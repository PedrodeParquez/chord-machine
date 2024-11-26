import { bpm } from './bpm.js';
import { run } from './runner_line.js';
import { visibleChords, Chord, updateChords, eventListenersChords } from '../chord/chord.js';
import { Note } from '../chord/note.js';
import { save } from '../local_storage.js';

export let possibleChords = JSON.parse(localStorage.getItem('possibleChords')) || [];
export const stopStartButton = document.getElementById('stop-play-button');
export const generateButton = document.getElementById('generate');
export const keySelect = document.getElementById('key-select');
export const scaleSelect = document.getElementById('scale-select');
export const instrumentSelect = document.getElementById('instrument-select');
export const genreSelect = document.getElementById('genre-select');

generateButton.addEventListener('click', () => {
    if (visibleChords.length > 0) {
        visibleChords.forEach(chord => chord.remove());
    }

    generateChords(keySelect.value, scaleSelect.value, instrumentSelect.value, genreSelect.value);
    getNewProgression();
});

stopStartButton.addEventListener('click', () => {
    stopStartButton.classList.toggle('active');
    run(bpm);
});

async function generateChords(key, scale, instrument, genre) {
    try {
        const response = await fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                key: key,
                scale: scale,
                instrument: instrument,
                genre: genre
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        possibleChords = await response.json();

        localStorage.setItem('possibleChords', JSON.stringify(possibleChords));
    } catch (error) {
        console.error('Failed to generate chords:', error);
    }
}

export function getNewChord(name, length, leftPosition) {
    if (possibleChords.length === 0) {
        return;
    }

    const selectedChord = possibleChords.find(chord => chord.Name === name);

    const newNotes = selectedChord.Notes.map(note => {
        return new Note(note.Name, note.Path);
    });

    return new Chord(selectedChord.Name, newNotes, length, leftPosition);
}

export function getNewProgression() {
    visibleChords.forEach(chord => chord.remove());

    const gridSize = 220;

    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * possibleChords.length);
        const selectedChord = possibleChords[randomIndex];

        const newChord = getNewChord(selectedChord.Name, 4, i * gridSize);
        if (newChord) {
            newChord.init();
            visibleChords.push(newChord);
        }
    }

    updateChords();
    eventListenersChords();
    save('visibleChords');
}
