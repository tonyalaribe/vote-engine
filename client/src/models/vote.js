import m from 'mithril';
const BACKEND_URL = ""

var VoteModel = {
  Positions:[],
}

VoteModel.GetElectionData = function(){
  m.request({
    method: "GET",
    url: BACKEND_URL+"/api/election_details",
  })
  .then(function(result) {
      console.log(result)
      VoteModel.Positions = result
  })
}


VoteModel.SubmitVote = function(voteData){
  let user = localStorage.getItem("user")
  console.log(user)
  m.request({
    method: "POST",
    url: BACKEND_URL+"/api/cast_vote?user="+user,
    data: voteData,
  })
  .then(function(result) {
      console.log(result)
  })
}
export default VoteModel;
