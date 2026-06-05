const today = new Date().toISOString().slice(0, 10);

let exercises = JSON.parse(localStorage.getItem('exercises') || '[]');
let logs = JSON.parse(localStorage.getItem('logs') || '{}');

function save() {
localStorage.setItem('exercises', JSON.stringify(exercises));
localStorage.setItem('logs', JSON.stringify(logs));
render();
}

function addExercise() {
const n = document.getElementById('exerciseName').value.trim();

if (!n) return;

if (exercises.includes(n)) {
alert('Exercise already exists.');
return;
}

exercises.push(n);
document.getElementById('exerciseName').value = '';
save();
}

function deleteExercise(exerciseName) {
const confirmed = confirm(
`Are you sure you want to delete "${exerciseName}" and all of its saved entries?`
);

if (!confirmed) return;

exercises = exercises.filter(e => e !== exerciseName);

Object.keys(logs).forEach(date => {
if (logs[date][exerciseName]) {
delete logs[date][exerciseName];
}
});

save();
}

function addEntry(ex) {
const input = document.getElementById('entry_' + ex);
const value = parseInt(input.value);

if (isNaN(value) || value <= 0) {
alert('Please enter a valid number.');
return;
}

if (!logs[today]) logs[today] = {};
if (!logs[today][ex]) logs[today][ex] = [];

logs[today][ex].push(value);

input.value = '';

save();
}

function total(date, ex) {
return ((logs[date] || {})[ex] || []).reduce((a, b) => a + b, 0);
}

function render() {
const root = document.getElementById('exercises');
root.innerHTML = '';

exercises.forEach(ex => {
const d = document.createElement('div');
d.className = 'exercise';


d.innerHTML = `
  <div style="display:flex;justify-content:space-between;align-items:center;">
    <h3>${ex}</h3>
    <button onclick="deleteExercise('${ex}')">
      🗑 Delete
    </button>
  </div>

  <input
    type="number"
    id="entry_${ex}"
    placeholder="Count"
  >

  <button onclick="addEntry('${ex}')">
    Add Entry
  </button>

  <p><strong>Today's Total:</strong> ${total(today, ex)}</p>
`;

root.appendChild(d);


});

const hist = document.getElementById('history');

let html =
'<table border="1" cellpadding="5"><tr><th>Date</th>';

exercises.forEach(e => {
html += `<th>${e}</th>`;
});

html += '</tr>';

Object.keys(logs)
.sort()
.reverse()
.forEach(date => {
html += `<tr><td>${date}</td>`;


  exercises.forEach(e => {
    html += `<td>${total(date, e)}</td>`;
  });

  html += '</tr>';
});


html += '</table>';

hist.innerHTML = html;
}

if ('serviceWorker' in navigator) {
navigator.serviceWorker.register('service-worker.js');
}

render();
