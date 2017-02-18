var m = require("mithril")

 export var VoterAuth = {
  oncreate:function(){
    console.log("in auth")
    let auth = localStorage.getItem("auth")
    console.log(auth)

  },
  view:function(vnode){
    return m("div",vnode.attrs,m.fragment(vnode.attrs,[vnode.children]));
  }
}


export var AdminAuth = {
 oncreate:function(){
   console.log("in auth")
   let auth = localStorage.getItem("auth")
   console.log(auth)
   if (auth!=="admin"){
     m.route.set("/login")
   }

 },
 view:function(vnode){
   return m("div",vnode.attrs,m.fragment(vnode.attrs,[vnode.children]));
 }
}
