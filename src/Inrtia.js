import linear from './functions/linear';
import elastic from './functions/elastic';
import bounce from './functions/bounce';

class Inrtia {
  constructor({
    value,
    interpolation = 'linear',
    precisionStop = 0.001,
    perfectStop = false,
    rigidity = 0.1,
    friction = 10,
    mass = 0.01
  }) {
    // Property params
    this.value = value;
    this.stopped = true;

    // Detect if value is Array of Object
    this.complex = (typeof value) === 'object';

    // If complex we extract keys and we copy array / object
    if (this.complex) {
      this.keys = Object.keys(this.value);
      if (Array.isArray(value)) {
        this.targetValue = value.slice(0);
      } else {
        this.targetValue = {};
        let l = this.keys.length;
        while (l--) this.targetValue[this.keys[l]] = this.value[this.keys[l]];
      }
    } else {
      this.targetValue = value;
    }

    // Stop params
    this.precisionStop = precisionStop;
    this.perfectStop = perfectStop;

    // Interpolation params
    this.interpolationFn = this.getInterpolation(interpolation);
    this.interpolationParams = { rigidity, friction, mass };
  }

  getInterpolation(interpolationName) {
    switch (interpolationName) {
      case 'elastic':
        return elastic;
      case 'bounce':
        return bounce;
      default:
        return linear;
    }
  }

  to(targetValue) {
    if (this.complex) {
      let key, l = this.keys.length;

      while (l--) {
        key = this.keys[l];
        if (targetValue[key]) this.targetValue[key] = targetValue[key];
      }
    } else {
      this.targetValue = targetValue;
    }

    if (this.stopped) this._start();
  }

  _start() {
    this.reset = true;
    this.stopped = false;
    this.lastTime = Date.now() - 17;
  }

  update(deltaTime = false) {
    if (this.stopped) return this.value;

    const now = Date.now();
    const dTime = (deltaTime || (now - this.lastTime)) / 1000;
    let needStop = true;

    // Loop if object is complex
    if (this.complex) {
      let key, l = this.keys.length;

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
      if (this.perfectStop) this.value = this.targetValue;
      this.stop();
    }

    this.lastTime = now;
    return this.value;
  }

  _updateValue(value, targetValue, dTime, key) {
    return this.interpolationFn.call(this, value, targetValue, this.interpolationParams, dTime, this.reset, key);
  }

  _needStop(value, targetValue, key) {
    const diff = value - targetValue;
    const speed = this._getSpeed(key);

    if (Math.abs(diff) < this.precisionStop) {
      if (isNaN(speed)) return true;
      return Math.abs(speed) < this.precisionStop;
    } return false;
  }

  _setSpeed(value, key) {
    if (this.complex) this.speed[key] = value;
    else this.speed = value;
  }

  _getSpeed(key) {
    if (this.complex) return this.speed && this.speed[key];
    return this.speed;
  }

  _resetSpeed(key) {
    if (this.complex) {
      if (!this.speed) this.speed = {};
      this.speed[key] = 0;
    } else this.speed = 0;
  }

  stop() {
    this.stopped = true;
  }

  destroy() {
    this.stop();
    this.interpolationFn = null;
    this.interpolationParams = null;
  }
}

export default Inrtia;
