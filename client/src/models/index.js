import m from 'mithril';
const BACKEND_URL = ""


export var ElectionModel = {
  IsElectionSession:false,
  VotersCSV:"",
  Data:{
    contestants:0,
    Positions:[]
  }
}


ElectionModel.SubmitVoters = function(){
  let votersCSV = document.getElementById("voterscsv").value
  console.log(votersCSV)
  m.request({
    method: "POST",
    url: BACKEND_URL+"/api/add_voters",
    data: votersCSV,
    serialize:function(value){return value}
  })
  .then(function(result) {
      console.log(result)
      m.route.set("/current_session",{},{})
  })

}


 ElectionModel.AddPosition = function(value,i){
  console.log(i);
   ElectionModel.Data.Positions.push({
    Title:value,
    Key:i,
  })
}

ElectionModel.NewSession = function(){
  console.log(ElectionModel)
  let data = JSON.stringify(ElectionModel.Data)
  console.log(data)

  m.request({
  method: "POST",
  url: BACKEND_URL+"/api/new_session",
  data: ElectionModel.Data,
  })
  .then(function(result) {
      console.log(result)
      m.route.set("/current_session",{},{})
  })
}

ElectionModel.GetDetails = function(){
  m.request({
  method: "GET",
  url: BACKEND_URL+"/api/get_session",
  })
  .then((result)=>{
      console.log(result)
      ElectionModel.Data = result
      if (result.ElectionName!=""){
        ElectionModel.IsElectionSession = true
      }
      m.redraw()
  })
}

ElectionModel.EndElectionSession = function(){
  m.request({
  method: "GET",
  url: BACKEND_URL+"/api/end_session",
  })
  .then((result)=>{
      console.log(result)
      ElectionModel.IsElectionSession = false
      m.redraw()
  })
}


ElectionModel.StartVoting = function(){
  m.request({
  method: "GET",
  url: BACKEND_URL+"/api/start_voting",
  })
  .then((result)=>{
      console.log(result)
      ElectionModel.Data.RunningElection = true
      m.redraw()
  })
}

ElectionModel.EndVoting = function(){
  console.log("end voting")
  m.request({
  method: "GET",
  url: BACKEND_URL+"/api/end_voting",
  })
  .then((result)=>{
      console.log(result)
      console.log("end success")
      ElectionModel.Data.RunningElection = false
      m.redraw()
  })
}

export var PositionModel = {
  Data:{Election:{},Contestants:[]}
}

PositionModel.NewCandidate = function(i,name,position){
  return m.request({
  method: "GET",
  url: BACKEND_URL+`/api/new_contestant?key=${i}&name=${name}&position=${position}`,
  })
  .then((result)=>{
      console.log(result)
      PositionModel.Data.Contestants.push(
        {
          Key:i,
          Name:name,
          Position:position
        }
      )
      return
  })
}

PositionModel.GetPosition = function(i){
  return m.request({
  method: "GET",
  url: BACKEND_URL+`/api/get_position?key=${i}`,
  })
  .then((result)=>{
      console.log(result)
      PositionModel.Data = result
      return result
  })
}


//export default {ElectionModel, ElectionModel};
