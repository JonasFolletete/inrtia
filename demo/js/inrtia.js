(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Inrtia = factory());
}(this, (function () { 'use strict';

var linear = function (current, target, params) {
  var delta = current - target;
  return current - delta / params.friction;
};

var frictionMultiplier = 100; // uniform friction through interpolation

var elastic = function (current, target, params, dTime, reset) {
  if (reset) this.speed = 0;

  var delta = current - target;
  var spring = -delta / (params.friction / frictionMultiplier);
  var damper = -params.rigidity * this.speed;
  var acc = (spring + damper) / params.mass;

  this.speed += acc * dTime;
  return current + this.speed * dTime;
};

var bounce = function (current, target, params, dTime, reset) {
  var result = elastic.call(this, current, target, params, dTime, reset);

  if (result - target >= 0) {
    this.speed = -this.speed;
    return target;
  }

  return result;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var Inrtia = function () {
  function Inrtia(_ref) {
    var value = _ref.value,
        _ref$interpolation = _ref.interpolation,
        interpolation = _ref$interpolation === undefined ? 'linear' : _ref$interpolation,
        _ref$precisionStop = _ref.precisionStop,
        precisionStop = _ref$precisionStop === undefined ? 0.001 : _ref$precisionStop,
        _ref$perfectStop = _ref.perfectStop,
        perfectStop = _ref$perfectStop === undefined ? false : _ref$perfectStop,
        _ref$rigidity = _ref.rigidity,
        rigidity = _ref$rigidity === undefined ? 0.1 : _ref$rigidity,
        _ref$friction = _ref.friction,
        friction = _ref$friction === undefined ? 10 : _ref$friction,
        _ref$mass = _ref.mass,
        mass = _ref$mass === undefined ? 0.01 : _ref$mass;
    classCallCheck(this, Inrtia);

    // Property params
    this.value = value;
    this.targetValue = value;
    this.stopped = true;

    // Stop params
    this.precisionStop = precisionStop;
    this.perfectStop = perfectStop;

    // Interpolation params
    this.interpolationFn = this.getInterpolation(interpolation);
    this.interpolationParams = { rigidity: rigidity, friction: friction, mass: mass };
  }

  createClass(Inrtia, [{
    key: 'getInterpolation',
    value: function getInterpolation(interpolationName) {
      switch (interpolationName) {
        case 'elastic':
          return elastic;
        case 'bounce':
          return bounce;
        default:
          return linear;
      }
    }
  }, {
    key: 'to',
    value: function to(targetValue) {
      this.targetValue = targetValue;
      if (this.stopped) this.start();
    }
  }, {
    key: 'start',
    value: function start() {
      this.reset = true;
      this.stopped = false;
      this.lastTime = Date.now() - 17;
    }
  }, {
    key: 'update',
    value: function update() {
      var deltaTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (this.stopped) return false;

      var now = Date.now();
      var dTime = deltaTime || (now - this.lastTime) / 1000;

      var diff = this.value - this.targetValue;
      this.value = this.interpolationFn.call(this, this.value, this.targetValue, this.interpolationParams, dTime, this.reset);

      if (this.reset) this.reset = false;

      if (this.needStop(diff)) {
        if (this.perfectStop) this.value = this.targetValue;
        this.stop();
      }

      this.lastTime = now;
      return this.value;
    }
  }, {
    key: 'needStop',
    value: function needStop(diff) {
      if (Math.abs(diff) < this.precisionStop) {
        if (isNaN(this.speed)) return true;
        return Math.abs(this.speed) < this.precisionStop;
      }return false;
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.stopped = true;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.stop();
      this.interpolationFn = null;
      this.interpolationParams = null;
    }
  }]);
  return Inrtia;
}();

return Inrtia;

})));
