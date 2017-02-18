import m from "mithril";
import Nav from '../components/nav.js'

var VotePage = {
  view: function(){
    return m("section.vh-100.w-100.tc",
      m(Nav),
      m("div.pt5",
        m("h1", "Vote Naija"),
        m("h2.fw1","Vote")
      ),
      m("div.mw7.dib.tl.w-100",
        m("div.tl.bg-white.shadow-4.pa4.mv1",
          m("h2.fw1","Position: President"),
          m("div",
            m("select",
              m("option","Mr Okon"),
              m("option","Mr Okon"),
              m("option","Mr Okon")
            )
          )
        ),
        m("div.tl.bg-white.shadow-4.pa4.mv1",
          m("h2.fw1","Position: Precident"),
          m("div",
            m("select",
              m("option","Mr Okon"),
              m("option","Mr Okon"),
              m("option","Mr Okon")
            )
          )
        ),
        m("div.tl.bg-white.shadow-4.pa4.mv1",
          m("h2","Position: Precident"),
          m("div",
            m("select",
              m("option","Mr Okon"),
              m("option","Mr Okon"),
              m("option","Mr Okon")
            )
          )
        ),
        m("div.tl.bg-white.shadow-4.pa4.mv1",
          m("h2","Position: Precident"),
          m("div",
            m("select",
              m("option","Mr Okon"),
              m("option","Mr Okon"),
              m("option","Mr Okon")
            )
          )
        ),
        m("div.tc.mv5",
          m("button.pa3","Cast vote")
        )
      )
    )
  }

}

export default VotePage;
