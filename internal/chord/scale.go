package chord

// Массив нот
var notes = []string{
	"C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
}

// Массив типов гамм с интервалами между нотами
var scaleTypes = [][]int{
	{2, 2, 1, 2, 2, 2, 1}, // major
	{2, 1, 2, 2, 2, 1, 2}, // dorian
	{2, 2, 1, 2, 2, 1, 2}, // mixolydian
	{2, 1, 2, 2, 1, 2, 2}, // aeolian = minor
	{2, 1, 2, 2, 1, 3, 1}, // harmonic minor
	{2, 1, 2, 2, 2, 2, 1}, // melodic minor
}

// Массив названий гамм
var scaleNames = []string{
	"major", "dorian", "mixolydian",
	"minor", "harmonicMinor", "melodicMinor",
}

// Массив типов аккордов с интервалами между нотами (в полутоннах)
var chordTypes = [][]int{
	{4, 3},       // major
	{4, 3, 4},    // major 7th
	{4, 3, 4, 3}, // major 9th
	{3, 4},       // minor
	{3, 4, 2},    // minor 6th
	{3, 4, 3},    // minor 7th
	{3, 3, 4},    // minor 7th b5
	{3, 4, 3, 4}, // minor 9th
	{4, 3, 2},    // 6th
	{4, 3, 3},    // 7th
	{4, 4, 2},    // 7th #5
	{4, 3, 3, 4}, // 9th
	{3, 3},       // dim
	{4, 4},       // augmented
	{2, 5},       // sus2
	{5, 2},       // sus4
	{4, 3, 3, 5}, // 7th #9 'Hendrix'
	{7},          // 5th 'power'
}

// Массив названий аккордов
var chordNames = []string{
	"major", "major 7th", "major 9th",
	"minor", "minor 6th", "minor 7th", "minor 7th b5", "minor 9th",
	"6th", "7th", "7th #5", "9th",
	"dim", "augmented", "sus2", "sus4", "7th #9 'Hendrix'", "5th 'power'",
}

// Наборы аккордов для жанров
var All = []int{0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18}
var Jass = []int{5, 7, 9, 12, 3, 10}
var Pop = []int{0, 1, 9, 8}
var Rock = []int{0, 1, 13, 10, 11}

var GenreMap = map[string][]int{
	"Jass": Jass,
	"Pop":  Pop,
	"Rock": Rock,
	"All":  All,
}

// Функция для поиска индекса ноты в массиве notes
func findScale(input string) int {
	for i, note := range notes {
		if input == note {
			return i
		}
	}
	return -1
}
