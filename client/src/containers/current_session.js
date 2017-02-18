import m from 'mithril';
const BACKEND_URL = "http://localhost:8080";
import {ElectionModel} from '../models/index.js';
import Nav from '../components/nav.js'

var CurrentSession = {}

CurrentSession.oncreate = function(vnode) {
  console.log("on create")
  ElectionModel.GetDetails()
}

CurrentSession.view = function(){
  let positions
  if(ElectionModel.IsElectionSession){
    positions = ElectionModel.Data.Positions.map(function(position){
      return m("a.link.pa2.black.db.bg-near-white.mv2",{href: `/position/${position.Key}`}, position.Title)
    })
  }
  return m("section.dt.w-100.vh-100.tc",
   m(Nav),
   m("div.dtc.v-mid",
    m("div.tl.w-50.bg-white.dib.shadow-4",
      ElectionModel.IsElectionSession?
      m("div.pa4",
        m("h2","Current Session"),
        m("div",
          m("p",`Name: ${ElectionModel.Data.ElectionName}`),
          m("p",`Type: ${ElectionModel.Data.ElectionType}`)
        ),
        m("div",
          m("h3","Positions"),
          m("div",
            positions
          )
        )
      ):"",
      ElectionModel.IsElectionSession?m("div.pa4.bg-near-white.cf",
        m("span","total registered voters: 200"),
        m("a.dib.fr.pa2.bg-dark-gray.white[href=/add_voters]",{oncreate:m.route.link},"add users")
      ):"",
      m("div.tc.pa4",
        ElectionModel.IsElectionSession?
        [ElectionModel.Data.RunningElection?
          m("button.pa3.ma1",{onclick:ElectionModel.EndVoting},"End Election")
          :[
            m("button.pa3.ma1",{onclick:ElectionModel.StartVoting},"Commence Voting"),
            m("button.pa3.ma1",{onclick:ElectionModel.EndElectionSession},"End Election Session")
          ]
        ]
        :
        m("a[href=/new_session].pa3.ma1.link.shadow-4.bg-navy.white.dim",
          {
            oncreate:m.route.link
          },
          "Start Election Session")
      )
    )
  )
  )
}

export default CurrentSession;
