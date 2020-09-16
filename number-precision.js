/**
 * 加减乘除运算
 * @type {{strip, digitLength, float2Fixed, checkBoundary, multiply, plus, minus, divide, round}}
 */
var NumberPrecisionUtil = function () {

    /**
     * 解决浮动运算问题，避免小数点后产生多位数和计算精度损失。
     * 问题示例：2.3 + 2.4 = 4.699999999999999，1.0 - 0.9 = 0.09999999999999998
     * @param num
     * @param precision
     * @returns {number}
     */
    var strip = function(num, precision) {
        if (precision === void 0) {
            precision = 12;
        }
        return +parseFloat(num.toPrecision(precision));
    };

    /**
     * Return digits length of a number
     * @param num
     * @returns {number}
     */
    var digitLength = function(num) {
        // Get digit length of e
        var eSplit = num.toString().split(/[eE]/);
        var len = (eSplit[0].split('.')[1] || '').length - (+(eSplit[1] || 0));
        return len > 0 ? len : 0;
    };

    /**
     * 把小数转成整数，支持科学计数法。如果是小数则放大成整数
     * @param num
     * @returns {number}
     */
    var float2Fixed = function(num) {
        if (num.toString().indexOf('e') === -1) {
            return Number(num.toString().replace('.', ''));
        }
        var dLen = digitLength(num);
        return dLen > 0 ? num * Math.pow(10, dLen) : num;
    };

    /**
     * 检测数字是否越界，如果越界给出提示
     * @param num
     * @returns {boolean}
     */
    var checkBoundary = function(num) {
        if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
            console.warn(num + " is beyond boundary when transfer to integer, the results may not be accurate");
            return true;
        }
        return false;
    };

    /**
     * 精确乘法
     * @param num1
     * @param num2
     * @returns {*}
     */
    var multiply = function(num1, num2) {
        var others = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            others[_i - 2] = arguments[_i];
        }
        if (others.length > 0) {
            return multiply.apply(void 0, [multiply(num1, num2), others[0]].concat(others.slice(1)));
        }
        var num1Changed = float2Fixed(num1);
        var num2Changed = float2Fixed(num2);
        var baseNum = digitLength(num1) + digitLength(num2);
        var leftValue = num1Changed * num2Changed;
        //checkBoundary(leftValue);
        return leftValue / Math.pow(10, baseNum);
    };

    /**
     * 精确加法
     * @param num1
     * @param num2
     * @returns {*}
     */
    var plus = function(num1, num2) {
        var others = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            others[_i - 2] = arguments[_i];
        }
        if (others.length > 0) {
            return plus.apply(void 0, [plus(num1, num2), others[0]].concat(others.slice(1)));
        }
        var baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)));
        return (multiply(num1, baseNum) + multiply(num2, baseNum)) / baseNum;
    };

    /**
     * 精确减法
     * @param num1
     * @param num2
     * @returns {*}
     */
    var minus = function(num1, num2) {
        var others = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            others[_i - 2] = arguments[_i];
        }
        if (others.length > 0) {
            return minus.apply(void 0, [minus(num1, num2), others[0]].concat(others.slice(1)));
        }
        var baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)));
        return (multiply(num1, baseNum) - multiply(num2, baseNum)) / baseNum;
    };

    /**
     * 精确除法
     * @param num1
     * @param num2
     * @returns {*}
     */
    var divide = function(num1, num2) {
        var others = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            others[_i - 2] = arguments[_i];
        }
        if (others.length > 0) {
            return divide.apply(void 0, [divide(num1, num2), others[0]].concat(others.slice(1)));
        }
        var num1Changed = float2Fixed(num1);
        var num2Changed = float2Fixed(num2);
        //checkBoundary(num1Changed);
        //checkBoundary(num2Changed);
        return multiply((num1Changed / num2Changed), Math.pow(10, digitLength(num2) - digitLength(num1)));
    };

    /**
     * 四舍五入
     * @param num
     * @param ratio
     * @returns {*}
     */
    var round = function(num, ratio) {
        var base = Math.pow(10, ratio);
        return divide(Math.round(multiply(num, base)), base);
    };

    return {
        strip: function (n, p) {
            return strip(n, p);
        },
        digitLength: function (n) {
            return digitLength(n);
        },
        float2Fixed: function (n) {
            return float2Fixed(n)
        },
        checkBoundary: function (n) {
            return checkBoundary(n);
        },
        multiply: function (n1, n2) {
            return multiply(n1, n2);
        },
        plus: function (n1, n2) {
            return plus(n1, n2);
        },
        minus: function (n1, n2) {
            return minus(n1, n2);
        },
        divide: function (n1, n2) {
            return divide(n1, n2);
        },
        round: function (n, r) {
            return round(n, r);
        }
    };
}();