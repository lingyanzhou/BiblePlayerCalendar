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


  this.addToPlayList(AudioLinkUtils.getNameFunc(true)(CalendarUtils.getTodayMonth(), CalendarUtils.getTodayDayOfMonth()), 
      AudioLinkUtils.getLinkFunc(this.maxOldTestament, true)(CalendarUtils.getTodayDayOfYear()));
  this.addToPlayList(AudioLinkUtils.getNameFunc(false)(CalendarUtils.getTodayMonth(), CalendarUtils.getTodayDayOfMonth()), 
      AudioLinkUtils.getLinkFunc(this.maxNewTestament, false)(CalendarUtils.getTodayDayOfYear()));
  //this.addToPlayList("旧"+CalendarUtils.getTodayMonth().toString()+"-"+CalendarUtils.getTodayDayOfMonth().toString(), 
  //    "jy1n1b/"+AudioLinkUtils.padZero(CalendarUtils.getTodayDayOfYear())+".mp3");
  //this.addToPlayList("新"+CalendarUtils.getTodayMonth().toString()+"-"+CalendarUtils.getTodayDayOfMonth().toString(), 
  //    "xy1n1b/"+AudioLinkUtils.padZero(CalendarUtils.getTodayDayOfYear())+".mp3");
  
  this.buildCalendarView(this.jyBtnSecId,
      AudioLinkUtils.getPrefixIdFunc("player-playlist-jy-"),
      AudioLinkUtils.getPrefixIdFunc("player-playlist-jy-collapse-"),
      AudioLinkUtils.getNameFunc(true),
      AudioLinkUtils.getLinkFunc(this.maxOldTestament, true));

  this.buildCalendarView(this.xyBtnSecId,
      AudioLinkUtils.getPrefixIdFunc("player-playlist-xy-"),
      AudioLinkUtils.getPrefixIdFunc("player-playlist-xy-collapse-"),
      AudioLinkUtils.getNameFunc(false),
      AudioLinkUtils.getLinkFunc(this.maxNewTestament, false));

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
    var oldTestamentNameFunc = AudioLinkUtils.getNameFunc(true);
    var oldTestamentLinkFunc = AudioLinkUtils.getLinkFunc(_this.maxOldTestament, true);
    var newTestamentNameFunc = AudioLinkUtils.getNameFunc(false);
    var newTestamentLinkFunc = AudioLinkUtils.getLinkFunc(_this.maxNewTestament, false);
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
