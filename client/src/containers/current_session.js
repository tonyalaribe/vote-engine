import m from 'mithril';
const BACKEND_URL = "http://localhost:8080";
import {ElectionModel} from '../models/index.js';


var CurrentSession = {
  oncreate: function(vnode) {
    ElectionModel.GetDetails()
  },
  view:function(){
    let positions = ElectionModel.Data.Positions.map(function(position){
      return m("a.db.pa2.link.black",{href: `/position/${position.Key}`}, position.Title)
    })
    return m("section.dt.w-100.vh-100.tc",
     m("div.dtc.v-mid",
      m("div.tl.w-50.bg-white.pa4.dib",
        m("h2","Current Session"),
        m("div",
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
        )
      )
    )
    )
  }
}

export default CurrentSession;
