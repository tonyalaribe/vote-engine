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

export default VoteModel;
