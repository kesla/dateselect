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
  'y':            assertTrue({year: -1}),
  'year':         assertTrue({year: -1}),
  'y.2012':       assertTrue({year: 2012}),
  'M':            assertTrue({month: -1}),
  'month':        assertTrue({month: -1}),
  'month.2':        assertTrue({month: 2}),
//  'month.february':        assertTrue({month: "february"}),
  "d":            assertTrue({day: -1}),
  "day":          assertTrue({day: -1}),
  "day.23":          assertTrue({day: 23}),
  "h":            assertTrue({hour: -1}),
  "hour":         assertTrue({hour: -1}),
//  "hour.5pm":         assertTrue({hour: "5pm"}),
  "hour.17":         assertTrue({hour: 17}),
  "m":            assertTrue({minute: -1}),
  "minute":       assertTrue({minute: -1}),
  "minute.37":       assertTrue({minute: 37}),
  "s":            assertTrue({second: -1}),
  "second":       assertTrue({second: -1}),
  "second.54":       assertTrue({second: 54}),
  "y M":          assertTrue({year: -1, month: -1}),
  "y.1985 month.02 day.04":          assertTrue({year: 1985, month: 2, day: 4}),
  "y M second":   assertTrue({year: -1, month: -1, second: -1}),
  "y.4711 M.3 second.9":   assertTrue({year: 4711, month: 3, second: 9}),
// TODO: I don't get it to work right now. It throws at least, so that is nice.
//  "M y":          assertTrows(Error)
}).export(module);
