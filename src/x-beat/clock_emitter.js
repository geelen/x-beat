export default
class ClockEmitter {
  constructor(xBeat) {
    this.xBeat = xBeat;
    this.beatNr = 0;
    this.beatDurationEstimate = 500;
    this.lastVisualBeat = performance.now();
    this.nextVisualBeat = this.lastVisualBeat + this.beatDurationEstimate;

    this.xBeat.addEventListener('x-beat-detected', this.beatDetected.bind(this));
    this.emitClock = this.emitClock.bind(this);
    this.emitClock();
  }

  beatDetected() {
    var nowBeat = performance.now(),
      timeFast = nowBeat - this.lastVisualBeat,
      timeSlow = this.nextVisualBeat - nowBeat,
      lastBeatDuration = nowBeat - this.lastRealBeat;
    this.lastRealBeat = nowBeat;
    if (isNaN(lastBeatDuration)) return;

    console.log("LAST BEAT DURATION: " + lastBeatDuration);
    console.log("BEAT ESTIMATE: " + this.beatDurationEstimate)
    var adjustment, newInformationBlend = 0.1, speedUp = 0.1;
    if (timeFast > timeSlow) {
      console.log("FAST")
      adjustment = timeFast * speedUp * -1;
    } else {
      console.log("SLOW")
      adjustment = timeSlow * speedUp;
    }
    this.beatDurationEstimate =
      this.beatDurationEstimate * (1 - newInformationBlend) +
      lastBeatDuration * newInformationBlend +
      adjustment;
  }

  emitClock() {
    requestAnimationFrame(this.emitClock);
    var nowFrame = performance.now();
    if (nowFrame >= this.nextVisualBeat) {
      this.lastVisualBeat = this.nextVisualBeat;
      this.nextVisualBeat = this.lastVisualBeat + this.beatDurationEstimate;
      this.beatNr++;
    }
    var beat = new CustomEvent('x-beat-clock', {
      detail: [this.beatNr, this.beatDurationEstimate, (nowFrame - this.lastVisualBeat) / this.beatDurationEstimate]
    });
    this.xBeat.dispatchEvent(beat, true);
  }
}
