var StringUtils = {
  getPrefixStringFunc : function (prefix) {
    return function(month) {
        return prefix+month.toString()
    }
  }
};
