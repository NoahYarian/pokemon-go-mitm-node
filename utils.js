var api = {
  randomIndex: function(arrOrStr) {
    return module.exports.randomIntFromInterval(0, arrOrStr.length-1);
  },
  randomIntFromInterval: function(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
  },
  hr: function(width, chars) {
    chars = chars || "-=#*+:~";
    var str = "";
    for (var i = 0; i < width; i++) {
      str += chars[module.exports.randomIndex(chars)];
    }
    return str;
  },
  padTrim: function(str, len, align) {
    // when called with len = 10
      // should change "" into "          "
      // should change "bacon" into "bacon     "
      // should change "SOOPERDOOPER" into "SOOPERDOOP"
      // shouldn't change "fantarctic"
    str = str || "";
    str = String(str);
    len = len || 0;
    align = align || "left";

    if (align === "left") {
      if (str.length > len) {
        var arr = str.split('');
        arr.length = len;
        str = arr.join('');
      }
      for (var i = str.length; i < len; i++) {
        str += " ";
      }
    } else if (align === "right") {
      var arr = str.split('');
      while (arr.length > len) {
        arr.shift();
      }
      while(arr.length < len) {
        arr.unshift(" ")
      }
      str = arr.join('');
    }
    return str;
  },
  capitalizeFirstLetter: function (string) {
    return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
  }
}

module.exports = api;
