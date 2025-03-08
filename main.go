package main

import (
	"fmt"
	"golang.org/x/image/draw"
	"html/template"
	"image"
	"image/jpeg"
	"image/png"
	"net/http"
	"os"
	"strings"
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
	http.HandleFunc("/d3_line_chart_data", d3LineChartData)
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		os.Exit(-1)
	}
}

func convertImage() {
	var src image.Image
	var outFile *os.File
	inFile, err := os.Open("input.png")
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	err = inFile.Close()
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	if strings.HasSuffix(inFile.Name(), ".jpg") {
		src, _, err = image.Decode(inFile)
		if err != nil {
			fmt.Println(err.Error())
			return
		}
		dst := image.NewRGBA(image.Rect(0, 0, src.Bounds().Dx()/2, src.Bounds().Dy()/2))
		draw.CatmullRom.Scale(dst, dst.Rect, src, src.Bounds(), draw.Over, nil)
		outFile, err = os.Create("output.jpg")
		if err != nil {
			fmt.Println(err.Error())
			return
		}
		err = outFile.Close()
		if err != nil {
			fmt.Println(err.Error())
			return
		}
		err = jpeg.Encode(outFile, dst, nil)
		if err != nil {
			fmt.Println(err.Error())
			return
		}
	} else if strings.HasSuffix(inFile.Name(), ".png") {
		src, _, err = image.Decode(inFile)
		if err != nil {
			fmt.Println(err.Error())
			return
		}
		dst := image.NewRGBA(image.Rect(0, 0, src.Bounds().Dx()/2, src.Bounds().Dy()/2))
		draw.CatmullRom.Scale(dst, dst.Rect, src, src.Bounds(), draw.Over, nil)
		outFile, err = os.Create("output.png")
		if err != nil {
			fmt.Println(err.Error())
			return
		}
		err = outFile.Close()
		if err != nil {
			fmt.Println(err.Error())
			return
		}

		err = png.Encode(outFile, dst)
		if err != nil {
			fmt.Println(err.Error())
			return
		}
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
