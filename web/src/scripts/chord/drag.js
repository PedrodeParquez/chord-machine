import { updateChords, gridSize, isCollision } from "./chord.js";

export function dragChord(chord) {
    chord.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('resizer-right') || e.target.classList.contains('resizer-left')) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        const initialX = e.clientX;
        const initialLeft = parseFloat(chord.style.left) || 0;

        const onMouseMove = (e) => {
            const deltaX = e.clientX - initialX;
            const newLeft = initialLeft + deltaX;

            const nearestGridColumn = Math.round(newLeft / gridSize);
            const nearestGridPosition = nearestGridColumn * gridSize;

            const gridSpan = Math.round(chord.getBoundingClientRect().width / gridSize);
            const collision = isCollision(nearestGridColumn, gridSpan, chord);

            if (!collision && nearestGridPosition >= 0 && nearestGridColumn + gridSpan <= 16) { 
                chord.style.left = `${nearestGridPosition}px`;
            }
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp); 
            updateChords();
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
}
