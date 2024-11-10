export const bpmContainer = document.getElementById('bpm');
let bpmValue = parseInt(bpmContainer.innerText);

const metronomeButton = document.getElementById('metro-button');
export let metronomeAudio = new Audio('src/sound/bpm-tick.ogg');
let metronomeInterval = null;                              
export let isMetronomeOn = false;

bpmContainer.addEventListener('wheel', function(event) {
    if (event.deltaY < 0) {
        bpmValue = Math.min(bpmValue + 1, 180);
    } else {
        bpmValue = Math.max(bpmValue - 1, 60);
    }

    if (bpmValue > 99) {
            bpmContainer.style.textAlign= 'left';
    } else {
        bpmContainer.style.textAlign= 'center';
    }

    bpmContainer.innerText = bpmValue;
});

// Метроном
function toggleMetronome() {
    metronomeButton.classList.toggle('active');

    if (isMetronomeOn) {
        clearInterval(metronomeInterval);
        isMetronomeOn = false;
    } else {
        metronomeInterval = setInterval(() => {
            metronomeAudio.play();
        }, 60000 / bpmValue);  
        isMetronomeOn = true;
    }
}

metronomeButton.addEventListener('click', toggleMetronome);



