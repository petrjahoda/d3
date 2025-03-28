package main

import (
	"fmt"
	"html/template"
	"net/http"
	"os"
)

func main() {
	//convertImage()
	http.Handle("/html/", http.StripPrefix("/html/", http.FileServer(http.Dir("html"))))
	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("css"))))
	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("js"))))
	http.Handle("/svg/", http.StripPrefix("/svg/", http.FileServer(http.Dir("svg"))))
	http.Handle("/font/", http.StripPrefix("/font/", http.FileServer(http.Dir("font"))))
	http.HandleFunc("/", home)
	http.HandleFunc("/d3_bar_chart_data", d3BarChartData)
	http.HandleFunc("/d3_stacked_chart_data", d3StackedChartData)
	http.HandleFunc("/d3_line_chart_data", d3LineChartData)

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		os.Exit(-1)
	}
}

func home(writer http.ResponseWriter, request *http.Request) {
	tmpl := template.Must(template.ParseFiles("./html/home.html"))
	err := tmpl.Execute(writer, nil)
	if err != nil {
		return
	}
	fmt.Println("home page loaded")
}
