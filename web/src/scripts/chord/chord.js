import { resizeLeft, resizeRight } from './resize.js';
import { dragChord } from './drag.js';
import { deleteChord } from './delete.js';
import { save, load } from '../local_storage.js';
import { Note } from './note.js';
 
export let visibleChords = [];
export const chordsContainer = document.querySelector('.chords-container');
export const containerWidth = chordsContainer.offsetWidth;
export const gridSize = containerWidth / 16;

document.addEventListener('DOMContentLoaded', () => {
    const loadedChords = JSON.parse(localStorage.getItem('visibleChords')) || [];
    visibleChords.length = 0;

    loadedChords.forEach(chordData => {
        const newNotes = chordData.notes.map(noteData => {
            return new Note(noteData.Name, noteData.path);
        }).filter(note => note !== undefined); 

        if (chordData.name && newNotes.length > 0 && chordData.length !== undefined && chordData.leftPosition !== undefined) {
            const newChord = new Chord(chordData.name, newNotes, chordData.length, chordData.leftPosition);
            newChord.init();
            visibleChords.push(newChord);
        }
    });

    updateChords();
    eventListenersChords();
});

export class Chord {
    constructor(name, notes, length, leftPosition) {
        this.name = name;
        this.notes = notes;
        this.length = length;
        this.leftPosition = leftPosition;
        this.isPlaying = false;
    }

    init() {
        const newChordHTML = `<div class="chord" data-width="${this.length}" style="left: ${this.leftPosition}px">${this.name}
            <div class="resizer-right"></div>
            <div class="resizer-left"></div>
        </div>`;
        
        chordsContainer.insertAdjacentHTML('beforeend', newChordHTML);

        const chord = chordsContainer.lastElementChild;
        chord.chordObject = this;
    }

    playNotes() {
        this.notes.forEach(note => { note.play(); note.highlight(); });
        this.isPlaying = true;
    }

    stopNotes() {
        this.notes.forEach(note => { note.stop(), note.unhighlight()});
        this.isPlaying = false;
    }
}

export function updateChords() {
    visibleChords = Array.from(document.querySelectorAll('.chord'));

    visibleChords.sort((a, b) => parseFloat(a.style.left) - parseFloat(b.style.left));

    visibleChords.forEach(chord => chord.remove());

    visibleChords.forEach(chord => {
        chordsContainer.appendChild(chord);
        chord.style.width = `${parseInt(chord.dataset.width, 10) * gridSize}px`;
    });

    save('visibleChords');
}

export function eventListenersChords() {
    visibleChords.forEach(item => {
        const resizerRight = item.querySelector('.resizer-right');
        const resizerLeft = item.querySelector('.resizer-left');

        resizeRight(resizerRight, item);

        resizeLeft(resizerLeft, item);

        dragChord(item);

        deleteChord(item);
    });
}

export function isCollision(column, width, currentChord) {
    let collision = false;

    visibleChords.forEach(chord => {
        if (chord !== currentChord) {  
            const chordLeft = parseFloat(chord.style.left) || 0;  
            const chordWidth = parseFloat(chord.style.width) || 0;  
            const chordRight = chordLeft + chordWidth;

            const currentChordLeft = column * gridSize;
            const currentChordRight = currentChordLeft + width * gridSize;

            if (
                (currentChordLeft >= chordLeft && currentChordLeft < chordRight) ||
                (currentChordRight > chordLeft && currentChordRight <= chordRight) ||
                (currentChordLeft <= chordLeft && currentChordRight >= chordRight)
            ) {
                collision = true;
            }
        }
    });

    return collision;
}
