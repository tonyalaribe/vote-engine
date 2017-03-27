import m from 'mithril';
import {PositionModel} from '../models/index.js';
import Nav from '../components/nav.js'


var PositionPage = {
  Position:"",
  Key:"",
}

PositionPage.oncreate = function(vnode){

  let key = vnode.attrs.id
  console.log(key)
  PositionPage.Key = key
  PositionModel.GetPosition(key).then((resp)=>{
    let currentPosition = resp.Election.Positions.find((p)=>{
      console.log(p)
      console.log(key)
      return p.Key == key
    })
    console.log(currentPosition)
    PositionPage.Position = currentPosition.Title
    m.redraw()
  })
}


function addContestant(e){
  e.preventDefault()
  let name = document.getElementById("contestantInput").value
  document.getElementById("contestantInput").value = ""
  console.log(PositionPage.Key)
  console.log("key")
  PositionModel.NewCandidate(PositionPage.Key,name,PositionPage.Position)
}


PositionPage.view = function(){
  let contestants = PositionModel.Data.Contestants.map((c)=>{
    return m("p", m.trust(`>&nbsp;&nbsp;${c.Name}`))
  })
  return m("section.dt.w-100.vh-100.tc",
    m(Nav),
     m("div.dtc.v-mid",
      m("div.tl.100.w-50-ns.bg-white.pa4.dib.shadow-4",
        m("a[href=/admin].link.pa2.black.db.bg-near-white",{oncreate:m.route.link},"<  go back"),

        m("div",
          m("h2",`Position: ${PositionPage.Position}`),
          m("div"),
          m("div",
            m("h3.fw4",
              m("span.dib.bb.pa1","Candidates")
            ),
            contestants
          ),
          m("form.tc",
            {
              onsubmit:addContestant,
            },
            m("input[type=text][placeholder=add contestant].pa2",{id:"contestantInput"}),
            m("button.ph2.pv3.bg-navy.shadow-4.white-80.ml2.bw0",{type:"submit"},"submit")
          )
        )
      )
    )
  )
}



export default PositionPage;
