var vows = require('vows'),
    assert = require('assert'),
    grammar = require('../lib/grammar.js');

function assertTrue(expected){
  var context = {
    topic: function(){
      var selector = this.context.name;
      return grammar.parse(selector);
    }
  }
    context["to json should result in " + JSON.stringify(expected)] = function(result){
      assert.deepEqual(result, expected);
    }
    return context;
}

vows.describe('Parsing').addBatch({
  'y':          assertTrue({year: "*"}),
  'year':       assertTrue({year: "*"}),
  'M':          assertTrue({month: "*"}),
  'month':      assertTrue({month: "*"}),
  "d":          assertTrue({day: "*"}),
  "day":        assertTrue({day: "*"}),
  "h":          assertTrue({hour: "*"}),
  "hour":       assertTrue({hour: "*"}),
  "m":          assertTrue({minute: "*"}),
  "minute":     assertTrue({minute: "*"}),
  "s":          assertTrue({second: "*"}),
  "second":     assertTrue({second: "*"})
}).export(module);
