var m = require("mithril")
const BACKEND_URL = ""

var LoginPage = {
  error:false,
  errorMessage:""
}

LoginPage.login = function(e){
  e.preventDefault()
  console.log("in login")
  let username=document.getElementById("username").value
  let password=document.getElementById("password").value

  if (username=="admin"&&password=="P@ssw0rd"){
    console.log("passed")
    localStorage.setItem("auth","admin")
    localStorage.setItem("userID","admin")
    m.route.set("/admin",{},{})
    return
  }

  let user = {
    ID:username,
    Password:password,
  }
  m.request({
    method: "POST",
    url: BACKEND_URL+"/api/voter_login",
    data: user,
  })
  .then(function(result) {
      console.log(result)
      localStorage.setItem("auth","user")
      localStorage.setItem("userID",username)
      result.HasVoted?m.route.set("/results",{},{}):m.route.set("/",{},{})

  },function(error){
    console.log(error)
    LoginPage.error = true
    LoginPage.errorMessage = error.Message
  })
}

LoginPage.view =  function() {
  return m("div.vh-100.v-mid.w-100.tc.dt ",[
      m("div.tc.dtc.v-mid.w-50.w-100-ns",
      [
        m("div.tc",
          m("img.h3.h4-ns",{src:"/public/images/logo.jpg"})
        ),
        m("h3.f5.navy", "College of Education Ikere-Ekiti"),
        m("form.dib.bg-white.shadow-4.pa2.pa4-ns.w-90.w-50-ns",
        {
          onsubmit:LoginPage.login,
        },
        [
          m("h2.f3.fw1.pt3.navy","Login"),

          m("div.dib.w-100.pt3.pa1", [
            m("div.tl.mv2.w-100.pv2",[
              m("label","username"),
              m("input[type=text][id=username].db.pa2.mv2.w-100.ba.b--gray",
              {
                placeholder:"username"
              }
            ),
            ]),
            m("div.tl.mv2.pv",[
              m("label","passcode"),
              m("input[type=text][id=password].db.pa2.mv2.w-100.ba.b--gray",
              {
                placeholder:"passcode"
              }
              ),
            ]),
          ]),
          m("br"),
          m("div.dib.pv2",
            LoginPage.error?m("div",
              m("span.dib.pa3",LoginPage.errorMessage)):"",
            m("button.dib.pv3.ph4.bg-navy.white-80.shadow-4.grow.pointer.ba[type=submit]", "login"),
            m("a[href=/results].dib.pv3.ph4.mh2.navy.ba.white-80.shadow-4.grow.pointer.link",{oncreate: m.route.link}, "results")
          )
        ])

      ]
    )
  ]
  )
}

export default LoginPage;
