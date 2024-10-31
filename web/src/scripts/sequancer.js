document.addEventListener('DOMContentLoaded', () => {
    const chords = document.querySelectorAll('.chord');
    const containerWidth = document.querySelector('.chords-container').offsetWidth;
    const gridSize = containerWidth / 16;

    chords.forEach((chord, index) => {
        const chordWidth = parseInt(chord.dataset.width, 10) * gridSize;
        chord.style.width = `${chordWidth}px`;
        chord.style.left = `${index * chordWidth}px`;
    });
});

document.querySelectorAll('.chord').forEach(item => {
    const resizer = document.createElement('div');
    resizer.classList.add('resizer');
    item.appendChild(resizer);

    item.addEventListener('mousedown', (e) => {
        if (e.target === resizer) return;

        const gridContainer = document.querySelector('.chords-container');
        const gridContainerRect = gridContainer.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        const initialX = e.clientX;
        let shiftX = e.clientX - itemRect.left;

        const onMouseMove = (e) => {
            let newLeft = e.clientX - shiftX - gridContainerRect.left;

            if (newLeft < 0) newLeft = 0;
            if (newLeft + itemRect.width > gridContainerRect.width) newLeft = gridContainerRect.width - itemRect.width;

            const gridSize = gridContainer.clientWidth / 16;
            const nearestGridColumn = Math.round(newLeft / gridSize);

            const gridSpan = Math.round(itemRect.width / gridSize);
            const collision = checkCollision(nearestGridColumn, gridSpan, item);

            if (!collision) {
                item.style.left = `${nearestGridColumn * gridSize}px`;
                item.style.top = '50%';
                item.style.transform = 'translateY(-50%)';
            }
        };

        document.addEventListener('mousemove', onMouseMove);

        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', onMouseMove);
        }, { once: true });
    });

    resizer.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const initialX = e.clientX;
        const initialWidth = item.getBoundingClientRect().width;
        const gridSize = document.querySelector('.chords-container').clientWidth / 16;

        const onMouseMove = (e) => {
            const deltaX = e.clientX - initialX;
            const newWidth = initialWidth + deltaX;
            const gridSpan = Math.round(newWidth / gridSize);

            if (gridSpan > 0 && gridSpan <= 16) {
                const nearestGridColumn = Math.round(parseFloat(item.style.left) / gridSize);
                const collision = checkCollision(nearestGridColumn, gridSpan, item);

                if (!collision) {
                    item.style.width = `${gridSpan * gridSize}px`;
                    item.style.gridColumn = `span ${gridSpan}`;
                }
            }
        };

        document.addEventListener('mousemove', onMouseMove);

        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', onMouseMove);
        }, { once: true });
    });
});

document.addEventListener('dragstart', (e) => e.preventDefault());

function checkCollision(startColumn, span, currentItem) {
    const chords = document.querySelectorAll('.chord');
    let collision = false;

    chords.forEach(chord => {
        if (chord !== currentItem) {
            const chordLeft = parseFloat(chord.style.left) || 0;
            const chordWidth = chord.getBoundingClientRect().width;
            const chordStartColumn = Math.round(chordLeft / (document.querySelector('.chords-container').clientWidth / 16));
            const chordSpan = Math.round(chordWidth / (document.querySelector('.chords-container').clientWidth / 16));

            if ((startColumn < chordStartColumn + chordSpan) && (startColumn + span > chordStartColumn)) {
                collision = true;
            }
        }
    });

    return collision;
}
