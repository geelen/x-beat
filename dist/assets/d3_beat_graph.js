(function () {
  'use strict';

  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
    xBeat = document.querySelector('x-beat'),
    lastMidiBeat, lastVisualBeat;
  document.body.appendChild(svg);

  var drawLine = function(type, coords) {
    requestAnimationFrame(function () {
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', coords);
      path.classList.add(type);
      svg.appendChild(path);

      requestAnimationFrame(function () {
        path.classList.add('gtfo');
      })
    })
  }

  xBeat.addEventListener('x-beat-visual-beat', function () {
    drawLine('red', "M0,0L0,100");
    var now = performance.now();
    if (lastVisualBeat) {
      var lastBeatDuration = now - lastVisualBeat,
        height = 400 - lastBeatDuration / 5;
      drawLine('red', "M0," + height + "L40," + height);
    }
    lastVisualBeat = now;
  });

  xBeat.addEventListener('x-beat-detected', function () {
    drawLine('blue', "M0,50L0,150");
    var now = performance.now();
    if (lastMidiBeat) {
      var lastBeatDuration = now - lastMidiBeat,
        height = 400 - lastBeatDuration / 5;
      drawLine('blue', "M0," + height + "L40," + height);
    }
    lastMidiBeat = now;
  });

})();
