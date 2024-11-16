import { resizeLeft, resizeRight } from './resize.js';
import { dragChord } from './drag.js';
import { deleteChord } from './delete.js';

export let chords = document.querySelectorAll('.chord');
export const chordsContainer = document.querySelector('.chords-container');
export const containerWidth = chordsContainer.offsetWidth;
export const gridSize = containerWidth / 16;

class Note {
    constructor(name, path) {
        this.name = name;
        this.path = path;
        this.sound = new Howl({ src: [path] });
        this.key = path.split('/').pop().split('.').shift()
    }

    play() {
        this.sound.play();
    }

    stop() {
        this.sound.stop();
    }

    highlight() {
        const keyElement = document.getElementById(this.key);
            if (keyElement) {
                keyElement.classList.add('active');
            }
    }

    unhighlight() {
        const keyElement = document.getElementById(this.key);
        if (keyElement) {
            keyElement.classList.remove('active');
        }
    }
}

class Chord {
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
        const chordElement = chordsContainer.lastElementChild;
        chordElement.chordObject = this;
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

export function initChords() {
    let notes1 = [
        new Note("C", "sound/piano/c_1.ogg"),
        new Note("E", "sound/piano/e_1.ogg"),
        new Note("G", "sound/piano/g_1.ogg")
    ];

    let notes2 = [
        new Note("G", "sound/piano/g_1.ogg"),
        new Note("B", "sound/piano/b_1.ogg"),
        new Note("D", "sound/piano/d_2.ogg")
    ];

    let notes3 = [
        new Note("A", "sound/piano/a_1.ogg"),
        new Note("C", "sound/piano/c_2.ogg"),
        new Note("E", "sound/piano/e_2.ogg")
    ];

    let notes4 = [
        new Note("F", "sound/piano/f_1.ogg"),
        new Note("A", "sound/piano/a_1.ogg"),
        new Note("C", "sound/piano/c_2.ogg")
    ];

    let chord1 = new Chord("C", notes1, 4, 0);
    let chord2 = new Chord("G", notes2, 4, 220);
    let chord3 = new Chord("Am", notes3, 4, 440);
    let chord4 = new Chord("F", notes4, 4, 660);

    chord1.init();
    chord2.init();
    chord3.init();
    chord4.init();

    updateChords();
    eventListenersChords();
}

export function getNewChord(length, leftPosition) {
    const chordNames = ["C", "D", "E", "F", "G", "A", "B"];
    const randomName = chordNames[Math.floor(Math.random() * chordNames.length)];
    const newNotes = [
        new Note("D", "sound/piano/d_1.ogg"),
        new Note("F", "sound/piano/f_1.ogg"),
        new Note("A", "sound/piano/a_1.ogg")
    ];

    return new Chord("Dm", newNotes, length, leftPosition);
}

export function updateChords() {
    chords = Array.from(document.querySelectorAll('.chord'));

    chords.sort((a, b) => parseFloat(a.style.left) - parseFloat(b.style.left));

    chords.forEach(chord => chord.remove());

    chords.forEach(chord => {
        chordsContainer.appendChild(chord);
        chord.style.width = `${parseInt(chord.dataset.width, 10) * gridSize}px`;
    });
}

export function eventListenersChords() {
    chords.forEach(item => {
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

    chords.forEach(chord => {
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
