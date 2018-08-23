'use strict'
var endPoint = "https://www.berkeyfilters.com/index.php/";
var intents = {"OrderStatus" : "rest/V1/orders?searchCriteria[filter_groups][1][filters][0][field]=increment_id&searchCriteria[filter_groups][1][filters][0][value]="};
module.exports = {
  build : function(intent, order, callback){
    var url = endPoint + intents.OrderStatus + order;
    callback(url);
  }
}
