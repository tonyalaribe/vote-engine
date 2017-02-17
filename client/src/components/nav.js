import m from "mithril"

var Nav = {
  view:function(){
    return m("nav.fixed.w-100",
      m("a[href=/]",{oncreate: m.route.link},"home")
    )
  }
}
