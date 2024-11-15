import { isRunning } from "./runner_line.js";

const bpmContainer = document.getElementById('bpm');
const metronomeButton = document.getElementById('metro-button');
let metronomeInterval = null;    

export let metronomeAudio = new Audio('src/sound/bpm-tick.ogg');
export let isMetronomeOn = false;
export let bpm = parseInt(bpmContainer.innerText);                          

bpmContainer.addEventListener('wheel', function(event) {
    if (event.deltaY < 0) {
        bpm= Math.min(bpm + 1, 180);
    } else {
        bpm = Math.max(bpm - 1, 60);
    }

    if (bpm > 99) {
            bpmContainer.style.textAlign= 'left';
    } else {
        bpmContainer.style.textAlign= 'center';
    }

    bpmContainer.innerText = bpm;
});

metronomeButton.addEventListener('click', toggleMetronome);

export function toggleMetronome() {
    if (metronomeButton.classList.contains('active')) {
        metronomeButton.classList.remove('active');
        stopMetronome();
        isMetronomeOn = false;
        return;
    }

    metronomeButton.classList.add('active');
    if (isRunning) { 
        startMetronome();
    }

    isMetronomeOn = true;
}

export function stopMetronome() {
    clearInterval(metronomeInterval);
}

export function startMetronome() {
    metronomeInterval = setInterval(() => { metronomeAudio.play(); }, 60000 / bpm);  
}



