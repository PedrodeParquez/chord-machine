import { bpm } from './bpm.js';
import { run } from './runner_line.js';
import { visibleChords, Chord } from '../chord/chord.js';
import { Note } from '../chord/note.js';

export let possibleChords = JSON.parse(localStorage.getItem('possibleChords')) || [];
export const stopStartButton = document.getElementById('stop-play-button');
export const generateButton = document.getElementById('generate');

generateButton.addEventListener('click', () => {
    if (visibleChords.length > 0) {
        visibleChords.forEach(chord => chord.remove());
    }
    
    const key = document.getElementById('key-select').value;
    const scale = document.getElementById('scale-select').value;
    const instrument = document.getElementById('instrument-select').value;
    const genre = document.getElementById('genre-select').value;

    generateChords(key, scale, instrument, genre);
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

export function getNewChord(length, leftPosition) {
    if (possibleChords.length === 0) {
        return;
    }

    const randomChord = possibleChords[Math.floor(Math.random() * possibleChords.length)];

    const newNotes = randomChord.Notes.map(note => {
        return new Note(note.Name, note.Path);
    });
    
    return new Chord(randomChord.Name, newNotes, length, leftPosition);
}