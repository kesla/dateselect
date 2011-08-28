var vows = require('vows'),
    assert = require('assert'),
    grammar = require('../lib/grammar.js');

function assertTrue(expected){
  var context = {
    topic: function(){
      var selector = this.context.name;
      return grammar.parse(selector);
    }
  };
  context["should result in " + JSON.stringify(expected)] = function(result){
    assert.deepEqual(result, expected);
  }
  return context;
}

/*
function assertTrows(exception){
  var context = {
    topic: function(){
      var selector = this.context.name;
      return "foo";
    }
  }
  context["to intermediate json should throw"] = function(selector) {
    // TODO: Use assert.throws. Didn't get it to work now.
    try {
      grammar.parse(selector);
    } catch(e){
      console.log("FoO!")
    }
  }
  return context;
}
*/
vows.describe('Parsing the selector').addBatch({
  'y':                      assertTrue({year: -1}),
  'year':                   assertTrue({year: -1}),
  'y.2012':                 assertTrue({year: 2012}),
  'y:nth(5)':               assertTrue({year: { nth: 5 }}),
  'y > .11':                assertTrue({year: -1, month: 11}),
  'y > .11 > .10':          assertTrue({year: -1, month: 11, day: 10}),
  'day.11 > .8 > .15':      assertTrue({day: 11, hour: 8, minute: 15}),
  'y > .11 > .10 > .9 > .8 > .7':
                            assertTrue({year: -1, month: 11, day: 10, hour: 9, minute: 8, second: 7}),
  'M':                      assertTrue({month: -1}),
  'month':                  assertTrue({month: -1}),
  'month.2':                assertTrue({month: 2}),
  'month.2 > .1':           assertTrue({month: 2, day: 1}),
  'month:nth(2)':           assertTrue({month: {nth: 2}}),
//  'month.february':        assertTrue({month: "february"}),
  "d":                      assertTrue({day: -1}),
  "day":                    assertTrue({day: -1}),
  "day.23":                 assertTrue({day: 23}),
  "day.23 > .21":           assertTrue({day: 23, hour:21}),
  "day:nth(2) > :nth(3)":   assertTrue({day: {nth: 2}, hour: {nth: 3}}),
  "h":                      assertTrue({hour: -1}),
  "hour":                   assertTrue({hour: -1}),
  "hour.5am":               assertTrue({hour: 5}),
  "hour.12am":              assertTrue({hour: 0}),
  "hour.12pm":              assertTrue({hour: 12}),
  "hour.5pm":               assertTrue({hour: 17}),
  "hour.17":                assertTrue({hour: 17}),
  "hour.17 > .32":          assertTrue({hour: 17, minute: 32}),
  "m":                      assertTrue({minute: -1}),
  "minute":                 assertTrue({minute: -1}),
  "minute.37":              assertTrue({minute: 37}),
  "minute.37 > .12":        assertTrue({minute: 37, second: 12}),
  "s":                      assertTrue({second: -1}),
  "second":                 assertTrue({second: -1}),
  "second.54":              assertTrue({second: 54}),
  "y M":                    assertTrue({year: -1, month: -1}),
  "y.1985 month.02 day.04": assertTrue({year: 1985, month: 2, day: 4}),
  "y M second":             assertTrue({year: -1, month: -1, second: -1}),
  "y.4711 M.3 second.9":    assertTrue({year: 4711, month: 3, second: 9}),
  "day.weekday":            assertTrue({day: "weekday"}),
  "day.monday":             assertTrue({day: "monday"})
// TODO: I don't get it to work right now. It throws at least, so that is nice.
//  "M y":          assertTrows(Error)
}).export(module);
