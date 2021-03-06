package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/julienschmidt/httprouter"
	"github.com/justinas/alice"
	"github.com/rs/cors"
	"github.com/tonyalaribe/voting_server/config"
)

// Router struct would carry the httprouter instance, so its methods could be verwritten and replaced with methds with wraphandler
type Router struct {
	*httprouter.Router
}

// Get is an endpoint to only accept requests of method GET
func (r *Router) Get(path string, handler http.Handler) {
	r.GET(path, wrapHandler(handler))
}

// Post is an endpoint to only accept requests of method POST
func (r *Router) Post(path string, handler http.Handler) {
	r.POST(path, wrapHandler(handler))
}

// Put is an endpoint to only accept requests of method PUT
func (r *Router) Put(path string, handler http.Handler) {
	r.PUT(path, wrapHandler(handler))
}

// Delete is an endpoint to only accept requests of method DELETE
func (r *Router) Delete(path string, handler http.Handler) {
	r.DELETE(path, wrapHandler(handler))
}

// NewRouter is a wrapper that makes the httprouter struct a child of the router struct
func NewRouter() *Router {
	return &Router{httprouter.New()}
}

func wrapHandler(h http.Handler) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		ctx := context.WithValue(r.Context(), "params", ps)
		r = r.WithContext(ctx)
		h.ServeHTTP(w, r)
	}
}

func init() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)
}

func main() {
	config.Init()
	router := NewRouter()
	commonHandlers := alice.New()

	router.Post("/api/new_session", commonHandlers.ThenFunc(NewSessionHandler))
	router.Get("/api/get_session", commonHandlers.ThenFunc(GetSessionHandler))
	router.Get("/api/end_session", commonHandlers.ThenFunc(EndSessionHandler))

	router.Get("/api/new_contestant", commonHandlers.ThenFunc(AddContestantHandler))
	router.Get("/api/get_position", commonHandlers.ThenFunc(GetPositionHandler))

	router.Get("/api/start_voting", commonHandlers.ThenFunc(StartVotingHandler))
	router.Get("/api/end_voting", commonHandlers.ThenFunc(EndVotingHandler))

	router.Post("/api/add_voters", commonHandlers.ThenFunc(AddVotersFromCSV))
	router.Post("/api/voter_login", commonHandlers.ThenFunc(VoterLogin))
	router.Post("/api/cast_vote", commonHandlers.ThenFunc(CastVoteHandler))

	router.Get("/api/has_not_voted", commonHandlers.ThenFunc(HasVotedHandler))

	router.Get("/api/election_details", commonHandlers.ThenFunc(GetPreVotingDetailsHandler))

	fileServer := http.FileServer(http.Dir("./client/public"))
	router.GET("/public/*filepath", func(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
		//w.Header().Set("Vary", "Accept-Encoding")
		///w.Header().Set("Cache-Control", "public, max-age=7776000")
		r.URL.Path = p.ByName("filepath")
		fileServer.ServeHTTP(w, r)
	})

	router.NotFound = commonHandlers.ThenFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./client/public/index.html")
	})

	PORT := os.Getenv("PORT")
	if PORT == "" {
		log.Println("No Global port has been defined, using default")
		PORT = "8080"
	}

	handler := cors.New(cors.Options{
		//		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "DELETE"},
		AllowCredentials: true,
		AllowedHeaders:   []string{"Accept", "Content-Type", "X-Auth-Token", "*"},
		Debug:            false,
	}).Handler(router)
	log.Println("serving ")
	log.Fatal(http.ListenAndServe(":"+PORT, handler))

}
