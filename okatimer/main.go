package okatimer

import(
	"net/http"
	"text/template"
	"fmt"
)

func init() {
	http.HandleFunc("/", start)
}

func start(w http.ResponseWriter, r *http.Request) {
	tmpl,err := template.ParseFiles("index.html")
	if err != nil {
		fmt.Fprintf(w, err.Error())
	}
	tmpl.Execute(w, make(map[string]string))
}
