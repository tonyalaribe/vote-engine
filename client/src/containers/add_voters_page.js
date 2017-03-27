import m from 'mithril';
import Nav from '../components/nav.js'

import {ElectionModel} from '../models/index.js'


var AddVotersPage = {}

AddVotersPage.view = function(){
  return m("section.dt.w-100.vh-100.tc",
     m(Nav),
     m("div.dtc.v-mid",
      m("div.tl.w-50.bg-white.dib.shadow-4.pa4",
        m("p",`Please add one user per line, as comma separated values in the format "UserID(Matric No), Name of User". The password would be sent to the user via text message`),
        m("textarea.w-100.vh-50[id=voterscsv]"),
        m("div.tc.pv3",
          m("button.pa3.bw0.shadow-4.bg-navy.white-80",{onclick:ElectionModel.SubmitVoters},"Submit Voters")
        )
      )
    )
  )
}

export default AddVotersPage;
