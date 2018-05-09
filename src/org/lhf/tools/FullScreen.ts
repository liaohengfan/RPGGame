class FullScreen {
    name:string=null;
    constructor() {
        this.name = 'FullScreenMethod';
    }

    static requestFullScreen(element:any) {
        const WDS:any=window;
        const ELE:any=element;
        //  判断各种浏览器，找到正确的方法
        if (ELE.requestFullscreen) {
            ELE.requestFullscreen();
        } else if (ELE.msRequestFullscreen) {
            ELE.msRequestFullscreen();
        } else if (ELE.mozRequestFullScreen) {
            ELE.mozRequestFullScreen();
        } else if (ELE.webkitRequestFullScreen) {
            ELE.webkitRequestFullScreen();
        } else {
            const ActiveXObject = WDS.ActiveXObject;
            if (typeof WDS.ActiveXObject !== 'undefined') {
                const wscript = new ActiveXObject('WScript.Shell');
                if (wscript !== null) {
                    wscript.SendKeys('{F11}');
                }
            }
        }
    }

    // 退出全屏 判断浏览器种类
    static exitFull() {
        const DOC:any=document;
        const WDS:any=window;
        //  判断各种浏览器，找到正确的方法
        if (DOC.exitFullscreen) {
            DOC.exitFullscreen();
        } else if (DOC.msExitFullscreen) {
            DOC.msExitFullscreen();
        } else if (DOC.mozCancelFullScreen) {
            DOC.mozCancelFullScreen();
        } else if (DOC.webkitCancelFullScreen) {
            DOC.webkitCancelFullScreen();
        } else {
            const ActiveXObject = WDS.ActiveXObject;
            if (typeof WDS.ActiveXObject !== 'undefined') {
                const wscript = new ActiveXObject('WScript.Shell');
                if (wscript !== null) {
                    wscript.SendKeys('{F11}');
                }
            }
        }
    }

    /**
     * 全屏事件监听
     * @param callBack_
     */
    static addFullScreenChangeEvent(callBack:Function) {
        const DOC:any=document;
        const WDS:any=window;
        let histStuts = false;
        /**         * 状态更改         */
        function stutsChange(val:any) {
            if (histStuts !== val && callBack) {
                callBack(val);
            }
            histStuts = val;
        }

        // 监听不同浏览器的全屏事件，并件执行相应的代码
        document.addEventListener('webkitfullscreenchange', function () {
            if (document.webkitIsFullScreen) {
                // 全屏后要执行的代码
                stutsChange(true);
            } else {
                // 退出全屏后执行的代码
                stutsChange(false);
            }
        }, false);

        document.addEventListener('fullscreenchange', function () {
            if (DOC.fullscreen) {
                // 全屏后执行的代码
                stutsChange(true);
            } else {
                // 退出全屏后要执行的代码
                stutsChange(false);
            }
        }, false);

        document.addEventListener('mozfullscreenchange', function () {
            if (DOC.mozFullScreen) {
                // 全屏后要执行的代码
                stutsChange(true);
            } else {
                // 退出全屏后要执行的代码
                stutsChange(false);
            }
        }, false);

        document.addEventListener('msfullscreenchange', function () {
            if (DOC.msFullscreenElement) {
                // 全屏后要执行的代码
                stutsChange(true);
            } else {
                // 退出全屏后要执行的代码
                stutsChange(false);
            }
        }, false);
    }
}
export default FullScreen;
