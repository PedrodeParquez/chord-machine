package chord

import (
	"chord-machine/internal/utils"
	"fmt"
	"path/filepath"
	"strings"
)

type Note struct {
	Name string
	Path string
}

type Chord struct {
	Name  string
	Notes []Note
}

// Функция для генерации возможных аккордов и текущей гаммы
func GeneratePossibleChords(key, scale, instrument string, genre []int) []Chord {
	scaleType := -1 // Переменная для хранения типа гаммы
	offset := 0     // Счетчик для интервалов гаммы

	currentScale := make([]string, 7) // Массив для хранения нот текущей гаммы
	possibleChords := []Chord{}       // Массив для хранения возможных аккордов

	// Поиск типа гаммы по имени
	for i, name := range scaleNames {
		if scale == name {
			scaleType = i // Устанавливаем тип гаммы
			break
		}
	}

	// Построение гаммы на основе начальной ноты и интервалов
	for i := 0; i < 7; i++ {
		currentScale[i] = notes[(findScale(key)+offset)%12] // Заполнение текущей гаммы
		offset += scaleTypes[scaleType][i]                  // Обновление смещения на основе интервалов гаммы
	}

	// Генерация аккордов, которые соответствуют нотам текущей гаммы
	for _, note := range currentScale {
		for i, chord := range chordTypes {
			temp := make([]bool, len(chord)+1)       // Массив для проверки, входят ли все ноты аккорда в гамму
			chordOffset := 0                         // Начальное смещение для аккорда
			chordNotes := make([]Note, len(chord)+1) // Массив для хранения нот аккорда
			currentOctave := 1                       // Начальная октава, начинаем с первой

			for n := range temp {
				// Вычисляем ноту аккорда и проверяем, содержится ли она в текущей гамме
				noteIndex := (findScale(note) + chordOffset) % 12
				currentNote := notes[noteIndex]

				// Обновляем октаву, если смещение выходит за пределы 12 нот
				if findScale(note)+chordOffset >= 12 {
					currentOctave = 2
				}

				// Учитываем правильное название файла с нотой
				noteFileName := fmt.Sprintf("%s_%d.ogg", strings.ToLower(currentNote), currentOctave)

				// Проверка, содержит ли гамма ноту аккорда
				temp[n] = utils.Contains(currentScale, currentNote)
				// Заполняем массив нот аккорда с учетом пути
				chordNotes[n] = Note{
					Name: currentNote,
					Path: filepath.Join("src", "sound", instrument, noteFileName),
				}

				if n < len(chord) {
					chordOffset += chord[n] // Обновляем смещение для следующей ноты аккорда
				}
			}

			// Если все ноты аккорда присутствуют в гамме и аккорд соответствует жанру, добавляем аккорд
			if utils.AllTrue(temp) && utils.ContainsInt(genre, i) {
				if chordNames[i] == "major" {
					possibleChords = append(possibleChords, Chord{
						Name:  note,
						Notes: chordNotes,
					})

					continue
				}

				if chordNames[i] == "minor" && note[len(note)-1] == '#' {
					possibleChords = append(possibleChords, Chord{
						Name:  strings.Replace(note, "#", "", 1) + "m#",
						Notes: chordNotes,
					})

					continue
				}

				if chordNames[i] == "minor" {
					possibleChords = append(possibleChords, Chord{
						Name:  note + "m",
						Notes: chordNotes,
					})

					continue
				}

				possibleChords = append(possibleChords, Chord{
					Name:  note + " " + chordNames[i],
					Notes: chordNotes,
				})
			}
		}
	}

	return possibleChords
}
