var grammar = require("./grammar.js");

/**
 * Method that returns the next date when an event can be emitted, according to
 * the selector.
 */
exports.next = function(selector, base){
  // returns an intermediate format as parsed from the original CSS-string
  var format = grammar.parse(selector);
  base = base? new Date(base) : new Date();
  var ms = base.getTime();
  if (format.second === -1) {
    var tmp = Math.ceil(ms/1000) * 1000;
    return new Date (tmp);
  } else if (format.minute === -1) {
    var tmp = Math.ceil(ms/(60 * 1000)) * 60 * 1000;
    return new Date(tmp);
  } else if (format.hour === -1) {
    var tmp = Math.ceil(ms/(60 * 60 * 1000)) * 60 * 60 * 1000;
    return new Date(tmp);
  } else if (format.day === -1) {
    var tmp = Math.ceil(ms/(24 * 60 * 60 * 1000)) * 24 * 60 * 60 * 1000;
    return new Date(tmp);
  } else if (format.month === -1) {
    if (ms % (24 * 60 * 60 * 1000) === 0 && base.getUTCDate() === 1) {
      return base;
    } else {
      var tmp = Math.floor(ms/(60 * 60 * 1000)) * 60 * 60 * 1000;
      base = new Date(tmp);
      base.setUTCDate(1);
      base.setUTCMonth(base.getUTCMonth() + 1);
      return base;
    }
  } else if (format.year === -1) {
    if (ms % (24 * 60 * 60 * 1000) === 0 && base.getUTCDate() === 1 &&
                                                    base.getUTCMonth() === 0) {
      return base;
    } else {
      var tmp = Math.floor(ms/(60 * 60 * 1000)) * 60 * 60 * 1000;
      base = new Date(tmp);
      base.setUTCDate(1);
      base.setUTCMonth(0);
      base.setUTCFullYear(base.getUTCFullYear() + 1);
      return base;
    }
  }
  return base;
}

exports.run = function(selector, callback){
  var self = this;

  var now = new Date();
  var diff = self.next(selector, now) - now;

  function next(){
    callback();
    now = new Date();
    diff = self.next(selector, now) - now;
    setTimeout(next, diff);
  }
  setTimeout(next, diff);
}
