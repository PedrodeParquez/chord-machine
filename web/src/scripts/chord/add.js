import { chordsContainer, gridSize, visibleChords, eventListenersChords, updateChords } from './chord.js';
import { getNewChord } from '../sequancer/sequancer.js';
import { save } from '../local_storage.js';

const addChordButton = document.querySelector('.add-button');
let col = 4;

chordsContainer.addEventListener('mousemove', (e) => {
    const chordsContainerRect = chordsContainer.getBoundingClientRect();
    const mouseX = e.clientX - chordsContainerRect.left;
    const gridPosition = Math.floor(mouseX / gridSize);
    const addChordButtonLeft = gridPosition * gridSize;

    let isCollisionAddButton = false;
    const maxColumns = 4;

    let availableColumns = maxColumns;

    visibleChords.forEach(visibleChords => {
        const chordLeft = parseFloat(visibleChords.style.left) || 0;
        const chordRight = chordLeft + parseFloat(visibleChords.style.width);

        if (addChordButtonLeft >= chordLeft && addChordButtonLeft < chordRight || mouseX < 0) {
            isCollisionAddButton = true;
        }

        if (!isCollisionAddButton && addChordButtonLeft < chordLeft && (chordLeft - addChordButtonLeft) / gridSize < 4) {
            availableColumns = Math.floor((chordLeft - addChordButtonLeft) / gridSize);
            col = availableColumns;
        }
    });

    if (!isCollisionAddButton) {
        addChordButton.style.left = `${addChordButtonLeft}px`;
        addChordButton.style.width = `${Math.min(gridSize * availableColumns, gridSize * maxColumns)}px`;
        addChordButton.style.display = 'flex';
    } else {
        addChordButton.style.display = 'none';
    }
});

chordsContainer.addEventListener('mouseleave', () => {
    addChordButton.style.display = 'none';
});

addChordButton.addEventListener('click', () => {
    let newChord = getNewChord(col, parseFloat(addChordButton.style.left));
    newChord.init();
    updateChords();
    eventListenersChords();

    save('visibleChords');
});
