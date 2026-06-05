const today=new Date().toISOString().slice(0,10);
let exercises=JSON.parse(localStorage.getItem('exercises')||'[]');
let logs=JSON.parse(localStorage.getItem('logs')||'{}');

function save(){
 localStorage.setItem('exercises',JSON.stringify(exercises));
 localStorage.setItem('logs',JSON.stringify(logs));
 render();
}

function addExercise(){
 const n=document.getElementById('exerciseName').value.trim();
 if(!n) return;
 exercises.push(n);
 document.getElementById('exerciseName').value='';
 save();
}

function addEntry(ex){
 const v=parseInt(document.getElementById('entry_'+ex).value||0);
 if(!logs[today]) logs[today]={};
 if(!logs[today][ex]) logs[today][ex]=[];
 logs[today][ex].push(v);
 save();
}

function total(date,ex){
 return ((logs[date]||{})[ex]||[]).reduce((a,b)=>a+b,0);
}

function render(){
 const root=document.getElementById('exercises');
 root.innerHTML='';
 exercises.forEach(ex=>{
   const d=document.createElement('div');
   d.className='exercise';
   d.innerHTML=`<h3>${ex}</h3>
   <input type="number" id="entry_${ex}" placeholder="Count">
   <button onclick="addEntry('${ex}')">Add Entry</button>
   <p>Today's Total: ${total(today,ex)}</p>`;
   root.appendChild(d);
 });

 const hist=document.getElementById('history');
 let html='<table border=1 cellpadding=5><tr><th>Date</th>';
 exercises.forEach(e=>html+=`<th>${e}</th>`);
 html+='</tr>';
 Object.keys(logs).sort().reverse().forEach(date=>{
   html+=`<tr><td>${date}</td>`;
   exercises.forEach(e=>html+=`<td>${total(date,e)}</td>`);
   html+='</tr>';
 });
 html+='</table>';
 hist.innerHTML=html;
}
if('serviceWorker' in navigator){navigator.serviceWorker.register('service-worker.js');}
render();
