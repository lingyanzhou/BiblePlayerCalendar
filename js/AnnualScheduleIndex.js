/**
 * AnnualScheduleIndex object
 *
 * 
 */
var AnnualScheduleIndex = function() {
  this.newTestamentSecId = "#bibleAnnualSchedule-newTestamentSec";
  this.oldTestamentSecId = "#bibleAnnualSchedule-oldTestamentSec";

  this.maxOldTestamentLink = 364;
  this.maxNewTestamentLink = 364;

  this.buildCalendarView(this.newTestamentSecId,
      StringUtils.getPrefixStringFunc("bibleAnnualSchedule-linklist-nt-"),
      StringUtils.getPrefixStringFunc("bibleAnnualSchedule-linklist-nt-collapse-"),
      PageLinkUtils.getLinkFunc(false, this.maxNewTestamentLink));

  this.buildCalendarView(this.oldTestamentSecId,
      StringUtils.getPrefixStringFunc("bibleAnnualSchedule-linklist-ot-"),
      StringUtils.getPrefixStringFunc("bibleAnnualSchedule-linklist-ot-collapse-"),
      PageLinkUtils.getLinkFunc(true, this.maxOldTestamentLink));

  var today = new Date();
  $("#gotoTodayNewTestament").text("今天-新约("+(today.getMonth()+1) + "-"+today.getDate()+")");
  $("#gotoTodayNewTestament").attr("href", PageLinkUtils.buildNewTestamentLink(CalendarUtils.getDayOfYear(today), this.maxNewTestamentLink));

  $("#gotoTodayOldTestament").text("今天-旧约("+(today.getMonth()+1) + "-"+today.getDate()+")");
  $("#gotoTodayOldTestament").attr("href", PageLinkUtils.buildOldTestamentLink(CalendarUtils.getDayOfYear(today), this.maxOldTestamentLink));

  var yesterday = CalendarUtils.addDays(today, -1);
  $("#gotoYesterdayNewTestament").text("昨天-新约("+(yesterday.getMonth()+1) + "-"+yesterday.getDate()+")");
  $("#gotoYesterdayNewTestament").attr("href", PageLinkUtils.buildNewTestamentLink(CalendarUtils.getDayOfYear(yesterday), this.maxNewTestamentLink));

  $("#gotoYesterdayOldTestament").text("昨天-旧约("+(yesterday.getMonth()+1) + "-"+yesterday.getDate()+")");
  $("#gotoYesterdayOldTestament").attr("href", PageLinkUtils.buildOldTestamentLink(CalendarUtils.getDayOfYear(yesterday), this.maxOldTestamentLink));

  var tomorrow = CalendarUtils.addDays(today, 1);
  $("#gotoTomorrowNewTestament").text("明天-新约("+(tomorrow.getMonth()+1) + "-"+tomorrow.getDate()+")");
  $("#gotoTomorrowNewTestament").attr("href", PageLinkUtils.buildNewTestamentLink(CalendarUtils.getDayOfYear(tomorrow), this.maxNewTestamentLink));

  $("#gotoTomorrowOldTestament").text("明天-旧约("+(tomorrow.getMonth()+1) + "-"+tomorrow.getDate()+")");
  $("#gotoTomorrowOldTestament").attr("href", PageLinkUtils.buildOldTestamentLink(CalendarUtils.getDayOfYear(tomorrow), this.maxOldTestamentLink));
  
  $("#thisMonthNewTestament").text("本月("+CalendarUtils.numericToMonthCn(CalendarUtils.getTodayMonth())+")");
  $("#thisMonthNewTestament").attr("href", "#bibleAnnualSchedule-linklist-nt-"+CalendarUtils.getTodayMonth());

  $("#thisMonthOldTestament").text("本月("+CalendarUtils.numericToMonthCn(CalendarUtils.getTodayMonth())+")");
  $("#thisMonthOldTestament").attr("href", "#bibleAnnualSchedule-linklist-ot-"+CalendarUtils.getTodayMonth());
};



AnnualScheduleIndex.prototype.getBuildCalendarDayElementFunc = function (linkFunc) {
  var _this = this;
  var _linkFunc = linkFunc;
  return function (month, dayOfMonth, dayOfYear, dayOfWeek) {
    var anchorEle = $(document.createElement('a'));
    anchorEle.addClass("btn btn-sm col-xs-12 col-sm-12 col-md-12 col-lg-12");
    if (0==dayOfWeek || 6==dayOfWeek) {
       anchorEle.addClass("btn-weekend");
    } else {
       anchorEle.addClass("btn-weekday");
    }
    anchorEle.attr("href", _linkFunc(dayOfYear));
    anchorEle.html(dayOfMonth.toString());
    return anchorEle;
  };
};

AnnualScheduleIndex.prototype.buildCalendarView = function(btnSecId, collapseBtnIdFunc, collapseDivIdFunc, linkFunc) {
  CalendarUtils.buildCalendarView(btnSecId, collapseBtnIdFunc, collapseDivIdFunc, 
      this.getBuildCalendarDayElementFunc(linkFunc));
};


$( document ).ready(function(){
  /**
   * Enable bootstrap tooltip
   */
  $('[data-toggle="tooltip"]').tooltip();

  
  var annualScheduleIndex = new AnnualScheduleIndex();
});
