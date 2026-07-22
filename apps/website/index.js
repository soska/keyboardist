import { createListener } from "keyboardist";
import { highlight, languages } from "prismjs";
import "./styles.css";
import "prismjs/themes/prism-okaidia.css";

const listener = createListener();

const pressKey = (keyName) => {
  const key = document.querySelector(`.key.${keyName}`);
  key.classList.add("pressed");
  window.setTimeout(() => {
    key.classList.remove("pressed");
  }, 120);
};

// The structured monitor reports the canonical key name and which layer
// (if any) claimed the key.
let monitorTimeout = null;
const monitor = ({ keyName, matched, layer }) => {
  if (monitorTimeout) {
    window.clearTimeout(monitorTimeout);
  }
  const el = document.querySelector(".monitor");
  const detail = matched ? `matched in "${layer}"` : "no match";
  el.innerHTML = `Pressed [ ${keyName} ] <small>${detail}</small>`;
  monitorTimeout = window.setTimeout(() => {
    el.innerHTML = "press any key";
  }, 900);
};

listener.setMonitor(monitor);

// The demo keys live on a "player" layer, registered as a map.
// Key names are the friendly canonical spellings.
const player = listener.layer("player", {
  space: () => pressKey("space"),
  down: () => pressKey("down"),
  up: () => pressKey("up"),
  left: () => pressKey("left"),
  right: () => pressKey("right"),
  "shift+space": () => pressKey("shiftspace"),
  "meta+space": () => pressKey("metaspace"),
  escape: () => pressKey("escape"),
});

player.push();

// Layers demo: an exclusive modal layer owns the keyboard while open —
// the player keys above go inert until the modal pops.
const modalEl = document.getElementById("layer-modal");
let popModal = null;

const closeModal = () => {
  modalEl.classList.remove("open");
  if (popModal) {
    popModal();
    popModal = null;
  }
};

const modalLayer = listener.layer(
  "modal",
  { escape: closeModal },
  { exclusive: true },
);

const openModal = () => {
  modalEl.classList.add("open");
  popModal = modalLayer.push();
};

listener.subscribe("m", openModal);
document.getElementById("open-modal").addEventListener("click", openModal);

// Text input demo: a listener attached to an input element receives
// keys even while typing in it.
const input = document.getElementById("text-input");
const inputListener = createListener("keydown", input);

let val = 0;
const counterUp = () => {
  val++;
  counterUpdate();
};
const counterDown = () => {
  val--;
  counterUpdate();
};
const counterReset = () => {
  val = 0;
  counterUpdate();
};

const counterUpdate = () => (input.value = val);

counterUpdate();

inputListener.subscribe("down", counterDown);
inputListener.subscribe("up", counterUp);
inputListener.subscribe("escape", counterReset);

const code = `
/*
 * This is a simplified version of the code for this demo.
 * Other than the Keyboardist library, it's all Vanilla JS.
 * --------------------------------------------------------
 */


// import the library
import { createListener } from 'keyboardist';

// creates a listener, by default it listens to 'keydown' events.
const listener = createListener();


// ## Player demo — a layer registered as a map
// --------------------------

// Key names are friendly and case-insensitive: 'shift+space',
// 'Shift + Space' and the raw 'Shift+Space' code all match the same key.
const player = listener.layer('player', {
  'space': () => pressKey('space'),
  'up': () => pressKey('up'),
  'down': () => pressKey('down'),
  'left': () => pressKey('left'),
  'right': () => pressKey('right'),
  'shift+space': () => pressKey('shiftspace'),
  'meta+space': () => pressKey('metaspace'),
  'escape': () => pressKey('escape'),
});

// layers are inert until pushed onto the stack
player.push();


// ## Modal demo — an exclusive layer owns the keyboard
// --------------------------

// While this layer is on top of the stack, its bindings win and —
// because it's exclusive — every unmatched key goes inert, so all
// the player shortcuts are disabled while the modal is open.
const modal = listener.layer('modal', {
  escape: closeModal,
}, { exclusive: true });

let popModal = null;

function openModal() {
  showModalUi();
  popModal = modal.push();   // modal takes the keyboard
}

function closeModal() {
  hideModalUi();
  popModal?.();              // player gets it back
}

listener.subscribe('m', openModal);


// ## Monitor — observe every key event
// --------------------------

// The monitor receives the canonical key name and the winning layer.
listener.setMonitor(({ keyName, matched, layer }) => {
  console.log(keyName, matched ? \`matched in $\{layer}\` : 'no match');
});


// ## Text input demo
// --------------------------

// Listeners attached to an editable element keep receiving keys
// while you type in it.
const input = document.getElementById('text-input');
const inputListener = createListener('keydown', input);

inputListener.subscribe('down', () => counter.decrement());
inputListener.subscribe('up', () => counter.increment());
inputListener.subscribe('escape', () => counter.reset());


`;

const codeWrapper = document.getElementById("code");
const html = highlight(code, languages.javascript, "javascript");
codeWrapper.innerHTML = `<pre class="language-javascript">${html}</pre>`;
