package utils

// Функция для проверки наличия строки в срезе строк
func Contains(slice []string, value string) bool {
	for _, v := range slice {
		if v == value {
			return true
		}
	}
	return false
}

// Функция для проверки наличия целого числа в срезе целых чисел
func ContainsInt(slice []int, value int) bool {
	for _, v := range slice {
		if v == value {
			return true
		}
	}
	return false
}

// Функция для проверки, что все значения в срезе булевых значений истинны
func AllTrue(slice []bool) bool {
	for _, v := range slice {
		if !v {
			return false
		}
	}
	return true
}
