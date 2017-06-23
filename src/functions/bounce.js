const frictionMultiplier = 100; // uniform friction through interpolation

export default function (current, target, params, dTime, reset) {
  if (reset) this.speed = 0;


  const delta = current - target;
  const spring = -delta / (params.friction / frictionMultiplier);
  const damper = -params.rigidity * this.speed;
  const acc = (spring + damper) / params.mass;

  this.speed += acc * dTime;
  const result = current + (this.speed * dTime);

  if ((result - target) >= 0) {
    this.speed = -this.speed;
    return target;
  }

  return result;
}
