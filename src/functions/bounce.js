import elastic from './elastic';

export default function (current, target, params, dTime, reset, key) {
  const result = elastic.call(this, current, target, params, dTime, reset);

  if ((result - target) >= 0) {
    this._setSpeed(-this._getSpeed(key), key);
    return target;
  }

  return result;
}
