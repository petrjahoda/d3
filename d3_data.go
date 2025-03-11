package main

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"sort"
	"time"
)

type D3BarData struct {
	Name   string
	Age    int
	Height float64
	Color  string
}

type D3BarDataResult struct {
	Data   []D3BarData
	Result string
}

type D3LineData struct {
	Time  uint32
	Value float32
}

type D3LineDataResult struct {
	Data  []D3LineData
	Name  string
	Value string
}

type StackedData struct {
	Name   string
	Values []Value
}

type Value struct {
	Key   string
	Value float32
}

func d3BarChartData(writer http.ResponseWriter, request *http.Request) {
	d3DataResult := D3BarDataResult{
		Result: "OK",
		Data: []D3BarData{
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
	sort.Slice(d3DataResult.Data, func(i, j int) bool {
		return d3DataResult.Data[i].Age > d3DataResult.Data[j].Age
	})
	writer.Header().Set("Content-Type", "application/json")
	err := json.NewEncoder(writer).Encode(d3DataResult)
	if err != nil {
		fmt.Println(err.Error())
	}
}

func d3StackedChartData(writer http.ResponseWriter, request *http.Request) {
	d3StackedData := []StackedData{
		{"CNC-1", []Value{
			{"2025-01-01", 10.23},
			{"2025-01-02", 29.44},
			{"2025-01-03", 18.95},
			{"2025-01-04", 21.67},
			{"2025-01-05", 24.81},
			{"2025-01-06", 26.52},
			{"2025-01-07", 19.34},
			{"2025-01-08", 22.76},
			{"2025-01-09", 23.45},
			{"2025-01-10", 25.87},
			{"2025-01-11", 20.63},
			{"2025-01-12", 27.34},
		}},

		{"CNC-2", []Value{
			{"2025-01-01", 15.32},
			{"2025-01-02", 18.27},
			{"2025-01-03", 22.41},
			{"2025-01-04", 24.15},
			{"2025-01-05", 19.83},
			{"2025-01-06", 21.67},
			{"2025-01-07", 20.56},
			{"2025-01-08", 23.12},
			{"2025-01-09", 25.76},
			{"2025-01-10", 18.94},
			{"2025-01-11", 20.23},
			{"2025-01-12", 22.78},
		}},

		{"CNC-3", []Value{
			{"2025-01-01", 12.45},
			{"2025-01-02", 14.67},
			{"2025-01-03", 19.78},
			{"2025-01-04", 23.41},
			{"2025-01-05", 20.56},
			{"2025-01-06", 18.29},
			{"2025-01-07", 24.78},
			{"2025-01-08", 22.34},
			{"2025-01-09", 26.45},
			{"2025-01-10", 21.68},
			{"2025-01-11", 19.89},
			{"2025-01-12", 25.23},
		}},
	}
	writer.Header().Set("Content-Type", "application/json")
	err := json.NewEncoder(writer).Encode(d3StackedData)
	if err != nil {
		fmt.Println(err.Error())
	}
}

func d3LineChartData(writer http.ResponseWriter, request *http.Request) {
	oneYearData := 3000000
	//oneYearData := 30
	initialDate := time.Date(2025, 1, 1, 0, 0, 0, 0, time.UTC)
	d3LineData := make([]D3LineData, oneYearData)
	for i := 0; i < oneYearData; i++ {
		d3LineData[i] = D3LineData{uint32(initialDate.Unix()), float32(rand.Float64() * 100)}
		initialDate = initialDate.Add(10 * time.Second)
	}
	d3DataResult := D3LineDataResult{
		Name:  "Temperature",
		Value: "Celsius",
		Data:  d3LineData,
	}
	writer.Header().Set("Content-Type", "application/json")
	err := json.NewEncoder(writer).Encode(d3DataResult)
	if err != nil {
		fmt.Println(err.Error())
	}
}
