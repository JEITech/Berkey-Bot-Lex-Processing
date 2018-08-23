'use strict'
var endPoint = "www.berkeyfilters.com/index.php/";
var intents = {"OrderStatus" : "rest/V1/orders?searchCriteria[filter_groups][1][filters][0][field]=increment_id&searchCriteria[filter_groups][1][filters][0][value]=008179480"};
module.exports = {
  getRoute : function(intent, callback){
    var url = endPoint + intents.OrderStatus;
    //console.log(url);
    callback(url);

  }
}
