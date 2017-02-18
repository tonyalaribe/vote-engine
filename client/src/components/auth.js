var m = require("mithril")

 var Auth = {
  oncreate:function(){
    console.log("in auth")
    let auth = localStorage.getItem("auth")
    console.log(auth)

  },
  view:function(vnode){
    return m("div",vnode.attrs,m.fragment(vnode.attrs,[vnode.children]));
  }
}

export default Auth;
