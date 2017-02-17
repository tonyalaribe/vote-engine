import m from 'mithril';
import {PositionModel} from '../models/index.js';

var PositionPage = {
  Position:"",
  Key:"",
  oncreate:function(vnode){
    console.log(vnode)
    console.log("vnode")
    console.log(vnode.attrs)
    let key = vnode.attrs.id
    console.log(key)
    this.Key = key
    PositionModel.GetPosition(key).then((resp)=>{
      let currentPosition = resp.Election.Positions.find((p)=>{
        console.log(p)
        console.log(key)
        return p.Key == key
      })
      console.log(currentPosition)
      this.Position = currentPosition.Title
      m.redraw()
    })


  },
  addContestant:function(e){
    e.preventDefault()
    let name = document.getElementById("contestantInput").value
    console.log(this.Key)
    PositionModel.NewCandidate(this.Key,name,this.Position)
  },
  view:function(){
    let contestants = PositionModel.Data.Contestants.map((c)=>{

      return m("p",c.Name)

    })
    return m("section.dt.w-100.vh-100.tc",
       m("div.dtc.v-mid",
        m("div.tl.w-50.bg-white.pa4.dib",
          m("h2","Current Session"),
          m("div",
            m("h3.fw1",`Position:${this.Position}`),
            m("div"),
            m("div",
              m("h3","Candidates"),
              contestants
            ),
            m("form",
              {
                onsubmit:this.addContestant.bind(this ),
              },
              m("input[type=text]",{id:"contestantInput"}),
              m("button",{type:"submit"},"submit")
            )
          )
        )
      )
    )
  }
}

export default PositionPage;
