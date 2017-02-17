var m = require("mithril")

import LoginPage from './containers/login.js'
import VotePage from './containers/vote_page.js'
import ResultsPage from './containers/results_page.js'
import NewVotingSessionPage from './containers/new_voting_session_page.js'
import AdminPage from './containers/admin_page.js'
import CurrentSession from './containers/current_session.js'
import PositionPage from './containers/position_page.js'
import Auth from './components/auth.js'

m.route.prefix("")
m.route(document.getElementById('appContent'), "/login", {
  "/login": LoginPage, // defines `http://localhost/#!/home`
  "/vote":VotePage,
  "/results":ResultsPage,
  "/admin":{
        view: function(vnode) {
            return m(Auth,vnode.attrs,m(AdminPage))
        },
      },
  "/new_session":{
        view: function(vnode) {
            return m(Auth,vnode.attrs,m(NewVotingSessionPage))
        },
      },
  "/current_session":{
        view: function(vnode) {
            return m(Auth,vnode.attrs,m(CurrentSession))
        },
      },
  "/position/:id":{
        onmatch:function(){
          console.log("in auth x")
          let auth = localStorage.getItem("auth")
          console.log(auth)
          return PositionPage
        }
      },
});
