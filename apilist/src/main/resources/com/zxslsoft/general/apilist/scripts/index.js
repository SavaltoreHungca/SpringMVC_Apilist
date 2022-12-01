require.config({ paths: { 'vs': 'scripts/vs' } });
const isDebug = false;
let apipane_z_index = 1000;
const BASE_REQ_URL = isDebug? "http://localhost:8084/app" : location.origin + SETTINGS.contextRoot;
const fetcher = axios.create({
    baseURL: isDebug? "http://localhost:8084/app/apilist":location.origin + SETTINGS.parentPath
});
const request = axios.create({
    baseURL: BASE_REQ_URL
});

const commentFetcher = {
    getInterfaceName: function(uri, consumer) {
        fetcher.get(`/queryComment?key=${encode(uri)}`)
            .then(consumer || ((r)=>{}));
    },
    updateInterfaceName: function(uri, name, consumer) {
        fetcher.get(`/updateComment?key=${encode(uri)}&value=${encode(name.trim())}`)
            .then(consumer || ((r)=>{}));
    },
    getInterfaceGroupName: function(packagePath, className, consumer) {
        fetcher.get(`/queryComment?key=${encode(packagePath + className)}`)
            .then(consumer || ((r)=>{}));
    },
    updateInterfaceGroupName: function(packagePath, className, name, consumer) {
        fetcher.get(`/updateComment?key=${encode(packagePath + className)}&value=${encode(name.trim())}`)
            .then(consumer || ((r)=>{}));
    },
    getJsonParam: function(uri, consumer){
        fetcher.get(`/queryComment?key=${encode(uri + ":jsonrequest")}`)
            .then(consumer || ((r)=>{}));
    },
    updateJsonParam: function(uri, value){
        fetcher.get(`/updateComment?key=${encode(uri + ":jsonrequest")}&value=${encode(value.trim())}`)
    },
    getJsonAnnotation: function(uri, consumer) {
        fetcher.get(`/queryComment?key=${encode(uri + ":jsonannotation")}`)
            .then(consumer || ((r)=>{}));
    },
    updateJsonAnnotation: function(uri, value){
        fetcher.get(`/updateComment?key=${encode(uri + ":jsonannotation")}&value=${encode(value.trim())}`)
    },
    getFormParam: function(uri, consumer){
        fetcher.get(`/queryComment?key=${encode(uri + ":formrequest")}`)
            .then(consumer || ((r)=>{}));
    },
    updateFormParam: function (uri, value) {
        fetcher.get(`/updateComment?key=${encode(uri + ":formrequest")}&value=${encode(value.trim())}`)
    },
    getFormAnnotation: function (uri, consumer){
        fetcher.get(`/queryComment?key=${encode(uri + ":formannotation")}`)
            .then(consumer || ((r)=>{}));
    },
    updateFormAnnotation: function(uri, value){
        fetcher.get(`/updateComment?key=${encode(uri + ":formannotation")}&value=${encode(value.trim())}`)
    },
    getWinInfo: function(winId, consumer){
        fetcher.get(`/queryComment?key=${encode("ModuleViewWinInfo:"+ winId)}`)
            .then(consumer || ((r)=>{}));
    },
    /**
     * @param {[]} consumer 
     */
    getWinList: function(consumer){
        fetcher.get(`/queryComment?key=${encode("winList:ModuleViewWinList")}`)
            .then(consumer || ((r)=>{}));
    },
    updateWinList: function(list){
        if(Array.isArray(list)){
            fetcher.get(`/updateComment?key=${encode("winList:ModuleViewWinList")}&value=${encode(JSON.stringify(list))}`)
        }
    },
    /**
     * 
     * @param {{title: string, uris: []}} winInfo 
     */
    updateWinTitle: function(winId, title){
        if(title){
            fetcher.get(`/updateComment?key=${encode("ModuleViewWinTitle:"+ winId)}&value=${encode(title)}`)
        }
    },
    updateWinUris: function(winId, uris){
        if(Array.isArray(uris)){
            fetcher.get(`/updateComment?key=${encode("ModuleViewWinUris:"+ winId)}&value=${encode(JSON.stringify(uris))}`)
        }
    },
    deleteWinUri: function(winId, uri){
        if(uri){
            fetcher.get(`/updateComment?key=${encode("deleteWinUri:"+ winId)}&value=${encode(uri)}`)
        }
    },
    updateWinPosition: function(winId, position){
        if(position){
            fetcher.get(`/updateComment?key=${encode("ModuleViewWinPosition:"+ winId)}&value=${encode(JSON.stringify(position))}`)
        }
    },
    getDbWinList: function(consumer){
        fetcher.get(`/queryComment?key=${encode("dbwinList:ModuleViewWinList")}`)
            .then(consumer || ((r)=>{}));
    },
    updateDbWinList: function(list){
        if(Array.isArray(list)){
            fetcher.get(`/updateComment?key=${encode("dbwinList:ModuleViewWinList")}&value=${encode(JSON.stringify(list))}`)
        }
    },
    getDbWinPosition: function(winId, consumer){
        fetcher.get(`/queryComment?key=${encode("dbModuleViewWinPosition:"+ winId)}`)
            .then(consumer || ((r)=>{}));
    },
    updateDbWinPosition: function(winId, position){
        if(position){
            fetcher.get(`/updateComment?key=${encode("dbModuleViewWinPosition:"+ winId)}&value=${encode(JSON.stringify(position))}`)
        }
    },
    getItemWinPosi: function(winId, uri, consumer){
        fetcher.get(`/queryComment?key=${encode("moduleItemWinPosi:"+ winId + uri)}`)
        .then(consumer || ((r)=>{}));
    },
    updateItemWinPosition: function(winId, uri,position){
        if(position){
            fetcher.get(`/updateComment?key=${encode("moduleItemWinPosi:"+ winId + uri)}&value=${encode(JSON.stringify(position))}`)
        }
    },
    getWinInterfaceDesc: function(winId, uri, consumer){
        fetcher.get(`/queryComment?key=${encode("winuridesc:"+ winId + uri)}`)
        .then(consumer || ((r)=>{}));
    },
    updateWinInterfaceDesc: function(winId, uri, value){
        if(value && value.trim() != ''){
            fetcher.get(`/updateComment?key=${encode("winuridesc:"+ winId + uri)}&value=${encode(value)}`)
        }
    }
}


const container = document.createElement('div');
document.body.appendChild(container);

const idset = {
    groups: guid(),
    apis: guid(),
    apiInfoPane: guid(), // 绿色背景
    functions: guid(),
    upfilebutton: guid(),
    upfile: guid(),
    hotlist: guid(),
    historyList: guid(),
}

container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
`
container.innerHTML = `
    <div style="display: flex; flex-direction: column; height: 100vh; width: 100vw;">
        <div id="${idset.functions}" style="height: 30px; background: lightsteelblue; ">
            <span><span id="search_all_api"></span></span>
            <span><button id="${idset.upfilebutton}">导入接口说明</button><input id="${idset.upfile}" type="file"></span>
            <span><button onclick="${anonyF(()=>{
                window.open(SETTINGS.parentPath + "/exportDB");
            })}(this)">下载接口说明</button></span>
            <div style="float: right; margin-right: 10px">
                <span><button onclick="${anonyF(()=>{refresh()})}(this)">拉取最新接口注释</button></span>
                <span><button onclick="${anonyF((self)=>{
                    if($(id_db_module_view_id)){
                        if($(id_db_module_view_id).style.cssText.indexOf('none') >= 0){
                            self.innerHTML = '收起数据库视图';
                            Utils.$$.setStyle($(id_db_module_view_id), {
                                display: 'flex',
                                'z-index': apipane_z_index++
                            })
                        } else {
                            self.innerHTML = '展开数据库视图';
                            Utils.$$.setStyle($(id_db_module_view_id), {
                                display: 'none',
                                'z-index': apipane_z_index++
                            })
                        }
                    }else{
                        self.innerHTML = '收起数据库视图';
                        showDbView()
                    }
                })}(this)">展开数据库视图</button></span>
                <span><button onclick="${anonyF((self)=>{
                    if($(id_module_view_id)){
                        if($(id_module_view_id).style.cssText.indexOf('none') >= 0){
                            self.innerHTML = '收起模块视图';
                            Utils.$$.setStyle($(id_module_view_id), {
                                display: 'flex',
                                'z-index': apipane_z_index++
                            })
                        } else {
                            self.innerHTML = '展开模块视图';
                            Utils.$$.setStyle($(id_module_view_id), {
                                display: 'none',
                                'z-index': apipane_z_index++
                            })
                        }
                    }else{
                        self.innerHTML = '收起模块视图';
                        showModuleView()
                    }
                })}(this)">收起模块视图</button></span>
            </div>
        </div>
        <div style="display: flex; width: 100vw; flex-grow: 1; overflow: hidden">
            <div style="display: flex; flex-direction: column; overflow: hidden; border-right: 1px solid;">
                <div style="display: flex; overflow: hidden; flex-grow: 1">
                    <div style="overflow: scroll; ">
                        <div id="${idset.groups}" style="width: fit-content"></div>
                    </div>
                    <div style="padding-left: 10px; overflow-y: scroll; ">
                        <div id="${idset.apis}" style="width: fit-content"></div>
                    </div>
                </div>
                <div id="${idset.historyList}" style="overflow-y: scroll; width: 100%; height: 200px; background: lightblue; font-size: 10px; border-bottom: 1px solid black;">历史记录</div>
                <div id="${idset.hotlist}" style="overflow-y: scroll; width: 100%; height: 100px; background: lightblue; font-size: 10px">接口收藏</div>
            </div>
            <div id="${idset.apiInfoPane}" style="flex-grow: 1; padding-left: 60px; overflow-y: scroll; background: lightblue;">
            </div>
        </div>
    </div>
`

function addToHostList(apiInfo){
    const div = document.createElement('div');
    div.style.cssText = "display: flex; cursor: pointer; white-space: nowrap";
    div.innerHTML = `
        <div style="white-space: nowrap; flex-grow: 1" onclick="${anonyF(()=>{
            renderApiInfoPane(apiInfo);
        })}(this)">${apiInfo.uri}</div>
        <div><button onclick="${anonyF(()=>{div.parentElement.removeChild(div)})}(this)">删除</button></div>
    `

    if(!$(idset.hotlist).firstElementChild){
        $(idset.hotlist).innerHTML = '';
    }
    $(idset.hotlist).appendChild(div);
}

function addToHistoryList(apiInfo){
    const div = document.createElement('div');
    div.style.cssText = "display: flex; cursor: pointer; white-space: nowrap";
    div.innerHTML = `
        <div style="white-space: nowrap; flex-grow: 1" onclick="${anonyF(()=>{
            renderApiInfoPane(apiInfo);
        })}(this)">${apiInfo.uri}</div>
        <div>
            <button onclick="${anonyF(()=>{addToHostList(apiInfo)})}(this)">收藏</button>
            <button onclick="${anonyF(()=>{div.parentElement.removeChild(div)})}(this)">删除</button>
        </div>
    `

    if($(idset.historyList).firstElementChild){
        $(idset.historyList).insertBefore(div, $(idset.historyList).firstElementChild);
    }
    else {
        $(idset.historyList).innerHTML = '';
        $(idset.historyList).appendChild(div);
    }
}

$(idset.upfilebutton).onclick = ()=>{
    let reader = new FileReader();
    reader.readAsDataURL($(idset.upfile).files[0]);
    reader.onload = function(ev) { //文件读取成功完成时触发
        fetcher.post("/upfile", ev.target.result.replace(/\S+,/, ''), {headers: {'Content-Type': 'application/json'}})
        .then((rsp)=>{
            location.reload();
        })
        .catch(()=>{
            alert("失败");
        })
    }
} 

function refresh(){
    fetcher.get("/getPackagePathList").then((rsp) => {
        $(idset.apis).innerHTML = '';

        const fetchAnnotations = [];
    
        let str = "";
        const packagePathList = Object.keys(rsp.data || {});
        packagePathList.sort((a, b)=>{
            if(a === '子系统接口') return -1;
            return 0;
        })
        for (const packagePath of packagePathList) {
    
            // 包名
            str += `
                <div style="font-size: 10px; background: lightgrey">${packagePath}</div>
            `
            for (const className of rsp.data[packagePath]) {
                // 类列表的点击事件
                const onclick = anonyF((self) => {
                    fetcher.get(`/getApiInfoList?className=${encodeURIComponent(className)}&path=${encodeURIComponent(packagePath)}`)
                        .then((apis) => {
                            const fetchApiInfos = [];
    
                            let content = "";
                            for (const apiInfo of (apis.data || {})) {
    
                                // 接口地址列表的点击事件
                                const onclick = anonyF((self) => {
                                    renderApiInfoPane(apiInfo);
                                    addToHistoryList(apiInfo);
                                });
    
                                // 接口名
                                const inputId = guid();
                                content += `
                                    <div style="cursor: pointer; font-size: 10px; border: 1px dotted; margin-left: 10px; margin-bottom: 5px; padding: 1px;">
                                        <div style="display: flex">
                                            <div style="flex-grow: 1" onclick="${onclick}(this)">
                                                <div style="position: relative;">${apiInfo.uri}</div>
                                                <div><input id="${inputId}" style="margin-left: 20px; width: calc(100% - 33px);" onchange="${anonyF((self)=>{
                                                    if(self.value && self.value.trim() !== ""){
                                                        commentFetcher.updateInterfaceName(apiInfo.uri, self.value)
                                                    }
                                                })}(this)"></div>
                                            </div>
                                            <div style="vertical-align: center; margin: auto; padding: 2px" title="添加到最近访问列表" onclick="${anonyF(()=>{addToHostList(apiInfo)})}(this)">+</div>
                                        </div>
                                    </div>
                                `
                                
                                fetchApiInfos.push(()=>{
                                    commentFetcher.getInterfaceName(apiInfo.uri, (rsp)=>{
                                        if(rsp.data){
                                            $(inputId).value = decode(rsp.data) || '';
                                        }
                                    })
                                });
                            }
                            $(idset.apis).innerHTML = content;
                            launchFunctions(fetchApiInfos);
                        })
                });
    
                // 类名
                const inputId = guid();
                str += `
                    <div style="cursor: pointer; font-size: 10px; border: 1px dotted; margin-left: 10px; margin-bottom: 5px; padding: 1px;" onclick="${onclick}(this)">
                        <div>${className}</div>
                        <div><input id="${inputId}" style="margin-left: 20px; width: calc(100% - 33px);" onchange="${anonyF((self)=>{
                            if(self.value && self.value.trim() !== ""){
                                commentFetcher.updateInterfaceGroupName(packagePath, className, self.value)
                            }
                        })}(this)"></div>
                    </div>
                `
                fetchAnnotations.push(()=>{
                    commentFetcher.getInterfaceGroupName(packagePath, className, (rsp)=>{
                        if(rsp.data){
                            $(inputId).value = decode(rsp.data);
                        }
                    });
                })
            }
        }
        $(idset.groups).innerHTML = str;
        launchFunctions(fetchAnnotations);
        showModuleView();
        // showDbView();
        fetcher.get("/getAllApiInfoList").then(rsp=>{
            const allApiInfoList = rsp.data;
            const allApiInfoMap = getIdMap(allApiInfoList, ite=>ite.uri);
            $("search_all_api").innerHTML = generateSearchableDropDown(allApiInfoList.map(ite=>ite.uri), (uri)=>{
                const apiInfo = allApiInfoMap.get(uri);
                renderApiInfoPane(apiInfo);
            }, ele=>{
                Utils.$$.setStyle(ele, {
                    display: 'inline-block'
                })
            }, '搜索接口');
        });
    })
}

refresh();