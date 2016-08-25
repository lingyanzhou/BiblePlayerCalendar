
/**
 *AudioLinkUtils namespace
 * utility functons
 */
var AudioLinkUtils = {};
AudioLinkUtils.padZero = function (num) {
    var s = "0000" + num;
    return s.substr(s.length-4);
};

AudioLinkUtils.getPrefixIdFunc = function (prefix) {
    return function(month) {
        return prefix+month.toString()
    };
};

AudioLinkUtils.getNameFunc = function (isOldTestament) {
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

