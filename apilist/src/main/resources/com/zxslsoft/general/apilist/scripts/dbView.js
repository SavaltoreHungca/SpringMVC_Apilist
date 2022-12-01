const id_db_module_view_id = guid();
const id_db_module_convas = guid();
const id_db_module_win_list = guid(); // 未添加表的id
const id_db_module_win_added = guid(); // 已添加窗口的id
const key_module_dbwin_id = guid(); // 窗口元素key
let ob_db_winList = [];  // 已添加的表名
let tableInfoMap;

function showDbView() {
    fetcher.get("/getDbInfos").then(rsp=>{
        tableInfoMap = rsp.data;
        commentFetcher.getDbWinList(rsp=>{
            let un_added_db_winList = []; // 未添加的表名
            ob_db_winList = rsp.data || [];
            for(let i of Object.keys(tableInfoMap)){
                if(!(i in ob_db_winList)){
                    un_added_db_winList.push(i);
                }
            }

            let container = $(id_db_module_view_id);

            if(!$(id_db_module_view_id)){
                container = document.createElement('div');
                container.id = id_db_module_view_id;
                container.style.cssText = `
                    position: fixed;
                    top: 30px;
                    right: 5px;
                    width: calc(100vw - 10px);
                    height: calc(100vh - 40px);
                    border: 1px solid black;
                    background: white;
                    z-index: ${apipane_z_index++};
                    display: flex;
                    flex-direction: column;
                `
                container.setAttribute("user-select", "none");
                document.body.appendChild(container);
                $(id_db_module_view_id).addEventListener('click', ()=>{
                    Utils.$$.setStyle($(id_db_module_view_id), {
                        'z-index': apipane_z_index++
                    })
                });
            }
            container.innerHTML = `
                <div style="background: beige;">
                    全局搜索: <input placeholder="从列表中搜索表" oninput="${anonyF(self=>{
                        searchDbItmes(self.value)
                    })}(this)">
                </div>
                <div style="flex-grow: 1; display: flex; height: calc(100vh - 70px);">
                    <div style="width: 200px; display: flex; flex-direction: column; font-size: 12px">
                        <div style="height: 50%; overflow: hidden; display: flex; flex-direction: column; background: lightcyan">
                            <div><input placeholder="搜索未添加表" oninput="${anonyF(self=>{
                                searchDbItmes(self.value, 'unadded')
                            })}(this)"></div>
                            <div style="flex-grow: 1; overflow: scroll">
                                <div id="${id_db_module_win_list}"></div>
                            </div>
                        </div>
                        <div style="height: 50%; overflow: hidden; display: flex; flex-direction: column; background: lightblue">
                            <div><input placeholder="搜索已添加表" oninput="${anonyF(self=>{
                                searchDbItmes(self.value, 'added')
                            })}(this)"></div>
                            <div style="flex-grow: 1; overflow: scroll">
                                <div id="${id_db_module_win_added}"></div>
                            </div>
                        </div>
                    </div>
                    <div style="flex-grow: 1; overflow: hidden; position: relative; overflow: scroll">
                        <div id="${id_db_module_convas}" style="position: absolute; width: 9000px; height: 9000px; top: 0; left: 0; cursor: grab;background-image: linear-gradient(90deg, rgba(180, 180, 180, 0.15) 10%, rgba(0, 0, 0, 0) 10%),linear-gradient(rgba(180, 180, 180, 0.15) 10%, rgba(0, 0, 0, 0) 10%); background-size: 50px 50px;"></div>
                    </div>
                </div>
            `

            Utils.$$.addDragEvent($(id_db_module_convas), (state)=>{
                if(state.registered){
                    const parent = $(id_db_module_convas).parentElement;
                    parent.scrollTop -= increaseNumber(state.deltaY, 2);
                    parent.scrollLeft -= increaseNumber(state.deltaX, 2);
                    document.getSelection().removeAllRanges()
                }
            });

            ob_db_winList.forEach(winId=>{
                const tableInfo = tableInfoMap[winId];
                commentFetcher.getDbWinPosition(winId, rsp => {
                    if(rsp.data){
                        const tableInfo = tableInfoMap[winId];
                        const position = rsp.data;
                        createDbWin(tableInfo, position);
                    }
                });
            });
            un_added_db_winList.forEach(winId=>{
                const div = $(id_db_module_win_list);
                const tableInfo = tableInfoMap[winId];
                div.appendChild(getUnAddedListItem(winId));
            })
            Utils.$$.setStyle(container, {
                display: "flex"
            })
        })
    });
}

function searchDbItmes(value, flag){
    const unadded = $(id_db_module_win_list);
    const added = $(id_db_module_win_added);

    const children = [];
    if(!flag || flag === 'unadded') for(let i = 0;i<unadded.children.length; i++) children.push(unadded.children[i]);
    if(!flag || flag === 'added') for(let i = 0;i<added.children.length; i++) children.push(added.children[i]);

    for(let i = 0;i<children.length; i++){
        const child = children[i];
        const title = child.firstElementChild.innerHTML;
        if(title.toLowerCase().indexOf(value.toLowerCase()) >= 0){
            Utils.$$.setStyle(child, {
                display: ""
            })
        }else{
            Utils.$$.setStyle(child, {
                display: "none"
            })
        }
    }
}

function getUnAddedListItem(winId){
    const tableInfo = tableInfoMap[winId];
    return textToElement(`
        <div style="cursor: pointer; border-bottom: 1px solid; margin: 2px 0" onclick="${anonyF((self)=>{
            if(ob_db_winList.indexOf(winId) < 0){
                createDbWin(tableInfo);
                removeFromUnAdded(winId);
            }else {
                dbScrollToView(queryDbWinItemFromConvas(tableInfo.tableName))
            }
        })}(this)">
            <div>${winId}</div>
            <div>${tableInfo.comment}</div>
        </div>
    `)
}

// 获取当前图板的起点坐标
function getCurrentPosi(){
    return {
        "top": $(id_db_module_convas).parentElement.scrollTop,
        "left": $(id_db_module_convas).parentElement.scrollLeft,
    }
}

function updateDbWinList(winId, callback){
    if(ob_db_winList.indexOf(winId) < 0){
        ob_db_winList.push(winId);
        commentFetcher.updateDbWinList(ob_db_winList);
        if(callback) callback();
    }
}

function removeFromDbWinList(winId, callback){
    if(ob_db_winList.indexOf(winId) >= 0){
        ob_db_winList.splice(ob_db_winList.indexOf(winId), 1);
        commentFetcher.updateDbWinList(ob_db_winList);
        if(callback) callback();
    }
}

function dbScrollToView(ele){
    Utils.$$.getElementInfo(ele, info=>{
        let x = - info.left + 10;
        let y =  - info.top + 10;
        x = x > 0? 0:x;
        y = y > 0? 0:y;
        const parent = $(id_db_module_convas).parentElement;
        parent.scrollTop = -y;
        parent.scrollLeft = -x;
    })
}

function getEleFromUnAdded(winId){
    const pane = $(id_db_module_win_list);
    for(let i=0; i<pane.children.length; i++){
        const child = pane.children[i];
        if(child.firstElementChild.innerHTML == winId){
            return child;
        }
    }
}

function getEleFromAdded(winId){
    const pane = $(id_db_module_win_added);
    for(let i=0; i<pane.children.length; i++){
        const child = pane.children[i];
        if(child.firstElementChild.innerHTML == winId){
            return child;
        }
    }
}


function removeFromUnAdded(winId){
    const ele = getEleFromUnAdded(winId);
    const tableInfo = tableInfoMap[winId];
    if(ele){
        ele.parentElement.removeChild(ele);
        $(id_db_module_win_added).appendChild(createAddedItem(winId))
    }
}

function queryDbWinItemFromConvas(winId){
    for(let i = 0; i<$(id_db_module_convas).children.length; i++){
        if($(id_db_module_convas).children[i][key_module_dbwin_id] === winId){
            return $(id_db_module_convas).children[i];
        }
    }
}

function deleteAddedItem(winId){
    confirmPane(["真删？"], ()=>{
        let item = getEleFromAdded(winId);
        item.parentElement.removeChild(item);
        item = queryDbWinItemFromConvas(winId);
        item.parentElement.removeChild(item);
        removeFromDbWinList(winId);
        $(id_db_module_win_list).appendChild(getUnAddedListItem(winId));
    })
}

function createAddedItem(winId){
    const tableInfo = tableInfoMap[winId];
    return textToElement(`
        <div style="cursor: pointer; border-bottom: 1px solid; margin: 2px 0" onclick="${anonyF((self)=>{
            dbScrollToView(queryDbWinItemFromConvas(tableInfo.tableName))
        })}(this)">
            <div>${winId}</div>
            <div>${tableInfo.comment}</div>
            <div><button onclick="${anonyF(()=>{
                const event = window.event || arguments.callee.caller.arguments[0];
                event.stopPropagation();
                const win = queryDbWinItemFromConvas(winId);
                const position = getCurrentPosi();
                Utils.$$.setStyle(win, {
                    top: position.top,
                    left: position.left
                })
            })}()">移至此处</button>
                <button onclick="${anonyF(()=>{
                    const event = window.event || arguments.callee.caller.arguments[0];
                    event.stopPropagation();
                    deleteAddedItem(winId);
                })}()">删除</button>
            </div>
        </div>
    `)
}

function createDbWinItems(fieldInfoList){
    let ans = `<table style="cursor: text" onmousedown="${anonyF(()=>{
        const event = window.event || arguments.callee.caller.arguments[0];
        event.stopPropagation();
    })}()">`;
    (fieldInfoList || []).forEach(it=>{
        ans += `
            <tr>
                <td>${it.name}</td>
                <td>${it.type}</td>
                <td>${it.comment}</td>
            </tr>`
    });
    ans += '</table>';
    return ans;
}



function createDbWin(tableInfo, position){
    position = position || getCurrentPosi();
    const winId = tableInfo.tableName;
    removeFromUnAdded(winId);
    const convas = $(id_db_module_convas); // 图板
    const win = textToElement(`
        <div style="font-size: 12px">
            <div><span>${tableInfo.tableName}</span><span style="float: right; margin-left: 10px; cursor: pointer" onclick="${anonyF(()=>{
                deleteAddedItem(winId);
            })}()">删除</span></div>
            <div>${tableInfo.comment}</div>
            <div>
                ${createDbWinItems(tableInfo.fieldInfoList)}
            </div>
        </div>
    `);
    win[key_module_dbwin_id] = winId;
    Utils.$$.setStyle(win, {
        display: 'flex',
        "flex-direction": 'column',
        position: 'absolute',
        top: position.top,
        left: position.left,
        'box-shadow': '-2px 3px 14px #888888',
        background: 'white',
        border: '1px solid blue'
    })
    updateDbWinList(winId, ()=>{
        commentFetcher.updateDbWinPosition(winId, position);
    });
    convas.appendChild(win);
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
                commentFetcher.updateDbWinPosition(winId, {
                    left: info.left,
                    top: info.top
                })
            })
        }
    })
}