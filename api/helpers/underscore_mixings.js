// this needs to be pulled out as a separate module

// just a bunch of underscore mixins that seemed useful
// many of these exist to support more function programming

module.exports = (function () {
  var _ = require('underscore')
  , _s  = require('underscore.string')
  ;

  _.mixin(_s.exports());

  var _pluckUniq = function (arr, val) {
    return _.chain(arr).pluck(val).uniq().value();
  };

  var _pickInt = function (obj, val) {
    return parseInt(obj[val], 10);
  };

  var _pluckInt = function (arr, val) {
    return _.map(arr, function (obj) {
      return parseInt(obj[val], 10);
    });
  };

  var _pluckStr = function (arr, val) {
    return _.map(arr, function (obj) {
      return (obj[val]).toString();
    });
  };

  var _logJSON = function (obj) {
    console.log(JSON.stringify(obj));
  };

  // find in the array the first object (with a property) that matches and return it, otherwise false
  // _.findWhere?
  var _match = function (arr, obj, prop) {
    if (prop) {
      return _.find(arr, function (a) {
        return a[prop] === obj[prop];
      });
    } else {
      return _.find(arr, function (a) {
        return a === obj;
      });
    }
  };

  var _mapCompact = function (arr, fn) {
    return _.chain(arr).map(fn).compact().value();
  };

  // converts a collection into a hash map with keys matching the property value
  // func is an optional boolean to return a function wrapper
  var _keyed = function (coll, prop, func) {
    var keyed = _.reduce(coll, function (memo, obj) {
      memo[obj[prop]] = obj;
      return memo;
    }, {});
    if (func) {
      return function (key) { return keyed[key]; };
    } else {
      return keyed;
    }
  };

  var _groupMap = function (coll, prop, fn) {
    return _.chain(coll).groupBy(prop).map(fn).value();
  };

  var _isVal = function (thing, key, val) {
    return _.isObject(thing) && thing[key] === val;
  };

  // checks if thing is an object and if it has a truthy value for key
  var _hasTrue = function (thing, key) {
    return _.isObject(thing) && thing[key];
  };

  var _hasAll = function (thing, props) {
    return _.every(props, function (prop) {
      return thing[prop];
    });
  };

  var _hasSome = function (thing, props) {
    return _.some(props, function (prop) {
      return thing[prop];
    });
  };

  var _hasNone = function (thing, props) {
    return !_.some(props, function (prop) {
      return thing[prop];
    });
  };

  // converts an array into a sentence
  var _mapSentence = function (arr, fn, delimeter, lastDelimeter) {
    return _s.toSentence(_.map(arr, fn), delimeter, lastDelimeter);
  };

  var _throttledLog = _.throttle(_.logJSON, 100);

  // attempts to return the nested value by sequentially applying arguments as keys
  var _deep = function (obj) {
    var args = Array.prototype.slice.call(arguments, 1);
    return _.reduce(args, function (memo, key) {
      return memo ? memo[key] : undefined;
    }, obj);
  };

  var _groupToArray = function (stuff, fn) {
    return _.chain(stuff).groupBy(fn).omit('null').toArray().compact().value();
  };

  var _add = function (a, b) {
    return a + b;
  };

  var _sum = function (arr) {
    return _.reduce(arr, _add, 0);
  };

  var _rangeMap = function (n, fn) {
    return _.map(_.range(n), fn);
  };

  var _compactCb = function (cb) {
    return function (err, results) {
      cb(err, _.compact(results || []));
    };
  };

  // quotes a string if it contains spaces
  var _quoteSpaces = function (str) {
    if (_s.include(str, ' ')) {
      return _.quote(str);
    } else {
      return str;
    }
  };

  // returns an array of the results of fn applied to each value
  var _mapReturn = function (arr, fn) {
    return _.map(arr, function (a) {
      return fn(a);
    });
  };

  // compares two arrays and returns true if they have the exact same values
  var _matchDiff = function (arr1, arr2) {
    return arr1.length === arr2.length && !_.difference(arr1, arr2).length;
  };

  var _pluckDiff = function (arr1, arr2, prop) {
    return _matchDiff(_.pluck(arr1, prop), _.pluck(arr2, prop));
  };

  var _addKeyVal = function (obj, key, val) {
    obj[key] = val;
    return obj;
  };

  // reduces a collection to only contain objects with the specified keys
  var _mapPick = function (arr) {
    var args = _.flatten(_.rest(arguments));
    return _.map(arr, function (a) {
      return _.pick(a, args);
    });
  };

  // randomization functions

  var _randIndex = function (arr) {
    return Math.floor(Math.random()*arr.length);
  };

  var _pickFrom = function (picks, prev) {
    return _.sample(_.without(picks, prev));
  };

  var _bellRand = function (n) {
    var rand = 0;
    for (var i=0; i<n; i++) {
      rand += Math.random();
    }
    return rand / n;
  };

  var _bellRange = function (min, max, n) {
    min = max > min ? min : max;
    return min + Math.floor(_bellRand(n || 3) * (max - min + 1));
  };

  var _grnd = function (mean, stdev) {
    return Math.round(_rnd_snd*stdev + mean);
  };

  var _rnd_snd = function () {
    return (Math.random()*2-1)+(Math.random()*2-1)+(Math.random()*2-1);
  };

  var _getSquareRand = function (min, max) {
    var x = Math.random();
    return min + Math.floor(x * x * (max-min));
  };

  var _pickManyRandom = function (arr, min, max) {
    var count = _bellRange(min, max);
    return _.chain(arr).shuffle().first(count).value();
  };

  var _pickFirstThenRandom = function (arr, min, max) {
    var count = _bellRange(min, max) - 1;
    arr = _.compact(arr || []);
    return _.first(arr, 1).concat(_.chain(arr).rest(1).shuffle().first(count).value());
  };

  var _pickWeight = function (arr) {
    var total = 0
    , weighted = _.map(arr, function (a) {
      return total += a;
    })
    , i = _.random(total)

    // binary sort would be faster
    , index = _.find(weighted, function (w) {
      return w > i;
    });
    return arr[index];
  };


  // score = lower bound of Wilson score confidence interval for a Bernoulli paramater
  // pos is the number of positive ratings
  // n is the total number of ratings
  // confidence refers to the statistical confidence level
  var _ci_lower_bound = function (pos, n, confidence) {
    if (n === 0) {
      return 0;
    }
    // need to add a statistical library
    var z = _pnormaldist(1-(1-confidence)/2);
    var phat = 1.0*pos/n;
    // return (phat + z*z/(2*n) - z * Math.sqrt((phat*(1-phat)+z*z/(4*n))/(1+z*z/n));
    return ((phat + z*z/(2*n) - z * Math.sqrt((phat*(1-phat)+z*z/(4*n))/n))/(1+z*z/n));
  };

  // inverse of normal distribution
  // Pr( (-\infty, x] ) = qn -> x
  var _pnormaldist = function (qn) {
    var b = [
      1.570796288, 0.03706987906, -0.8364353589e-3,
      -0.2250947176e-3, 0.6841218299e-5, 0.5824238515e-5,
      -0.104527497e-5, 0.8360937017e-7, -0.3231081277e-8,
      0.3657763036e-10, 0.6936233982e-12
    ];

    if (qn < 0.0 || 1.0 < qn) {
      console.log("Error : qn <= 0 or qn >= 1  in pnormaldist()!");
      return 0.0;
    }
    if (qn == 0.5) {
      return 0.0;
    }

    var w1 = qn;
    if (qn > 0.5) {
      w1 = 1.0 - w1;
    }
    var w3 = -Math.log(4.0 * w1 * (1.0 - w1));
    w1 = b[0];
    for (var i=1; i<=10; i++) {
      w1 += b[i] * Math.pow(w3,i);
    }
    if (qn > 0.5) {
      return Math.sqrt(w1 * w3);
    }
    return -Math.sqrt(w1 * w3);
  };

  var exports = {
    str : _s
    , _pluckUniq : _pluckUniq
    , _pickInt : _pickInt
    , _pluckInt : _pluckInt
    , _pluckStr : _pluckStr
    , _pickFrom : _pickFrom
    , _randIndex : _randIndex
    , _randomIndex : _randIndex
    , _logJSON : _logJSON
    , _match : _match
    , _mapCompact : _mapCompact
    , _keyed : _keyed
    , _groupMap : _groupMap
    , _isVal : _isVal
    , _hasTrue : _hasTrue
    , _hasAll : _hasAll
    , _hasSome : _hasSome
    , _hasAny : _hasSome
    , _hasNone : _hasNone
    , _mapSentence : _mapSentence
    , _throttledLog : _throttledLog
    , _bellRand : _bellRand
    , _bellRange : _bellRange
    , _deep : _deep
    , _groupToArray : _groupToArray
    , _add : _add
    , _sum : _sum
    , _rangeMap : _rangeMap
    , _grnd : _grnd
    , _rnd_snd : _rnd_snd
    , _getSquareRand : _getSquareRand
    , _pickManyRandom : _pickManyRandom
    , _pickFirstThenRandom : _pickFirstThenRandom
    , _pickWeight : _pickWeight
    , _compactCb : _compactCb
    , _compactCallback : _compactCb
    , _quoteSpaces : _quoteSpaces
    , _quoteSpace : _quoteSpaces
    , _mapReturn : _mapReturn
    , _matchDiff : _matchDiff
    , _matchDifference : _matchDiff
    , _pluckDiff : _pluckDiff
    , _addKeyVal : _addKeyVal
    , _mapPick : _mapPick
    , _ci_lower_bound : _ci_lower_bound
    , _pnormaldist : _pnormaldist
  };
  _.mixin(exports);
  return exports;
}());