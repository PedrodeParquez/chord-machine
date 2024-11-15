import { bpm } from './bpm.js';
import { run } from './runner_line.js';
import { initChords, chords } from '../chord/chord.js';

export const stopStartButton = document.getElementById('stop-play-button');
export const generateButton = document.getElementById('generate');

generateButton.addEventListener('click', () => {
    if (chords.length > 0) {
        chords.forEach(chord => chord.remove());
    }

    initChords();
});

stopStartButton.addEventListener('click', () => {
    stopStartButton.classList.toggle('active');
    run(bpm);
});