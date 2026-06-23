// ===== ELEMENTOS =====

const nota = document.getElementById("nota");
const frecuenciaTexto = document.getElementById("frecuencia");
const afinacionTexto = document.getElementById("afinacion");

let audioContext;
let analyser;
let dataArray;
let source;


// ===== TABLA DE NOTAS =====

const notas = [
["C4",261.63],
["D4",293.66],
["E4",329.63],
["F4",349.23],
["G4",392.00],
["A4",440.00],
["B4",493.88]
];



// ===== OBTENER NOTA MÁS CERCANA =====

function obtenerNota(freq){

let menor = Infinity;
let notaDetectada = "--";

for(let i=0;i<notas.length;i++){

let diferencia =
Math.abs(freq-notas[i][1]);

if(diferencia<menor){

menor = diferencia;

notaDetectada = notas[i][0];

}

}

return notaDetectada;

}



// ===== AFINADOR =====

function afinar(freq){

if(Math.abs(freq-440)<2){

return "✔ Afinado";

}

if(freq<440){

return "⬅ Grave";

}

return "➡ Agudo";

}



// ===== INICIAR MICRÓFONO =====

async function iniciarMicrofono(){

try{

const stream =
await navigator.mediaDevices.getUserMedia({

audio:true

});

audioContext = new AudioContext();

source =
audioContext.createMediaStreamSource(stream);

analyser =
audioContext.createAnalyser();

source.connect(analyser);

analyser.fftSize = 2048;

dataArray =
new Uint8Array(analyser.frequencyBinCount);

actualizar();

}

catch(error){

alert("Debes permitir el acceso al micrófono");

}

}



// ===== DETECTAR FRECUENCIA =====

function actualizar(){

analyser.getByteFrequencyData(dataArray);

let max = 0;
let indice = 0;

for(let i=0;i<dataArray.length;i++){

if(dataArray[i]>max){

max = dataArray[i];

indice = i;

}

}


// Convertir índice a frecuencia

let frecuencia =
indice *
audioContext.sampleRate /
analyser.fftSize;


// Mostrar frecuencia

frecuenciaTexto.innerHTML =
frecuencia.toFixed(2)+" Hz";


// Mostrar nota

nota.innerHTML =
obtenerNota(frecuencia);


// Afinador

afinacionTexto.innerHTML =
afinar(frecuencia);


requestAnimationFrame(actualizar);

}



// ===== BOTÓN =====

document
.getElementById("iniciar")
.addEventListener(
"click",
iniciarMicrofono
);