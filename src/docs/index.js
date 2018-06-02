// import cover from '../../assets/cover.png';
import { highlight, languages } from 'prismjs';
import createListener from '../lib';
import './styles.css';
import 'prismjs/themes/prism-okaidia.css';

// document.getElementById('cover').src = cover;

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

listener.subscribe('Space', () => pressKey('space'));
listener.subscribe('Down', () => pressKey('down'));
listener.subscribe('Up', () => pressKey('up'));
listener.subscribe('Left', () => pressKey('left'));
listener.subscribe('Right', () => pressKey('right'));
listener.subscribe('Shift+Space', () => pressKey('shiftspace'));
listener.subscribe('Escape', () => pressKey('escape'));

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

listener.subscribe('Space', () => pressKey('space'));
listener.subscribe('Down', () => pressKey('down'));
listener.subscribe('Up', () => pressKey('up'));
listener.subscribe('Left', () => pressKey('left'));
listener.subscribe('Right', () => pressKey('right'));
listener.subscribe('Shift+space', () => pressKey('shiftspace'));
listener.subscribe('Escape', () => pressKey('escape'));

`;

const codeWrapper = document.getElementById('code');
const html = highlight(code, languages.javascript, 'javascript');
codeWrapper.innerHTML = '<pre class="language-javascript">' + html + '</pre>';
