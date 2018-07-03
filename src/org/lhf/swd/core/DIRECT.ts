import {Styles} from "./Styles";
enum DIRECT { L = 0, LT, T, RT, R, RB, B, LB, C}

/**
 * 获取对应位置的偏移 class
 * @param {DIRECT} direct
 */
function getDirectTransClass(direct: DIRECT) {
    let dclass: string = '';
    switch (direct) {
        case DIRECT.L:
            dclass = Styles.D_L;
            break;
        case DIRECT.T:
            dclass = Styles.D_T;
            break;
        case DIRECT.RT:
            dclass = Styles.D_RT;
            break;
        case DIRECT.R:
            dclass = Styles.D_R;
            break;
        case DIRECT.RB:
            dclass = Styles.D_RB;
            break;
        case DIRECT.B:
            dclass = Styles.D_B;
            break;
        case DIRECT.LB:
            dclass = Styles.D_LB;
            break;
        case DIRECT.C:
            dclass = Styles.D_C;
            break;
        default:
            dclass = Styles.D_LT;
            break;
    }
    return dclass;
}

export {DIRECT, getDirectTransClass}