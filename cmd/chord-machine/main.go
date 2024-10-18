package main

import (
	"html/template"
	"log"
	"net/http"
	"os"
)

var tpl = template.Must(template.ParseFiles("web/index.html"))

func indexHandler(w http.ResponseWriter, r *http.Request) {
	tpl.Execute(w, nil)
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	mux := http.NewServeMux()

	fs := http.FileServer(http.Dir("web/src"))
	mux.Handle("/src/", http.StripPrefix("/src/", fs))

	mux.HandleFunc("/", indexHandler)

	log.Fatal(http.ListenAndServe(":"+port, mux))
}
