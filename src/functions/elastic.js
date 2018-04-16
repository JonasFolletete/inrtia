const frictionMultiplier = 100; // uniform friction through interpolation

export default function (current, target, params, dTime, reset, key) {
  if (reset) this._resetSpeed(key);

  let speed = this._getSpeed(key);
  const delta = current - target;
  const spring = -delta / (params.friction / frictionMultiplier);
  const damper = -params.rigidity * speed;
  const acc = (spring + damper) / params.mass;

  speed += acc * dTime;
  this._setSpeed(speed, key);
  return current + (speed * dTime);
}
