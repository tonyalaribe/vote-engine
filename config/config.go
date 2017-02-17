package config

import (
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"runtime"

	mgo "gopkg.in/mgo.v2"
)

//Conf nbfmjh
type Conf struct {
	MongoDB                string
	MongoServer            string
	Database               *mgo.Database
	PasswordEncryptionCost int
	Encryption             struct {
		Private []byte
		Public  []byte
	}
}

var (
	config     Conf
	_, b, _, _ = runtime.Caller(0)
	basepath   = filepath.Dir(b)
)

const (
	ELECTION_COLLECTION    = "election_collection"
	CONTESTANTS_COLLECTION = "contestants_collection"
)

func Init() {
	MONGOSERVER := os.Getenv("MONGO_URL")
	MONGODB := os.Getenv("MONGODB")
	if MONGOSERVER == "" {
		log.Println("No mongo server address set, resulting to default address")
		MONGOSERVER = "127.0.0.1:27017"
		MONGODB = "voting_db"
	}

	session, err := mgo.Dial(MONGOSERVER)
	if err != nil {
		log.Println(err)
	}
	log.Println(session)

	config = Conf{
		MongoDB:                MONGODB,
		MongoServer:            MONGOSERVER,
		Database:               session.DB(MONGODB),
		PasswordEncryptionCost: 10,
	}

	config.Encryption.Public, err = ioutil.ReadFile("./config/encryption_keys/public.pem")
	if err != nil {
		log.Println("Error reading public key")
		log.Println(err)
		return
	}

	config.Encryption.Private, err = ioutil.ReadFile("./config/encryption_keys/private.pem")
	if err != nil {
		log.Println("Error reading private key")
		log.Println(err)
		return
	}

	log.Printf("mongoserver %s", MONGOSERVER)
}

func Get() *Conf {
	return &config
}
