import { visibleChords, Chord, updateChords, eventListenersChords } from "./chord/chord.js";
import { Note } from "./chord/note.js";

export function save(nameArray) {
    const chordsData = Array.from(visibleChords).map(chord => {
        const chordObject = chord.chordObject;
        return {
            name: chordObject.name,
            notes: chordObject.notes.map(note => ({
                name: note.name,
                path: note.path
            })),
            length: chordObject.length,
            leftPosition: chordObject.leftPosition
        };
    });

    localStorage.setItem(nameArray, JSON.stringify(chordsData));
}

export function load(nameArray) {
    const storedChords = JSON.parse(localStorage.getItem(nameArray) || '[]');

    storedChords.forEach(chordData => {
        if (chordData.notes && Array.isArray(chordData.notes)) {
            const notes = chordData.notes.map(noteData => {
                if (noteData.name && noteData.path) {
                    return new Note(noteData.name, noteData.path);
                } else {
                    console.error("Invalid note data:", noteData);
                    return null;
                }
            }).filter(note => note !== null);

            if (notes.length > 0) {
                const chord = new Chord(chordData.name, notes, chordData.length, chordData.leftPosition);
                chord.init();
            } 

        }
    });

    updateChords();
    eventListenersChords();
}
