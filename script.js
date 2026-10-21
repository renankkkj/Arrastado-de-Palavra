// script.js
// Jogo simples: escolha frases sobre programação e monte-as arrastando palavras.

const sentences = [
  {
    text: 'A linguagem JavaScript é usada para desenvolvimento web.'
  },
  { text: 'Algoritmos eficientes melhoram o desempenho.' },
  { text: 'Git ajuda a controlar versões do código.' },
  { text: 'Testes automatizados evitam regressões.' },
  { text: 'Estruturas de dados organizam informações.' }
];

let current = 0;
let poolEl, dropEl, resultEl;

function splitWords(sentence){
  // simples separação por espaços, mantendo pontuação como parte da palavra
  return sentence.trim().split(/\s+/);
}

function shuffle(array){
  for(let i = array.length -1; i>0; i--){
    const j = Math.floor(Math.random()*(i+1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function render(){
  poolEl.innerHTML = '';
  dropEl.innerHTML = '';
  resultEl.textContent = '';
  resultEl.className = 'result';

  const sentence = sentences[current].text;
  const words = splitWords(sentence);
  // keep a copy of correct order
  sentences[current].words = words.slice();

  const shuffled = words.slice();
  shuffle(shuffled);

  shuffled.forEach((w, i)=>{
    const span = document.createElement('button');
    span.className = 'word';
    span.textContent = w;
    span.setAttribute('draggable', 'true');
    span.setAttribute('role','listitem');
    span.dataset.word = w;
    span.addEventListener('dragstart', onDragStart);
    span.addEventListener('click', onPoolClick);
    poolEl.appendChild(span);
  });
}

function onDragStart(e){
  e.dataTransfer.setData('text/plain', e.target.dataset.word);
}

function onPoolClick(e){
  // move back to dropzone when clicked from pool
  // actually clicking pool word should add to dropzone
  const word = e.target.dataset.word;
  appendToDrop(word);
  e.target.remove();
}

function appendToDrop(word){
  const span = document.createElement('button');
  span.className = 'word';
  span.textContent = word;
  span.dataset.word = word;
  span.addEventListener('click', ()=>{
    // remove from drop and send back to pool
    span.remove();
    createPoolWord(word);
  });
  dropEl.appendChild(span);
}

function createPoolWord(word){
  const span = document.createElement('button');
  span.className = 'word';
  span.textContent = word;
  span.dataset.word = word;
  span.setAttribute('draggable','true');
  span.addEventListener('dragstart', onDragStart);
  span.addEventListener('click', onPoolClick);
  poolEl.appendChild(span);
}

function onDrop(e){
  e.preventDefault();
  const word = e.dataTransfer.getData('text/plain');
  // find the dragged element in pool and remove it (if exists)
  const from = Array.from(poolEl.querySelectorAll('.word')).find(s=>s.dataset.word===word);
  if(from) from.remove();
  appendToDrop(word);
}

function onDragOver(e){ e.preventDefault(); }

function check(){
  const assembled = Array.from(dropEl.querySelectorAll('.word')).map(n=>n.dataset.word);
  const correct = sentences[current].words;
  // compare arrays joined by space
  if(assembled.length !== correct.length){
    resultEl.textContent = `Faltam palavras (${assembled.length}/${correct.length}).`;
    resultEl.className = 'result error';
    return;
  }
  const joinedA = assembled.join(' ');
  const joinedB = correct.join(' ');
  if(joinedA === joinedB){
    resultEl.textContent = 'Correto! \u2705';
    resultEl.className = 'result success';
  } else {
    resultEl.textContent = 'Incorreto. Tente novamente.';
    resultEl.className = 'result error';
  }
}

function resetPool(){
  // re-render with shuffled words
  render();
}

function next(){
  current = (current + 1) % sentences.length;
  render();
}
function prev(){
  current = (current - 1 + sentences.length) % sentences.length;
  render();
}

function init(){
  poolEl = document.getElementById('pool');
  dropEl = document.getElementById('dropzone');
  resultEl = document.getElementById('result');

  document.getElementById('next').addEventListener('click', next);
  document.getElementById('prev').addEventListener('click', prev);
  document.getElementById('reset').addEventListener('click', resetPool);
  document.getElementById('check').addEventListener('click', check);

  dropEl.addEventListener('dragover', onDragOver);
  dropEl.addEventListener('drop', onDrop);

  render();
}

window.addEventListener('load', init);
