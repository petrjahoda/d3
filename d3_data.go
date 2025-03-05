package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type D3Data struct {
	Name   string
	Age    int
	Height float64
	Color  string
}

type D3DataResult struct {
	Data   []D3Data
	Result string
}

func d3Data(writer http.ResponseWriter, request *http.Request) {
	d3DataResult := D3DataResult{
		Result: "OK",
		Data: []D3Data{
			{"John", 22, 1.75, "hsla(355, 65%, 65%, 1.0)"},
			{"Emily", 25, 1.68, "hsla(120, 50%, 75%, 1.0)"},
			{"Michael", 30, 1.80, "hsla(200, 70%, 55%, 1.0)"},
			{"Sarah", 28, 1.65, "hsla(45, 85%, 67%, 1.0)"},
			{"Daniel", 35, 1.85, "hsla(300, 55%, 60%, 1.0)"},
			{"Anna", 23, 1.60, "hsla(25, 57%, 70%, 1.0)"},
			{"David", 40, 1.78, "hsla(180, 40%, 62%, 1.0)"},
			{"Sophia", 27, 1.70, "hsla(210, 67%, 68%, 1.0)"},
			{"James", 32, 1.82, "hsla(150, 33%, 72%, 1.0)"},
			{"Emma", 29, 1.62, "hsla(60, 90%, 69%, 1.0)"},
			{"Oliver", 31, 1.76, "hsla(95, 47%, 77%, 1.0)"},
			{"Isabella", 26, 1.64, "hsla(15, 77%, 65%, 1.0)"},
			{"Lucas", 38, 1.83, "hsla(235, 60%, 60%, 1.0)"},
			{"Mia", 24, 1.58, "hsla(280, 50%, 67%, 1.0)"},
			{"Benjamin", 34, 1.87, "hsla(350, 63%, 70%, 1.0)"},
			{"Charlotte", 22, 1.69, "hsla(190, 45%, 66%, 1.0)"},
			{"Ethan", 28, 1.74, "hsla(75, 50%, 55%, 1.0)"},
			{"Amelia", 25, 1.61, "hsla(330, 70%, 72%, 1.0)"},
			{"Alexander", 36, 1.85, "hsla(160, 53%, 65%, 1.0)"},
			{"Harper", 30, 1.71, "hsla(130, 72%, 68%, 1.0)"},
			{"William", 41, 1.79, "hsla(50, 85%, 59%, 1.0)"},
			{"Luna", 33, 1.66, "hsla(205, 65%, 61%, 1.0)"},
			{"Elijah", 21, 1.82, "hsla(285, 44%, 74%, 1.0)"},
			{"Aria", 29, 1.60, "hsla(10, 60%, 69%, 1.0)"},
			{"Henry", 37, 1.80, "hsla(300, 42%, 58%, 1.0)"},
			{"Grace", 26, 1.68, "hsla(230, 75%, 76%, 1.0)"},
			{"Noah", 39, 1.78, "hsla(390, 35%, 66%, 1.0)"},
			{"Ava", 31, 1.63, "hsla(100, 50%, 71%, 1.0)"},
			{"Sebastian", 28, 1.86, "hsla(340, 65%, 57%, 1.0)"},
			{"Sofia", 24, 1.70, "hsla(70, 78%, 64%, 1.0)"},
		},
	}
	writer.Header().Set("Content-Type", "application/json")
	err := json.NewEncoder(writer).Encode(d3DataResult)
	if err != nil {
		fmt.Println(err.Error())
	}
}
