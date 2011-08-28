var grammar = require("./grammar.js");
var _ = require('underscore');

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

function getNextDate(selector, base){
    var format = grammar.parse(selector);
    var ms = base.getTime();
    var date;
    if (format.year === -1 && (format.month || format.day || format.hour || format.minute || format.second)) {
      delete format.year;
    }
    if(format.month === -1 && (format.day || format.hour || format.minute || format.second)) {
      delete format.month;
    }
    if(format.day === -1 && (format.hour || format.minute || format.second)) {
      delete format.day;
    }
    if(format.hour === -1 && (format.minute || format.second)) {
      delete format.hour;
    }
    if(format.minute === -1 && (format.second)) {
      delete format.minute;
    }
    
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
        date = floorDate(base, 24*60*60*1000);
        date.setUTCDate(1);
        if (format.month === -1) {
          date.increaseMonth(1);
        }
      }
    } else if (format.year) {
      if (ms % (24 * 60 * 60 * 1000) === 0 && base.getUTCDate() === 1 &&
            base.getUTCMonth() === 0 && format.year === -1) {
        return base;
      } else {
        date = floorDate(base, 24*60*60*1000);
        date.setUTCDate(1);
        date.setUTCMonth(0);
        if (format.year === -1) {
          date.increaseYear(1);
        }
      }
    }

    if(format.year && format.year !== -1) {
      date.setUTCFullYear(format.year);
    }


    if(format.month && format.month !== -1){
      if (format.month < date.getUTCMonth()) {
        date.setUTCMonth(format.month-1); // january is 0
        date.increaseYear(1);
      }
      date.setUTCMonth(format.month-1); // january is 0
      date.setUTCDate(1);
      date = floorDate(date, 24*60*60*1000);
    }

    if (typeof format.day === "string"){
      if (format.day === "weekday") {
        if (date.getUTCDay() === 0 || date.getUTCDay() === 6){
          var incDays = (1 - date.getUTCDay() + 7) % 7;
          if (incDays > 0){
            date.increaseDay(incDays);
            date = floorDate(date, 24*60*60*1000);
          }
        }
      } else if (format.day === "weekend") {
        if (date.getUTCDay() > 0 && date.getUTCDay() < 6){
          var incDays = (6 - date.getUTCDay());
          if (incDays > 0){
            date.increaseDay(incDays);
            date = floorDate(date, 24*60*60*1000);
          }
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
      date = floorDate(date, 24*60*60*1000);
    }

    if (format.hour && format.hour !== -1) {
      if (format.hour < date.getUTCHours()){
        date.increaseDay(1);
      }
      date.setUTCHours(format.hour);
      date = floorDate(date, 60*60*1000);
    }

    if (format.minute && format.minute !== -1) {
      if (format.minute < date.getUTCMinutes()){
        date.increaseHour(1);
      }
      date.setUTCMinutes(format.minute);
      date = floorDate(date, 60*1000);
    }  

    if (format.second && format.second !== -1) {
      if (format.second < date.getUTCSeconds()){
        date.increaseMinute(1);
      }
      date.setUTCSeconds(format.second);
      date = floorDate(date, 1000);
    }

    if (format.day === "weekend" &&
        (date.getUTCDay() > 0 && date.getUTCDay() < 6)){
      date = getNextDate(selector, date);
    } else if (format.day === "weekday" &&
                (date.getUTCDay() === 0 || date.getUTCDay() === 6)){
      date = getNextDate(selector, date);
    }
    
    return date;
}

var Dateselect = module.exports = function(selector, callback){
  var now = new Date();
  var diff = Dateselect.next(selector, now) - now;

  function next(){
    callback();
    now = new Date();
    diff = Dateselect.next(selector, now) - now;
    setTimeout(next, diff);
  }
  setTimeout(next, diff);
}

/**
 * Method that returns the next date when an event can be emitted, according to
 * the selector.
 * @selector is the css-like selector
 * @base is the date to base the calculation on
 */
Dateselect.next = function(selectors, base){
  if(!base){
    base = new Date();
  }

  // returns an intermediate format as parsed from the original CSS-string
  // TODO: Parse the string to an array directly.
  
  var suggestions = selectors.split(",").map(redo = function(selector){
    var date = getNextDate(selector, base);
    return date.getTime();
  });
  // select the time nearest in the future
  var nextTime = _.min(suggestions)
  // and convert the time to a date
  return new Date(nextTime);
}
