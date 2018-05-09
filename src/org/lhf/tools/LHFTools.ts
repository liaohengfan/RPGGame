interface IColorRGBA{
    r:number;
    g:number;
    b:number;
    a:number;
}
class LHFTools {
    static hexReg: RegExp = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    static debug: boolean = false;

    static msg(msg: string) {
        if (!LHFTools.debug) return;
        console.log(msg);
    }

    static msgs(...args: any[]) {
        if (!LHFTools.debug) return;
        console.log(args);
    }

    static warn(msg: string) {
        if (!LHFTools.debug) return;
        console.warn(msg);
    }

    static prompt(msg: string) {

    }

    /**
     * hex 颜色 转 rgb
     * @param {string} hex
     * @returns {string}
     */
    static colorHEX2RGB(hex: string):any{
        let sColor: string = hex.toLowerCase();
        if (sColor && LHFTools.hexReg.test(sColor)) {
            if (sColor.length === 4) {
                let sColorNew: string = "#";
                for (let i = 1; i < 4; i += 1) {
                    sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                }
                sColor = sColorNew;
            }
            //处理六位的颜色值
            let sColorChange: any[] = [];
            for (let i = 1; i < 7; i += 2) {
                sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
            }
            let rgba: IColorRGBA = {r: sColorChange[0], g: sColorChange[1], b: sColorChange[2], a: 255,};
            return rgba;
            //return "RGB(" + sColorChange.join(",") + ")";
        } else {
            return sColor;
        }
    }

}

let msg: Function = LHFTools.msg;
let msgs: Function = LHFTools.msgs;
let warn: Function = LHFTools.warn;
let prompt: Function = LHFTools.prompt;
let colorHEX2RGB: Function = LHFTools.colorHEX2RGB;

export {LHFTools, msg, msgs, warn, prompt,colorHEX2RGB,IColorRGBA};