import { containerWidth } from '../chord/chord.js'; // Импортируем ширину контейнера для вычислений
import { isMetronomeOn, toggleMetronome } from './bpm.js'; // Импортируем метроном и его состояние

export const runnerLine = document.querySelector('.runner-line'); // Получаем элемент бегущей линии
export let animationFrameId = null;  // Идентификатор анимации, используемый для отмены анимации
export let isRunning = false;  // Флаг, показывающий, запущена ли анимация
export let position = 0;  // Текущая позиция бегущей линии

// Функция для начала анимации бегущей линии с указанным темпом
function startRunnerLine(tempo) {
    // Вычисляем количество пикселей, которое линия будет двигаться за 1 миллисекунду
    const pixelsPerMillisecond = containerWidth / ((60000 / tempo) * 16); 

    let lastTimestamp = null;  // Временная метка для вычисления прошедшего времени

    // Функция для перемещения линии
    function moveRunnerLine(timestamp) {
        if (!lastTimestamp) {                        
            lastTimestamp = timestamp;  // Запоминаем временную метку первого кадра
        }

        const elapsed = timestamp - lastTimestamp;   // Вычисляем прошедшее время
        position += pixelsPerMillisecond * elapsed;  // Обновляем позицию линии

        // Если линия достигла конца контейнера, сбрасываем её в начало
        if (position >= containerWidth) {            
            position = 0;
            runnerLine.style.left = '0px';  // Устанавливаем позицию линии в начало

            cancelAnimationFrame(animationFrameId);  // Останавливаем текущую анимацию
            setTimeout(() => { animationFrameId = requestAnimationFrame(moveRunnerLine); }, 150);  // Перезапускаем анимацию с задержкой
            return;
        }

        runnerLine.style.left = `${position}px`;  // Обновляем позицию линии
        lastTimestamp = timestamp;  // Обновляем временную метку
        animationFrameId = requestAnimationFrame(moveRunnerLine);  // Запрашиваем следующий кадр анимации
    }

    animationFrameId = requestAnimationFrame(moveRunnerLine);  // Запускаем анимацию
}

// Функция для запуска или остановки анимации
export function play(bpm) {
    if (isRunning) {  
        stopRunnerLine();  // Если анимация уже запущена, останавливаем её
    } else {          
        startRunnerLine(bpm);  // Если анимация не запущена, начинаем её
    }

    isRunning = !isRunning;  // Переключаем флаг состояния анимации
}

// Функция для остановки анимации
function stopRunnerLine() {
    cancelAnimationFrame(animationFrameId);  // Останавливаем анимацию
    animationFrameId = null;                 // Сбрасываем идентификатор анимации
}

let isDragging = false;  // Флаг, показывающий, что линия перетаскивается
let startX = 0;  // Начальная позиция курсора при перетаскивании
let startPos = 0;  // Начальная позиция бегущей линии при перетаскивании

// Обработчик события 'mousedown' для начала перетаскивания
runnerLine.addEventListener('mousedown', (e) => {
    isDragging = true;  // Включаем флаг перетаскивания
    startX = e.clientX;  // Сохраняем начальную позицию курсора
    startPos = position;  // Сохраняем текущую позицию линии

    // Добавляем обработчики для перемещения и завершения перетаскивания
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});

// Функция для обработки перемещения мыши во время перетаскивания
function onMouseMove(e) {
    if (isDragging) {
        const dx = e.clientX - startX;  // Вычисляем разницу в позиции курсора
        position = startPos + dx;  // Обновляем позицию линии

        // Ограничиваем движение линии в пределах контейнера
        if (position < 0) {
            position = 0;
        } else if (position > containerWidth) {
            position = containerWidth;
        }

        runnerLine.style.left = `${position}px`;  // Обновляем позицию линии
    }
}

// Функция для завершения перетаскивания
function onMouseUp() {
    if (isDragging) {
        isDragging = false;  // Останавливаем перетаскивание
        document.removeEventListener('mousemove', onMouseMove);  // Убираем обработчик перемещения мыши
        document.removeEventListener('mouseup', onMouseUp);  // Убираем обработчик окончания перетаскивания
    }
}
