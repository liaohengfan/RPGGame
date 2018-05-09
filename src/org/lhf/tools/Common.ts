class Common{
    enabled = false;

    loadingDom: any = null;
    en: boolean = false;
    resizes: Function[] = [];

    constructor() {
        this.loadingDom = document.querySelector('#loadingItem');
        this.enabled = true;
        this.init();
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

    init(): void {
        /**         * 添加窗口大小更改事件         */
        window.addEventListener("resize", () => {
            this.windowResize();
        });
    }

    /**     * 加载动画     */
    loading(stuts: boolean = true) {
        if (stuts) {
            this.loadingDom.style.display = '';
        } else {
            this.loadingDom.style.display = 'none';
        }
    }

    getLanguage(): boolean {
        let language: String = localStorage.getItem('language');
        if (language == 'en') {
            this.changeLanguage(true)
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
export {Common}