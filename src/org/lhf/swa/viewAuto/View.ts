/**
 * 移动端rem适配
 */
class RemAutoSize{
    max:number=540;
    constructor(maxRatio?:number){
        this.max=maxRatio?maxRatio:this.max;
        this.initAuto(window,window['lib'] || (window['lib'] = {}));
        this.initCss();
    }
    initAuto(win:any, lib:any) {
        let that:RemAutoSize=this;
        let doc:Document = win.document;
        let docEl:HTMLElement = doc.documentElement;
        let metaEl:Element = doc.querySelector('meta[name="viewport"]');
        let flexibleEl:Element = doc.querySelector('meta[name="flexible"]');
        let dpr:number = 0;
        let scale:number = 0;
        let tid:any;
        let flexible = lib.flexible || (lib.flexible = {});

        if (metaEl) {
            console.warn('将根据已有的meta标签来设置缩放比例');
            let match:RegExpMatchArray = metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
            if (match) {
                scale = parseFloat(match[1]);
                dpr = parseInt(String(1 / scale));
            }
        } else if (flexibleEl) {
            let content:string = flexibleEl.getAttribute('content');
            if (content) {
                let initialDpr:RegExpMatchArray = content.match(/initial\-dpr=([\d\.]+)/);
                let maximumDpr:RegExpMatchArray = content.match(/maximum\-dpr=([\d\.]+)/);
                if (initialDpr) {
                    dpr = parseFloat(initialDpr[1]);
                    scale = parseFloat((1 / dpr).toFixed(2));
                }
                if (maximumDpr) {
                    dpr = parseFloat(maximumDpr[1]);
                    scale = parseFloat((1 / dpr).toFixed(2));
                }
            }
        }

        if (!dpr && !scale) {
            let isAndroid = win.navigator.appVersion.match(/android/gi);
            let isIPhone = win.navigator.appVersion.match(/iphone/gi);
            let devicePixelRatio = win.devicePixelRatio;
            //let isRegularDpr = devicePixelRatio.toString().match(/^[1-9]\d*$/g);
            if (isIPhone) {
                // 对于2和3的屏，用2倍的方案，其余的用1倍方案
                if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
                    dpr = 3;
                } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)){
                    dpr = 2;
                } else {
                    dpr = 1;
                }
            } else {
                // 其他设备下，仍旧使用1倍的方案
                dpr = 1;
            }
            scale = 1 / dpr;
        }

        docEl.setAttribute('data-dpr', dpr.toString());
        if (!metaEl) {
            metaEl = doc.createElement('meta');
            metaEl.setAttribute('name', 'viewport');
            //Android target-densitydpi=device-dpi
            let attribute:string = 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no';
            //判断是否是WebView
            let app:any = getCookie('chelun_appName');
            if(app) {
                attribute = 'width=device-width,'+attribute;
            }
            metaEl.setAttribute('content', attribute);
            if (docEl.firstElementChild) {
                docEl.firstElementChild.appendChild(metaEl);
            } else {
                let wrap:any = doc.createElement('div');
                wrap.appendChild(metaEl);
                doc.write(wrap.innerHTML);
            }
        }

        function getCookie(name:string){
            let maps:any = {};
            let cookArr:any[] = document.cookie.split(';');
            for(let i in cookArr){
                let tmp:string = cookArr[i].replace(/^\s*/, '');
                if(tmp){
                    let nv:any[] = tmp.split('=');
                    maps[nv[0]] = nv[1] || '';
                }
            }
            return maps[name];
        }
        function refreshRem(){
            let width:number = docEl.getBoundingClientRect().width;
            if (width / dpr > that.max) {
                width = that.max * dpr;
            }
            let rem:number = width / 10;
            docEl.style.fontSize = rem + 'px';
            flexible.rem = win.rem = rem;
        }

        win.addEventListener('resize', function() {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        }, false);
        win.addEventListener('pageshow', function(e:any) {
            if (e.persisted) {
                clearTimeout(tid);
                tid = setTimeout(refreshRem, 300);
            }
        }, false);

        if (doc.readyState === 'complete') {
            //doc.body.style.fontSize = 12 * dpr + 'px';
        } else {
            doc.addEventListener('DOMContentLoaded', function(e) {
                //doc.body.style.fontSize = 12 * dpr + 'px';
            }, false);
        }

        refreshRem();

        flexible.dpr = win.dpr = dpr;
        flexible.refreshRem = refreshRem;
        flexible.rem2px = function(d:any) {
            let val:any = parseFloat(d) * this.rem;
            if (typeof d === 'string' && d.match(/rem$/)) {
                val += 'px';
            }
            return val;
        }
        flexible.px2rem = function(d:any) {
            let val:any = parseFloat(d) / this.rem;
            if (typeof d === 'string' && d.match(/px$/)) {
                val += 'rem';
            }
            return val;
        }

    }
    initCss():void{
        let a:string = "@charset" +
            " \"utf-8\";html{color:#000;background:#fff;overflow-y:scroll;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}html *{outline:0;-webkit-text-size-adjust:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}html,body{font-family:sans-serif}body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,input,textarea,p,blockquote,th,td,hr,button,article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{margin:0;padding:0}input,select,textarea{font-size:100%}table{border-collapse:collapse;border-spacing:0}fieldset,img{border:0}abbr,acronym{border:0;font-variant:normal}del{text-decoration:line-through}address,caption,cite,code,dfn,em,th,let{font-style:normal;font-weight:500}ol,ul{list-style:none}caption,th{text-align:left}h1,h2,h3,h4,h5,h6{font-size:100%;font-weight:500}q:before,q:after{content:''}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sup{top:-.5em}sub{bottom:-.25em}a:hover{text-decoration:underline}ins,a{text-decoration:none}";
        let b:any=document.createElement('style');
        let head:any=document.getElementsByTagName('head')[0];
        if(head.appendChild(b),b.styleSheet){
            b.styleSheet.disabled||(b.styleSheet.cssText=a);
        }else{
            try{
                b.innerHTML=a;
            }catch (e){
                b.innerText=a;
            }
        }
    }
}
export {RemAutoSize};