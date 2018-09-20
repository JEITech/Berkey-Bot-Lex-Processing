'use strict'
const https = require('https');
const sa = require('superagent');
const requester = require('request');
const auth = require('./auth');
const ops = require('./ops');
const urlConstructor = require('./urlConstructor');
const respond = require('./respond');
const messageConstructor = require('./messages');

  function dispatch(intentRequest, callback) {

  if(intentRequest.sessionAttributes == null){
      intentRequest.sessionAttributes = {};
  }
          const sessionAttributes = intentRequest.sessionAttributes;

          var intent = intentRequest.currentIntent.name;
          var currentStatus = intentRequest.currentIntent.confirmationStatus;

          switch (intent) {

                        case "OrderStatus":
                                var slots = intentRequest.currentIntent.slots;
                                auth.getAdminToken(function(res){

                                  var token = String(res);
                                  urlConstructor.build("OrderStatus", String(slots.orderId), function(res){

                                    var url = String(res);
                                    ops.getOrderDetails(token, url, function(res){

                                        var orderDetails = res;
                                        messageConstructor.buildOrderStatusMessage(orderDetails, sessionAttributes, function(){

                                          callback(respond.close(sessionAttributes, 'Fulfilled'));


                                        });

                                    });

                                  })

                                });
                                break;

                        default:

                          messageConstructor.buildFAQResponse(intent, sessionAttributes, function(){

                              callback(respond.close(sessionAttributes, 'Fulfilled'));

                          });
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
