package main

import (
	"encoding/csv"
	"encoding/json"
	"log"
	"math/rand"
	"net/http"
	"strings"

	"gopkg.in/mgo.v2/bson"

	"github.com/tonyalaribe/voting_server/config"
)

type Voter struct {
	ID       string `bson:"_id"`
	Phone    string
	Password string
	HasVoted bool
}

const letterBytes = "abcdefghijklmnopqrstuvwxyz"

func RandStringBytes(n int) string {
	b := make([]byte, n)
	for i := range b {
		b[i] = letterBytes[rand.Intn(len(letterBytes))]
	}
	return string(b)
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

		password := RandStringBytes(5)

		bulk.Insert(Voter{
			ID:       strings.TrimSpace(v[0]),
			Phone:    strings.TrimSpace(v[1]),
			Password: password,
		})

		resp, err := http.Get("http://www.bulksmsnigeria.net/components/com_spc/smsapi.php?username=anthonyalaribe@gmail.com&password=irhose&sender=voter&recipient=" + strings.TrimSpace(v[1]) + "&message=Hello,+Your+password+to+allow+you+vote+is+" + password + "&")

		p := []byte{}
		resp.Body.Read(p)
		log.Println(p)

		if err != nil {
			log.Println(err)
		}

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

	type Message struct {
		Message  string
		Error    error
		Code     int
		HasVoted bool
	}

	election := Election{}

	collection2 := conf.Database.C(config.ELECTION_COLLECTION).With(mgoSession)

	err = collection2.Find(bson.M{
		"id": "election",
	}).One(&election)
	if err != nil {
		log.Println(err)
	}

	if !election.RunningElection {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(Message{
			Message: "Please Voting is yet to Begin",
			Error:   err,
			Code:    http.StatusInternalServerError,
		})
		return
	}

	collection := conf.Database.C(config.VOTERS_COLLECTION).With(mgoSession)
	err = collection.Find(bson.M{
		"_id": voter.ID,
	}).One(&retrievedVoter)

	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(Message{
			Message: "This account does not exist in our Database ",
			Error:   err,
			Code:    http.StatusInternalServerError,
		})
		return
	}
	//
	// log.Printf("voter: %+v , retrievedVoter: %+v", voter, retrievedVoter)

	if strings.TrimSpace(voter.Password) != strings.TrimSpace(retrievedVoter.Password) {

		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(Message{
			Message: "Incorrect Passowrd",
			Code:    http.StatusInternalServerError,
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(Message{
		Message:  "Login Success",
		Code:     http.StatusOK,
		HasVoted: retrievedVoter.HasVoted,
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
		Votes       int
		Contestants []Contestant
	}

	responseMap := map[int]responseObj{}

	for _, v := range election.Positions {
		currentContestants := []Contestant{}
		contestantsCollection.Find(bson.M{
			"key": v.Key,
		}).All(&currentContestants)

		log.Printf("%+v", currentContestants)
		responseMap[v.Key] = responseObj{
			Key:         v.Key,
			Title:       v.Title,
			Contestants: currentContestants,
		}
	}

	responseArray := []responseObj{}
	for i := 0; i < len(responseMap); i++ {
		responseArray = append(responseArray, responseMap[i+1])
	}

	err = json.NewEncoder(w).Encode(responseArray)
	if err != nil {
		log.Println(err)
	}
}

func CastVoteHandler(w http.ResponseWriter, r *http.Request) {
	user := r.URL.Query().Get("user")
	log.Println(user)

	conf := config.Get()

	voter := Voter{}

	mgoSession := conf.Database.Session.Copy()
	defer mgoSession.Close()

	collection := conf.Database.C(config.VOTERS_COLLECTION).With(mgoSession)

	err := collection.Find(bson.M{
		"_id": user,
	}).One(&voter)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusNotAcceptable)
		json.NewEncoder(w).Encode(Message{
			Message: "Has already Voted",
			Code:    http.StatusNotAcceptable,
		})
		return
	}

	if voter.HasVoted {
		w.WriteHeader(http.StatusNotAcceptable)
		json.NewEncoder(w).Encode(Message{
			Message: "Has already Voted",
			Code:    http.StatusNotAcceptable,
		})
		return
	}

	voteData := map[int]string{}
	err = json.NewDecoder(r.Body).Decode(&voteData)
	if err != nil {
		log.Println(err)
	}

	contestantsCollection := conf.Database.C(config.CONTESTANTS_COLLECTION).With(mgoSession)

	for k, v := range voteData {
		log.Println(k)
		log.Println(v)

		err := contestantsCollection.Update(
			bson.M{
				"_id": bson.ObjectIdHex(v),
			}, bson.M{
				"$inc": bson.M{
					"votes": 1,
				},
			})

		if err != nil {
			log.Println(err)
		}
	}

	err = collection.Update(
		bson.M{
			"_id": user,
		},
		bson.M{
			"$set": bson.M{
				"hasvoted": true,
			},
		})

	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusNotAcceptable)
		json.NewEncoder(w).Encode(Message{
			Message: "Has already Voted",
			Code:    http.StatusNotAcceptable,
		})
		return
	}

}

func HasVotedHandler(w http.ResponseWriter, r *http.Request) {
	user := r.URL.Query().Get("user")
	log.Println(user)

	conf := config.Get()

	voter := Voter{}

	mgoSession := conf.Database.Session.Copy()
	defer mgoSession.Close()

	collection := conf.Database.C(config.VOTERS_COLLECTION).With(mgoSession)

	err := collection.Find(bson.M{
		"_id": user,
	}).One(&voter)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(Message{
			Message: "Has not Voted",
			Code:    http.StatusNotAcceptable,
		})
		return
	}

	if voter.HasVoted {
		w.WriteHeader(http.StatusNotAcceptable)
		json.NewEncoder(w).Encode(Message{
			Message: "Has already Voted",
			Code:    http.StatusNotAcceptable,
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(Message{
		Message: "Has not Voted",
		Code:    http.StatusNotAcceptable,
	})
}
