import { chordsContainer, gridSize, chords, getNewChord, addEventListenersToChords, updateChords } from './chord.js';

// Получаем элемент для кнопки добавления аккорда
const addChordButton = document.querySelector('.add-button');

// Добавляем событие 'mousemove' на контейнер аккордов
chordsContainer.addEventListener('mousemove', (e) => {
    // Получаем размеры и координаты контейнера аккордов
    const chordsContainerRect = chordsContainer.getBoundingClientRect();
    // Вычисляем позицию курсора мыши относительно контейнера
    const mouseX = e.clientX - chordsContainerRect.left;
    // Определяем позицию сетки, в которую попадает курсор
    const gridPosition = Math.floor(mouseX / gridSize);
    // Вычисляем позицию левой границы кнопки добавления аккорда
    const addChordButtonLeft = gridPosition * gridSize;

    // Флаг для проверки столкновения с существующими аккордами
    let isCollisionAddButton = false;

    // Минимальный и максимальный размеры для кнопки
    const maxColumns = 4;

    let availableColumns = maxColumns;

    // Проверяем все существующие аккорды на столкновение с кнопкой добавления аккорда
    chords.forEach(chord => {
        const chordLeft = parseFloat(chord.style.left) || 0;
        const chordRight = chordLeft + parseFloat(chord.style.width);

        // Если кнопка добавления аккорда попадает в область существующего аккорда, устанавливаем флаг столкновения
        if (addChordButtonLeft >= chordLeft && addChordButtonLeft < chordRight || mouseX > 878) {
            isCollisionAddButton = true;
        }

        // Вычисляем количество доступных колонок
        if (!isCollisionAddButton && addChordButtonLeft < chordLeft && (chordLeft - addChordButtonLeft) / gridSize < 4) {
            availableColumns = Math.floor((chordLeft - addChordButtonLeft) / gridSize);
        }
    });

    // Устанавливаем ширину кнопки добавления аккорда в зависимости от доступного пространства
    if (!isCollisionAddButton) {
        addChordButton.style.left = `${addChordButtonLeft}px`;
        addChordButton.style.width = `${Math.min(gridSize * availableColumns, gridSize * maxColumns)}px`;
        addChordButton.style.display = 'flex';
    } else {
        addChordButton.style.display = 'none';
    }
});

// Добавляем событие 'mouseleave' на контейнер аккордов
chordsContainer.addEventListener('mouseleave', () => {
    addChordButton.style.display = 'none';
});

// Добавляем событие 'click' на кнопку добавления аккорда
addChordButton.addEventListener('click', () => {
    // Создаем новый аккорд с использованием функции getNewChord
    let newChord = getNewChord();
    newChord.init(newChord.name);

    updateChords();
    addEventListenersToChords();
});
