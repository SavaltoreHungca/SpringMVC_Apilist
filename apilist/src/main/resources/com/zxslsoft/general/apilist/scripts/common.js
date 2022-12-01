EMPYT_F = function () { };

ERROR_F = function (error) {
    if (error) {
        console.log(error);
        if (typeof error === 'object') {
            showMessage(JSON.stringify(error, undefined, 2));
        } else {
            alert(error);
        }
    }
}

// Generate a pseudo-GUID by concatenating random hexadecimal. 
function guid() {
    // Generate four random hex digits. 
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return "_" + S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
};

function $(id){
    return document.getElementById(id);
}

function anonyF(func) {
    const f = guid();
    window[f] = func;
    return f;
}

function confirmPane(fields, onConfirm) {
    const baseStyle = `
        position: fixed;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        z-index: 999999;
        background: rgba(0,0,0,0.8);
        color: white;
    `
    let confirmPane = document.getElementById("confirmPane");
    if (!confirmPane) {
        confirmPane = document.createElement('div');
        confirmPane.id = 'confirmPane';
        confirmPane.style.cssText = baseStyle + "display: none;";
        document.body.appendChild(confirmPane);
    }

    confirmPane.style.cssText = baseStyle

    confirmPane.fieldMap = {};
    let innerH = '<table style="margin: auto; margin-top: 10vh">'
    for (const name of fields) {
        innerH += `
            <tr>
                <td>${name}</td>
                <td><input onchange="${anonyF((self) => { confirmPane.fieldMap[name] = self.value; })}(this)"></td>
            </tr>
        `
    }

    const cancelAct = () => {
        confirmPane.style.cssText = baseStyle + "display: none;";
    }
    const buttonAct = () => {
        onConfirm(confirmPane.fieldMap);
        cancelAct();
    }
    innerH += `
        <tr>
            <td style="background: none"></td>
            <td>
                <button onclick="${anonyF(cancelAct)}()">cancel</button>
                <button onclick="${anonyF(buttonAct)}()">confirm</button>
            </td>
        </tr>
    `
    innerH += '</table>';
    confirmPane.innerHTML = innerH;
}

function isOnLoading(isOnloading, msg) {
    const baseStyle = `
        position: fixed;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        z-index: 99;
        background: rgba(0,0,0);
        color: white;
    `
    let loadingPane = document.getElementById("loadingPane");
    if (!loadingPane) {
        loadingPane = document.createElement('div');
        loadingPane.id = 'loadingPane';
        loadingPane.style.cssText = baseStyle + "display: none;";
        document.body.appendChild(loadingPane);
    }
    if (isOnloading) {
        loadingPane.innerHTML = `
            <h3 style="margin-top: 50vh">
                ${msg ? msg : 'Processing, please wait...'}
            </h3>
        `;
        loadingPane.style.cssText = baseStyle;
    } else {
        loadingPane.style.cssText = baseStyle + "display: none;";
    }
}

function showMessage(msg) {
    console.log(msg);
    const baseStyle = `
        position: fixed;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        z-index: 99;
        background: rgba(0,0,0);
        color: white;
    `
    let msgPane = document.getElementById("msgPane");
    if (!msgPane) {
        msgPane = document.createElement('div');
        msgPane.id = 'msgPane';
        msgPane.style.cssText = baseStyle + "display: none;";
        document.body.appendChild(msgPane);
        msgPane.onclick = () => {
            msgPane.style.cssText = baseStyle + "display: none;";
        }
    }

    msgPane.innerHTML = `
        <h3 style="margin-top: 10px">
            <script type="text/html" style="display: block;">
                <pre>${typeof msg === 'object' ? JSON.stringify(msg, undefined, 2) : msg}</pre>
            </script>
        </h3>
    `;
    msgPane.style.cssText = baseStyle;
}

/**
 * @param {(ele: HTMLElement)=>{}} consumer
 * @return {HTMLElement}
 */
function createElement(name, consumer){
    const ele = document.createElement(name);
    if(consumer){
        consumer(ele);
    }
    return ele;
}

function picView(src) {
    const baseStyle = `
        position: fixed;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        z-index: 99;
        background: rgba(0,0,0);
        color: white;
    `
    let picPane = document.getElementById("picPane");
    if (!picPane) {
        picPane = document.createElement('div');
        picPane.id = 'picPane';
        picPane.style.cssText = baseStyle + "display: none;";
        document.body.appendChild(picPane);
        picPane.onclick = () => {
            picPane.style.cssText = baseStyle + "display: none;";
        }
    }

    picPane.innerHTML = `
        <img style="display: block;margin: auto; margin-top: 10px;" src="${src}"></img>
    `;
    picPane.style.cssText = baseStyle;
}

function paramlizeForGet(data){
    let str = '';
    for(const name in data){
        if(Array.isArray(data[name])){
            for (let j of data[name]) {
                str += encodeURIComponent(name) + "=" + encodeURIComponent(j) + "&";
            }
        }
        else {
            str += encodeURIComponent(name) + "=" + encodeURIComponent(data[name]) + "&";
        }
    }
    if(str !== ''){
        str = str.substring(0, str.length -1);
    }
    return str;
}

const BASE64={
   
    enKey: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
     
    deKey: new Array(
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
      52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
      -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
      15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
      -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
      41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
    ),
     
    encode: function(src){
      //用一个数组来存放编码后的字符，效率比用字符串相加高很多。
      var str=new Array();
      var ch1, ch2, ch3;
      var pos=0;
      //每三个字符进行编码。
      while(pos+3<=src.length){
        ch1=src.charCodeAt(pos++);
        ch2=src.charCodeAt(pos++);
        ch3=src.charCodeAt(pos++);
        str.push(this.enKey.charAt(ch1>>2), this.enKey.charAt(((ch1<<4)+(ch2>>4))&0x3f));
        str.push(this.enKey.charAt(((ch2<<2)+(ch3>>6))&0x3f), this.enKey.charAt(ch3&0x3f));
      }
      //给剩下的字符进行编码。
      if(pos<src.length){
        ch1=src.charCodeAt(pos++);
        str.push(this.enKey.charAt(ch1>>2));
        if(pos<src.length){
          ch2=src.charCodeAt(pos);
          str.push(this.enKey.charAt(((ch1<<4)+(ch2>>4))&0x3f));
          str.push(this.enKey.charAt(ch2<<2&0x3f), '=');
        }else{
          str.push(this.enKey.charAt(ch1<<4&0x3f), '==');
        }
      }
      //组合各编码后的字符，连成一个字符串。
      return str.join('');
    },
     
    decode: function(src){
      //用一个数组来存放解码后的字符。
      var str=new Array();
      var ch1, ch2, ch3, ch4;
      var pos=0;
      //过滤非法字符，并去掉'='。
      src=src.replace(/[^A-Za-z0-9\+\/]/g, '');
      //decode the source string in partition of per four characters.
      while(pos+4<=src.length){
        ch1=this.deKey[src.charCodeAt(pos++)];
        ch2=this.deKey[src.charCodeAt(pos++)];
        ch3=this.deKey[src.charCodeAt(pos++)];
        ch4=this.deKey[src.charCodeAt(pos++)];
        str.push(String.fromCharCode(
          (ch1<<2&0xff)+(ch2>>4), (ch2<<4&0xff)+(ch3>>2), (ch3<<6&0xff)+ch4));
      }
      //给剩下的字符进行解码。
      if(pos+1<src.length){
        ch1=this.deKey[src.charCodeAt(pos++)];
        ch2=this.deKey[src.charCodeAt(pos++)];
        if(pos<src.length){
          ch3=this.deKey[src.charCodeAt(pos)];
          str.push(String.fromCharCode((ch1<<2&0xff)+(ch2>>4), (ch2<<4&0xff)+(ch3>>2)));
        }else{
          str.push(String.fromCharCode((ch1<<2&0xff)+(ch2>>4)));
        }
      }
      //组合各解码后的字符，连成一个字符串。
      return str.join('');
    }
  };

function encode(v){
    return encodeURIComponent(v);
}

function decode(v){
    return v;
}

function launchFunctions(collection){
    (collection || []).forEach(v => {
        v();
    })
}

function randomInt(len) {
    if (typeof len !== 'number') {
        len = 100;
    }
    return Math.ceil(Math.random() * Math.pow(10, Math.ceil(len / 10))) % len;
}

function randomEmoji(len) {
    if (typeof len !== 'number') {
        len = 1;
    }
    const set = [
        '😀', '😁', '😂', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '😗', '😙', '😚', '😇', '😐', '😑', '😶', '😏', '😣', '😥', '😮', '😯', '😪', '😫', '😴', '😌', '😛', '😜', '😝', '😒', '😓', '😔', '😕', '😲', '😷', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😬', '😰', '😱', '😳', '😵', '😡', '😠',
        '👦','👧','👨','👩','👴','👵','👶','👱','👮','👲','👳','👷','👸','💂','🎅','👰','👼','💆','💇','🙍','🙎','🙅','🙆','💁','🙋','🙇','🙌','🙏','👤','👥','🚶','🏃','👯','💃','👫','👬','👭','💏','💑','👪',        
    ]
    let ans = '';
    for (let i = 0; i < len; i++) {
        ans += set[randomInt(set.length)];
    }
    return ans;
}

/**
 * 
 * @param {HTMLElement} container 
 * @param {[]} list 
 */
function searchableDropDown(container, list, selectedCallBack, placeholder, inputClick) {
    const id_selectResult = guid();
    const id_selectList = guid();
    const id_items_container = guid();

    const style_com = "position: relative;";
    const style_close = "display: none; " + style_com;
    const style_open = style_com;

    list = list || [];


    const getListStr = (list)=>{
        let listStr = '';
        list.forEach(ite=>{
            listStr += `
                <div onclick="${anonyF(()=>{
                    $(id_selectResult).value = ite;
                    $(id_selectList).opend = false;
                    $(id_selectList).style.cssText = style_close;
                    if(selectedCallBack) selectedCallBack(ite);
                })}(this)">${ite}</div>
            `
        });
        return listStr;
    }
    
    container.innerHTML = `
        <input id="${id_selectResult}" style="cursor: pointer" onclick="${anonyF((self)=>{
            if(inputClick){
                inputClick(id_selectResult);
            }
            if($(id_selectList).opend){
                $(id_selectList).opend = false;
                $(id_selectList).style.cssText = style_close;
            }else{
                $(id_selectList).opend = true;
                $(id_items_container).innerHTML = getListStr(list);
                $(id_selectList).style.cssText = style_open;
            }
        })}(this)" placeholder="${placeholder?placeholder:'请选择'}" oninput="${anonyF((self)=>{
            $(id_items_container).innerHTML = getListStr(list.filter(str=>{
                return str.toLowerCase().indexOf(self.value.toLowerCase()) >= 0;
            }));
        })}(this)">
        <div id="${id_selectList}" style="${style_close}">
            <div id="${id_items_container}" onwheel="${anonyF((self)=>{
                const event = window.event || arguments.callee.caller.arguments[0]
                event.stopPropagation();
            })}(this)" style="z-index: 999; position: absolute; top: 0; left: 0; background: rgba(0,0,0,1);overflow: scroll; height: 100px; font-size: 12px; color: white; cursor: context-menu">
                ${getListStr(list)}
            </div>
        </div>
    `
}

/**
 * 
 * @param {[]} list 
 * @param {(ele: HTMLElement)=>{}} consumer  当元素创建好后的回调
 * @param selectedCallBack  当选择选项后的回调
 */
function generateSearchableDropDown(list, selectedCallBack, consumer, placeholder, inputClick){
    const div = document.createElement('div');
    const container = document.createElement('div');
    div.appendChild(container);
    searchableDropDown(container, list, selectedCallBack, placeholder, inputClick);
    if(consumer) consumer(container);
    const ans = div.innerHTML;
    div.removeChild(container);
    return ans;
}


function listenTextInput(container, triggleTextInput) {
    container.skipInputEvent = true;

    container.addEventListener("compositionstart", (event) => {
        container.skipInputEvent = true;
    })
    container.addEventListener("compositionend", (event) => {
        triggleTextInput(event.data)
        container.skipInputEvent = false;
    })
    container.addEventListener('input', (event) => {
        if (container.skipInputEvent) return;
        triggleTextInput(event.data)
    })
}

/**
 * 
 * @param {[]} list 
 */
function getIdMap(list, func){
    list = list || [];
    const map = new Map()
    list.forEach(ite=>{
        map.set(func(ite), ite);
    });
    return map;
}

function increaseNumber(ori, incre){
    if(ori < 0){
        return ori - Math.abs(incre);
    }else if(ori > 0){
        return ori + Math.abs(incre);
    }else {
        return ori;
    }
}

function textToElement(text){
    return createElement('div', div=>{
        div.innerHTML = text;
    }).firstElementChild;
}