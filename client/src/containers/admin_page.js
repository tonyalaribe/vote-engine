import m from 'mithril';

var AdminPage = {
  view: function(){
    return m("section",
      m("div.vh-100.tc.dt.w-100",
        m("div.dtc.v-mid",
          m("button.pa3","Start Voting Session")
        )
      )
    )
  }
}


export default AdminPage;
