export default class MidiListener {
  constructor(xBeat, channel, note) {
    this.xBeat = xBeat;
    this.channel = channel;
    this.note = note;
    this.watchMidi();
  }

  watchMidi() {
    navigator.requestMIDIAccess().then((midi) => {
      this.input = midi.inputs()[0]

      if (!this.input) {
        console.error("No MIDI input detected!")
        return;
      }

      console.log("OK WAT")
      console.log(this.channel)
      console.log(this.note)
      this.input.addEventListener('midimessage', this.midiMessage.bind(this));
    })
  }

  midiMessage(message) {
    if (message.data[0] >> 4 === 9 && //NOTE ON EVENT
        message.data[0] % 16 === this.channel && //CORRECT CHANNEL
        message.data[1] === this.note) { //CORRECT NOTE
      this.xBeat.dispatchEvent(new CustomEvent('x-beat-detected'), true)
    }
  }
}
