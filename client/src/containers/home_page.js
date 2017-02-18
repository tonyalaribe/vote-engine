import m from 'mithril';

var HomePage = {
  oncreate:function(){
    let auth = localStorage.getItem("auth")
    console.log(auth)
    if (auth=="admin"){
      m.route.set("/admin",{},{})
    }else if(auth=="user"){
      m.route.set("/vote",{},{})
    }else{
      m.route.set("/login",{},{})
    }
  },
  view:function(){
    return m("div")
  }
}

export default HomePage;
