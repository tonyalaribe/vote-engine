import m from "mithril"

var Nav = {
  logout:function(){
    localStorage.removeItem("auth")
    localStorage.removeItem("userID")
    m.route.set("/login")
  },
  view:function(){
    let user = localStorage.getItem("userID")
    return m("nav.fixed.w-100.bg-navy.shadow-4.white.pa2.tc.top-0",
      user?m("div",
        m("a[href=/].white.link.dib.pa2",{oncreate: m.route.link},"home"),
        m("a[href=/results].white.link.dib.pa2",{oncreate: m.route.link},"results"),
        m("a.pointer.white.link.dib.pa2",{onclick:this.logout},"logout")
      ):m("a[href=/login].white.link.dib.pa2.ph4.fr",{oncreate: m.route.link},"login")
    )
  }
}

export default Nav;
