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
    this.targetValue = value;
    this.stopped = true;

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
    this.targetValue = targetValue;
    if (this.stopped) this.start();
  }

  start() {
    this.reset = true;
    this.stopped = false;
    this.lastTime = Date.now() - 17;
  }

  update(deltaTime = false) {
    if (this.stopped) return false;

    const now = Date.now();
    const dTime = deltaTime || ((now - this.lastTime) / 1000);

    const diff = this.value - this.targetValue;
    this.value = this.interpolationFn.call(this, this.value, this.targetValue,
      this.interpolationParams, dTime, this.reset);

    if (this.reset) this.reset = false;

    if (this.needStop(diff)) {
      if (this.perfectStop) this.value = this.targetValue;
      this.stop();
    }

    this.lastTime = now;
    return this.value;
  }

  needStop(diff) {
    if (Math.abs(diff) < this.precisionStop) {
      if (isNaN(this.speed)) return true;
      return Math.abs(this.speed) < this.precisionStop;
    } return false;
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
