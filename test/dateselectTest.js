var vows = require('vows'),
    assert = require('assert'),
    dateselect = require('../lib/dateselect.js');

function assertEqual(expected){
  var context = {
    topic: function(){
      var selector = this.context.name;
      var base = this.context.env.context.title.split("'")[1];
      var baseDate = new Date(base);
      return dateselect.next(selector, baseDate);
    }
  };
  context["should result"] = function(result){
    assert.deepEqual(result, expected);
  }
  return context;
}

vows.describe('Calculating next occurence').addBatch({
  "base: '1970-01-01T00:00:00.0Z' with selector": {
    "year":               assertEqual(new Date(0)),
    "month":              assertEqual(new Date(0)),
    "day:nth(3)":         assertEqual(new Date(3*24*60*60*1000)),
    "hour:nth(2)":        assertEqual(new Date(2*60*60*1000)),
    "minute":             assertEqual(new Date(0)),
    "minute:nth(3)":      assertEqual(new Date(3*60*1000)),
    "second":             assertEqual(new Date(0)),
    "second:nth(5)":      assertEqual(new Date(5*1000)),
  },
  
  "base : '1970-03-03T03:03:03.700Z' with selector": {
    "year.2011":          assertEqual(new Date("2011-01-01 00:00:00 GMT")),  
    "month.6":            assertEqual(new Date("1970-06-01 00:00:00 GMT")),
    "day.27":             assertEqual(new Date("1970-03-27 00:00:00 GMT")),
    "hour.15":            assertEqual(new Date("1970-03-03 15:00:00 GMT")),
    "minute.47":          assertEqual(new Date("1970-03-03 03:47:00 GMT")),
    "second.59":          assertEqual(new Date("1970-03-03 03:03:59 GMT")),
    "minute.4 > .59":     assertEqual(new Date("1970-03-03 03:04:59 GMT")),
    "hour.15 > .4 > .59": assertEqual(new Date("1970-03-03 15:04:59 GMT")),
    "day.27 hour.15 minute.4 second.59":
                          assertEqual(new Date("1970-03-27 15:04:59 GMT")),
    "month.6 day.27 hour.15 minute.4 second.59":
                          assertEqual(new Date("1970-06-27 15:04:59 GMT")),
    "year.2011 month.6 day.27 hour.15 minute.4 second.59":
                          assertEqual(new Date("2011-06-27 15:04:59 GMT")),
    "year.2011 > .6 > .27 > .15 > .4 > .59":
                          assertEqual(new Date("2011-06-27 15:04:59 GMT")),
    "day.weekday >.7 minute.30": // 1970-01-01 is a thursday = a weekday
                          assertEqual(new Date("1970-03-03 07:30:00 GMT")),
    "day.weekend > .10 >.30": // 1970-01-01 is a thursday = a weekday
                          assertEqual(new Date("1970-03-07 10:30:00 GMT")),
    "day.tuesday > .8 > .15":
                          assertEqual(new Date("1970-03-03 08:15:00 GMT")),
    "day.thursday":       assertEqual(new Date("1970-03-05 00:00:00 GMT")),
    "hour.15 minute":     assertEqual(new Date("1970-03-03 15:00:00 GMT")),
    "day:nth(2) hour.15 minute":
                          assertEqual(new Date("1970-03-05 15:00:00 GMT")),
  },

  "base: '1970-01-01T00:00:00.500Z' with selector": {
    "year":               assertEqual(new Date("1971-01-01 00:00:00 GMT")),
    "month":              assertEqual(new Date("1970-02-01 00:00:00 GMT")),
    "day":                assertEqual(new Date("1970-01-02 00:00:00 GMT")),
    "hour":               assertEqual(new Date("1970-01-01 01:00:00 GMT")),
    "hour.9":             assertEqual(new Date("1970-01-01 09:00:00 GMT")),
    "minute":             assertEqual(new Date("1970-01-01 00:01:00 GMT")),
    "second":             assertEqual(new Date("1970-01-01 00:00:01 GMT")),
    "year.1970 second":   assertEqual(new Date("1970-01-01 00:00:01 GMT")),
    "month second":       assertEqual(new Date("1970-01-01 00:00:01 GMT")),
    "year second":        assertEqual(new Date("1970-01-01 00:00:01 GMT")),
    "year month day hour minute second":
                          assertEqual(new Date("1970-01-01 00:00:01 GMT"))
  },
  "base: '1970-01-01T00:00:59.0Z' with selector": {
    "second.13":          assertEqual(new Date("1970-01-01 00:01:13 GMT"))
  },
  "base: '1970-01-01T00:59:00.0Z' with selector": {
    "minute.13":          assertEqual(new Date("1970-01-01 01:13:00 GMT"))
  },
  // test the comma
  "base: '1970-01-01T23:00:00.0Z' with selector": {
    "hour.13, hour.22":   assertEqual(new Date("1970-01-02 13:00:00 GMT"))
  },
  "base: '1970-01-01T21:00:00.0Z' with selector": {
    "hour.13, hour.22":   assertEqual(new Date("1970-01-01 22:00:00 GMT"))
  },
  "base: '1970-01-31T00:00:00.0Z' with selector": {
    "day.13":             assertEqual(new Date("1970-02-13 00:00:00 GMT")),
    "day.30":             assertEqual(new Date("1970-03-30 00:00:00 GMT"))
  },
  "base: '1970-02-29T00:00:00.0Z' with selector": {
    "day.30":             assertEqual(new Date("1970-03-30 00:00:00 GMT"))
  },
  "base: '2011-08-28T14:17:00.0Z' with selector": {
    "month.2 minute":     assertEqual(new Date("2012-02-01 00:00:00 GMT"))
  },
  "base: '2011-08-28T17:21:00.0Z' with selector": {
    "day.weekday > .7 > .30, day.weekend > .10 > .15":
                          assertEqual(new Date("2011-08-29 07:30:00 GMT")),
    "day.weekday > .7 > .30":
                          assertEqual(new Date("2011-08-29 07:30:00 GMT")),
    "day.weekend > .10 > .15":
                          assertEqual(new Date("2011-09-03 10:15:00 GMT"))
  }
}).export(module);
