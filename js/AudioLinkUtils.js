
/**
 *AudioLinkUtils namespace
 * utility functons
 */
var AudioLinkUtils = {};
AudioLinkUtils.padZero = function (num) {
    var s = "0000" + num;
    return s.substr(s.length-4);
};

AudioLinkUtils.getLinkFunc = function (maxLink, isOldTestament) {
  var _maxLink = maxLink;
  if (isOldTestament) {
    return function(dayOfYear) {
      return "jy1n1b/"+AudioLinkUtils.padZero(Math.min(dayOfYear, _maxLink))+".mp3";
    };
  } else {
    return function(dayOfYear) {
      return "xy1n1b/"+AudioLinkUtils.padZero(Math.min(dayOfYear, _maxLink))+".mp3";
    };
  }
};


AudioLinkUtils.getTextLinkFunc = function (maxLink, isOldTestament) {
  var _maxLink = maxLink;
  if (isOldTestament) {
    return function(dayOfYear) {
      return "biblecontent/jy1n1b"+Math.min(dayOfYear, _maxLink)+".html";
    };
  } else {
    return function(dayOfYear) {
      return "biblecontent/xy1n1b"+Math.min(dayOfYear, _maxLink)+".html";
    };
  }
};
