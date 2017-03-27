import  m from "mithril";
import Nav from '../components/nav.js';
import VoteModel from '../models/vote.js';

var ResultsPage  = {}

ResultsPage.oncreate = function(){
  VoteModel.GetElectionData()
}

ResultsPage.view = function(){
    return m("section.vh-100.w-100.tc",
      m(Nav),
      m("div.pt5",
        m("div.tc",
          m("img.h3.h4-ns",{src:"/public/images/logo.jpg"})
        ),
        m("h3.f5.navy", "College of Education Ikere-Ekiti"),
        m("h2.fw1","Results")
      ),

      VoteModel.Positions.map((p)=>{
        return m("div.mw7.dib.tl.w-100",
          m("div.tl.bg-white.shadow-4.pa4.mv1",
            m("h2.fw1",`Position: ${p.Title} `),
            m("hr.mv2.b--near-white"),
            m("div.mh3",
               p.Contestants.map((contestant)=>{
                return m("div.cf",
                  m("span",contestant.Name),
                  m("span.fr",`${contestant.Votes} votes`)
                )
              })
            )
          )
        )
      }
    )
  )
}


export default ResultsPage;
