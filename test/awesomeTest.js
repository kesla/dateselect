var vows = require('vows'),
    assert = require('assert'),
    awesome = require('../lib/awesome.js'),
    date1 = new Date(0),
    date2 = new Date(500);

function assertEqual(baseDate, expected){
  var context = {
    topic: function(){
      var selector = this.context.name;
      return awesome.next(selector, baseDate);
    }
  };
  context["should result"] = function(result){
    assert.deepEqual(result, expected);
  }
  return context;
}

vows.describe('Calculating next occurence').addBatch({
  "(base 1970-01-01 00:00:00 GMT) with selector":{
    "year":         assertEqual(date1, date1),
    "month":        assertEqual(date1, date1),
    "day":          assertEqual(date1, date1),
    "hour":         assertEqual(date1, date1),
    "minute":       assertEqual(date1, date1),
    "second":       assertEqual(date1, date1)
  },
  "(base 1970-01-01 00:00:00 GMT + 500ms) with selector":{
    "year":         assertEqual(date2, new Date("1971-01-01 00:00:00 GMT")),
    "month":        assertEqual(date2, new Date("1970-02-01 00:00:00 GMT")),
    "day":          assertEqual(date2, new Date("1970-01-02 00:00:00 GMT")),
    "hour":         assertEqual(date2, new Date("1970-01-01 01:00:00 GMT")),
    "minute":       assertEqual(date2, new Date("1970-01-01 00:01:00 GMT")),
    "second":       assertEqual(date2, new Date("1970-01-01 00:00:01 GMT"))
  }
}).export(module);
