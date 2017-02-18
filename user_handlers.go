package main

import (
	"encoding/csv"
	"encoding/json"
	"log"
	"net/http"

	"github.com/tonyalaribe/voting_server/config"
)

type Voter struct {
	ID       string `bson:"_id"`
	Name     string
	Password string
}

func AddVotersFromCSV(w http.ResponseWriter, r *http.Request) {
	voters := []Voter{}
	var usersCSV [][]string
	usersCSV, err := csv.NewReader(r.Body).ReadAll()
	log.Printf("%+v", usersCSV)
	if err != nil {
		log.Println(usersCSV)
	}
	for _, v := range usersCSV {
		voters = append(voters, Voter{
			ID:       v[0],
			Name:     v[1],
			Password: "password",
		})
	}
	conf := config.Get()
	mgoSession := conf.Database.Session.Copy()
	defer mgoSession.Close()

	collection := conf.Database.C(config.VOTERS_COLLECTION).With(mgoSession)
	collection.Bulk().Insert(voters)

	message := struct {
		Message string
	}{
		Message: "Voters added successfully",
	}
	err = json.NewEncoder(w).Encode(message)
	if err != nil {
		log.Println(err)
	}
}
