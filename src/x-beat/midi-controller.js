export default class MidiController {
  constructor(channel, note) {
    this.channel = channel;
    this.note = note;
    this.watchMidi();
  }

  watchMidi() {
    navigator.requestMidiAccess().then((midi) => {
      console.log(midi)
    })
  }
}
