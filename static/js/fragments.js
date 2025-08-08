let z = 1; // Used to manage z-index stacking order

fetch('/data/notes.json')
  .then(response => response.json())
  .then(notes => {
    const container = document.getElementById('fragments-container');

    notes.forEach((note, index) => {
      const frag = document.createElement('div');
      frag.className = `fragment ${getRandomTheme()}`;
      frag.innerHTML = `
        <div class="meta">${note.date || ''}</div>
        <div class="content">${redact(note.content)}</div>
      `;
      makeDraggable(frag, index);
      container.appendChild(frag);
    });
const frag = document.createElement('div');
frag.className = `fragment ${getRandomTheme()}`;
frag.style.maxWidth = '300px';
frag.style.width = 'auto';
frag.innerHTML = `...`;

  })
  .catch(err => console.error('Failed to load JSON:', err));

  frag.style.maxWidth = '200px';
frag.style.width = 'auto'; // let it shrink smaller if content is less

function redact(text) {
  text = text.replace(/^#{1,6} .*?\n+/g, '');

  const names = [
    "paola", "edward", "lincoln", "cambridge", "ely", "thorne", "alfie",
    "jessica", "miss law", "alice", "new york", "Ed", "edwards", "barry",
    "pomeranian", "bazz", "andy", "lisa", "jack", "megan", "georgia", "nick",
    "Aleisha", "Ellen", "ellen", "E", "Connie", "connie", "aura", "maddy",
    "Maddy", "Aura", "Micah", "Frankie", "Laura", "Grace", "mia", "mum", "dad",
    "lauren", "kate", "amy", "dubai", "milan", "rome", "croatia", "abbie ashman", "abbie",
  ];
  names.forEach(name => {
    const regex = new RegExp(`\\b${name}\\b`, 'gi');
    text = text.replace(regex, '<span class="redacted">████</span>');
  });

  return text.replace(/\n/g, '<br>');
}

function makeDraggable(el, index) {
  el.style.position = 'absolute';

  const maxWidth = window.innerWidth - 300; // note width padding
  const maxHeight = 20000; // tall scrolling area

  // Keep a record of placed notes
  if (!window.notePositions) {
    window.notePositions = [];
  }

  let left, top;
  let tries = 0;
  const minDistance = 150; // px minimum spacing

  do {
    left = Math.random() * maxWidth;
    top = Math.random() * maxHeight;

    var tooClose = window.notePositions.some(pos => {
      const dx = pos.left - left;
      const dy = pos.top - top;
      return Math.sqrt(dx * dx + dy * dy) < minDistance;
    });

    tries++;
  } while (tooClose && tries < 50);

  window.notePositions.push({ left, top });

  el.style.left = `${left}px`;
  el.style.top = `${top}px`;

  let onMouseMove, onMouseUp;

  el.onmousedown = function (e) {
    el.style.zIndex = ++z;

    let shiftX = e.clientX - el.getBoundingClientRect().left;
    let shiftY = e.clientY - el.getBoundingClientRect().top;

    onMouseMove = function (e) {
      el.style.left = e.pageX - shiftX + 'px';
      el.style.top = e.pageY - shiftY + 'px';
    };

    onMouseUp = function () {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  el.ondragstart = () => false;
}

function getRandomTheme() {
  const themes = [
    'theme-yellow',
    'theme-blue-inverse',
    'theme-pink',
    'theme-cream',
    'theme-midnight'
  ];
  return themes[Math.floor(Math.random() * themes.length)];
}

