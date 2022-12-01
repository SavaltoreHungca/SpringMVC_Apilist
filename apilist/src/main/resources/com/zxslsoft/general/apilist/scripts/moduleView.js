const id_module_view_id = guid();
const id_module_convas = guid();
const id_module_win_list = guid();
const key_module_win_id = guid();
let ob_winList = []

function showModuleView() {
    fetcher.get("/getAllApiInfoList").then(rsp=>{
        const allApiInfo = rsp.data;
        commentFetcher.getWinList(rsp=>{
            ob_winList = rsp.data || [];

            let container = $(id_module_view_id);

            if(!$(id_module_view_id)){
                container = document.createElement('div');
                container.id = id_module_view_id;
                container.style.cssText = `
                    position: fixed;
                    top: 30px;
                    right: 0;
                    width: calc(100vw - 700px);
                    height: calc(100vh - 40px);
                    border: 1px solid black;
                    background: white;
                    z-index: 5;
                    display: flex;
                    flex-direction: column;
                `
                container.setAttribute("user-select", "none");
                document.body.appendChild(container);
                $(id_module_view_id).addEventListener('click', ()=>{
                    Utils.$$.setStyle($(id_module_view_id), {
                        'z-index': apipane_z_index++
                    })
                });
            }
            const id_sizeAjust = guid();
            container.innerHTML = `
                <div>
                    <button onclick="${anonyF(()=>{
                        const win = createWin(undefined, allApiInfo);
                        const parent = $(id_module_convas).parentElement;
                        Utils.$$.setStyle(win, {
                            top: parent.scrollTop,
                            left: parent.scrollLeft
                        })
                    })}(this)">创建窗口</button>
                </div>
                <div style="flex-grow: 1; overflow: hidden; position: relative; overflow: scroll">
                    <div id="${id_module_convas}" style="position: absolute; width: 9000px; height: 9000px; top: 0; left: 0; cursor: grab;background-image: linear-gradient(90deg, rgba(180, 180, 180, 0.15) 10%, rgba(0, 0, 0, 0) 10%),linear-gradient(rgba(180, 180, 180, 0.15) 10%, rgba(0, 0, 0, 0) 10%); background-size: 50px 50px;"></div>
                </div>
                <div style="position: absolute; left: -157px; top: 0;">
                    <div style="height=23px"><input placeholder="搜索" style="width: 91px;" oninput="${anonyF((self)=>{
                        for(let i = 0; i<$(id_module_win_list).children.length; i++){
                            const child = $(id_module_win_list).children[i];
                            const title = child.firstElementChild.value || '';
                            if(title.toLowerCase().indexOf(self.value.toLowerCase()) >= 0){
                                Utils.$$.setStyle(child, {
                                    display: ""
                                })
                            }else{
                                Utils.$$.setStyle(child, {
                                    display: "none"
                                })
                            }
                        }
                    })}(this)"></div>
                    <div id="${id_module_win_list}" onwheel="${anonyF(()=>{
                        const event = window.event || arguments.callee.caller.arguments[0]
                        event.stopPropagation();
                    })}()" style="height: calc(100vh - 60px); overflow: scroll; border-left: 1px dotted black; background: rgba(0,0,0,0.1)"></div>
                </div>
                <span id="${id_sizeAjust}" style="width: 5px;height: 5px;position: absolute;left: 0;bottom: 0;background: black;cursor: crosshair;"></span>
            `

            Utils.$$.addDragEvent($(id_sizeAjust), (state)=>{
                if(state.registered){
                    Utils.$$.getElementInfo(container, info=>{
                        Utils.$$.setStyle(container, {
                            width: info.innerWidth - state.deltaX,
                            height: info.innerHeight + state.deltaY
                        })
                    })
                }
            })

            Utils.$$.addDragEvent($(id_module_convas), (state)=>{
                if(state.registered){
                    const parent = $(id_module_convas).parentElement;
                    parent.scrollTop -= increaseNumber(state.deltaY, 2);
                    parent.scrollLeft -= increaseNumber(state.deltaX, 2);
                    document.getSelection().removeAllRanges()
                }
            });


            ob_winList.forEach(winId=>{
                commentFetcher.getWinInfo(winId, rsp => {
                    if(rsp.data){
                        const winInfo = rsp.data;
                        createWin(winId, allApiInfo, winInfo.apiInfos, winInfo.position, winInfo.title);
                    }
                })
            })
            Utils.$$.setStyle(container, {
                display: "flex"
            })
        })
    });
}

function addToWinList(winId, name){
    let div = document.createElement('div');
    div.setAttribute('winId', winId);
    div.onclick = ()=>{
        const win = queryWinItemFromConvas(winId);
        scrollToView(win);
    }
    div.innerHTML = `
        <input style="width: 91px" value="${name?name:''}" oninput="${anonyF((self)=>{
            queryWinItemFromConvas(winId).children[1].firstElementChild.value = self.value;
        })}(this)" onchange="${anonyF((self)=>{
            commentFetcher.updateWinTitle(winId, self.value);
        })}(this)">
        <span style="font-size:12px; cursor: pointer" onclick="${anonyF(()=>{
            const win = queryWinItemFromConvas(winId);
            const parent = $(id_module_convas).parentElement;
            Utils.$$.setStyle(win, {
                top: parent.scrollTop + 20,
                left: parent.scrollLeft + 20
            })
            Utils.$$.getElementInfo(win, info=>{
                commentFetcher.updateWinPosition(winId, {
                    x: info.left,
                    y: info.top
                })
            })
        })}(this)">移至当前</span>
    `
    $(id_module_win_list).appendChild(div);

}

function queryWinItemFromWinList(winId){
    for(let i = 0; i<$(id_module_win_list).children.length; i++){
        if($(id_module_win_list).children[i].getAttribute("winId") === winId){
            return $(id_module_win_list).children[i];
        }
    }
}

function queryWinItemFromConvas(winId){
    for(let i = 0; i<$(id_module_convas).children.length; i++){
        if($(id_module_convas).children[i][key_module_win_id] === winId){
            return $(id_module_convas).children[i];
        }
    }
}

function scrollToView(ele){
    Utils.$$.getElementInfo(ele, info=>{
        let x = - info.left + 10;
        let y =  - info.top + 10;
        x = x > 0? 0:x;
        y = y > 0? 0:y;
        const parent = $(id_module_convas).parentElement;
        parent.scrollTop = -y;
        parent.scrollLeft = -x;
    })
}

/**
 * 
 * @param {string} title 
 * @param {{x: number, y: number}} position 
 * @param {[{className: string, classSimpleName: string, 
 *          formRequest: [], jsonRequest: string, 
 *          packagePath: string, requestType: string, 
 *          returnType: string, uri: string}]} apiInfoList
 */
function createWin(winId, allApiInfoList, apiInfoList,  position, title) {
    const id_win_items = guid();

    if(!winId){
        winId = Utils.$$.randmonId();
        ob_winList.push(winId);
        commentFetcher.updateWinList(ob_winList);
    }

    apiInfoList = apiInfoList || [];
    const addedApi = apiInfoList.map(ite=>ite.uri);
    const allApiInfoMap = getIdMap(allApiInfoList, ite=>ite.uri);
    position = position || {x: 0, y: 0}
    title = title || ''

    const container = $(id_module_convas);
    const win = createElement("div");
    win[key_module_win_id] = winId;

    addToWinList(winId, title);

    Utils.$$.setStyle(win, {
        display: 'flex',
        "flex-direction": 'column',
        position: 'absolute',
        top: position.y,
        left: position.x,
        'box-shadow': '-2px 3px 14px #888888',
        background: 'white',
        border: '1px solid blue'
    })
    win.setAttribute('user-select', "none")

    createWinItems(winId, apiInfoList, itemsStr => {
        win.innerHTML = `
            <div style="background: rgba(0,0,0,1); text-align: right; color: white; cursor: pointer">
                <span onclick="${anonyF(()=>{
                    showItemConvas(winId, addedApi, allApiInfoList, id_win_items);
                })}(this)">视图</span>
                <span onclick="${anonyF(()=>{
                    confirmPane(["真删？"], ()=>{
                        const index = ob_winList.indexOf(winId);
                        if(index >= 0){
                            ob_winList.splice(index, 1);
                        }
                        commentFetcher.updateWinList(ob_winList);
                        win.parentElement.removeChild(win);
                        const winItem = queryWinItemFromWinList(winId);
                        winItem.parentElement.removeChild(winItem);
                    })
                })}(this)">删除</span>
            </div>
            <div><input placeholder="输入标题" value="${title}" oninput="${anonyF((self)=>{
                queryWinItemFromWinList(winId).firstElementChild.value = self.value;
                queryWinItemFromWinList(winId).firstElementChild.scrollIntoView();
            })}(this)" onchange="${anonyF((self)=>{
                commentFetcher.updateWinTitle(winId, self.value);
            })}(this)"></div>
            <div>${generateSearchableDropDown(allApiInfoList.map(ite=>ite.uri), uri=>{
                const apiInfo = allApiInfoMap.get(uri);
                if(addedApi.find(ite=>ite===uri)) return;
                addedApi.push(uri);
                createWinItem(winId, apiInfo, item=>{
                    // $(id_win_items).innerHTML += item;
                    $(id_win_items).appendChild(textToElement(item));
                });
                commentFetcher.updateWinUris(winId, addedApi);
            }, ()=>{}, '添加接口(可搜索)')}</div>
            <div id="${id_win_items}" onwheel="${anonyF(()=>{
                const event = window.event || arguments.callee.caller.arguments[0]
                event.stopPropagation();
            })}(this)" style="flex-grow: 1; border-top: 1px dotted black; border-left: 1px dotted black; margin-top: 2px; overflow: scroll; max-height: 300px; padding-top: 3px; padding-left: 3px">
                ${itemsStr}
            </div>
        `
        container.appendChild(win);
        Utils.$$.stopPropagation(win, 'mousedown');
        Utils.$$.addDragEvent(win, (state)=>{
            if(state.registered){
                Utils.$$.getElementInfo(win, info=>{
                    if(info.top + state.deltaY >= 0 && info.left + state.deltaX >= 0){
                        Utils.$$.setStyle( win, {
                            top: info.top + state.deltaY,
                            left: info.left + state.deltaX
                        })
                    }
                })
            } else {
                Utils.$$.getElementInfo(win, info=>{
                    commentFetcher.updateWinPosition(winId, {
                        x: info.left,
                        y: info.top
                    })
                })
            }
        })
    })

    return win;
}

/**
 * 
 * @param {{className: string, classSimpleName: string, 
 *          formRequest: [], jsonRequest: string, 
 *          packagePath: string, requestType: string, 
 *          returnType: string, uri: string}} apiInfo 
 */
function createWinItem(winId, apiInfo, consumer) {
    if(!apiInfo) consumer('');

    const id_item = guid();
    commentFetcher.getInterfaceName(apiInfo.uri, (rsp)=>{
        const item = `
            <div id="${id_item}" style="font-size: 12px; cursor: pointer; display: flex;">
                <div>
                    <div><input value="${rsp.data || ''}" onchange="${anonyF((self)=>{
                        if(self.value && self.value.trim() !== ""){
                            commentFetcher.updateInterfaceName(apiInfo.uri, self.value)
                        }
                    })}(this)"></div>
                    <div style="padding-left: 10px" onclick="${anonyF((self)=>{renderApiInfoPane(apiInfo)})}(this)">${apiInfo.uri}</div>
                </div>
                <div style="text-align: right; flex-grow: 1; line-height: 2; margin-left: 9px"><span onclick="${anonyF(()=>{
                    commentFetcher.deleteWinUri(winId, apiInfo.uri);
                    $(id_item).parentElement.removeChild($(id_item));
                })}(this)">删除</span></div>
            </div>
        `
        consumer(item);
    })
}

function createWinItems(winId, apiInfoList, consumer) {
    let ans = '';
    apiInfoList = apiInfoList || [];
    let iteIndex = 0;

    let next = ()=>{
        if(iteIndex < apiInfoList.length){
            createWinItem(winId, apiInfoList[iteIndex], str=>{
                ans += str;
                iteIndex++;
                next();
            })
        }else{
            consumer(ans);
        }
    }
    
    next();
}