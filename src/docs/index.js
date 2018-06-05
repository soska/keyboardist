import { highlight, languages } from 'prismjs';
import createListener from '../lib';
import './styles.css';
import 'prismjs/themes/prism-okaidia.css';

const listener = createListener();
listener.setMonitor((eventName, matched, originalEvent) => {
  console.log(`name: ${eventName} ${matched ? '[matched]' : '[not matched]'}`);
});

const pressKey = keyName => {
  const key = document.querySelector(`.key.${keyName}`);
  key.classList.add('pressed');
  window.setTimeout(() => {
    key.classList.remove('pressed');
  }, 120);
};

let monitorTimeout = null;
const monitor = keyName => {
  if (monitorTimeout) {
    window.clearTimeout(monitorTimeout);
  }
  const key = document.querySelector(`.monitor`);
  key.innerHTML = `Pressed [ ${keyName} ]`;
  monitorTimeout = window.setTimeout(() => {
    key.innerHTML = 'press any key';
  }, 500);
};

listener.subscribe('Space', () => pressKey('space'));
listener.subscribe('Down', () => pressKey('down'));
listener.subscribe('Up', () => pressKey('up'));
listener.subscribe('Left', () => pressKey('left'));
listener.subscribe('Right', () => pressKey('right'));
listener.subscribe('Shift+Space', () => pressKey('shiftspace'));
listener.subscribe('Escape', () => pressKey('escape'));

listener.setMonitor(monitor);

const code = `
/*
 * This is a simplified version of the code for this demo.
 * Other than the Keyboard.js library, it's all Vanilla JS.
 * --------------------------------------------------------
 */

// import the library
import createListener from 'keyboardist';

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


`;

const codeWrapper = document.getElementById('code');
const html = highlight(code, languages.javascript, 'javascript');
codeWrapper.innerHTML = '<pre class="language-javascript">' + html + '</pre>';
