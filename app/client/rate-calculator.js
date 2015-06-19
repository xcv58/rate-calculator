Session.setDefault('interest', 0);
Session.setDefault('total', 0);
Session.setDefault('dayLength', 0);
Session.setDefault('start', 0);
Session.setDefault('end', 0);

Template.rate.onRendered(function () {
  $('#startdate').pickadate({
    monthsFull: [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ],
    monthsShort: [ '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二' ],
    weekdaysFull: [ '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六' ],
    weekdaysShort: [ '日', '一', '二', '三', '四', '五', '六' ],
    today: '今日',
    clear: '清除',
    close: '关闭',
    firstDay: 1,
    format: 'yyyy 年 mm 月 dd 日',
    formatSubmit: 'yyyy/mm/dd',
    showMonthsShort: true,
    selectMonths: true,
    selectYears: true,
    onSet: function(context) {
      Session.set('start', context.select);
      update();
    }
  });
  $('#enddate').pickadate({
    monthsFull: [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ],
    monthsShort: [ '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二' ],
    weekdaysFull: [ '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六' ],
    weekdaysShort: [ '日', '一', '二', '三', '四', '五', '六' ],
    today: '今日',
    clear: '清除',
    close: '关闭',
    firstDay: 1,
    format: 'yyyy 年 mm 月 dd 日',
    formatSubmit: 'yyyy/mm/dd',
    showMonthsShort: true,
    selectMonths: true,
    selectYears: true,
    onSet: function(context) {
      Session.set('end', context.select);
      update();
    }
  });
  update();
});

Template.rate.helpers({
  dayLength: function() {
    return Session.get('dayLength');
  },
  chineseBase: function() {
    return numberToChinese(Session.get('base'));
  },
  interest: function() {
    return Session.get('interest');
  },
  chineseInterest: function() {
    return numberToChinese(Session.get('interest'));
  },
  total: function() {
    return Session.get('total');
  },
  chineseTotal: function() {
    return numberToChinese(Session.get('total'));
  }
});

Template.rate.events({
  "click #board": function (event, template) {
    update();
  },
  'keyup input': function(event) {
    update();
  }
});

function update() {
  var rate = Number($('#rate').val());
  var base = Number($('#base').val());
  Session.set('base', base);

  var start = Session.get('start');
  var end = Session.get('end');
  if (start === 0 || end === 0) {
    return;
  } else {
    var len = end - start;
    var days = len / 1000 / 3600 / 24;
    days = Math.abs(days);
    Session.set('dayLength', days);
  }
  var interest = Session.get('dayLength') * rate * base / 100 / 30;
  interest = Math.round(interest * Math.pow(10, 2)) / Math.pow(10, 2);
  var total = base + interest;
  Session.set('interest', interest);
  Session.set('total', total);
};

function numberToChinese(n) {
  if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
    return "数据非法";
  var unit = "千百拾亿千百拾万千百拾元角分", str = "";
  n += "00";
  var p = n.indexOf('.');
  if (p >= 0) {
    n = n.substring(0, p) + n.substr(p + 1, 2);
  }
  unit = unit.substr(unit.length - n.length);
  for (var i=0; i < n.length; i++)
    str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
  return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
}
