/**
 * 差值
 * by liaohengfan@yeah.net
 * 2017.12.4
 * @type {{Linear: ((v: any, k: number) => (number | number | number)); Bezier: ((v: any, k: number) => number); CatmullRom: ((v: any, k: number) => (number | number)); Utils: {Linear: ((p0: number, p1: number, t: number) => number); Bernstein: ((n: number, i: number) => number); Factorial: ((n: number) => number); CatmullRom: ((p0: number, p1: number, p2: number, p3: number, t: number) => number)}}}
 */
let Interpolation:any={

    /**
     * 线性
     * @param v
     * @param {number} k
     * @returns {number}
     * @constructor
     */
    Linear: function (v:any,k:number) {

        let m = v.length - 1;
        let f = m * k;
        let i = Math.floor(f);
        let fn = Interpolation.Utils.Linear;

        if (k < 0) {
            return fn(v[0], v[1], f);
        }

        if (k > 1) {
            return fn(v[m], v[m - 1], m - f);
        }

        return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);

    },

    /**
     * 贝塞尔曲线
     * @param v
     * @param {number} k
     * @returns {number}
     * @constructor
     */
    Bezier: function (v:any,k:number) {

        let b = 0;
        let n = v.length - 1;
        let pw = Math.pow;
        let bn = Interpolation.Utils.Bernstein;

        for (let i = 0; i <= n; i++) {
            b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
        }

        return b;

    },

    /**
     * CatmullRom
     * @param v
     * @param {number} k
     * @returns {number}
     * @constructor
     */
    CatmullRom: function (v:any,k:number) {

        let m = v.length - 1;
        let f = m * k;
        let i = Math.floor(f);
        let fn = Interpolation.Utils.CatmullRom;

        if (v[0] === v[m]) {

            if (k < 0) {
                i = Math.floor(f = m * (1 + k));
            }

            return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);

        } else {

            if (k < 0) {
                return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
            }

            if (k > 1) {
                return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
            }

            return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);

        }

    },

    /**
     * 辅助
     */
    Utils: {

        /**
         * 线性
         * @param {number} p0
         * @param {number} p1
         * @param {number} t
         * @returns {number}
         * @constructor
         */
        Linear: function (p0:number, p1:number, t:number) {

            return (p1 - p0) * t + p0;

        },

        /**
         * Bernstein
          * @param {number} n
         * @param {number} i
         * @returns {number}
         * @constructor
         */
        Bernstein: function (n:number, i:number) {

            let fc = Interpolation.Utils.Factorial;

            return fc(n) / fc(i) / fc(n - i);

        },

        /**
         * 阶乘
         */
        Factorial: (function () {

            let a = [1];

            return function (n:number) {

                let s = 1;

                if (a[n]) {
                    return a[n];
                }

                for (let i = n; i > 1; i--) {
                    s *= i;
                }

                a[n] = s;
                return s;

            };

        })(),

            CatmullRom: function (p0:number, p1:number, p2:number, p3:number, t:number) {

            let v0 = (p2 - p0) * 0.5;
            let v1 = (p3 - p1) * 0.5;
            let t2 = t * t;
            let t3 = t * t2;

            return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (- 3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;

        }

    }

};
export {Interpolation};