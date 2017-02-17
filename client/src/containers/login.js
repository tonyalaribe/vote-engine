var m = require("mithril")

var Login = {
  login:function(e){
    e.preventDefault()
    console.log("in login")
    let username=document.getElementById("username").value
    let password=document.getElementById("password").value

    if (username=="admin"&&password=="P@ssw0rd"){
      console.log("passed")
      localStorage.setItem("auth","admin")
      m.route.set("/admin",{},{})
    }
  },
  view: function() {
    return m("div.vh-100.v-mid.w-100.tc.dt bg-near-white",[
        m("div.tc.dtc.v-mid.w-50.w-100-ns",
        [
          m("h1", "Vote Naija"),
          m("form.dib.bg-white.shadow-4.pa4.w-90.w-50-ns",
          {
            onsubmit:this.login,
          },
          [
            m("h2.f3.fw1.pv3","Login"),
            m("div.dib.w-100", [
              m("select",[
                m("option","student"),
                m("option","staff")
              ]),
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
}

export default Login;
