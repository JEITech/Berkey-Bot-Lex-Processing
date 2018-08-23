'use strict'
const https = require('https');
const sa = require('superagent');
const requester = require('request');
var auth = require('./auth');
var ops = require('./ops');
var urlConstructor = require('./urlConstructor');

  function close(sessionAttributes, fulfillmentState) {
      return {
          sessionAttributes,

          dialogAction: {
              type: 'Close',
              fulfillmentState
          }
      };
  }
  function orderStatus(sessionAttributes, fulfillmentState, message){
       return {
          sessionAttributes,

          dialogAction: {
              type: 'Close',
              fulfillmentState
          }
      };
  }
  function fine(sessionAttributes, fulfillmentState, message) {
      return {
          sessionAttributes,

          dialogAction: {
              type: 'Close',
              message,
              fulfillmentState
          }
      };
  }
  function confirm(sessionAttributes, fulfillmentState, message, intent) {
    return {
          sessionAttributes,

          dialogAction: {
              type: 'ConfirmIntent',
              message,
              intentName: intent

          }
      };
  }
  function dispatch(intentRequest, callback) {

  if(intentRequest.sessionAttributes == null){
      intentRequest.sessionAttributes = {};
  }
          const sessionAttributes = intentRequest.sessionAttributes;

          var rn = intentRequest.currentIntent.name;
          var currentStatus = intentRequest.currentIntent.confirmationStatus;

          sessionAttributes.greeting = "Berkey Bot reporting in! Hello ";
          sessionAttributes.greeting += intentRequest.userid;
          sessionAttributes.greeting += "!";
          sessionAttributes.detected = "I was able to find some information in our knowledge base that might help you:";
          sessionAttributes.closing  = "If that doesn't answer your question, you can type 'human' in the chat and I will summon someone!  Otherwise, feel free to ask me another question!";
          sessionAttributes.confirm  = "Thanks for messaging Berkey Filters.  Our Berkey Bot AI was able to find an answer to your question!  Type 'yes' to talk with the Berkey Bot, or 'no' to wait for a real human.";
          sessionAttributes.letgo    = "Alright, a human will be here to help you as soon as possible!";




          var rn = intentRequest.currentIntent.name;
          var currentStatus = intentRequest.currentIntent.confirmationStatus;


          if (rn == "OrderStatus"){
              sessionAttributes.closing = "If you need more help with your order, just let me know!";
                   sessionAttributes.detected = "helicopter";
                var slots = intentRequest.currentIntent.slots;
                sessionAttributes.orderResponse1 = ("Excellent!  I've got your order details right here.");

                auth.getAdminToken(function(res){

                  var token = String(res);
                  urlConstructor.build("OrderStatus", String(slots.orderId), function(res){

                    var url = String(res);
                    ops.getOrderDetails(token, url, function(res){

                      var orderDetails = res;
                        sessionAttributes.orderResponse2 = ("Your order was placed on " + orderDetails.date + " for a total of $" + orderDetails.total + '.');
                        var hasShipped;
                        var statusMsg;
                        function statusString(){

                          if(orderDetails.status == "complete"){
                            hasShipped = true;
                            statusMsg =  "Your order has shipped!"

                          }else{
                            hasShipped = false;
                            statusMsg = "Your order is waiting to ship!"

                          }

                        }
                        statusString();
                        var itemsMsg = ''

                        function itemString(){
                          if(hasShipped){

                            itemsMsg = "I hope you are enjoying your "

                          }else{

                              itemsMsg = "I know you are going to love your new "

                            }

                              if(orderDetails.items.length == 1){

                                itemsMsg += orderDetails.items[0];

                              }else if(orderDetails.items.length == 2){

                                itemsMsg += orderDetails.items[0];
                                itemsMsg += ' and your ';
                                itemsMsg += orderDetails.items[1];


                              }else{
                                for (var i=0; i<orderDetails.items.length; i++){
                                  var almost = (orderDetails.items.length - 1);
                                  itemsMsg += orderDetails.items[i];
                                  if(i<almost){

                                    itemsMsg += ', and your ';

                                  }

                              }


                            }
                            itemsMsg += '!';
                            sessionAttributes.orderResponse4 = (itemsMsg);

                        }
                        itemString();
                        sessionAttributes.orderResponse3 = (statusMsg + " The package contains " + orderDetails.totalItems + " items.");

                        callback(orderStatus(sessionAttributes, 'Fulfilled', {'contentType': 'PlainText', 'content': sessionAttributes.orderResponse2}));


                    });

                  })

                });



          }else{

          if(currentStatus == "None" && !sessionAttributes.precheck){

               callback(confirm(sessionAttributes, 'Fulfilled', {'contentType': 'PlainText', 'content': sessionAttributes.confirm}, rn));

          }else if(currentStatus == "None" && sessionAttributes.precheck){

              callback(close(sessionAttributes, 'Fulfilled'));

          }else if (currentStatus == "Confirmed" || sessionAttributes.precheck){

              sessionAttributes.precheck = true;
              callback(close(sessionAttributes, 'Fulfilled'));
          }
          else if (currentStatus == "Denied"){

              callback(fine(sessionAttributes, 'Fulfilled', {'contentType': 'PlainText', 'content': sessionAttributes.letgo}));

          }


          }


    };
  exports.handler = (event, context, callback) => {
      try {
          dispatch(event,
              (response) => {
                  callback(null, response);
              });
      } catch (err) {
          callback(err);
      }
  };
