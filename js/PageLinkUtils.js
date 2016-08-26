
/**
 *PageLinkUtils namespace
 * utility functons
 */
var PageLinkUtils = {};

PageLinkUtils.getLinkFunc = function (isOldTestament, max) {
  var _max = max;
  if (isOldTestament) {
    return function(num) {
      return PageLinkUtils.buildOldTestamentLink(num, _max);
    }; 
  } else {
    return function(num) {
      return PageLinkUtils.buildNewTestamentLink(num, _max);
    };
  }
};

PageLinkUtils.buildNewTestamentLink = function (num, max) {
    return "xy1n1b" + Math.min(num, max) + ".html";
};

PageLinkUtils.buildOldTestamentLink = function (num, max) {
    return "jy1n1b" + Math.min(num, max) + ".html";
};
