import { containerWidth } from '../chord/chord.js';
import { isMetronomeOn, startMetronome, stopMetronome } from './bpm.js';

export const runnerLine = document.querySelector('.runner-line'); 
export let animationFrameId = null;
export let isRunning = false;
export let position = 0; 

function startRunnerLine(tempo) {
    const pixelsPerMillisecond = containerWidth / ((60000 / tempo) * 16); 
    let lastTimestamp = null;

    function moveRunnerLine(timestamp) {
        if (!lastTimestamp) {                        
            lastTimestamp = timestamp;
        }

        const elapsed = timestamp - lastTimestamp;
        position += pixelsPerMillisecond * elapsed;

        if (position >= containerWidth) {
            position = 0;
            runnerLine.style.left = '0px';
            cancelAnimationFrame(animationFrameId);
            setTimeout(() => { animationFrameId = requestAnimationFrame(moveRunnerLine); }, 150);
            return;
        }

        runnerLine.style.left = `${position}px`;
        lastTimestamp = timestamp;
        animationFrameId = requestAnimationFrame(moveRunnerLine);
    }

    animationFrameId = requestAnimationFrame(moveRunnerLine);
}

export function run(bpm) {
    if (isRunning) {  
        stopRunnerLine();
        if (isMetronomeOn) {
            stopMetronome();
        }
    } else {          
        startRunnerLine(bpm);
        if (isMetronomeOn) {
            startMetronome();
        }
    }

    isRunning = !isRunning;
}

function stopRunnerLine() {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;                 
}

let isDragging = false; 
let startX = 0; 
let startPos = 0; 

runnerLine.addEventListener('mousedown', (e) => {
    isDragging = true;  
    startX = e.clientX;
    startPos = position; 

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});


function onMouseMove(e) {
    if (isDragging) {
        const dx = e.clientX - startX;
        position = startPos + dx;

        if (position < 0) {
            position = 0;
        } else if (position > containerWidth) {
            position = containerWidth;
        }

        runnerLine.style.left = `${position}px`;
    }
}

function onMouseUp() {
    if (isDragging) {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
}
