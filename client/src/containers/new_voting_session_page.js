
import m from 'mithril';
import {VotingModel} from '../models/index.js'

var NewVotingSessionPage = {
  increment:function(e){
    e.preventDefault()
    VotingModel.Data.contestants++
  },
  view:function(vnode){
    var positionsInput = []
    var contestantsCount =  VotingModel.Data.contestants

    for (let i=1; i<=contestantsCount; i++){
      //const x = i;
      positionsInput.push(
        m("div.pv2",{key:i},
          m("label.pa3.dib:",`position ${i} title`),
          m(`input[placeholder=eg xyz election].pa2`,{onchange:m.withAttr("value",(v)=>{
            console.log(v);
            VotingModel.AddPosition(v,i)
          }
        )})
        )
      )
    }
    return m("section.dt.w-100.vh-100.tc",
      m("div.dtc.v-mid",
        m("form.tl.w-50.bg-white.pa4.dib",{onsubmit:(e)=>{
          console.log(e)
          e.preventDefault();
          VotingModel.Submit()
        }},
          m("div.mv2",
            m("label.w-50.dib","Name of Election"),
            m("input[type=text][placeholder=eg. SUG election].pa2",{onchange:m.withAttr("value",(v)=>{
              console.log(v)
              VotingModel.Data.ElectionName = v
            })})
          ),
          m("div.mv2",
            m("label.w-50.dib","Election Type"),
            m("input[type=text][placeholder=eg. students].pa2",{onchange:m.withAttr("value",(v)=>{
              VotingModel.Data.ElectionType = v
            })})
          ),
          m("div",
            m("h2.fw1","Add positions"),
            positionsInput
          ),
          m("div",
            m("button.pa2",{onclick:this.increment},"add position")
          ),
          m("div.mv3.tr",
            m("button.ph3.pv2", "submit")
          )
        )
      )
    )
  }
}

export default NewVotingSessionPage;
