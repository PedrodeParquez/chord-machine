import { updateChords } from "./chord.js";

export function deleteChord(chord) {
    chord.addEventListener('contextmenu', (e) => {
        e.preventDefault();

        chord.remove();
        updateChords();
    });
}

