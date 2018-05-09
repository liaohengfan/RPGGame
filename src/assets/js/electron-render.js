/** * 打开新页面通信 */
let openNewWebView=(url)=>{
    console.log('不在electron环境下')
};

function init(){
    console.log('init');
    const {ipcRenderer} = require('electron');
    console.log('oprender:',ipcRenderer);
    openNewWebView = (url) => {
        console.log('open new fun handler');
        if(ipcRenderer){
            console.log('send message:',url);
            ipcRenderer.send('openNewWebView', url)
        }
    };
}
const require=window.require;
if(require){
    init();
}else{
}