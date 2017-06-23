export default function (current, target, params) {
  const delta = current - target;
  return current - (delta / params.friction);
}
