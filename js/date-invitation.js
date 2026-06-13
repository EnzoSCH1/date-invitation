const CONFIG = {
  prenom: "",
  couleurPrincipale: "#FF6B9D",
  medias: {
    photo: {
      local: "assets/photo.jpg",
      fallback: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=400&q=80"
    },
    introGif: {
      local: "assets/intro.gif",
      fallback: "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
    },
    successGif: {
      local: "assets/success.gif",
      fallback: "https://media.giphy.com/media/26u4lOMA8JKSnL9Uk/giphy.gif"
    },
    finalGif: {
      local: "assets/final.gif",
      fallback: "https://media.giphy.com/media/l4FGpP4lxGGghBe7m/giphy.gif"
    }
  }
};

function setMedia(id, media){
  const element = document.getElementById(id);
  if(!element) return;
  element.src = media.local;
  element.onerror = ()=>{
    if(element.src !== media.fallback){
      element.onerror = null;
      element.src = media.fallback;
    }
  };
}

document.documentElement.style.setProperty('--pink', CONFIG.couleurPrincipale);
document.getElementById('nameSpan').textContent = CONFIG.prenom ? CONFIG.prenom : "";
setMedia('photoImg', CONFIG.medias.photo);
setMedia('introGif', CONFIG.medias.introGif);
setMedia('successGif', CONFIG.medias.successGif);
setMedia('finalGif', CONFIG.medias.finalGif);

const stepOrder = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6'];
const progressDots = document.querySelectorAll('.progress-dot');

const bg = document.getElementById('bgHearts');
const emojis = ['💕','💖','💗','✨','🌸','💘'];
for(let i=0;i<18;i++){
  const s = document.createElement('span');
  s.textContent = emojis[i%emojis.length];
  s.style.left = Math.random()*100+'%';
  s.style.fontSize = (14+Math.random()*22)+'px';
  s.style.animationDuration = (10+Math.random()*14)+'s';
  s.style.animationDelay = (Math.random()*12)+'s';
  bg.appendChild(s);
}

function showStep(id){
  document.querySelectorAll('.step').forEach(s=>s.classList.remove('active'));
  const el = document.getElementById(id);
  el.classList.add('active');
  const index = stepOrder.indexOf(id);
  progressDots.forEach((dot, dotIndex)=>dot.classList.toggle('active', dotIndex <= index));
  if(id !== 'step1'){
    btnNo.hidden = true;
  } else {
    resetNoButton();
  }
  window.scrollTo({top:0,behavior:'smooth'});
}

function makeSelectable(element, callback){
  element.setAttribute('role', 'button');
  element.setAttribute('tabindex', '0');
  element.addEventListener('click', callback);
  element.addEventListener('keydown', (event)=>{
    if(event.key === 'Enter' || event.key === ' '){
      event.preventDefault();
      callback();
    }
  });
}

const btnNo = document.getElementById('btnNo');
const btnNoHome = btnNo.parentElement;

function resetNoButton(){
  btnNo.hidden = false;
  btnNo.classList.remove('floating');
  btnNo.removeAttribute('style');
  btnNoHome.appendChild(btnNo);
}

function moveNo(){
  const pad = 16;
  const viewport = window.visualViewport || { width: window.innerWidth, height: window.innerHeight, offsetLeft: 0, offsetTop: 0 };
  const bw = btnNo.offsetWidth;
  const bh = btnNo.offsetHeight;
  if(btnNo.parentElement !== document.body){
    document.body.appendChild(btnNo);
  }
  btnNo.hidden = false;
  btnNo.classList.add('floating');
  btnNo.style.position = 'fixed';
  const minX = viewport.offsetLeft + pad;
  const minY = viewport.offsetTop + pad;
  const maxX = Math.max(minX, viewport.offsetLeft + viewport.width - bw - pad);
  const maxY = Math.max(minY, viewport.offsetTop + viewport.height - bh - pad);
  const x = minX + Math.random() * (maxX - minX);
  const y = minY + Math.random() * (maxY - minY);
  btnNo.style.left = Math.round(x)+'px';
  btnNo.style.top = Math.round(y)+'px';
  btnNo.style.zIndex = 999;
}
btnNo.addEventListener('mouseover', moveNo);
btnNo.addEventListener('touchstart', (e)=>{ e.preventDefault(); showToast(); moveNo(); }, {passive:false});
btnNo.addEventListener('click', (e)=>{ e.preventDefault(); showToast(); moveNo(); });

const toast = document.getElementById('toast');
let toastTimer;
function showToast(){
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toast.classList.remove('show'),1400);
}

document.getElementById('btnYes').addEventListener('click', ()=>{
  showStep('step2');
  setTimeout(()=>{ if(document.getElementById('step2').classList.contains('active')) showStep('step3'); }, 3500);
});
document.getElementById('toStep3').addEventListener('click', ()=>showStep('step3'));
document.querySelectorAll('[data-back]').forEach(button=>{
  button.addEventListener('click', ()=>showStep(button.dataset.back));
});

const dateArea = document.getElementById('dateArea');
const dateConfirmed = document.getElementById('dateConfirmed');
const bigDate = document.getElementById('bigDate');
let chosenDate = null;
let chosenDateLabel = "";

function frenchDate(d){
  return d.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
}
function confirmDate(d){
  chosenDate = d;
  chosenDateLabel = frenchDate(d);
  bigDate.innerHTML = `<span class="heart">❤</span> ${frenchDate(d)} <span class="heart">❤</span>`;
  dateArea.innerHTML = '';
  dateConfirmed.style.display = 'block';
}

function confirmSurpriseDate(){
  chosenDate = null;
  chosenDateLabel = "Laisse-moi décider";
  bigDate.innerHTML = '';
  dateArea.innerHTML = '';
  dateConfirmed.style.display = 'block';
}

document.querySelectorAll('#step3 .choice-card').forEach(card=>{
  makeSelectable(card, ()=>{
    document.querySelectorAll('#step3 .choice-card').forEach(c=>c.classList.remove('selected'));
    card.classList.add('selected');
    dateConfirmed.style.display = 'none';
    if(card.dataset.choice==='pick'){
      const today = new Date().toISOString().split('T')[0];
      dateArea.innerHTML = `<input type="date" id="datePick" min="${today}"/><br><button class="btn btn-primary" id="confirmDate">Confirmer cette date</button>`;
      document.getElementById('confirmDate').addEventListener('click',()=>{
        const v = document.getElementById('datePick').value;
        if(!v){ alert('Choisis une date 💕'); return; }
        confirmDate(new Date(v+'T12:00:00'));
      });
    } else {
      confirmSurpriseDate();
    }
  });
});
document.getElementById('toStep4').addEventListener('click', ()=>showStep('step4'));

const meals = [
  {ico:'🍕',label:'Pizza'},
  {ico:'🍣',label:'Sushis'},
  {ico:'🍝',label:'Restaurant italien'},
  {ico:'🥗',label:'Poke'},
  {ico:'🍔',label:'Burger & frites'},
  {ico:'🎂',label:'Picnic romantique'},
  {ico:'✨',label:'Surprise'}
];
let chosenMeal = null;
const mealGrid = document.getElementById('mealGrid');
meals.forEach((m,i)=>{
  const t = document.createElement('div');
  t.className='tile'; t.innerHTML = `<span class="ico">${m.ico}</span>${m.label}`;
  makeSelectable(t, ()=>{
    document.querySelectorAll('#mealGrid .tile').forEach(x=>x.classList.remove('selected'));
    t.classList.add('selected');
    let pick = m;
    if(m.label==='Surprise'){
      const choices = meals.slice(0,-1);
      pick = choices[Math.floor(Math.random()*choices.length)];
    }
    chosenMeal = pick;
    document.getElementById('toStep5').disabled = false;
  });
  mealGrid.appendChild(t);
});
document.getElementById('toStep5').addEventListener('click', ()=>showStep('step5'));

const acts = [
  {ico:'🎬',label:'Cinéma'},
  {ico:'🌳',label:'Balade en nature'},
  {ico:'🎱',label:"Billard"},
  {ico:'🏠',label:'Soirée film à la maison'},
  {ico:'🎨',label:'Expo ou musée'},
  {ico:'🎮',label:'Arcade'},
  {ico:'🎤',label:'Karaoké'},
  {ico:'🌃',label:'Balade de nuit en ville'},
  {ico:'✨',label:'Surprise'}
];
let chosenAct = null;
const actGrid = document.getElementById('actGrid');
acts.forEach(a=>{
  const t = document.createElement('div');
  t.className='tile'; t.innerHTML = `<span class="ico">${a.ico}</span>${a.label}`;
  makeSelectable(t, ()=>{
    document.querySelectorAll('#actGrid .tile').forEach(x=>x.classList.remove('selected'));
    t.classList.add('selected');
    let pick = a;
    if(a.label==='Surprise'){
      const choices = acts.slice(0,-1);
      pick = choices[Math.floor(Math.random()*choices.length)];
    }
    chosenAct = pick;
    document.getElementById('toStep6').disabled = false;
  });
  actGrid.appendChild(t);
});
document.getElementById('toStep6').addEventListener('click', ()=>{
  if(!chosenDateLabel || !chosenMeal || !chosenAct){
    showToast();
    return;
  }
  const recap = document.getElementById('recap');
  recap.innerHTML = `
    <div class="recap-row"><span class="recap-ico">📅</span><div><div class="label">Date</div><div class="val">${chosenDateLabel}</div></div></div>
    <div class="recap-row"><span class="recap-ico">${chosenMeal.ico}</span><div><div class="label">Repas</div><div class="val">${chosenMeal.label}</div></div></div>
    <div class="recap-row"><span class="recap-ico">${chosenAct.ico}</span><div><div class="label">Activité</div><div class="val">${chosenAct.label}</div></div></div>
    <div class="recap-row"><span class="recap-ico">💌</span><div><div class="label">Ambiance</div><div class="val">Simple, tendre et inoubliable</div></div></div>
  `;
  showStep('step6');
});

document.getElementById('restart').addEventListener('click', ()=>{
  chosenDate = null;
  chosenDateLabel = "";
  chosenMeal = null;
  chosenAct = null;
  dateArea.innerHTML = '';
  dateConfirmed.style.display = 'none';
  document.querySelectorAll('.selected').forEach(element=>element.classList.remove('selected'));
  document.getElementById('toStep5').disabled = true;
  document.getElementById('toStep6').disabled = true;
  showStep('step1');
});