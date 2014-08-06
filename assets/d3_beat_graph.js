(function () {
  'use strict';

  var svg = document.querySelector('.raw-svg'),
    xBeat = document.querySelector('x-beat'),
    lastMidiBeat, lastVisualBeat;

  var drawLine = function (type, coords) {
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

});//();

(function (d3) {
  var xBeat = document.querySelector('x-beat'),
    lastMidiBeat, midiBpms = [], visualBpms = [];

  var now = performance.now() / 1000,
    width = 800,
    height = 200;

  var x = d3.scale.linear()
    .domain([now - 10, now + 2])
    .range([0, width]);

  var y = d3.scale.linear()
    .domain([60, 200])
    .range([height, 0]);

  var svg = d3.select(".d3-svg");
  svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

//    .attr("width", width)
//    .attr("height", height);

  var axis = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(x.axis = d3.svg.axis().scale(x).orient("bottom"));

  // MIDI STUFF
  var midiLine = d3.svg.line()
    .x(function (d, i) { return x(d[0]); })
    .y(function (d, i) { return y(d[1]); });

  var midiPath = svg.append("g")
    .attr("clip-path", "url(#clip)")
    .append("path")
    .attr("class", "bpm midi")
    .data([midiBpms]);

  xBeat.addEventListener('x-beat-detected', function () {
    var now = performance.now() / 1000;
    if (lastMidiBeat) {
      var beatDuration = now - lastMidiBeat;
      midiBpms.push([now, 60 / beatDuration]);
      while (x(midiBpms[0][0]) < -100) midiBpms.shift();
    }
    lastMidiBeat = now;
  });

  var visualLine = d3.svg.line()
    .x(function (d, i) { return x(d[0]); })
    .y(function (d, i) { return y(d[1]); });

  var visualPath = svg.append("g")
    .attr("clip-path", "url(#clip)")
    .append("path")
    .attr("class", "bpm visual")
    .data([visualBpms]);

  xBeat.addEventListener('x-beat-visual-beat', function (e) {
    var previousBeat = e.detail[0] / 1000,
      nextBeat = e.detail[1] / 1000,
      beatDuration = nextBeat - previousBeat;
    visualBpms.push([previousBeat, 60 / beatDuration]);
    while (visualBpms[0] && x(visualBpms[0][0]) < -100) visualBpms.shift();
  });

  var animate = function () {
    requestAnimationFrame(animate);

    var now = performance.now() / 1000;
    x.domain([now - 10, now + 2]);
    axis.call(x.axis);

    midiPath.attr("d", midiLine);
    visualPath.attr("d", visualLine);
  }
  animate();

})(d3);
