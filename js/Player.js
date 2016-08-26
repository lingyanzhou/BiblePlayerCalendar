/**
 *PlayerListEntry Object
 *
 */
var PlayListEntry = function(name, url, textUrl) {
  this.name = name;
  this.url = url;
  this.textUrl = textUrl;
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
  this.textSecId = "#bibleplayer-textcontent";
  this.maxNewTestament = 364;
  this.maxOldTestament = 364;

  
  //state variables
  this.toPlayList = [];
  this.loopCtl = true;
  this.isPlaying = false;
  this.nowPlaying = null;
  this.nowText = "";

  //For callback closure
  var _this = this;


  this.addToPlayList(this.getPlayListEntryNameFunc(true)(CalendarUtils.getTodayMonth(), CalendarUtils.getTodayDayOfMonth()), 
      AudioLinkUtils.getLinkFunc(this.maxOldTestament, true)(CalendarUtils.getTodayDayOfYear()),
      AudioLinkUtils.getTextLinkFunc(this.maxOldTestament, true)(CalendarUtils.getTodayDayOfYear()));
  this.addToPlayList(this.getPlayListEntryNameFunc(false)(CalendarUtils.getTodayMonth(), CalendarUtils.getTodayDayOfMonth()), 
      AudioLinkUtils.getLinkFunc(this.maxNewTestament, false)(CalendarUtils.getTodayDayOfYear()),
      AudioLinkUtils.getTextLinkFunc(this.maxNewTestament, false)(CalendarUtils.getTodayDayOfYear()));
  
  this.buildCalendarView(this.jyBtnSecId,
      StringUtils.getPrefixStringFunc("player-playlist-jy-"),
      StringUtils.getPrefixStringFunc("player-playlist-jy-collapse-"),
      this.getPlayListEntryNameFunc(true),
      AudioLinkUtils.getLinkFunc(this.maxOldTestament, true),
      AudioLinkUtils.getTextLinkFunc(this.maxOldTestament, true));

  this.buildCalendarView(this.xyBtnSecId,
      StringUtils.getPrefixStringFunc("player-playlist-xy-"),
      StringUtils.getPrefixStringFunc("player-playlist-xy-collapse-"),
      this.getPlayListEntryNameFunc(false),
      AudioLinkUtils.getLinkFunc(this.maxNewTestament, false),
      AudioLinkUtils.getTextLinkFunc(this.maxNewTestament, false));

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

BiblePlayer.prototype.getPlayListEntryNameFunc = function (isOldTestament) {
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

BiblePlayer.prototype.getBuildCalendarDayElementFunc = function (nameFunc, linkFunc, textLinkFunc) {
  var _this = this;
  var _nameFunc = nameFunc;
  var _linkFunc = linkFunc;
  var _textLinkFunc = textLinkFunc;
  return function (month, dayOfMonth, dayOfYear, dayOfWeek) {
    var anchorEle = $(document.createElement('a'));
    anchorEle.addClass("btn btn-sm col-xs-12 col-sm-12 col-md-12 col-lg-12");
    if (0==dayOfWeek || 6==dayOfWeek) {
       anchorEle.addClass("btn-weekend");
    } else {
       anchorEle.addClass("btn-weekday");
    }
    anchorEle.attr("href","javascript:void(0);");
    anchorEle.attr("data-name", _nameFunc(month, dayOfMonth));  
    anchorEle.attr("data-url", _linkFunc(dayOfYear)); 
    anchorEle.attr("data-texturl", _textLinkFunc(dayOfYear));
    anchorEle.html(dayOfMonth.toString()+"<br /> <span class=\"ui-icon ui-icon-circle-plus\"></span>");
    anchorEle.click(function() {
      _this.addToPlayList($(this).attr("data-name"), $(this).attr("data-url"), $(this).attr("data-texturl"));
    });
    return anchorEle;
  };
};

BiblePlayer.prototype.buildCalendarView = function(btnSecId, 
    collapseBtnIdFunc, collapseDivIdFunc, 
    nameFunc, linkFunc, textLinkFunc) {
  CalendarUtils.buildCalendarView(btnSecId, collapseBtnIdFunc, collapseDivIdFunc, 
      this.getBuildCalendarDayElementFunc(nameFunc, linkFunc, textLinkFunc));
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
    $(this.nowPlayingNameCls).text("无内容");
  } else {
    $(this.nowPlayingNameCls).text(this.nowPlaying.name);
  }
};

BiblePlayer.prototype.updateTextContent = function() {
  if (""===this.nowText) {
    $(this.textSecId).text("无内容");
  } else {
    $(this.textSecId).html(this.nowText);
  }
};

BiblePlayer.prototype.next = function() {
  if (this.toPlayList.length==0) {
    this.changeAudio(undefined);
    this.isPlaying=false;
    this.nowPlaying = null;
    this.nowText="";
    alert("播放列表为空。请添加播放片段。");
  } else {
    this.isPlaying=true;
    var nextAudio = this.toPlayList.shift();
    this.nowPlaying = nextAudio;
    if (this.loopCtl) {
      this.toPlayList.push(nextAudio);
    }
    
    this.changeAudio(nextAudio.url);
    this.changeText(nextAudio.textUrl);
    this.updatePlayListUi();
  }
  this.updateControlsUi();
};

BiblePlayer.prototype.changeText = function(textUrl) {
  var _this = this;
  this.nowText="";
  $.get( textUrl, function( data ) {
      _this.nowText = data;
      _this.updateTextContent();
  });
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

BiblePlayer.prototype.addToPlayList = function (name, url, texturl) {
  var entry = new PlayListEntry(name, url, texturl);
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
    anchorEle.addClass("btn btn-warning btn-sm");
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
    var oldTestamentNameFunc = _this.getPlayListEntryNameFunc(true);
    var oldTestamentLinkFunc = AudioLinkUtils.getLinkFunc(_this.maxOldTestament, true)
    var oldTestamentTextLinkFunc = AudioLinkUtils.getTextLinkFunc(_this.maxOldTestament, true);
    var newTestamentNameFunc = _this.getPlayListEntryNameFunc(false);
    var newTestamentLinkFunc = AudioLinkUtils.getLinkFunc(_this.maxNewTestament, false)
    var newTestamentTextLinkFunc = AudioLinkUtils.getTextLinkFunc(_this.maxNewTestament, false);
    for (var i=0; i<=futureDays; i++) {
      var futureDay = CalendarUtils.addDays(today, i);
      var entry = new PlayListEntry(oldTestamentNameFunc(futureDay.getMonth(), futureDay.getDate()),
          oldTestamentLinkFunc(CalendarUtils.getDayOfYear(futureDay)),
          oldTestamentTextLinkFunc(CalendarUtils.getDayOfYear(futureDay)));
      _this.toPlayList.push(entry);
    }
    for (var i=0; i<=futureDays; i++) {
      var futureDay = CalendarUtils.addDays(today, i);
      var entry = new PlayListEntry(newTestamentNameFunc(futureDay.getMonth(), futureDay.getDate()),
          newTestamentLinkFunc(CalendarUtils.getDayOfYear(futureDay)),
          newTestamentTextLinkFunc(CalendarUtils.getDayOfYear(futureDay)));
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
