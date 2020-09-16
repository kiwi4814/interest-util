# 利息计算通用工具JS使用说明

## 引入

默认页面中已引入`jQuery`和`utils.js`

在此基础上引入以下依赖：

```html
<script src="static/common/scripts/number-precision.js" type="text/javascript"></script>
<script src="static/common/scripts/interestUtil.js" type="text/javascript"></script>
```

## 方法文档

### 一、获得两个日期之间相差的天数

#### `InterestUtil.getDays(date1, date2)`

#### 参数说明：

- date1：起始日期，格式为`yyyy-MM-dd`

- date2：结束日期，格式为`yyyy-MM-dd`

#### 返回值：

- 返回值始终为`date2-date1`，也就是未对结果进行绝对值计算

- 约定1月1日和1月2日相差天数为1，有些情况下需要对计算结果额外加1



### 二、对指定的日期进行月份的增减

#### `InterestUtil.addMonths(date, number)`

#### 参数说明：

- `date`：指定起始日期，格式为`yyyy-MM-dd`

- `number`：要加减的月份，为整数，减法则为副整数

#### 返回值：

- 返回计算后的日期字符串，格式为`yyyy-MM-dd`
- 2020-01-31日的基础上增加1个月，结果为2020-02-29，其他情况依次类推



### 三、利息计算

#### `InterestUtil.calculate(money, rate, days, yearDays, ratio)`

#### 参数说明：

- `money`：本金金额，支持千分符格式

- `rate`：合同利率，默认为已经去除%的，例如合同利率为5.6%时需要传入0.056
- `days`：起息日和截止日期的相差天数
- `yearDays`：年度计算标准天数，默认值为365
- `ratio`：小数点后保留位数，默认为4

#### 返回值：

- 返回利息的计算结果，为无千分符的浮点数



## 使用示例

```javascript
console.log("=====getDays测试======");
console.log(InterestUtil.getDays("2020-04-05", "2020-06-10"));// 66

console.log("=====addMonths测试======");
var date = InterestUtil.addMonths("2019-12-31", 4);
console.log(date);// 2020-04-30

console.log("=====calculate测试======");
var number = InterestUtil.calculate("2000000","0.035","66");
console.log(number);// 12657.5342
```

