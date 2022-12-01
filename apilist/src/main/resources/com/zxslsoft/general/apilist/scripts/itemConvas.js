const id_item_container = guid();
const id_item_convas = guid();

function showItemConvas(winId, addedApi, allApiInfoList, id_win_items){
    const createWin = (apiInfo)=>{
        if(apiInfo){
            const win = createElement('div');
            Utils.$$.setStyle(win, {
                'box-shadow': '-2px 3px 14px #888888',
                background: 'white',
                border: '1px solid blue',
                position: 'absolute'
            });

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
                        commentFetcher.updateItemWinPosition(winId, apiInfo.uri, {
                            x: info.left,
                            y: info.top
                        })
                    })
                }
            })

            commentFetcher.getInterfaceName(apiInfo.uri, rsp=>{
                const interfaceName = rsp.data || '';
                commentFetcher.getWinInterfaceDesc(winId, apiInfo.uri, rsp=>{
                    const desc = rsp.data || '';
                    win.innerHTML = `
                        <div style="text-align: right; background: black; color: white; min-width: 100px">
                            <span style="font-size: 12px; cursor: pointer" onclick="${anonyF(()=>{
                                commentFetcher.deleteWinUri(winId, apiInfo.uri);
                                win.parentElement.removeChild(win);
                                for(let i=0; i<$(id_win_items).children.length; i++){
                                    const child = $(id_win_items).children[i];
                                    if(child.firstElementChild.children[1].innerHTML === apiInfo.uri){
                                        child.parentElement.removeChild(child);
                                    }
                                }
                            })}(this)">Delete</span>
                        </div>
                        <div style="">${interfaceName}</div>
                        <div style="padding-left: 3px; font-size: 12px; cursor: pointer"
                            onclick="${anonyF((self)=>{renderApiInfoPane(apiInfo)})}(this)"
                        >${apiInfo.uri}</div>
                        <div>
                            <textarea onchange="${anonyF((self)=>{
                                commentFetcher.updateWinInterfaceDesc(winId, apiInfo.uri, self.value);
                            })}(this)" placeholder="输入接口描述">${desc}</textarea>
                        </div>
                    `
                })
            })

            $(id_item_convas).appendChild(win);
            commentFetcher.getItemWinPosi(winId, apiInfo.uri, rsp=>{
                const position = rsp.data;
                if(position){
                    Utils.$$.setStyle(win, {
                        left: position.x,
                        top: position.y
                    });
                }else {
                    const parent = $(id_item_convas).parentElement;
                    Utils.$$.setStyle(win, {
                        left: parent.scrollLeft + 10,
                        top: parent.scrollTop + 10
                    });
                }
            })
        }
    }

    const allApiInfoMap = getIdMap(allApiInfoList, ite=>ite.uri);
    let container = $(id_item_container);

    if(!container){
        container = createElement('div');
        container.id = id_item_container;
        document.body.appendChild(container);  
        Utils.$$.setStyle(container, {
            width: 'calc(100vw - 700px)',
            height: 'calc(100vh - 39px)',
            position: 'fixed',
            right: 10,
            top: 34,
            'z-index': 7,
            background: 'white',
            border: '1px solid black',
            display: 'flex',
            'flex-direction': 'column',
            'box-shadow': '-2px 3px 14px #888888',
        });
    }

    Utils.$$.setStyle(container, {
        display: 'flex',
        'z-index': ++apipane_z_index
    });

    container.addEventListener('click', ()=>{
        Utils.$$.setStyle(container, {
            'z-index': ++apipane_z_index
        });
    })

    const id_movable = guid();
    const id_sizeAjust = guid();
    const id_sizeAjust_2 = guid();
    container.innerHTML = `
        <div id="${id_movable}" style="z-index: 1">
            <button onclick="${anonyF(()=>{
                Utils.$$.setStyle(container, {
                    display: 'none'
                })
            })}(this)">关闭</button>
            <button onclick="${anonyF(()=>{
                // const posi = {x: Number.MAX_VALUE, y:Number.MAX_VALUE}
                // for(let i =0; i<$(id_item_convas).children.length; i++){
                //     const child = $(id_item_convas).children[i];
                //     const info = Utils.$$.getElementInfo(child);
                //     if(info.top < posi.y){
                //         posi.y = info.top;
                //         posi.x = info.left;
                //     }else if(info.top === posi.y && info.left < posi.x ){
                //         posi.y = info.top;
                //         posi.x = info.left;
                //     }  
                // }
                Utils.$$.setStyle($(id_item_convas), {
                    top: 0,
                    left: 0,
                })
            })}(this)">视图归位</button>
            <button onclick="${anonyF(()=>{
                fetcher.get("/getAllApiInfoList").then(rsp=>{
                    const allApiInfo = rsp.data;
                    showItemConvas(winId, addedApi, allApiInfo, id_win_items);
                });
            })}(this)">刷新</button>
            ${generateSearchableDropDown(allApiInfoList.map(ite=>ite.uri), uri=>{
                const apiInfo = allApiInfoMap.get(uri);
                if(addedApi.find(ite=>ite===uri)) return;
                addedApi.push(uri);
                createWinItem(winId, apiInfo, item=>{
                    $(id_win_items).innerHTML += item;
                });
                commentFetcher.updateWinUris(winId, addedApi);
                createWin(apiInfo);
            }, ele=>{
                Utils.$$.setStyle(ele, {
                    display: 'inline-block'
                })
            }, '点击添加接口')}
            ${generateSearchableDropDown(addedApi, uri=>{
                for(let i =0; i<$(id_item_convas).children.length; i++){
                    const child = $(id_item_convas).children[i];
                    const info = Utils.$$.getElementInfo(child);

                    if(child.children[2].innerHTML === uri){
                        const parent = $(id_item_convas).parentElement;
                        parent.scrollTop = -(info.top < 0? 0 : - info.top + 10);
                        parent.scrollLeft = -(info.left < 0? 0 : - info.left + 10);
                    }
                }
            }, ele=>{
                Utils.$$.setStyle(ele, {
                    display: 'inline-block'
                })
            }, '搜索已添加接口并定位')}
            <span style="marin: 2px; height: 15px; width: 30px; background: black; display: inline-block; float: right; cursor: all-scroll"></span>
        </div>
        <div style="flex-grow: 1; position: relative; overflow: hidden; width: 100%; overflow: scroll">
            <div id="${id_item_convas}" 
                style="cursor: grab;flex-grow: 1;cursor: wrap;position: absolute; top: 0; left: 0;width: 9000px; height: 9000px;background-image: linear-gradient(90deg, rgba(180, 180, 180, 0.15) 10%, rgba(0, 0, 0, 0) 10%),linear-gradient(rgba(180, 180, 180, 0.15) 10%, rgba(0, 0, 0, 0) 10%); background-size: 50px 50px;">
            </div>
        </div>
        <span id="${id_sizeAjust}" style="width: 5px;height: 5px;position: absolute;left: 0;bottom: 0;background: black;cursor: crosshair;"></span>
        <span id="${id_sizeAjust_2}" style="z-index: 7; width: 5px;height: 5px;position: absolute;right: 0;bottom: 0;background: black;cursor: crosshair;"></span>
    `

    addedApi.forEach(ite=>{
        createWin(allApiInfoMap.get(ite));
    });
    
    Utils.$$.addDragEvent($(id_item_convas), (state)=>{
        if(state.registered){
            const parent = $(id_item_convas).parentElement;
            parent.scrollTop -= increaseNumber(state.deltaY, 2);
            parent.scrollLeft -= increaseNumber(state.deltaX, 2);
            document.getSelection().removeAllRanges()
        }
    });

    Utils.$$.addDragEvent($(id_movable), (state)=>{
        if(state.registered){
            Utils.$$.getElementInfo(container, info=>{
                // if(info.top + state.deltaY <= 0 && info.left + state.deltaX <= 0){
                    Utils.$$.setStyle(container, {
                        top: info.top + state.deltaY,
                        left: info.left + state.deltaX
                    })
                // }
                
            })
        }
    });

            
    Utils.$$.addDragEvent($(id_sizeAjust), (state)=>{
        if(state.registered){
            Utils.$$.getElementInfo(container, info=>{
                Utils.$$.setStyle(container, {
                    width: info.innerWidth - state.deltaX,
                    height: info.innerHeight + state.deltaY,
                    left: info.left + state.deltaX,
                })
            })
        }
    })

    Utils.$$.addDragEvent($(id_sizeAjust_2), (state)=>{
        if(state.registered){
            Utils.$$.getElementInfo(container, info=>{
                Utils.$$.setStyle(container, {
                    width: info.innerWidth + state.deltaX,
                    height: info.innerHeight + state.deltaY
                })
            })
        }
    })
}