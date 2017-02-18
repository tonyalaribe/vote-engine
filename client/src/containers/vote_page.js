import m from "mithril";
import Nav from '../components/nav.js';
import VoteModel from '../models/vote.js';


var VotePage = {}
VotePage.oncreate = function(){
  VoteModel.GetElectionData()
}

VotePage.view = function(){

    return m("section.vh-100.w-100.tc",
      m(Nav),
      m("div.pt5",
        m("h1", "Vote Naija"),
        m("h2.fw1","Vote")
      ),
      VoteModel.Positions.map((p)=>{
        return m("div.mw7.dib.tl.w-100",
          m("div.tl.bg-white.shadow-4.pa4.mv1",
            m("h2.fw1",`Position: ${p.Title}`),
            m("div",
              m("select",
                p.Contestants.map((contestant)=>{
                    return m("option",{value:contestant.Key},contestant.Name)
                })
              )
            )
          )
        )
      }),
        m("div.tc.mv5",
          m("button.pa3","Cast vote")
        )
      )

  }

export default VotePage;
