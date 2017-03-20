import m from 'mithril';
import {ElectionModel} from '../models/index.js';
import Nav from '../components/nav.js';

var NewVotingSessionPage = {}

NewVotingSessionPage.oncreate = function(){
    ElectionModel.Data.contestants = 0
    ElectionModel.Data.Positions = []

}

NewVotingSessionPage.increment = function(e){
    e.preventDefault()
    ElectionModel.Data.contestants++
  }

NewVotingSessionPage.view = function(){
    var positionsInput = []
    var contestantsCount =  ElectionModel.Data.contestants;

    for (let i=1; i<=contestantsCount; i++){
      //const x = i;
      positionsInput.push(
        m("div.pv2",{key:i},
          m("label.pa3.dib:",`position ${i} title`),
          m(`input[placeholder=eg xyz election].pa2`,{onchange:m.withAttr("value",(v)=>{
            console.log(v);
            ElectionModel.AddPosition(v,i)
          }
        )})
        )
      )
    }
    return m("section.dt.w-100.vh-100.tc",
     m(Nav),
      m("div.dtc.v-mid",
      m("div.tc",
        m("img.h4",{src:"/public/images/logo.jpg"})
      ),
      m("h3", "College of Education Ikere-Ekiti"),
        m("form.tl.w-50.bg-white.pa4.dib",{onsubmit:(e)=>{
          console.log(e)
          e.preventDefault();
          ElectionModel.NewSession()
        }},
          m("div.mv2",
            m("label.w-50.dib","Name of Election"),
            m("input[type=text][placeholder=eg. SUG election].pa2",{onchange:m.withAttr("value",(v)=>{
              console.log(v)
              ElectionModel.Data.ElectionName = v
            })})
          ),
          m("div.mv2",
            m("label.w-50.dib","Election Type"),
            m("input[type=text][placeholder=eg. students].pa2",{onchange:m.withAttr("value",(v)=>{
              ElectionModel.Data.ElectionType = v
            })})
          ),
          m("div",
            m("h2.fw1","Add positions"),
            positionsInput
          ),
          m("div",
            m("button.pa2",{onclick:NewVotingSessionPage.increment},"add position")
          ),
          m("div.mv3.tr",
            m("button.ph3.pv2", "submit")
          )
        )
      )
    )
  }


export default NewVotingSessionPage;
