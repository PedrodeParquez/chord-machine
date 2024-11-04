document.addEventListener('DOMContentLoaded', () => {
    const chords = document.querySelectorAll('.chord');
    const container = document.querySelector('.chords-container');
    const containerWidth = container.offsetWidth;
    const gridSize = containerWidth / 16;

    chords.forEach((chord, index) => {
        const chordWidth = parseInt(chord.dataset.width, 10) * gridSize;
        chord.style.width = `${chordWidth}px`;
        chord.style.left = `${index * chordWidth}px`;
    });

    const runnerLine = document.querySelector('.runner-line');
    const bpmContainer = document.getElementById('bpm');
    const toggleButton = document.getElementById('toggle-runner');
    let animationFrameId = null;
    let isRunning = false;

    function startRunner(tempo) {
        const beatsPerMinute = tempo;
        const millisecondsPerBeat = 60000 / beatsPerMinute;
        const pixelsPerMillisecond = containerWidth / (millisecondsPerBeat * 16); // 16 долей
        let position = 0;
        let lastTimestamp = null;

        function moveRunner(timestamp) {
            if (!lastTimestamp) {
                lastTimestamp = timestamp;
            }

            const elapsed = timestamp - lastTimestamp;
            position += pixelsPerMillisecond * elapsed;

            if (position >= containerWidth) {
                position = 0;
            }

            runnerLine.style.left = `${position}px`;
            lastTimestamp = timestamp;
            animationFrameId = requestAnimationFrame(moveRunner);
        }

        animationFrameId = requestAnimationFrame(moveRunner);
    }

    function stopRunner() {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    toggleButton.addEventListener('click', () => {
        const bpm = parseInt(bpmContainer.textContent, 10);

        if (isRunning) {
            stopRunner();
        } else {
            startRunner(bpm);
        }

        isRunning = !isRunning;
    });

    document.querySelectorAll('.chord').forEach(item => {
        const resizer = document.createElement('div');
        resizer.classList.add('resizer');
        item.appendChild(resizer);

        const resizerLeft = document.createElement('div');
        resizerLeft.classList.add('resizer-left');
        item.appendChild(resizerLeft);

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
                const nearestGridColumn = Math.round(parseFloat(item.style.left) / gridSize);

                const collision = checkCollision(nearestGridColumn, gridSpan, item);
                if (!collision && gridSpan > 0 && gridSpan <= 16) {
                    item.style.width = `${newWidth}px`;
                }
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);

                const finalWidth = item.getBoundingClientRect().width;
                const gridSpan = Math.round(finalWidth / gridSize);
                const nearestGridWidth = gridSpan * gridSize;
                const nearestGridColumn = Math.round(parseFloat(item.style.left) / gridSize);

                const collision = checkCollision(nearestGridColumn, gridSpan, item);
                if (!collision && gridSpan > 0 && gridSpan <= 16) {
                    item.style.width = `${nearestGridWidth}px`;
                }

                document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        resizerLeft.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const initialX = e.clientX;
            const initialLeft = parseFloat(item.style.left) || 0;
            const initialWidth = item.getBoundingClientRect().width;
            const gridSize = document.querySelector('.chords-container').clientWidth / 16;

            const onMouseMove = (e) => {
                const deltaX = e.clientX - initialX;
                const newLeft = initialLeft + deltaX;
                const newWidth = initialWidth - deltaX;

                const gridSpan = Math.round(newWidth / gridSize);
                const nearestGridColumn = Math.round(newLeft / gridSize);

                const collision = checkCollision(nearestGridColumn, gridSpan, item);
                if (!collision && newLeft >= 0 && gridSpan > 0 && gridSpan <= 16) {
                    item.style.left = `${newLeft}px`;
                    item.style.width = `${newWidth}px`;
                }
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);

                const finalLeft = parseFloat(item.style.left) || 0;
                const finalWidth = item.getBoundingClientRect().width;
                const gridSpan = Math.round(finalWidth / gridSize);
                const nearestGridWidth = gridSpan * gridSize;
                const nearestGridColumn = Math.round(finalLeft / gridSize);

                const collision = checkCollision(nearestGridColumn, gridSpan, item);
                if (!collision && gridSpan > 0 && gridSpan <= 16) {
                    item.style.left = `${nearestGridColumn * gridSize}px`;
                    item.style.width = `${nearestGridWidth}px`;
                }

                document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        item.addEventListener('mousedown', (e) => {
            if (e.target === resizer || e.target === resizerLeft) return;

            const gridContainer = document.querySelector('.chords-container');
            const gridContainerRect = gridContainer.getBoundingClientRect();
            const itemRect = item.getBoundingClientRect();
            const initialX = e.clientX;
            let shiftX = e.clientX - itemRect.left;

            const onMouseMove = (e) => {
                let newLeft = e.clientX - shiftX - gridContainerRect.left;

                const gridSize = gridContainer.clientWidth / 16;
                const nearestGridColumn = Math.round(newLeft / gridSize);

                const gridSpan = Math.round(itemRect.width / gridSize);
                const collision = checkCollision(nearestGridColumn, gridSpan, item);

                if (!collision && newLeft >= 0 && newLeft + itemRect.width <= gridContainerRect.width) {
                    item.style.left = `${newLeft}px`;
                    item.style.top = '50%';
                    item.style.transform = 'translateY(-50%)';
                }
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);

                const finalLeft = parseFloat(item.style.left) || 0;
                const gridSize = gridContainer.clientWidth / 16;
                const nearestGridLeft = Math.round(finalLeft / gridSize) * gridSize;

                item.style.left = `${nearestGridLeft}px`;

                document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
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
});
