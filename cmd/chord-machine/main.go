package main

import (
	"chord-machine/internal/chord"
	"fmt"
	"log"
	"net/http"
	"text/template"
)

var tpl = template.Must(template.ParseFiles("web/index.html"))

func indexHandler(w http.ResponseWriter, r *http.Request) {
	tpl.Execute(w, nil)
}

func test() {
	key := "C"
	scale := "major"
	instrument := "piano"
	genre := chord.Rock
	lengths := []float64{1.0, 0.5, 0.5, 1.0}

	possibleChords, currentScale := chord.GeneratePossibleChords(key, scale, instrument, genre)
	progression := chord.GenerateProgression(possibleChords, lengths, instrument)

	fmt.Println("Current Scale:", currentScale)
	fmt.Println("Possible Chords:", possibleChords)
	fmt.Println("Chord Progression:")
	for _, chord := range progression {
		fmt.Printf("Chord: %s, Notes: %v\n", chord.Name, chord.Notes)
	}
}

func main() {
	test()

	port := "8080"

	mux := http.NewServeMux()

	fs := http.FileServer(http.Dir("web/src"))
	mux.Handle("/src/", http.StripPrefix("/src/", fs))

	mux.HandleFunc("/", indexHandler)

	log.Fatal(http.ListenAndServe(":"+port, mux))
}
