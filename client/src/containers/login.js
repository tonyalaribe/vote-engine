var m = require("mithril")
const BACKEND_URL = ""

var LoginPage = {
  error:false
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
      m.route.set("/",{},{})
  },function(error){
    console.log(error)
    LoginPage.error = true
  })
}

LoginPage.view =  function() {
  return m("div.vh-100.v-mid.w-100.tc.dt bg-near-white",[
      m("div.tc.dtc.v-mid.w-50.w-100-ns",
      [
        m("h1", "College of Education Ikere-Ekiti"),
        m("form.dib.bg-white.shadow-4.pa4.w-90.w-50-ns",
        {
          onsubmit:LoginPage.login,
        },
        [
          m("h2.f3.fw1.pt3","Login"),
          LoginPage.error?m("span","wrong user id or password"):"",
          m("div.dib.w-100.pt3", [
            m("div.tl.mv2.w-100",[
              m("label","username"),
              m("input[type=text][id=username].db.pa2.mv2.w-100",
              {
                placeholder:"username"
              }
            ),
            ]),
            m("div.tl.mv2",[
              m("label","passcode"),
              m("input[type=text][id=password].db.pa2.mv2.w-100",
              {
                placeholder:"passcode"
              }
              ),
            ]),
          ]),
          m("br"),
          m("div.dib.pv2",
            m("button.dib.pa2.ba.bg-white[type=submit]", "login")
          )
        ])

      ]
    )
  ]
  )
}

export default LoginPage;
