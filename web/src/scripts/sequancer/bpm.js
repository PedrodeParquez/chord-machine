import { isRunning } from "./runner_line.js";

const bpmContainer = document.getElementById('bpm');
export let metronomeAudio = new Audio('src/sound/bpm-tick.ogg');
export let isMetronomeOn = false;
export let bpm = parseInt(bpmContainer.innerText);
const metronomeButton = document.getElementById('metro-button');
let metronomeInterval = null;                              

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
    console.log(bpm);
});

// Метроном
export function toggleMetronome() {
    if (metronomeButton.classList.contains('active') && !isRunning) {
        metronomeButton.classList.remove('active');
        clearInterval(metronomeInterval);
        isMetronomeOn = false;
        console.log("isMetronomeOn: " + isMetronomeOn);
        return;
    }

    metronomeButton.classList.add('active');
    metronomeInterval = setInterval(() => { metronomeAudio.play(); }, 60000 / bpm);  
    isMetronomeOn = true;
    console.log("isMetronomeOn: " + isMetronomeOn);  
}
  

metronomeButton.addEventListener('click', toggleMetronome);



