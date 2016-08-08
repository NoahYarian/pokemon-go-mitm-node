module.exports = {
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
  }
}
