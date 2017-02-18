var m = require("mithril")

import LoginPage from './containers/login.js'
import VotePage from './containers/vote_page.js'
import ResultsPage from './containers/results_page.js'
import NewVotingSessionPage from './containers/new_voting_session_page.js'
import CurrentSession from './containers/current_session.js'
import PositionPage from './containers/position_page.js'
import {VoterAuth, AdminAuth} from './components/auth.js'

import HomePage from './containers/home_page.js'
import AddVotersPage from './containers/add_voters_page.js'


m.route.prefix("")
m.route(document.getElementById('appContent'), "/", {
  "/":HomePage,
  "/login": LoginPage, // defines `http://localhost/#!/home`
  "/vote":VotePage,
  "/results":ResultsPage,
  "/admin":{
        view: function(vnode) {
            return m(AdminAuth,vnode.attrs,m(CurrentSession,vnode.attrs))
        },
      },
  "/new_session":{
        view: function(vnode) {
            return m(AdminAuth,vnode.attrs,m(NewVotingSessionPage,vnode.attrs))
        },
      },
  "/add_voters":{
        view: function(vnode) {
            return m(AdminAuth,vnode.attrs,m(AddVotersPage,vnode.attrs))
        },
      },
  "/position/:id":{
        view: function(vnode) {
            return m(AdminAuth,vnode.attrs,m(PositionPage,vnode.attrs))
        },
      },
});
