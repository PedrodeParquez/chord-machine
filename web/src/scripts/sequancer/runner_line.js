import { containerWidth } from './chord.js';
import { metronomeAudio, isMetronomeOn } from '../bpm.js';

export const runnerLine = document.querySelector('.runner-line'); 
export let animationFrameId = null;  
export let isRunning = false;  
let position = 0;  

// Функция для запуска анимации
function startRunner(tempo) {
    const pixelsPerMillisecond = containerWidth / ((60000 / tempo) * 16); 

    let lastTimestamp = null;  
    
    // Функция, перемещающая линию
    function moveRunner(timestamp) {
        if (!lastTimestamp) {                        
            lastTimestamp = timestamp;
        }

        const elapsed = timestamp - lastTimestamp;   
        position += pixelsPerMillisecond * elapsed;  

        if (position >= containerWidth) {            
            position = 0;
            runnerLine.style.left = '0px';           

            cancelAnimationFrame(animationFrameId);
            setTimeout(() => { animationFrameId = requestAnimationFrame(moveRunner); }, 150);
            return;
        }

        runnerLine.style.left = `${position}px`;     
        lastTimestamp = timestamp;                   
        animationFrameId = requestAnimationFrame(moveRunner);  

        // Воспроизведение метронома
        if (isMetronomeOn) {
            if (elapsed >= 60000 / tempo) {  // Если прошло время для удара метронома
                metronomeAudio.play();  // Воспроизводим звук метронома
                lastTimestamp = timestamp;  // Сброс времени
            }
        }
    }

    animationFrameId = requestAnimationFrame(moveRunner);     
}

export function play(bpm) {
    if (isRunning) {  
        stopRunner();
    } else {          
        startRunner(bpm);
    }

    isRunning = !isRunning;  
}

// Функция для остановки анимации
function stopRunner() {
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
