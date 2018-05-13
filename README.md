# Keyboardist

```
 _              _                         _ _     _
| | _____ _   _| |__   ___   __ _ _ __ __| (_)___| |_
| |/ / _ | | | | '_ \ / _ \ / _` | '__/ _` | / __| __|
|   |  __| |_| | |_) | (_) | (_| | | | (_| | \__ | |_
|_|\_\___|\__, |_.__/ \___/ \__,_|_|  \__,_|_|___/\__|
          |___/
```

An easy way to add keyboard shortcuts to your javascript applications.

```javascript
const k = new Keyboardist();

console.log(k);

k.subscribe('down', () => {
  console.log('Pressed down');
});

k.subscribe('shift+down', () => {
  console.log('Pressed Shift + down');
});
```
