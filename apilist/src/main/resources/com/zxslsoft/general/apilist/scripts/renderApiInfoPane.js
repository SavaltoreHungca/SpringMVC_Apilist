const request_result= new Map();

const apipane_opend = new Map();

function renderApiInfoPane(apiInfo) {
    let container = apipane_opend.get(apiInfo.uri);
    if(!container){
        container = document.createElement('div');
        container.monacos = [];
        Utils.$$.setStyle(container, {
            position: 'fixed',
            background: 'white',
            border: '1px solid blue',
            'box-shadow': '-2px 3px 14px #888888',
            display: 'flex',
            'flex-direction': 'column',
            height: 761,
            width: 611,
            top: 100,
            left: 100,
            'z-index': ++apipane_z_index
        });
        document.body.appendChild(container);
        apipane_opend.set(apiInfo.uri, container);
    }

    Utils.$$.setStyle(container, {
        display: 'flex',
        'z-index': ++apipane_z_index
    });

    container.monacos.forEach(ite=>{
        ite.dispose();
    });

    container.onmousedown = ()=>{
        Utils.$$.setStyle(container, {
            'z-index': ++apipane_z_index
        });
    }

    const id_pane = guid();
    const id_sizeAjust = guid();
    const id_move = guid();
    container.innerHTML = `
        <div id="${id_move}" style="cursor: all-scroll; position: absolute; left: 0; top: -24px; width: 100%; background: black; color: white; text-align: right;">
            <span style="color: white; float: left">${apiInfo.uri}</span>
            <span onclick="${anonyF(()=>{
                Utils.$$.setStyle(container, {
                    display: 'none'
                })
            })}()" style="cursor: pointer">关闭</span>
        </div>
        <div style="flex-grow: 1; overflow: scroll">
            <div id="${id_pane}" style="padding-left: 30px; width: 1064px"></div>
        </div>
        <div>
            <span id="${id_sizeAjust}" style="width: 5px;height: 5px;position: absolute;right: 0;bottom: 0;background: black;cursor: crosshair;"></span>
        </div>
    `

    Utils.$$.addDragEvent($(id_move), (state)=>{
        if(state.registered){
            Utils.$$.getElementInfo(container, info=>{
                Utils.$$.setStyle(container, {
                    top: info.top + state.deltaY,
                    left: info.left + state.deltaX
                })
            })
        }
    })

    Utils.$$.addDragEvent($(id_sizeAjust), (state)=>{
        document.getSelection().removeAllRanges()
        if(state.registered){
            Utils.$$.getElementInfo(container, info=>{
                Utils.$$.setStyle(container, {
                    width: info.innerWidth + state.deltaX,
                    height: info.innerHeight + state.deltaY
                })
            })
        }
    })

    $(id_pane).monacos = container.monacos;
    if(apiInfo.jsonRequest){
        renderJson($(id_pane), apiInfo);
    }
    else {
        renderForm($(id_pane), apiInfo);
    }
}

function renderJson(container, apiInfo){
    const idset = {
        paramTable: guid(),
        requestResult: guid(),
        annotaionTable: guid(),
        uriInput: guid(),
        requestButton: guid(),
        anonRestBtn: guid(),
        requestParamRestBtn: guid(),
    }

    container.innerHTML = `
        <div style="margin-bottom: 5px"><span>${apiInfo.requestType}: </span><input id="${idset.uriInput}" style="width: 400px" value="${apiInfo.uri}"></div>
        <div style="margin-bottom: 5px"><span>完整请求路径: <input id="jsonurl" style="width: 600px" value="${BASE_REQ_URL + apiInfo.uri}"></span><button onclick="window.open(document.getElementById('jsonurl').value)">open</button></div>

        <div style="background: indianred; width: fit-content;">请注意: 请求类型为 application/json</div>

        <div>请求参数 <button id="${idset.requestParamRestBtn}" style="left-margin: 10px">reset</button></div>
        <div id="${idset.paramTable}" style="width: 573px; height: 294px;border: 1px solid black;"></div>
        
        <div style="margin: 10px 0">
            <button id="${idset.requestButton}">请求</button>
        </div>

        <div id="${idset.requestResult}" style="width: 573px; height: 294px;border: 1px solid black;"></div>

        <div>接口注释说明 <button id="${idset.anonRestBtn}" style="left-margin: 10px">reset</button></div>
        <div id="${idset.annotaionTable}" style="width: 573px; height: 294px;border: 1px solid black;"></div>
    `

    // 请求参数
    createMonaco($(idset.paramTable), paramMonaco=>{
        container.monacos.push(paramMonaco);

        paramMonaco.setModel(monaco.editor.createModel("", 'json'));

        paramMonaco.onDidBlurEditorText(()=>{
            const value = paramMonaco.getValue();
            if(value && value.trim() !== ""){
                commentFetcher.updateJsonParam(apiInfo.uri, value);
            }
        });

        // 填充之前的请求参数
        commentFetcher.getJsonParam(apiInfo.uri, (rsp)=>{
            if(rsp.data){
                if(typeof rsp.data === 'string'){
                    paramMonaco.setValue(rsp.data);
                }else {
                    paramMonaco.setValue(JSON.stringify(rsp.data, undefined, 4));
                }
            }else {
                paramMonaco.setValue(JSON.stringify(JSON.parse(apiInfo.jsonRequest), undefined, 4));
            }
        })

        $(idset.requestParamRestBtn).onclick = ()=>{
            paramMonaco.setValue(JSON.stringify(JSON.parse(apiInfo.jsonRequest), undefined, 4));
        }

        // 请求结果
        createMonaco($(idset.requestResult), requestResultMonaco=>{
            container.monacos.push(requestResultMonaco);
            requestResultMonaco.setModel(monaco.editor.createModel("", 'json'));
            requestResultMonaco.setValue(request_result.get(apiInfo.uri) || '');
            // 点击请求
            $(idset.requestButton).onclick = ()=>{
                requestResultMonaco.setValue("请求中。。。");
            
                request.post($(idset.uriInput).value, JSON.parse(paramMonaco.getValue())).then((rsp)=>{
                    console.log(rsp.data);
                    request_result.set(apiInfo.uri, JSON.stringify(rsp.data, undefined, 4));
                    requestResultMonaco.setValue(JSON.stringify(rsp.data, undefined, 4));
                }).catch((e)=>{
                    console.log(e);
                    requestResultMonaco.setValue(JSON.stringify(e, undefined, 4));
                });
            }
        })
    })

    // 注释的文本
    createMonaco($(idset.annotaionTable), annotaionMonaco=>{
        container.monacos.push(annotaionMonaco);

        annotaionMonaco.setValue(JSON.stringify(apiInfo, undefined, 4));

        annotaionMonaco.onDidBlurEditorText(()=>{
            const value = annotaionMonaco.getValue();
            if(value && value.trim() !== ""){
                commentFetcher.updateJsonAnnotation(apiInfo.uri, value);
            }
        });

        // 填充之前的说明信息
        commentFetcher.getJsonAnnotation(apiInfo.uri, (rsp)=>{
            let value = '';
            if(rsp.data){
                if(typeof rsp.data === 'string'){
                    value = rsp.data;
                }
                else {
                    value = JSON.stringify(rsp.data, undefined, 4);
                }
            }
            else {
                value = JSON.stringify(apiInfo, undefined, 4);
            }
            annotaionMonaco.setValue(value);
        })

        $(idset.anonRestBtn).onclick = ()=>{
            annotaionMonaco.setValue(JSON.stringify(apiInfo, undefined, 4));
        }
    })
}

function renderForm(container, apiInfo){
    const idset = {
        paramTable: guid(),
        requestResult: guid(),
        annotaionTable: guid(),
        uriInput: guid(),
        requestButton: guid(),
        requestParamRestBtn: guid(),
        anonRestBtn: guid(),
        fileName: guid(),
        file: guid(),
        addFileBtn: guid(),
        fileTable: guid(),
    }
    const files = {};
    container.innerHTML = `
        <div style="margin-bottom: 5px"><span>${apiInfo.requestType}: </span><input id="${idset.uriInput}" style="width: 400px" value="${apiInfo.uri}"></div>
        <div style="margin-bottom: 5px"><span>完整请求路径: <input id="formurl" style="width: 600px" value="${BASE_REQ_URL + apiInfo.uri}"></span><button onclick="window.open(document.getElementById('formurl').value)">open</button></div>
        
        <div style="background: indianred; width: fit-content;">请注意: 请求类型为 ${apiInfo.requestType === "GET"?"get": "mutilpart/data-form"}</div>

        <div>请求参数 <button id="${idset.requestParamRestBtn}" style="left-margin: 10px">reset</button></div>
        <div id="${idset.paramTable}" style="width: 573px; height: 294px;border: 1px solid black;"></div>
        
        <div>
            <table><tbody id="${idset.fileTable}">
                <tr>
                    <td><input id="${idset.fileName}" placeholder="文件名"></td>
                    <td><input id="${idset.file}" type="file" placeholder="文件" multiple="multiple"></td>
                    <td><button id="${idset.addFileBtn}">添加文件</button></td>
                </tr>
            </tbody></table>
        </div>

        <div style="margin: 10px 0">
            <button id="${idset.requestButton}">请求</button>
        </div>

        <div id="${idset.requestResult}" style="width: 573px; height: 294px;border: 1px solid black;"></div>

        <div>接口注释说明 <button id="${idset.anonRestBtn}" style="left-margin: 10px">reset</button></div>
        <div id="${idset.annotaionTable}" style="width: 573px; height: 294px;border: 1px solid black;"></div>
    `

    if(apiInfo.requestType === "GET"){
        $(idset.fileTable).innerHTML = '';
    }else {
        $(idset.addFileBtn).onclick = ()=>{
            files[$(idset.fileName).value] = files[$(idset.fileName).value] || [];
    
            for(let i=0; i<$(idset.file).files.length; i++){
                files[$(idset.fileName).value].push($(idset.file).files[i]);
            }
    
            console.log(files);
    
            const tr = document.createElement('tr');
            $(idset.fileTable).appendChild(tr);
            const deleteButton = guid();
            tr.fileName = $(idset.fileName).value;
            tr.innerHTML = `
                <td>${$(idset.fileName).value}</td>
                <td>${$(idset.file).files.length}个文件</td>
                <td colspan="2"><button id="${deleteButton}">删除</button></td>
            `
            $(deleteButton).onclick = ()=>{
                delete files[tr.fileName];
                $(idset.fileTable).removeChild(tr);
                console.log(files);
            }
    
            $(idset.fileName).value = '';
            $(idset.file).value = '';
        }
    
    }

    // 请求参数
    createMonaco($(idset.paramTable), paramMonaco=>{
        container.monacos.push(paramMonaco);

        paramMonaco.setModel(monaco.editor.createModel("", 'json'));

        paramMonaco.onDidBlurEditorText(()=>{
            const value = paramMonaco.getValue();
            if(value && value.trim() !== ""){
                commentFetcher.updateFormParam(apiInfo.uri, value);
            }
        });

        // 填充之前的请求参数
        commentFetcher.getFormParam(apiInfo.uri, (rsp)=>{
            if(rsp.data){
                if(typeof rsp.data === 'string'){
                    paramMonaco.setValue(rsp.data);
                }else {
                    paramMonaco.setValue(JSON.stringify(rsp.data, undefined, 4));
                }
            }else {
                const params = {};

                (apiInfo.formRequest || []).forEach(field=>{
                    params[field.name] = field.type;
                })

                paramMonaco.setValue(JSON.stringify(params, undefined, 4));
            }
        })

        $(idset.requestParamRestBtn).onclick = ()=>{
            const params = {};
            (apiInfo.formRequest || []).forEach(field=>{
                params[field.name] = field.type;
            })
            paramMonaco.setValue(JSON.stringify(params, undefined, 4));
        }


        // 请求结果
        createMonaco($(idset.requestResult), requestResultMonaco=>{
            container.monacos.push(requestResultMonaco);
            requestResultMonaco.setModel(monaco.editor.createModel("", 'json'));
            requestResultMonaco.setValue(request_result.get(apiInfo.uri) || '');
            // 点击请求
            $(idset.requestButton).onclick = ()=>{
                requestResultMonaco.setValue("请求中。。。");
            
                
                let inputData;
                try{
                    inputData = JSON.parse(paramMonaco.getValue());
                }catch(e){
                    inputData = {};
                }
                if(apiInfo.requestType === "GET"){
                    request.get($(idset.uriInput).value + "?" + paramlizeForGet(inputData)).then((rsp)=>{
                        console.log(rsp.data);
                        request_result.set(apiInfo.uri, JSON.stringify(rsp.data, undefined, 4));
                        requestResultMonaco.setValue(JSON.stringify(rsp.data, undefined, 4));
                    }).catch((e)=>{
                        console.log(e);
                        requestResultMonaco.setValue(JSON.stringify(e, undefined, 4));
                    });
                }
                else {
                    let requestData = new FormData();
                    Object.keys(inputData || {}).map((i) => {
                        if (Array.isArray(inputData[i])) {
                            for (let j in inputData[i]) {
                                requestData.append(i, inputData[i][j]);
                            }
                        } else {
                            requestData.append(i, inputData[i]);
                        }
                    });
                    for(let name in files){
                        for(let f of files[name]){
                            requestData.append(name, f);
                        }
                    }
        
                    request.post($(idset.uriInput).value, requestData).then((rsp)=>{
                        console.log(rsp.data);
                        request_result.set(apiInfo.uri, JSON.stringify(rsp.data, undefined, 4));
                        requestResultMonaco.setValue(JSON.stringify(rsp.data, undefined, 4));
                    }).catch((e)=>{
                        requestResultMonaco.setValue(JSON.stringify(e, undefined, 4));
                    });
                }
            }
        })
    })

    // 注释的文本
    createMonaco($(idset.annotaionTable), annotaionMonaco=>{
        container.monacos.push(annotaionMonaco);

        annotaionMonaco.setValue(JSON.stringify(apiInfo, undefined, 4));

        annotaionMonaco.onDidBlurEditorText(()=>{
            const value = annotaionMonaco.getValue();
            if(value && value.trim() !== ""){
                commentFetcher.updateFormAnnotation(apiInfo.uri, value);
            }
        });

        // 填充之前的说明信息
        commentFetcher.getFormAnnotation(apiInfo.uri, (rsp)=>{
            let value = '';
            if(rsp.data){
                if(typeof rsp.data === 'string'){
                    value = rsp.data;
                }
                else {
                    value = JSON.stringify(rsp.data, undefined, 4);
                }
            }
            else {
                value = JSON.stringify(apiInfo, undefined, 4);
            }
            annotaionMonaco.setValue(value);
        })

        $(idset.anonRestBtn).onclick = ()=>{
            annotaionMonaco.setValue(JSON.stringify(apiInfo, undefined, 4));
        }
    });
}