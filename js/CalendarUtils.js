
/**
 * Namespace Calendar
 * Utility class
 * Like javascript Date object, month is 0 based.
 */
var CalendarUtils = {}; 
CalendarUtils.numericToMonthCn = function (num) {
    if (num==0) {
      return "一月";
    } else if (num==1) {
      return "二月";
    } else if (num==2) {
      return "三月";
    } else if (num==3) {
      return "四月";
    } else if (num==4) {
      return "五月";
    } else if (num==5) {
      return "六月";
    } else if (num==6) {
      return "七月";
    } else if (num==7) {
      return "八月";
    } else if (num==8) {
      return "九月";
    } else if (num==9) {
      return "十月";
    } else if (num==10) {
      return "十一月";
    } else if (num==11) {
      return "十二月";
    }
    return "";
};


CalendarUtils.numericToDayInWeekCn= function (num) {
    if (num==1) {
      return "周一";
    } else if (num==2) {
      return "周二";
    } else if (num==3) {
      return "周三";
    } else if (num==4) {
      return "周四";
    } else if (num==5) {
      return "周五";
    } else if (num==6) {
      return "周六";
    } else if (num==0) {
      return "周日";
    }    return "";
};

CalendarUtils.getDayOfWeekOfFirstDayInYear = function () {
    var today = new Date();
    var year = today.getFullYear();
    var firstDayInYear = new Date(year, 0, 1);
    return firstDayInYear.getDay();
};

CalendarUtils.getTodayDayOfYear = function () {
    var today = new Date();
    return CalendarUtils.getDayOfYear(today);
};

CalendarUtils.getTodayDayOfMonth = function () {
    var today = new Date();
    return today.getDate();
};

CalendarUtils.getTodayMonth = function () {
    var today = new Date();
    return today.getMonth();
};

CalendarUtils.getDayOfYear = function (dateObj) {
    var month = dateObj.getMonth(); //0-11
    month += 1; //1-12
    var dayInMonth = dateObj.getDate();
    var monthlyDays = CalendarUtils.getMonthlyDaysArray();
    var dayOfYear = 0;
    for (var i =0; i<month; i++) {
      dayOfYear += monthlyDays[i];
    }
    dayOfYear += dayInMonth;
    return dayOfYear;
};

CalendarUtils.addDays = function (dateObj, dayCount) {
    var oldMilli = dateObj.getTime();
    return new Date(oldMilli+86400000*dayCount);
};

CalendarUtils.getMonthlyDaysArray = function () {
    var today = new Date();
    var year = today.getFullYear();
    if (CalendarUtils.isLeapYear(year)) {
      return [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    } else {
      return [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    }
};


CalendarUtils.isLeapYear = function (year) {
  return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
};

CalendarUtils.buildCalendarView = function(viewSecId, collapseBtnIdFunc, collapseDivIdFunc, dayElementFunc) {
  var dayOfWeekOfFirstDayInYear = CalendarUtils.getDayOfWeekOfFirstDayInYear();
  var daysInMonths= CalendarUtils.getMonthlyDaysArray();
  var dayOfYearOfFirstDayInMonth = 1;
  for (var j=0; j<12; j++) {
    var buttonEle = $(document.createElement('button'));
    buttonEle.addClass("btn btn-block m-t-1");
    buttonEle.attr("id", collapseBtnIdFunc(j)); 
    buttonEle.attr("type","button");
    buttonEle.attr("data-toggle","collapse");
    buttonEle.attr("data-target","#"+collapseDivIdFunc(j));
    buttonEle.text(CalendarUtils.numericToMonthCn(j));
    $(viewSecId).append(buttonEle);
    var tableWrapperEle = $(document.createElement('div'));
    tableWrapperEle.addClass("table-responsive collapse");
    tableWrapperEle.attr("id", collapseDivIdFunc(j));
    $(viewSecId).append(tableWrapperEle);
    var tableEle = $(document.createElement('table'));
    tableWrapperEle.append(tableEle);
    tableEle.addClass("table table-striped table-condensed text-center");

    var theadEle = $(document.createElement('thead'));
    theadEle.addClass("thead-default");
    tableEle.append(theadEle);
    var trEle = $(document.createElement('tr'));
    theadEle.append(trEle);

    for (var i=0; i<7; i++) {
      var thEle = $(document.createElement('th'));
      thEle.addClass("text-center");
      thEle.text(CalendarUtils.numericToDayInWeekCn(i));
      trEle.append(thEle);
    }

    var tbodyEle = $(document.createElement('tbody'));
    tableEle.append(tbodyEle);

    dayOfYearOfFirstDayInMonth += daysInMonths[j];
    var dayOfYearOfLastDayInMonth = dayOfYearOfFirstDayInMonth+daysInMonths[j+1]-1;
    trEle = $(document.createElement('tr'));
    tbodyEle.append(trEle);
    for (var i=0; i<(dayOfYearOfFirstDayInMonth+dayOfWeekOfFirstDayInYear-1)%7; i++) {
      var tdEle = $(document.createElement('td'));
      trEle.append(tdEle);
    }

    for (var i=dayOfYearOfFirstDayInMonth; i<=dayOfYearOfLastDayInMonth; i++) {
      if ((i+dayOfWeekOfFirstDayInYear-1)%7==0) {
        trEle = $(document.createElement('tr'));
        tbodyEle.append(trEle);
      }
      var tdEle = $(document.createElement('td'));

      var dayEle = dayElementFunc(j, i-dayOfYearOfFirstDayInMonth+1, i);
      tdEle.append(dayEle);
      trEle.append(tdEle);
    }
  }
};
