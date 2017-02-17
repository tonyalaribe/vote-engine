var m = require("mithril")

var ResultsPage  = {
  view:function(){
    return  m("section.vh-100.w-100.tc",
      m("h1", "Vote Naija"),
      m("h2.fw1","Vote"),
      m("div.mw7.dib.tl.w-100",
        m("div.tl.bg-white.shadow-4.pa4.mv1",
          m("h2.fw1","Position: President"),
          m("hr.mv2.b--near-white"),
          m("div.mh3",
              m("div.cf",
                m("span","Anhton fd fdfdd"),
                m("span.fr","200 votes")
            )
          )
        ),
        m("div.tl.bg-white.shadow-4.pa4.mv1",
          m("h2.fw1","Position: President"),
          m("hr.mv2.b--near-white"),
          m("div.mh3",
              m("div.cf",
                m("span","Anhton fd fdfdd"),
                m("span.fr","200 votes")
            )
          )
        ),
        m("div.tl.bg-white.shadow-4.pa4.mv1",
          m("h2.fw1","Position: President"),
          m("hr.mv2.b--near-white"),
          m("div.mh3",
              m("div.cf",
                m("span","Anhton fd fdfdd"),
                m("span.fr","200 votes")
            )
          )
        ),
        m("div.tl.bg-white.shadow-4.pa4.mv1",
          m("h2.fw1","Position: President"),
          m("hr.mv2.b--near-white"),
          m("div.mh3",
              m("div.cf",
                m("span","Anhton fd fdfdd"),
                m("span.fr","200 votes")
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

export default ResultsPage;
