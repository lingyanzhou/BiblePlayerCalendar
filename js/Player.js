
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


/**
 *Utils namespace
 * utility functons
 */
var Utils = {};
Utils.padZero = function (num) {
    var s = "0000" + num;
    return s.substr(s.length-4);
};

Utils.getPrefixIdFunc = function (prefix) {
    return function(month) {
        return prefix+month.toString()
    };
};

Utils.getNameFunc = function (isOldTestament) {
  if (isOldTestament) {
    return function(month, dayOfMonth) {
      return "旧"+(month+1).toString()+"-"+dayOfMonth.toString();
    };
  } else {
    return function(month, dayOfMonth) {
      return "新"+(month+1).toString()+"-"+dayOfMonth.toString();
    };
  }
};

Utils.getLinkFunc = function (maxLink, isOldTestament) {
  var _maxLink = maxLink;
  if (isOldTestament) {
    return function(dayOfYear) {
      return "jy1n1b/"+Utils.padZero(Math.min(dayOfYear, _maxLink))+".mp3";
    };
  } else {
    return function(dayOfYear) {
      return "xy1n1b/"+Utils.padZero(Math.min(dayOfYear, _maxLink))+".mp3";
    };
  }
};

/**
 *PlayerListEntry Object
 *
 */
var PlayListEntry = function(name, url) {
  this.name = name;
  this.url = url;
};

/**
 * BiblePlayer object
 *
 * 
 */
var BiblePlayer = function() {
  this.audioPlayerId = "#bibleplayer-audioPlayer";
  this.playBtnId = "#bibleplayer-playBtn";
  this.skipBtnId = "#bibleplayer-skipBtn";
  this.refreshBtnId = "#bibleplayer-refreshBtn";
  this.xyBtnSecId = "#bibleplayer-xyBtnSec";
  this.jyBtnSecId = "#bibleplayer-jyBtnSec";
  this.xyBtnSecWrapperId = "bibleplayer-#xyBtnSecWrapper";
  this.jyBtnSecWrapperId = "bibleplayer-#jyBtnSecWrapper";
  this.playListSecId = "#bibleplayer-playList";
  this.nowPlayingId = "#bibleplayer-nowPlaying";
  this.nowPlayingNameCls = ".bibleplayer-nowPlayingNameCls";
  this.audioPlayerLoopId = "#bibleplayer-audioPlayerLoop";
  this.topControlsSecId = "#bibleplayer-topControlsSec";
  this.maxNewTestament = 364;
  this.maxOldTestament = 364;

  
  //state variables
  this.toPlayList = [];
  this.loopCtl = true;
  this.isPlaying = false;
  this.nowPlaying = null;

  //For callback closure
  var _this = this;


  this.addToPlayList(Utils.getNameFunc(true)(CalendarUtils.getTodayMonth(), CalendarUtils.getTodayDayOfMonth()), 
      Utils.getLinkFunc(this.maxOldTestament, true)(CalendarUtils.getTodayDayOfYear()));
  this.addToPlayList(Utils.getNameFunc(false)(CalendarUtils.getTodayMonth(), CalendarUtils.getTodayDayOfMonth()), 
      Utils.getLinkFunc(this.maxNewTestament, false)(CalendarUtils.getTodayDayOfYear()));
  //this.addToPlayList("旧"+CalendarUtils.getTodayMonth().toString()+"-"+CalendarUtils.getTodayDayOfMonth().toString(), 
  //    "jy1n1b/"+Utils.padZero(CalendarUtils.getTodayDayOfYear())+".mp3");
  //this.addToPlayList("新"+CalendarUtils.getTodayMonth().toString()+"-"+CalendarUtils.getTodayDayOfMonth().toString(), 
  //    "xy1n1b/"+Utils.padZero(CalendarUtils.getTodayDayOfYear())+".mp3");
  
  this.buildCalendarView(this.jyBtnSecId,
      Utils.getPrefixIdFunc("player-playlist-jy-"),
      Utils.getPrefixIdFunc("player-playlist-jy-collapse-"),
      Utils.getNameFunc(true),
      Utils.getLinkFunc(this.maxOldTestament, true));

  this.buildCalendarView(this.xyBtnSecId,
      Utils.getPrefixIdFunc("player-playlist-xy-"),
      Utils.getPrefixIdFunc("player-playlist-xy-collapse-"),
      Utils.getNameFunc(false),
      Utils.getLinkFunc(this.maxNewTestament, false));

  this.changeAudio(undefined);
  this.updatePlayListUi();
  this.updateControlsUi();

  $(this.skipBtnId).click(function() {
    _this.next();
  });

  $(this.audioPlayerId).on('ended',function(){
    _this.next();
  });

  $(this.playBtnId).click(function(){
    _this.start();
  });

  $(this.refreshBtnId).click(function(){
    _this.reset();
  });

  $(this.audioPlayerLoopId).click(function() {
    _this.loopCtl = !_this.loopCtl;
    //_this.updateControlsUi(); // Bootstrap manages the toggle button ui
  });
};

BiblePlayer.prototype.getBuildCalendarDayElementFunc = function (nameFunc, linkFunc) {
  var _this = this;
  var _nameFunc = nameFunc;
  var _linkFunc = linkFunc;
  return function (month, daOfMonth, dayOfYear) {
    var anchorEle = $(document.createElement('a'));
    anchorEle.addClass("btn btn-success col-xs-12 col-sm-12 col-md-12 col-lg-12");
    anchorEle.attr("href","javascript:void(0);");
    anchorEle.attr("data-name", _nameFunc(month, daOfMonth));  
    anchorEle.attr("data-url", _linkFunc(dayOfYear)); 
    anchorEle.html(daOfMonth.toString()+"<span class=\"ui-icon ui-icon-circle-plus\"></span>");
    anchorEle.click(function() {
      _this.addToPlayList($(this).attr("data-name"), $(this).attr("data-url"));
    });
    return anchorEle;
  };
};

BiblePlayer.prototype.buildCalendarView = function(btnSecId, collapseBtnIdFunc, collapseDivIdFunc, nameFunc, linkFunc) {
  CalendarUtils.buildCalendarView(btnSecId, collapseBtnIdFunc, collapseDivIdFunc, this.getBuildCalendarDayElementFunc(nameFunc, linkFunc))
};

BiblePlayer.prototype.start = function() {
  if (!this.isPlaying) {
    this.next();
  }
};

BiblePlayer.prototype.reset = function() {
    this.toPlayList = [];
    this.isPlaying = false;
    this.nowPlaying = null;
    this.changeAudio(undefined);

    this.updatePlayListUi();
    this.updateControlsUi();
};

BiblePlayer.prototype.pause = function() {
};

BiblePlayer.prototype.updateControlsUi = function() {
  if (this.isPlaying) {
    $(this.playBtnId).addClass("disabled");
    $(this.skipBtnId).removeClass("disabled");
  } else {
    $(this.playBtnId).removeClass("disabled");
    $(this.skipBtnId).addClass("disabled");
  }
  if (this.loopCtl) {
    $(this.audioPlayerLoopId).attr("aria-pressed", "true");
    $(this.audioPlayerLoopId).addClass("active");
  } else {
    $(this.audioPlayerLoopId).attr("aria-pressed", "false");
    $(this.audioPlayerLoopId).removeClass("active");
  }
  if (null===this.nowPlaying) {
    $(this.nowPlayingNameCls).text("空");
  } else {
    $(this.nowPlayingNameCls).text(this.nowPlaying.name);
  }
};

BiblePlayer.prototype.next = function() {
  if (this.toPlayList.length==0) {
    this.changeAudio(undefined);
    this.isPlaying=false;
    this.nowPlaying = null;
    alert("播放列表为空。请添加播放片段。");
  } else {
    this.isPlaying=true;
    var nextAudio = this.toPlayList.shift();
    this.nowPlaying = nextAudio;
    if (this.loopCtl) {
      this.toPlayList.push(nextAudio);
    }
    this.changeAudio(nextAudio.url);
    this.updatePlayListUi();
  }
  this.updateControlsUi();
};


/* function changeAudio
   original author: Justice Erolin
   */
BiblePlayer.prototype.changeAudio = function (sourceUrl) {
  var audio = $(this.audioPlayerId)[0];
  if (sourceUrl===undefined) {
    audio.pause();
    audio.src = "";
    //audio[0].load();
    return;
  } else {      
    audio.src = sourceUrl;
    /****************/
    audio.pause();
    audio.load();//suspends and restores all audio element

    //audio[0].play(); changed based on Sprachprofi's comment below
    audio.oncanplaythrough = audio.play();
    /****************/
  }
};

BiblePlayer.prototype.addToPlayList = function (name, url) {
  var entry = new PlayListEntry(name, url);
  this.toPlayList.push(entry);
  this.updatePlayListUi();
};

BiblePlayer.prototype.updatePlayListUi = function () {
  $(this.playListSecId).empty();
  var len = this.toPlayList.length;
  var _this = this;
  for (var i=0; i < len ; i++) {
    var liEle = $(document.createElement('li'));
    $(this.playListSecId).append(liEle);
    var anchorEle = $(document.createElement('a'));
    liEle.append(anchorEle);
    anchorEle.addClass("btn btn-warning");
    anchorEle.attr("href", "javascript:void(0);");
    anchorEle.prop("data-index", i.toString());
    anchorEle.click(function() {
      _this.removeFromPlayList($(this).prop("data-index"));
    });
    anchorEle.html(this.toPlayList[i].name+"<span class=\"ui-icon ui-icon-circle-minus\"></span>");
  }
};

BiblePlayer.prototype.removeFromPlayList = function (index) {
  this.toPlayList.splice(index, 1);
  this.updatePlayListUi();
};

BiblePlayer.prototype.getAddFuturePlayListEntriesFunc = function (futureDays) {
  var _this = this;
  return function() {
    var today = new Date();
    var oldTestamentNameFunc = Utils.getNameFunc(true);
    var oldTestamentLinkFunc = Utils.getLinkFunc(_this.maxOldTestament, true);
    var newTestamentNameFunc = Utils.getNameFunc(false);
    var newTestamentLinkFunc = Utils.getLinkFunc(_this.maxNewTestament, false);
    for (var i=0; i<=futureDays; i++) {
      var futureDay = CalendarUtils.addDays(today, i);
      var entry = new PlayListEntry(oldTestamentNameFunc(futureDay.getMonth(), futureDay.getDate()),
          oldTestamentLinkFunc(CalendarUtils.getDayOfYear(futureDay)));
      _this.toPlayList.push(entry);
    }
    for (var i=0; i<=futureDays; i++) {
      var futureDay = CalendarUtils.addDays(today, i);
      var entry = new PlayListEntry(newTestamentNameFunc(futureDay.getMonth(), futureDay.getDate()),
          newTestamentLinkFunc(CalendarUtils.getDayOfYear(futureDay)));
      _this.toPlayList.push(entry);
    }
    _this.updatePlayListUi();
  }
};

$( document ).ready(function(){
  /**
   * Enable bootstrap tooltip
   */
  $('[data-toggle="tooltip"]').tooltip();

  $("#thisMonthXy").text("本月("+CalendarUtils.numericToMonthCn(CalendarUtils.getTodayMonth())+")");
  $("#thisMonthXy").attr("href", "#player-playlist-xy-"+CalendarUtils.getTodayMonth().toString());

  $("#thisMonthJy").text("本月("+CalendarUtils.numericToMonthCn(CalendarUtils.getTodayMonth())+")");
  $("#thisMonthJy").attr("href", "#player-playlist-jy-"+CalendarUtils.getTodayMonth().toString());

  var biblePlayer = new BiblePlayer();

  $("#addToday").click(biblePlayer.getAddFuturePlayListEntriesFunc(0));
  $("#addSevenDays").click(biblePlayer.getAddFuturePlayListEntriesFunc(7));
});
