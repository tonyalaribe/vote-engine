package main

import (
	"encoding/csv"
	"log"
	"net/http"
)

type Voter struct {
	ID       string `bson:"_id"`
	Passcode string
}

func AddVotersFromCSV(w http.ResponseWriter, r *http.Request) {
	//users := []Voter
	var usersCSV [][]string
	usersCSV, err := csv.NewReader(r.Body).ReadAll()
	log.Printf("%+v", usersCSV)
	if err != nil {
		log.Println(usersCSV)
	}
}
