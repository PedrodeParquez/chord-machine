import { chordsContainer, gridSize, visibleChords, eventListenersChords, updateChords } from './chord.js';
import { getNewChord, possibleChords } from '../sequancer/sequancer.js';
import { save } from '../local_storage.js';
import { menuButtons, closePopUp } from '../footer_menu.js';

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
    openPopUpAddChords();
});

function openPopUpAddChords() {
    const popUpAddChordHTML = `
    <div id="pop-up-add" class="pop-up-background">
        <div class="pop-up-container-add">
            <h1>CHOOSE CHORD</h1>
            <div class="pop-up-container-add-panel">
                <select id="chord-select">
                </select>
                <button id="add">ADD</button>
            </div>
        </div>
    </div>`;
    
    menuButtons.insertAdjacentHTML('afterend', popUpAddChordHTML);

    const chordSelect = document.getElementById('chord-select');
    addChordsToSelect(chordSelect, possibleChords);

    const addButton = document.getElementById('add');

    addButton.onclick = function(e) {
        e.preventDefault();

        const selectedChord = chordSelect.value;

        let newChord = getNewChord(selectedChord, 4, parseFloat(addChordButton.style.left));
        if (newChord) {
            newChord.init();
            updateChords();
            eventListenersChords();

            save('visibleChords');
        }
        
        const popUp = document.getElementById('pop-up-add');
        
        popUp.remove();
    };

    document.getElementById('pop-up-add').addEventListener('click', closePopUp);
}

function addChordsToSelect(selectElement, chords) {
    chords.forEach(chord => {
        if (chord && chord.Name) {
            const option = document.createElement('option');
            option.value = chord.Name;
            option.textContent = chord.Name;
            selectElement.appendChild(option);
        }
    });
}
