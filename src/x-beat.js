class XBeat extends HTMLElement {
  createdCallback() {
    console.log("WE GOOD")
  }

}

document.registerElement('x-beat', XBeat);
