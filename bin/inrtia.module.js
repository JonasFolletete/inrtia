var basic = function (current, target, params) {
  var delta = current - target;
  return current - delta / params.friction;
};

var frictionMultiplier = 100; // uniform friction through interpolation

var elastic = function (current, target, params, dTime, reset, key) {
  if (reset) this._resetSpeed(key);

  var speed = this._getSpeed(key);
  var delta = current - target;
  var spring = -delta / (params.friction / frictionMultiplier);
  var damper = -params.rigidity * speed;
  var acc = (spring + damper) / params.mass;

  speed += acc * dTime;
  this._setSpeed(speed, key);
  return current + speed * dTime;
};

var bounce = function (current, target, params, dTime, reset, key) {
  var result = elastic.call(this, current, target, params, dTime, reset, key);

  if (result - target >= 0) {
    this._setSpeed(-this._getSpeed(key), key);
    return target;
  }

  return result;
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
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
        interpolation = _ref$interpolation === undefined ? 'basic' : _ref$interpolation,
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
    this.stopped = true;

    // Detect if value is Array of Object
    this.complex = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';

    // If complex we extract keys and we copy array / object
    if (this.complex) {
      this.keys = Object.keys(this.value);
      if (Array.isArray(value)) {
        this.targetValue = value.slice(0);
      } else {
        this.targetValue = {};
        var l = this.keys.length;
        while (l--) {
          this.targetValue[this.keys[l]] = this.value[this.keys[l]];
        }
      }
    } else {
      this.targetValue = value;
    }

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
          return basic;
      }
    }
  }, {
    key: 'to',
    value: function to(targetValue) {
      if (this.complex) {
        var key = void 0,
            l = this.keys.length;

        while (l--) {
          key = this.keys[l];
          if (targetValue[key]) this.targetValue[key] = targetValue[key];
        }
      } else {
        this.targetValue = targetValue;
      }

      if (this.stopped) this._start();
    }
  }, {
    key: '_start',
    value: function _start() {
      this.reset = true;
      this.stopped = false;
      this.lastTime = Date.now() - 17;
    }
  }, {
    key: 'update',
    value: function update() {
      var deltaTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (this.stopped) return this.value;

      var now = Date.now();
      var dTime = (deltaTime || now - this.lastTime) / 1000;
      var needStop = true;

      // Loop if object is complex
      if (this.complex) {
        var key = void 0,
            l = this.keys.length;

        while (l--) {
          key = this.keys[l];
          this.value[key] = this._updateValue(this.value[key], this.targetValue[key], dTime, key);
          needStop = needStop && this._needStop(this.value[key], this.targetValue[key], key);
        }
      } else {
        this.value = this._updateValue(this.value, this.targetValue, dTime, false);
        needStop = this._needStop(this.value, this.targetValue, false);
      }

      if (this.reset) this.reset = false;

      if (needStop) {
        if (this.perfectStop) {
          if (this.complex) {
            var key2 = void 0,
                l2 = this.keys.length;

            while (l2--) {
              key2 = this.keys[l2];
              this.value[key2] = this.targetValue[key2];
            }
          } else {
            this.value = this.targetValue;
          }
        }

        this.stop();
      }

      this.lastTime = now;
      return this.value;
    }
  }, {
    key: '_updateValue',
    value: function _updateValue(value, targetValue, dTime, key) {
      return this.interpolationFn.call(this, value, targetValue, this.interpolationParams, dTime, this.reset, key);
    }
  }, {
    key: '_needStop',
    value: function _needStop(value, targetValue, key) {
      var diff = value - targetValue;
      var speed = this._getSpeed(key);

      if (Math.abs(diff) < this.precisionStop) {
        if (isNaN(speed)) return true;
        return Math.abs(speed) < this.precisionStop;
      }return false;
    }
  }, {
    key: '_setSpeed',
    value: function _setSpeed(value, key) {
      if (this.complex) this.speed[key] = value;else this.speed = value;
    }
  }, {
    key: '_getSpeed',
    value: function _getSpeed(key) {
      if (this.complex) return this.speed && this.speed[key];
      return this.speed;
    }
  }, {
    key: '_resetSpeed',
    value: function _resetSpeed(key) {
      if (this.complex) {
        if (!this.speed) this.speed = {};
        this.speed[key] = 0;
      } else this.speed = 0;
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

export default Inrtia;
