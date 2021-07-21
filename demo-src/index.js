import { highlight, languages } from "prismjs";
import { createListener } from "../src";
import "./styles.css";
import "prismjs/themes/prism-okaidia.css";

const listener = createListener();
listener.setMonitor((eventName, matched, originalEvent) => {
  console.log(`name: ${eventName} ${matched ? "[matched]" : "[not matched]"}`);
});

const pressKey = (keyName) => {
  const key = document.querySelector(`.key.${keyName}`);
  key.classList.add("pressed");
  window.setTimeout(() => {
    key.classList.remove("pressed");
  }, 120);
};

let monitorTimeout = null;
const monitor = (keyName) => {
  if (monitorTimeout) {
    window.clearTimeout(monitorTimeout);
  }
  const key = document.querySelector(`.monitor`);
  key.innerHTML = `Pressed [ ${keyName} ]`;
  monitorTimeout = window.setTimeout(() => {
    key.innerHTML = "press any key";
  }, 500);
};

listener.subscribe("Space", () => pressKey("space"));
listener.subscribe("Down", () => pressKey("down"));
listener.subscribe("Up", () => pressKey("up"));
listener.subscribe("Left", () => pressKey("left"));
listener.subscribe("Right", () => pressKey("right"));
listener.subscribe("Shift+Space", () => pressKey("shiftspace"));
listener.subscribe("Meta+Space", () => pressKey("metaspace"));
listener.subscribe("Escape", () => pressKey("escape"));

listener.setMonitor(monitor);

// Text input demo
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

inputListener.subscribe("Down", counterDown);
inputListener.subscribe("Up", counterUp);
inputListener.subscribe("Escape", counterReset);

const code = `
/*
 * This is a simplified version of the code for this demo.
 * Other than the Keyboardist library, it's all Vanilla JS.
 * --------------------------------------------------------
 */


// import the library
import createListener from 'keyboardist';


// ## Global listener demo
// --------------------------

// creates a listener, by default it listens to 'keydown' events.
const listener = createListener();

// triggers the key animation on screen
const pressKey = keyName => {
  const key = document.querySelector(\`.key.\$\{keyName}\`);
  key.classList.add('pressed');
  window.setTimeout(() => {
    key.classList.remove('pressed');
  }, 120);
};

// let's create a monitor to show every key press
const monitor = keyName => {
  const key = document.querySelector(\`.monitor\`);
  key.innerHTML = \`Pressed [ \$\{keyName} ]\`;
  window.setTimeout(() => {
    key.innerHTML = 'press any key';
  }, 500);
};

//let's create the listeners
listener.subscribe('Space', () => pressKey('space'));
listener.subscribe('Down', () => pressKey('down'));
listener.subscribe('Up', () => pressKey('up'));
listener.subscribe('Left', () => pressKey('left'));
listener.subscribe('Right', () => pressKey('right'));
listener.subscribe('Shift+space', () => pressKey('shiftspace'));
listener.subscribe('Escape', () => pressKey('escape'));

// set the monitor function
listener.setMonitor(monitor);


// ## Text input demo
// --------------------------
const input = document.getElementById('text-input');
const inputListener = createListener('keydown', input);

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

inputListener.subscribe('Down', counterDown);
inputListener.subscribe('Up', counterUp);
inputListener.subscribe('Escape', counterReset);


`;

const codeWrapper = document.getElementById("code");
const html = highlight(code, languages.javascript, "javascript");
codeWrapper.innerHTML = '<pre class="language-javascript">' + html + "</pre>";
