'use strict'
const requester = require('request');
module.exports = {

  getOrderDetails: function(token, url, callback){

           token = "Bearer " + token;
           var reqOptions = {
             method : 'GET',
             url: url,
             headers: {
               "Authorization" : token,
               "Content-Type" : "application/json"
             }

           };
           requester(reqOptions, function(err, res, body){
             if(!err && res.statusCode == 200){

               var order = JSON.parse(body);
               if(order == undefined){

                callback('error');

              }else{

                var orderItems = [];

                    for(var i=0; i<order.items[0].items.length; i++){

                      orderItems.push(order.items[0].items[i].name);

                    }

                 var cbData = {

                   total : String(order.items[0].base_total_paid),
                   date: String(order.items[0].created_at),
                   status : String(order.items[0].status),
                   totalItems : String(order.items[0].total_qty_ordered),
                   items : orderItems

                 };

                 callback(cbData);
               }

             }else{

                callback('error, ' + err);

             }
           });
          }
}
