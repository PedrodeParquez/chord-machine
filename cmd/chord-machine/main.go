package main

import (
	"chord-machine/internal/chord"
	"encoding/json"
	"log"
	"net/http"
	"text/template"
)

var tpl = template.Must(template.ParseFiles("web/index.html"))

func indexHandler(w http.ResponseWriter, r *http.Request) {
	tpl.Execute(w, nil)
}

func generateHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	key := r.FormValue("key")
	scale := r.FormValue("scale")
	instrument := r.FormValue("instrument")
	genreName := r.FormValue("genre")

	genre := chord.GenreMap[genreName]

	possibleChords := chord.GeneratePossibleChords(key, scale, instrument, genre)

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(possibleChords); err != nil {
		log.Println("Error encoding JSON:", err)
		http.Error(w, "Error encoding JSON", http.StatusInternalServerError)
	}
}

func main() {
	port := "8080"

	mux := http.NewServeMux()

	fs := http.FileServer(http.Dir("web/src"))
	mux.Handle("/src/", http.StripPrefix("/src/", fs))

	mux.HandleFunc("/", indexHandler)
	mux.HandleFunc("/generate", generateHandler)

	log.Println("Server started at http://localhost:" + port)
	log.Fatal(http.ListenAndServe(":"+port, mux))
}
