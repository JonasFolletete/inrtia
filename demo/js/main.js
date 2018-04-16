window.onload = function () {

  // inrtia
  var inrtia = new Inrtia({
    value : 0,
    interpolation : 'elastic',
    precisionStop : 0.005,
    perfectStop : false
  });

  // canvas
  var canvas = document.querySelector('canvas');
  canvas.height = 400;
  canvas.width = 1000;
  var context = canvas.getContext('2d');

  // buttons
  var startButton = document.querySelector('.btn.start');
  var stopButton = document.querySelector('.btn.stop');
  startButton.addEventListener('click', start);
  stopButton.addEventListener('click', stop);


  //form
  var interpolationSelect = document.querySelector('.select-interpolation');
  interpolationSelect.addEventListener("change", updateInterpolation);
  var inputs = document.querySelectorAll('input.form-control');
  var l = inputs.length;
  while (l--)  inputs[l].addEventListener("change", updateParam);


  //params
  var values = [0];
  tick();

  start();

  function start(event) {
    inrtia.stop();
    inrtia.value = 0;
    values = [inrtia.value];
    inrtia.to(1);
    if(event) event.preventDefault();
  }
  function stop(event) {
    inrtia.stop();
    event.preventDefault();
  }

  function tick() {
    if (!inrtia.stopped) {
      inrtia.update(17);
      render();
    }
    window.requestAnimationFrame(tick);
  }

  function render() {
    if (isNaN(inrtia.value)) return;

    values.push(inrtia.value);

    var radius = 10;

    var l = values.length;
    var w = canvas.width - radius;
    var h = canvas.height;
    var step = w / (l-1);
    var scale = inrtia.targetValue;
    var bnd = getBounder();

    for (var i = 0; i < l; i++) {
     scale = Math.max(scale, values[i]);
    }

    context.clearRect(0, 0, w + radius, h);

    // grid

    context.beginPath();
    context.lineWidth = .5;
    context.strokeStyle = "grey";
    context.globalAlpha = 0.6;


    for (var i = 0; i < l; i+=5) {
      context.moveTo(step * i, 0);
      context.lineTo(step * i, h);
    }

    context.moveTo(0, 0);
    context.lineTo(w,0);
    context.lineTo(w,h);
    context.lineTo(0,h);
    context.lineTo(0,0);

    context.stroke();

    // graph

    context.beginPath();
    context.lineWidth = 2;
    context.strokeStyle = "#2e6da4";
    context.fillStyle = "#337ab7";
    context.globalAlpha = .6;

    context.moveTo(0, h);

    var p1, p2;
    for (var i = 0; i < (l-1); i++) {
      p1 = {x : step * i, y : h * (1 - bnd(values[i]))};
      p2 = {x : step * (i+1), y : h * (1 - bnd(values[i+1]))};

      if (values[i] == inrtia.targetValue) {
        context.lineTo(p1.x, p1.y);
      } else {
        context.quadraticCurveTo(p1.x, p1.y, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
      }

    }

    context.lineTo(p2.x, p2.y);

    context.lineTo(w, h);
    context.lineTo(0,h);
    context.fill();
    context.stroke();

    //target
    var y = h * (1 - bnd(inrtia.targetValue));
    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = "red";
    context.moveTo(0, y);
    context.lineTo(w, y);
    context.stroke();

    // point
    context.globalAlpha = 1;
    context.beginPath();
    context.arc(w,  h * (1 - bnd(inrtia.value)), radius, 0, 2 * Math.PI);
    context.fill();
  }

  function getBounder() {

    var l = values.length;
    var min = 0;
    var max = inrtia.targetValue;

    for (var i = 0; i < l; i++) {
     min = Math.min(min, values[i]);
     max = Math.max(max, values[i]);
    }

    var scale = max - min;

    return function(value) {
      return  (value / scale) - (min/scale);
    }
  }

  function updateInterpolation() {
    var rigidity = document.querySelector('input[name=rigidity]')
    rigidity.disabled = interpolationSelect.value === 'linear'
    inrtia.stop();
    inrtia.interpolationFn = inrtia.getInterpolation(interpolationSelect.value);
  }

  function updateParam(event) {
    inrtia.interpolationParams[this.name] = this.value;
  }
};
