import elastic from './elastic';

export default function (current, target, params, dTime, reset) {
  const result = elastic.call(this, current, target, params, dTime, reset);

  if ((result - target) >= 0) {
    this.speed = -this.speed;
    return target;
  }

  return result;
}
