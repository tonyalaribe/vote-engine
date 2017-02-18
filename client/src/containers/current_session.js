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
    m("div.tl.w-50.bg-white.pa4.dib.shadow-4",
      ElectionModel.IsElectionSession?
      m("div",
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
      m("div.tc.pv4",
        ElectionModel.IsElectionSession?
        [ElectionModel.Data.RunningElection?
          m("button.pa3.ma1","End Election")
          :[
            m("button.pa3.ma1","Commence Election"),
            m("button.pa3.ma1","End Election Session")
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
