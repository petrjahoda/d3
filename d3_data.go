package main

import (
	"encoding/json"
	"fmt"
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
	Time  time.Time
	Value float32
}

type D3LineDataResult struct {
	Data  []D3LineData
	Name  string
	Value string
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

func d3LineChartData(writer http.ResponseWriter, request *http.Request) {
	d3DataResult := D3LineDataResult{
		Name:  "Temperature",
		Value: "Celsius",
		Data: []D3LineData{
			{time.Date(2025, 1, 1, 0, 0, 0, 0, time.UTC), 36.02},
			{time.Date(2025, 1, 1, 0, 0, 10, 0, time.UTC), 36.11},
			{time.Date(2025, 1, 1, 0, 0, 20, 0, time.UTC), 36.02},

			{time.Date(2025, 1, 1, 0, 0, 30, 0, time.UTC), 36.15},
			{time.Date(2025, 1, 1, 0, 0, 40, 0, time.UTC), 36.10},
			{time.Date(2025, 1, 1, 0, 0, 50, 0, time.UTC), 36.08},
			{time.Date(2025, 1, 1, 0, 1, 0, 0, time.UTC), 36.12},
			{time.Date(2025, 1, 1, 0, 1, 10, 0, time.UTC), 26.14},
			{time.Date(2025, 1, 1, 0, 1, 20, 0, time.UTC), 36.07},
			{time.Date(2025, 1, 1, 0, 1, 30, 0, time.UTC), 36.13},
			{time.Date(2025, 1, 1, 0, 1, 40, 0, time.UTC), 36.09},
			{time.Date(2025, 1, 1, 0, 1, 50, 0, time.UTC), 36.04},
			{time.Date(2025, 1, 1, 0, 2, 0, 0, time.UTC), 36.16},
			{time.Date(2025, 1, 1, 0, 2, 10, 0, time.UTC), 16.11},
			{time.Date(2025, 1, 1, 0, 2, 20, 0, time.UTC), 36.05},
			{time.Date(2025, 1, 1, 0, 2, 30, 0, time.UTC), 36.14},
			{time.Date(2025, 1, 1, 0, 2, 40, 0, time.UTC), 36.08},
			{time.Date(2025, 1, 1, 0, 2, 50, 0, time.UTC), 36.07},
			{time.Date(2025, 1, 1, 0, 3, 0, 0, time.UTC), 36.12},
			{time.Date(2025, 1, 1, 0, 3, 10, 0, time.UTC), 0},
			{time.Date(2025, 1, 1, 0, 3, 20, 0, time.UTC), 0},
			{time.Date(2025, 1, 1, 0, 3, 30, 0, time.UTC), 0},
			{time.Date(2025, 1, 1, 0, 3, 40, 0, time.UTC), 0},
			{time.Date(2025, 1, 1, 0, 3, 50, 0, time.UTC), 0},
			{time.Date(2025, 1, 1, 0, 4, 0, 0, time.UTC), 0},
			{time.Date(2025, 1, 1, 0, 4, 10, 0, time.UTC), 36.05},
			{time.Date(2025, 1, 1, 0, 4, 20, 0, time.UTC), 36.06},
			{time.Date(2025, 1, 1, 0, 4, 30, 0, time.UTC), 36.14},
			{time.Date(2025, 1, 1, 0, 4, 40, 0, time.UTC), 36.12},
			{time.Date(2025, 1, 1, 0, 4, 50, 0, time.UTC), 36.09},
			{time.Date(2025, 1, 1, 0, 5, 0, 0, time.UTC), 36.15},
		},
	}
	writer.Header().Set("Content-Type", "application/json")
	err := json.NewEncoder(writer).Encode(d3DataResult)
	if err != nil {
		fmt.Println(err.Error())
	}
}
