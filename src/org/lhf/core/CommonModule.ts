class CommonModule {
    public static instance: CommonModule = null;

    public static getInstance(): CommonModule {
        if (!this.instance) {
            this.instance = new CommonModule();
        }
        return this.instance;
    }

    enabled = false;
    loadingDom: any = null;
    en: boolean = false;
    resizes: Function[] = [];
    mouseUps: Function[] = [];

    constructor() {
        if (CommonModule.instance) {
            throw new Error('公共事件管理为单列模式！');
        }
        this.enabled = true;
        this.init();
    }

    bindLoadDom(id_: string): void {
        this.loadingDom = document.querySelector('#' + id_);
    }

    /**   * 添加窗口更改   */
    addWDWResize(fun: Function): void {
        this.resizes.push(fun);
    }

    /**   * 移除窗口更改   */
    removeWDWResize(fun: Function): void {
        for (let i = 0; i < this.resizes.length; i++) {
            let fun_: Function = this.resizes[i];
            if (fun_ == fun) {
                this.resizes.splice(i, 1);
                i--;
                continue;
            }
        }
    }
    /**   * 窗口更改   */
    windowResize(): void {
        for (let i = 0; i < this.resizes.length; i++) {
            let fun = this.resizes[i];
            if (fun) {
                fun();
            }
        }
    }

    /**   * 添加鼠标抬起监听   */
    addMouseUP(fun: Function): void {
        this.mouseUps.push(fun);
    }

    /**   * 移除鼠标抬起监听   */
    removeMouseUP(fun: Function): void {
        for (let i = 0; i < this.mouseUps.length; i++) {
            let fun_: Function = this.mouseUps[i];
            if (fun_ == fun) {
                this.mouseUps.splice(i, 1);
                i--;
                continue;
            }
        }
    }

    /**   * 鼠标抬起事件   */
    mouseUP(): void {
        for (let i = 0; i < this.mouseUps.length; i++) {
            let fun = this.mouseUps[i];
            if (fun) {
                fun();
            }
        }
    }

    init(): void {
        /**         * 添加窗口大小更改事件         */
        window.addEventListener('resize', () => {
            this.windowResize();
        });

        /**         * 添加鼠标抬起事件监听         */
        window.addEventListener('mouseup',()=>{
            this.mouseUP();
        });
    }

    /**     * 加载动画     */
    loading(stuts: boolean = true) {
        if (!this.loadingDom) return;
        if (stuts) {
            this.loadingDom.style.display = '';
        } else {
            this.loadingDom.style.display = 'none';
        }
    }

    getLanguage(): boolean {
        let language: String = localStorage.getItem('language');
        if (language == 'en') {
            this.changeLanguage(true);
        } else {
            this.changeLanguage(false);
        }
        return this.en;
    }

    /**
     * 更改中英文
     * @param {boolean} en_
     */
    changeLanguage(en_: boolean): void {
        this.en = en_;
        if (en_) {
            localStorage.setItem('language', 'en');
        } else {
            localStorage.setItem('language', 'zh');
        }
    }

}

export {CommonModule};