package main

import (
	"encoding/csv"
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"gopkg.in/mgo.v2/bson"

	"github.com/tonyalaribe/voting_server/config"
)

type Voter struct {
	ID       string `bson:"_id"`
	Name     string
	Password string
}

func AddVotersFromCSV(w http.ResponseWriter, r *http.Request) {
	var usersCSV [][]string
	usersCSV, err := csv.NewReader(r.Body).ReadAll()
	log.Printf("%+v", usersCSV)
	if err != nil {
		log.Println(err)
	}

	conf := config.Get()
	mgoSession := conf.Database.Session.Copy()
	defer mgoSession.Close()

	collection := conf.Database.C(config.VOTERS_COLLECTION).With(mgoSession)

	bulk := collection.Bulk()

	for _, v := range usersCSV {
		bulk.Insert(Voter{
			ID:       strings.TrimSpace(v[0]),
			Name:     strings.TrimSpace(v[1]),
			Password: "password",
		})
	}

	_, err = bulk.Run()
	if err != nil {
		log.Println(err)
	}

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

func VoterLogin(w http.ResponseWriter, r *http.Request) {
	voter := Voter{}
	retrievedVoter := Voter{}
	err := json.NewDecoder(r.Body).Decode(&voter)
	if err != nil {
		log.Println(err)
	}

	conf := config.Get()
	mgoSession := conf.Database.Session.Copy()
	defer mgoSession.Close()

	collection := conf.Database.C(config.VOTERS_COLLECTION).With(mgoSession)
	err = collection.Find(bson.M{
		"_id": voter.ID,
	}).One(&retrievedVoter)

	type Message struct {
		Message string
		Error   error
		Code    int
	}

	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(Message{
			Message: "unsuccessful",
			Error:   err,
			Code:    http.StatusInternalServerError,
		})
		return
	}

	if voter.Password != retrievedVoter.Password {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(Message{
			Message: "Wrong Password",
			Code:    http.StatusInternalServerError,
		})
		return
	}

	log.Println(err)
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(Message{
		Message: "Login Success",
		Code:    http.StatusOK,
	})
	return

}

func GetPreVotingDetailsHandler(w http.ResponseWriter, r *http.Request) {
	conf := config.Get()

	election := Election{}

	mgoSession := conf.Database.Session.Copy()
	defer mgoSession.Close()

	collection := conf.Database.C(config.ELECTION_COLLECTION).With(mgoSession)

	err := collection.Find(bson.M{
		"id": "election",
	}).One(&election)
	if err != nil {
		log.Println(err)
	}

	contestantsCollection := conf.Database.C(config.CONTESTANTS_COLLECTION).With(mgoSession)

	type responseObj struct {
		Key         int
		Title       string
		Contestants []Contestant
	}

	responseMap := map[int]responseObj{}

	for _, v := range election.Positions {
		currentContestants := []Contestant{}
		contestantsCollection.Find(bson.M{
			"key": v.Key,
		}).All(&currentContestants)

		responseMap[v.Key] = responseObj{
			Key:         v.Key,
			Title:       v.Title,
			Contestants: currentContestants,
		}
	}

	log.Println(responseMap)

	responseArray := []responseObj{}
	for i := 0; i < len(responseMap); i++ {
		responseArray = append(responseArray, responseMap[i+1])
	}

	err = json.NewEncoder(w).Encode(responseArray)
	if err != nil {
		log.Println(err)
	}
}
