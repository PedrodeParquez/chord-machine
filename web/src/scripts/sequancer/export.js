import { closePopUp, menuButtons } from '../footer_menu.js';
import { bpm } from './bpm.js';
import { keySelect, scaleSelect, instrumentSelect } from './sequancer.js';

const exportButton = document.getElementById('export-button');

exportButton.addEventListener('click', () => { openPopUpExport(); });

function openPopUpExport() {
    const popUpExportHTML = `
    <div id="pop-up-export" class="pop-up-background">
        <div class="pop-up-container-export">
            <h1>CHOOSE FORMAT</h1>
            <div class="pop-up-container-export-panel">
                <select id="export-select">
                    <option>WAV</option>
                    <option>MP3</option>
                    <option>MIDI</option>
                </select>
                <button id="export">EXPORT</button>
            </div>
        </div>
    </div>`;
    
    menuButtons.insertAdjacentHTML('afterend', popUpExportHTML);

    document.getElementById('pop-up-export').addEventListener('click', closePopUp);

    document.getElementById('export').addEventListener('click', async () => {
        const format = (document.getElementById('export-select').value).toLowerCase();
        const filename = `${keySelect.value}_${scaleSelect.value}_${instrumentSelect.value}_${bpm}.${format}`.toLowerCase();

        await exportFile(format, filename);
    });
}

async function exportFile(format, filename) {
    const options = {
        types: [{
            description: 'Audio Files',
            accept: { 'audio/*': [`.${format}`] },
        }],
        suggestedName: filename,
    };

    const handle = await window.showSaveFilePicker(options);
    const writable = await handle.createWritable();

    let content = "Your file content goes here";
    let blob = new Blob([content], { type: `audio/${format}` });

    await writable.write(blob);
    await writable.close();  

    closePopUp({ target: document.getElementById('pop-up-export') });
}