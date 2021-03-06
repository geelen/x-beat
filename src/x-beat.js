import {Attributes} from './x-beat/utils.js'
import MidiListener from './x-beat/midi_listener.js'
import ClockEmitter from './x-beat/clock_emitter.js'

class XBeat extends HTMLElement {
  createdCallback() {
    this.clockEmitter = new ClockEmitter(this);

    if (!this.hasAttribute('midi')) {
//      console.error("Only the MIDI version of an x-beat is currently implemented!");
      return;
    }

    if (!navigator.requestMIDIAccess) {
//      console.error("Native MIDI access is only supported in Chrome with a flag. Go to chrome://flags/#enable-web-midi to turn it on!");
      return;
    }

    var maybeChannel = parseInt(this.getAttribute('channel')),
      maybeNote = parseInt(this.getAttribute('note'));
    if (isNaN(maybeChannel) || isNaN(maybeNote)) {
//      console.error("Both CHANNEL and NOTE are required for a MIDI x-beat!");
      return;
    }
    this.beatListener = new MidiListener(this, maybeChannel, maybeNote);
  }
}

document.registerElement('x-beat', XBeat);
