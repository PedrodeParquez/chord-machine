import { bpmContainer } from '../bpm.js';
import { play } from './runner_line.js';

let chords = document.querySelectorAll('.chord');                    // Находим все элементы с классом 'chord'
const chordsContainer = document.querySelector('.chords-container'); // Находим контейнер аккордов  
const stopStartButton = document.getElementById('stop-play-button'); // Находим кнопку для запуска и остановки анимации
const generateButton = document.getElementById('generate');          // Находим кнопку для генерации аккордов
export const containerWidth = chordsContainer.offsetWidth;           // Получаем ширину контейнера
const gridSize = containerWidth / 16;                                // Вычисляем размер одной ячейки сетки (контейнер делится на 16 частей)

class Note {
    constructor(name, path) {
        this.name = name;
        this.path = path;
    }
}

class Chord {
    constructor(name, notes) {
        this.name = name;
        this.notes = notes;
    }

    initial(name) {
        const newChordHTML = `<div class="chord" data-width="4">${name}
            <div class="resizer-right"></div>
            <div class="resizer-left"></div>
        </div>`;
        chordsContainer.insertAdjacentHTML('beforeend', newChordHTML);
    }
}

generateButton.addEventListener('click', () => {
    let notes1 = [
        new Note("C", "sound/piano/c_1.ogg"),
        new Note("E", "sound/piano/e_1.ogg"),
        new Note("G", "sound/piano/g_1.ogg")
    ];

    let notes2 = [
        new Note("G", "sound/piano/g_1.ogg"),
        new Note("B", "sound/piano/b_1.ogg"),
        new Note("D", "sound/piano/d_2.ogg"),
        new Note("F", "sound/piano/f_2.ogg"),
        new Note("A", "sound/piano/a_2.ogg")
    ];

    let notes3 = [
        new Note("F", "sound/piano/f_1.ogg"),
        new Note("A", "sound/piano/a_1.ogg"),
        new Note("C", "sound/piano/c_2.ogg")
    ];

    let chord1 = new Chord("C", notes1);
    let chord2 = new Chord("G 9th", notes2);
    let chord3 = new Chord("F", notes3);

    chord1.initial(chord1.name);
    chord2.initial(chord2.name);
    chord3.initial(chord3.name);

    chords = document.querySelectorAll('.chord');

    chords.forEach((chord, index) => {
        const chordWidth = parseInt(chord.dataset.width, 10) * gridSize;  // Вычисляем ширину аккорда, умножая значение из data-width на размер ячейки
        chord.style.width = `${chordWidth}px`;                            // Устанавливаем ширину аккорда
        chord.style.left = `${index * chordWidth}px`;                     // Устанавливаем позицию аккорда
    });

    addEventListenersToChords(); // Добавляем обработчики событий для аккордов
});

// Обработчик для кнопки запуска/остановки анимации
stopStartButton.addEventListener('click', () => {
    stopStartButton.classList.toggle('active');
    const bpm = parseInt(bpmContainer.textContent, 10);  // Получаем значение BPM из контейнера
    play(bpm);
});

function addEventListenersToChords() {
    chords.forEach(item => {
        const resizerRight = item.querySelector('.resizer-right');
        const resizerLeft = item.querySelector('.resizer-left');

        // Обработчик для изменения размера справа
        resizerRight.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const initialX = e.clientX;  // Начальная позиция курсора по оси X
            const initialWidth = item.getBoundingClientRect().width;  // Начальная ширина аккорда

            const onMouseMove = (e) => {
                const deltaX = e.clientX - initialX;  // Изменение позиции курсора по оси X
                const newWidth = initialWidth + deltaX;  // Новая ширина аккорда

                const gridSpan = Math.round(newWidth / gridSize);  // Количество ячеек, занимаемых новой шириной
                const nearestGridColumn = Math.round(parseFloat(item.style.left) / gridSize);  // Ближайшая колонка сетки

                const collision = checkCollision(nearestGridColumn, gridSpan, item);  // Проверяем на столкновения
                if (!collision && gridSpan > 0 && gridSpan <= 16) {  // Если нет столкновений и новая ширина валидна
                    item.style.width = `${newWidth}px`;  // Устанавливаем новую ширину аккорда
                }
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);  // Удаляем обработчик движения мыши

                const finalWidth = item.getBoundingClientRect().width;  // Финальная ширина аккорда
                const gridSpan = Math.round(finalWidth / gridSize);  // Количество ячеек, занимаемых финальной шириной
                const nearestGridWidth = gridSpan * gridSize;  // Ближайшая ширина сетки
                const nearestColumn = Math.round(parseFloat(item.style.left) / gridSize);  // Ближайшая колонка сетки

                const collision = checkCollision(nearestColumn, gridSpan, item);  // Проверяем на столкновения
                if (!collision && gridSpan > 0 && gridSpan <= 16) {  // Если нет столкновений и финальная ширина валидна
                    item.style.width = `${nearestGridWidth}px`;  // Устанавливаем финальную ширину аккорда
                }

                document.removeEventListener('mouseup', onMouseUp);  // Удаляем обработчик отпускания мыши
            };

            document.addEventListener('mousemove', onMouseMove);  // Добавляем обработчик движения мыши
            document.addEventListener('mouseup', onMouseUp);  // Добавляем обработчик отпускания мыши
        });

        // Обработчик для изменения размера слева
        resizerLeft.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const initialX = e.clientX;  // Начальная позиция курсора по оси X
            const initialLeft = parseFloat(item.style.left) || 0;  // Начальная позиция аккорда слева
            const initialWidth = item.getBoundingClientRect().width;  // Начальная ширина аккорда

            const onMouseMove = (e) => {
                const deltaX = e.clientX - initialX;  // Изменение позиции курсора по оси X
                const newLeft = initialLeft + deltaX;  // Новая позиция аккорда слева
                const newWidth = initialWidth - deltaX;  // Новая ширина аккорда

                const gridSpan = Math.round(newWidth / gridSize);  // Количество ячеек, занимаемых новой шириной
                const nearestGridColumn = Math.round(newLeft / gridSize);  // Ближайшая колонка сетки

                const collision = checkCollision(nearestGridColumn, gridSpan, item);  // Проверяем на столкновения
                if (!collision && newLeft >= 0 && gridSpan > 0 && gridSpan <= 16) {  // Если нет столкновений и новая ширина валидна
                    item.style.left = `${newLeft}px`;  // Устанавливаем новую позицию аккорда слева
                    item.style.width = `${newWidth}px`;  // Устанавливаем новую ширину аккорда
                }
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);  // Удаляем обработчик движения мыши

                const finalLeft = parseFloat(item.style.left) || 0;  // Финальная позиция аккорда слева
                const finalWidth = item.getBoundingClientRect().width;  // Финальная ширина аккорда
                const gridSpan = Math.round(finalWidth / gridSize);  // Количество ячеек, занимаемых финальной шириной
                const nearestGridWidth = gridSpan * gridSize;  // Ближайшая ширина сетки
                const nearestGridColumn = Math.round(finalLeft / gridSize);  // Ближайшая колонка сетки

                const collision = checkCollision(nearestGridColumn, gridSpan, item);  // Проверяем на столкновения
                if (!collision && gridSpan > 0 && gridSpan <= 16) {  // Если нет столкновений и финальная ширина валидна
                    item.style.left = `${nearestGridColumn * gridSize}px`;  // Устанавливаем финальную позицию аккорда слева
                    item.style.width = `${nearestGridWidth}px`;  // Устанавливаем финальную ширину аккорда
                }

                document.removeEventListener('mouseup', onMouseUp);  // Удаляем обработчик отпускания мыши
            };

            document.addEventListener('mousemove', onMouseMove);  // Добавляем обработчик движения мыши
            document.addEventListener('mouseup', onMouseUp);  // Добавляем обработчик отпускания мыши
        });

        // Обработчик для перетаскивания аккорда
        item.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('resizer-right') || e.target.classList.contains('resizer-left')) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            const initialX = e.clientX;  // Начальная позиция курсора по оси X
            const initialLeft = parseFloat(item.style.left) || 0;  // Начальная позиция аккорда слева

            const onMouseMove = (e) => {
                const deltaX = e.clientX - initialX;  // Изменение позиции курсора по оси X
                const newLeft = initialLeft + deltaX;  // Новая позиция аккорда слева

                const nearestGridColumn = Math.round(newLeft / gridSize);  // Ближайшая колонка сетки
                const nearestGridPosition = nearestGridColumn * gridSize;  // Ближайшая позиция сетки

                const gridSpan = Math.round(item.getBoundingClientRect().width / gridSize);  // Количество ячеек, занимаемых аккордом
                const collision = checkCollision(nearestGridColumn, gridSpan, item);  // Проверяем на столкновения

                if (!collision && nearestGridPosition >= 0 && nearestGridColumn + gridSpan <= 16) {  // Если нет столкновений и позиция валидна
                    item.style.left = `${nearestGridPosition}px`;  // Устанавливаем новую позицию аккорда слева
                }
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);  // Удаляем обработчик движения мыши
                document.removeEventListener('mouseup', onMouseUp);  // Удаляем обработчик отпускания мыши
            };

            document.addEventListener('mousemove', onMouseMove);  // Добавляем обработчик движения мыши
            document.addEventListener('mouseup', onMouseUp);  // Добавляем обработчик отпускания мыши
        });
    });
}

// Функция для проверки на столкновения
function checkCollision(column, width, currentChord) {
    let collision = false;

    chords.forEach(chord => {
        if (chord !== currentChord) {  // Игнорируем текущий аккорд
            const chordLeft = parseFloat(chord.style.left) || 0;  // Позиция другого аккорда слева
            const chordWidth = parseFloat(chord.style.width) || 0;  // Ширина другого аккорда
            const chordRight = chordLeft + chordWidth;  // Правая граница другого аккорда

            const currentChordLeft = column * gridSize;  // Позиция текущего аккорда слева
            const currentChordRight = currentChordLeft + width * gridSize;  // Правая граница текущего аккорда

            if (
                (currentChordLeft >= chordLeft && currentChordLeft < chordRight) ||
                (currentChordRight > chordLeft && currentChordRight <= chordRight) ||
                (currentChordLeft <= chordLeft && currentChordRight >= chordRight)
            ) {
                collision = true;  // Обнаружено столкновение
            }
        }
    });

    return collision;  // Возвращаем результат проверки
}

document.addEventListener('DOMContentLoaded', addEventListenersToChords);
