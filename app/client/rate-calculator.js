Session.setDefault('interest', 0);
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
      console.log(context.select);
      var pivot = Session.get('pivot');
      Session.set('start', context.select);
      $('#enddate').show();
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
      console.log(context.select);
      Session.set('end', context.select);

      var start = Session.get('start');
      var end = Session.get('end');
      if (start === 0 || end === 0) {
        console.log('skip');
      } else {
        var len = start - end;
        var days = len / 1000 / 3600 / 24;
        days = Math.abs(days);
        Session.set('dayLength', days);
        console.log(days);
        update();
      }
    }
  });
});

Template.rate.helpers({
  dayLength: function() {
    return Session.get('dayLength');
  },
  interest: function() {
    return Session.get('interest');
  },
  total: function() {
    return Session.get('total');
  }
});

Template.rate.events({
  "click #board": function (event, template) {
    update();
  }
});


function update() {
  var rate = Number($('#rate').val());
  var base = Number($('#base').val());
  console.log('rate: ' + rate);
  console.log('base: ' + base);

  var start = Session.get('start');
  var end = Session.get('end');
  if (start === 0 || end === 0) {
    console.log('skip');
    return;
  } else {
    var len = end - start;
    var days = len / 1000 / 3600 / 24;
    days = Math.abs(days);
    Session.set('dayLength', days);
    console.log(days);
  }
  var interest = Session.get('dayLength') * rate * base / 100 / 30;
  interest = Math.round(interest * Math.pow(10, 2)) / Math.pow(10, 2);
  var total = base + interest;
  console.log("toatal: " + total);
  Session.set('interest', interest);
  Session.set('total', total);
};
