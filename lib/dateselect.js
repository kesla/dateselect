var grammar = require("./grammar.js"),
    _ = require('underscore'),
    helpers = require('./helpers'),
    ceilDate = helpers.ceilDate,
    floorDate = helpers.floorDate,
    weekdays = helpers.weekdays;

function getNextDate(selector, base){
    var input = grammar.parse(selector);
    var ms = base.getTime();
    var date = base;
    if (input.year === -1 && (input.month || input.day || input.hour || input.minute || input.second)) {
      delete input.year;
    }
    if(input.month === -1 && (input.day || input.hour || input.minute || input.second)) {
      delete input.month;
    }
    if(input.day === -1 && (input.hour || input.minute || input.second)) {
      delete input.day;
    }
    if(input.hour === -1 && (input.minute || input.second)) {
      delete input.hour;
    }
    if(input.minute === -1 && (input.second)) {
      delete input.minute;
    }

    if (input.second && input.second.nth) {
      date.increaseSecond(input.second.nth);
    }
    if (input.minute && input.minute.nth) {
      date.increaseMinute(input.minute.nth);
    }
    if (input.hour && input.hour.nth) {
      date.increaseHour(input.hour.nth);
    }
    if (input.day && input.day.nth) {
      date.increaseDay(input.day.nth);
    }
    
    if (typeof input.second === "number") {
      date = ceilDate(base, 1000);
    } else if (typeof input.minute === "number") {
      date = ceilDate(base, 60*1000);
    } else if (typeof input.hour === "number") {
      date = ceilDate(base, 60*60*1000);
    } else if (input.day) {
      date = ceilDate(base, 24*60*60*1000);
    } else if (input.month) {
      if (ms % (24 * 60 * 60 * 1000) === 0 && base.getUTCDate() === 1 &&
                                                            input.month == -1) {
        return base;
      } else {
        date = floorDate(base, 24*60*60*1000);
        date.setUTCDate(1);
        if (input.month === -1) {
          date.increaseMonth(1);
        }
      }
    } else if (input.year) {
      if (ms % (24 * 60 * 60 * 1000) === 0 && base.getUTCDate() === 1 &&
            base.getUTCMonth() === 0 && input.year === -1) {
        return base;
      } else {
        date = floorDate(base, 24*60*60*1000);
        date.setUTCDate(1);
        date.setUTCMonth(0);
        if (input.year === -1) {
          date.increaseYear(1);
        }
      }
    }

    if(input.year && input.year !== -1) {
      date.setUTCFullYear(input.year);
    }


    if(input.month && input.month !== -1){
      if (input.month < date.getUTCMonth()) {
        date.setUTCMonth(input.month-1); // january is 0
        date.increaseYear(1);
      }
      date.setUTCMonth(input.month-1); // january is 0
      date.setUTCDate(1);
      date = floorDate(date, 24*60*60*1000);
    }

    if (typeof input.day === "string"){
      if (input.day === "weekday") {
        if (date.getUTCDay() === 0 || date.getUTCDay() === 6){
          var incDays = (1 - date.getUTCDay() + 7) % 7;
          if (incDays > 0){
            date.increaseDay(incDays);
            date = floorDate(date, 24*60*60*1000);
          }
        }
      } else if (input.day === "weekend") {
        if (date.getUTCDay() > 0 && date.getUTCDay() < 6){
          var incDays = (6 - date.getUTCDay());
          if (incDays > 0){
            date.increaseDay(incDays);
            date = floorDate(date, 24*60*60*1000);
          }
        }
      } else {
      // day like monday, etc
        var incDays = (weekdays.indexOf(input.day) - date.getUTCDay() + 7) % 7;
        date.increaseDay(incDays);
      }
    } else if (typeof input.day === 'number' && input.day !== -1) {
      if (input.day < date.getUTCDate()){
        date.setUTCDate(input.day);
        date.increaseMonth(1);
      }
      date.setUTCDate(input.day);
      date = floorDate(date, 24*60*60*1000);
    }

    if (typeof input.hour === 'number' && input.hour !== -1) {
      if (input.hour < date.getUTCHours()){
        date.increaseDay(1);
      }
      date.setUTCHours(input.hour);
      date = floorDate(date, 60*60*1000);
    }

    if (typeof input.minute === 'number' && input.minute !== -1) {
      if (input.minute < date.getUTCMinutes()){
        date.increaseHour(1);
      }
      date.setUTCMinutes(input.minute);
      date = floorDate(date, 60*1000);
    }  

    if (typeof input.second === 'number' && input.second !== -1) {
      if (input.second < date.getUTCSeconds()){
        date.increaseMinute(1);
      }
      date.setUTCSeconds(input.second);
      date = floorDate(date, 1000);
    }

    if (input.day === "weekend" &&
        (date.getUTCDay() > 0 && date.getUTCDay() < 6)){
      date = getNextDate(selector, date);
    } else if (input.day === "weekday" &&
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
