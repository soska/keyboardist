// import cover from '../../assets/cover.png';
import { highlight, languages } from 'prismjs';
import createListener from '../lib';
import './styles.css';
import 'prismjs/themes/prism-okaidia.css';

// document.getElementById('cover').src = cover;

const listener = createListener();

const pressKey = keyName => {
  const key = document.querySelector(`.key.${keyName}`);
  key.classList.add('pressed');
  window.setTimeout(() => {
    key.classList.remove('pressed');
  }, 120);
};

listener.subscribe('space', () => pressKey('space'));
listener.subscribe('down', () => pressKey('down'));
listener.subscribe('up', () => pressKey('up'));
listener.subscribe('left', () => pressKey('left'));
listener.subscribe('right', () => pressKey('right'));
listener.subscribe('shift+space', () => pressKey('shiftspace'));
listener.subscribe('esc', () => pressKey('escape'));

const code = `
import createListener from 'keyboardist';

const listener = createListener();

const pressKey = keyName => {
  const key = document.querySelector(\`.key.\$\{keyName}\`);
  key.classList.add('pressed');
  window.setTimeout(() => {
    key.classList.remove('pressed');
  }, 120);
};

listener.subscribe('space', () => pressKey('space'));
listener.subscribe('down', () => pressKey('down'));
listener.subscribe('up', () => pressKey('up'));
listener.subscribe('left', () => pressKey('left'));
listener.subscribe('right', () => pressKey('right'));
listener.subscribe('shift+space', () => pressKey('shiftspace'));
listener.subscribe('esc', () => pressKey('escape'));

`;

const codeWrapper = document.getElementById('code');
const html = highlight(code, languages.javascript, 'javascript');
codeWrapper.innerHTML = '<pre class="language-javascript">' + html + '</pre>';
