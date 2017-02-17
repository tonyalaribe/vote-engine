import m from 'mithril';
const BACKEND_URL = ""

export var VotingModel = {
  Data:{
    contestants:0,
    Positions:[],
  },
  AddPosition:function(value,i){
    console.log(i);
    this.Data.Positions.push({
      Title:value,
      Key:i,
    })
  },
  Submit:function(){
    console.log(this)
    var data = JSON.stringify(this.Data)
    console.log(data)

    m.request({
    method: "POST",
    url: BACKEND_URL+"/new_session",
    data: this.Data,
    })
    .then(function(result) {
        console.log(result)
    })
  }
}

export var ElectionModel = {
  Data:{Positions:[]},
  GetDetails:function(){
    m.request({
    method: "GET",
    url: BACKEND_URL+"/get_session",
    })
    .then((result)=>{
        console.log(result)
        this.Data = result
    })
  }
}

export var PositionModel = {
  Data:{Election:{},Contestants:[]},
  NewCandidate:function(i,name,position){
    return m.request({
    method: "GET",
    url: BACKEND_URL+`/new_contestant?key=${i}&name=${name}&position=${position}`,
    })
    .then((result)=>{
        console.log(result)
        this.Data.Contestants.push(
          {
            Key:i,
            Name:name,
            Position:position
          }
        )
        return
    })
  },
  GetPosition:function(i){
    return m.request({
    method: "GET",
    url: BACKEND_URL+`/get_position?key=${i}`,
    })
    .then((result)=>{
        console.log(result)
        this.Data = result
        return result
    })
  }
}

//export default {VotingModel, ElectionModel};
