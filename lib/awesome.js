var grammar = require("./grammar.js");
    var weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

Date.prototype.increaseYear = function(num) {
  this.setUTCFullYear(this.getUTCFullYear() + num);
}
Date.prototype.increaseMonth = function(num) {
  var str = this.getUTCFullYear()+"-"+(this.getUTCMonth()+num + 1)+"-"+
        this.getUTCDate()+"T"+this.getUTCHours()+":"+this.getUTCMinutes()+":"+
        this.getUTCSeconds()+"."+this.getUTCMilliseconds()+"Z";
  var date = new Date(str);
  this.setTime(date.getTime());
}
Date.prototype.increaseDay = function(num) {
  this.setUTCDate(this.getUTCDate() + num);
}
Date.prototype.increaseHour = function(num) {
  this.setUTCHours(this.getUTCHours() + num);
}

Date.prototype.increaseMinute = function(num) {
  this.setUTCMinutes(this.getUTCMinutes() + num);
}

function ceilDate(date, delta){
  var ms = date.getTime();
  return new Date(Math.ceil(ms/delta)*delta);
}

function floorDate(date, delta){
  var ms = date.getTime();
  return new Date(Math.floor(ms/delta)*delta)
}

/**
 * Method that returns the next date when an event can be emitted, according to
 * the selector.
 * @selector is the css-like selector
 * @base is the date to base the calculation on
 */
exports.next = function(selector, base){
  if(!base){
    base = new Date();
  }

  // returns an intermediate format as parsed from the original CSS-string
  var format = grammar.parse(selector);
  var ms = base.getTime();
  var date;
  if (format.second) {
    date = ceilDate(base, 1000);
  } else if (format.minute) {
    date = ceilDate(base, 60*1000);
  } else if (format.hour) {
    date = ceilDate(base, 60*60*1000);
  } else if (format.day) {
    date = ceilDate(base, 24*60*60*1000);
  } else if (format.month) {
    if (ms % (24 * 60 * 60 * 1000) === 0 && base.getUTCDate() === 1 &&
                                                          format.month == -1) {
      return base;
    } else {
      date = floorDate(base, 60*60*1000);
      date.setUTCDate(1);
    }
  } else if (format.year) {
    if (ms % (24 * 60 * 60 * 1000) === 0 && base.getUTCDate() === 1 &&
          base.getUTCMonth() === 0 && format.year === -1) {
      return base;
    } else {
      date = floorDate(base, 60*60*1000);
      date.setUTCDate(1);
      date.setUTCMonth(0);
    }
  }

  if (format.second && format.second !== -1) {
    if (format.second < date.getUTCSeconds()){
      date.increaseMinute(1);
    }
    date.setUTCSeconds(format.second);
  }

  if (format.minute && format.minute !== -1) {
    if (format.minute < date.getUTCMinutes()){
      date.increaseHour(1);
    }
    date.setUTCMinutes(format.minute);
  }  

  if (format.hour && format.hour !== -1) {
    if (format.hour < date.getUTCHours()){
      date.increaseDay(1);
    }
    date.setUTCHours(format.hour);
  }

  if (typeof format.day === "string"){
    if (format.day === "weekday") {
      if (date.getUTCDay() === 0 || date.getUTCDay() === 6){
        var incDays = (1 - date.getUTCDay() + 7) % 7;
        date.increaseDay(incDays);
      }
    } else if (format.day === "weekend") {
      if (date.getUTCDay() > 0 && date.getUTCDay() < 6){
        var incDays = (6 - date.getUTCDay() );
        date.increaseDay(incDays);
      }
    } else {
    // day like monday, etc
      var incDays = (weekdays.indexOf(format.day) - date.getUTCDay() + 7) % 7;
      date.increaseDay(incDays);
    }
  } else if (format.day && format.day !== -1) {
    if (format.day < date.getUTCDate()){
      date.setUTCDate(format.day);
      date.increaseMonth(1);
    }
    date.setUTCDate(format.day);
  }

  if(format.month){
    if (format.month === -1) {
      date.increaseMonth(1);
    } else {
      date.setUTCMonth(format.month-1); // january is 0
    }
  }
  
  if(format.year) {
    if (format.year === -1){
      date.increaseYear(1);
    } else {
      date.setUTCFullYear(format.year);
    }
  }

  return date;
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
