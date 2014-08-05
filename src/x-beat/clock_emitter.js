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
      lastBeatDuration = nowBeat - this.lastRealBeat;
    if (nowBeat > this.nextVisualBeat) {
      // This can happen if you change tabs. Events still get fired but
      // requestAnimationFrame doesn't. May as well reset our estimates
      this.lastVisualBeat = nowBeat;
      if (lastBeatDuration) {
        this.beatDurationEstimate = lastBeatDuration;
        this.nextVisualBeat = nowBeat + lastBeatDuration;
      }
    }

    var timeFast = this.nextVisualBeat - nowBeat,
      timeSlow = nowBeat - this.lastVisualBeat;
    this.lastRealBeat = nowBeat;
    if (isNaN(lastBeatDuration)) return;

    console.log("LAST BEAT DURATION: " + lastBeatDuration);
    console.log("BEAT ESTIMATE: " + this.beatDurationEstimate)
    var adjustment, newInformationBlend = 0.2, speedUp = 0.1;
    if (timeFast < timeSlow) {
      console.log("FAST BY " + timeFast)
      adjustment = timeFast * speedUp * -1;
    } else {
      console.log("SLOW BY " + timeSlow)
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
      this.xBeat.dispatchEvent(new CustomEvent('x-beat-visual-beat'), true);
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
