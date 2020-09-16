Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
Date.isLeapYear = function (year) {
    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
};

Date.getDaysInMonth = function (year, month) {
    return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};

Date.prototype.isLeapYear = function () {
    return Date.isLeapYear(this.getFullYear());
};

Date.prototype.getDaysInMonth = function () {
    return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
};

Date.prototype.addDays = function (d) {
    return this.setTime(this.getTime() + (d * (1000 * 60 * 60 * 24)));
};

Date.prototype.addMonths = function (value) {
    var n = this.getDate();
    this.setDate(1);
    this.setMonth(this.getMonth() + value);
    this.setDate(Math.min(n, this.getDaysInMonth()));
    return this;
};

var InterestUtil = function () {
    /**
     * 将YYYY-MM-DD格式的日期字符串转换为日期对象
     * @param dateStr
     * @returns {Date}
     */
    var _createNewDate = function (dateStr) {
        dateStr += '';
        var dateArray = dateStr.split("-");
        return new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
    }


    /**
     * 获得两个日期之间相差的天数（例如2020-01-02到2020-01-03日中间相差是1天）
     * - 日期格式为yyyy-MM-dd
     * - 返回值未取绝对值，始终为date2-date1
     * @param date1
     * @param date2
     * @returns {number}
     */
    var _getDays = function (date1, date2) {
        var date1Obj = _createNewDate(date1);
        var date2Obj = _createNewDate(date2);
        var t1 = date1Obj.getTime();
        var t2 = date2Obj.getTime();
        var dateTime = 1000 * 60 * 60 * 24; //每一天的毫秒数
        return Math.floor(((t2 - t1) / dateTime));//计算出两个日期的天数差
    }
    /**
     * 对指定的日期进行月份的增减
     * - 日期格式为yyyy-MM-dd
     * - 返回值为字符串，格式为yyyy-MM-dd
     * @param date
     * @param number
     * @returns {*}
     * @private
     */
    var _addMonths = function (date, number) {
        var dateObj = _createNewDate(date);
        dateObj.addMonths(number);
        return dateObj.format("yyyy-MM-dd");
    }

    /**
     * 页面上的金额取消千分符并且转为数字
     * @param number
     * @returns {number}
     */
    var _parseToNumber = function (number) {
        number = number.replace(/,/g, '');
        number = number.replace(/[　 \s]*/g, "");
        var result = parseFloat(number);
        return GlobalUtil.isEmpty(result) ? 0 : result;
    }

    /**
     * 计算利息
     * @param money 本金余额（支持传入千分符）
     * @param rate 合同利率（数字,例如0.056）
     * @param days 起息日和截止日期的相差天数
     * @param yearDays 年度计算标准天数，默认为365
     * @param ratio 四舍五入到小数点后的位数，默认为4
     * @returns {number} 利息
     * @private
     */
    var _calculate = function (money, rate, days, yearDays, ratio) {
        if (GlobalUtil.isEmpty(yearDays)) {
            yearDays = 365;
        }
        if (GlobalUtil.isEmpty(ratio)) {
            ratio = 4;
        }
        var result = 0;
        yearDays = parseInt(yearDays);
        money = _parseToNumber(money);
        rate = _parseToNumber(rate);
        days = parseInt(days);
        if (!GlobalUtil.isEmpty(days)) {
            result = NumberPrecisionUtil.divide(NumberPrecisionUtil.multiply(NumberPrecisionUtil.multiply(money, rate), days), yearDays);
        }
        return NumberPrecisionUtil.round(result, ratio);
    }

    return {
        getDays: function (date1, date2) {
            return _getDays(date1, date2);
        },
        addMonths: function (date, number) {
            return _addMonths(date, number);
        },
        calculate: function (money, rate, days, yearDays, ratio) {
            return _calculate(money, rate, days, yearDays, ratio);
        }
    };
}();