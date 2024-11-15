import { updateChords, gridSize, isCollision, containerWidth } from "./chord.js";

export function resizeRight(resizer, chord) {
    resizer.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
    
        const initialX = e.clientX;
        const initialWidth = chord.getBoundingClientRect().width;
    
        const onMouseMove = (e) => {
            const deltaX = e.clientX - initialX;
            const newWidth = initialWidth + deltaX;
    
            const gridSpan = Math.round(newWidth / gridSize);
            const nearestGridColumn = Math.round(parseFloat(chord.style.left) / gridSize);
    
            const maxWidth = containerWidth - parseFloat(chord.style.left);
    
            const collision = isCollision(nearestGridColumn, gridSpan, chord);
            if (!collision && newWidth <= maxWidth && gridSpan > 0 && gridSpan <= 16) {
                chord.style.width = `${newWidth}px`;
            }
        };
    
        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
    
            const finalWidth = chord.getBoundingClientRect().width;
            const gridSpan = Math.round(finalWidth / gridSize);
            const nearestGridWidth = gridSpan * gridSize;
            const nearestColumn = Math.round(parseFloat(chord.style.left) / gridSize);
    
            const collision = isCollision(nearestColumn, gridSpan, chord);
            if (!collision && gridSpan > 0 && gridSpan <= 16) {
                chord.style.width = `${nearestGridWidth}px`;
                chord.dataset.width = gridSpan;
            } 

            document.removeEventListener('mouseup', onMouseUp);
            updateChords();
        };
    
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
}

export function resizeLeft(resizer, chord) {
    resizer.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const initialX = e.clientX;
        const initialLeft = parseFloat(chord.style.left) || 0;
        const initialWidth = chord.getBoundingClientRect().width;

        const onMouseMove = (e) => {
            const deltaX = e.clientX - initialX;
            const newLeft = initialLeft + deltaX;
            const newWidth = initialWidth - deltaX;

            const gridSpan = Math.round(newWidth / gridSize);
            const nearestGridColumn = Math.round(newLeft / gridSize);

            const collision = isCollision(nearestGridColumn, gridSpan, chord);
            if (!collision && newLeft >= 0 && gridSpan > 0 && gridSpan <= 16) {
                chord.style.left = `${newLeft}px`;
                chord.style.width = `${newWidth}px`;
            }
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);

            const finalLeft = parseFloat(chord.style.left) || 0;
            const finalWidth = chord.getBoundingClientRect().width;
            const gridSpan = Math.round(finalWidth / gridSize);
            const nearestGridWidth = gridSpan * gridSize;
            const nearestGridColumn = Math.round(finalLeft / gridSize);

            const collision = isCollision(nearestGridColumn, gridSpan, chord);
            if (!collision && gridSpan > 0 && gridSpan <= 16) {
                chord.style.left = `${nearestGridColumn * gridSize}px`;
                chord.style.width = `${nearestGridWidth}px`;
                chord.dataset.width = gridSpan;
            }

            document.removeEventListener('mouseup', onMouseUp);
            updateChords();
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
}