'use strict'
var messages = {

  greetings : [

    "Berkey Bot here to help!", "Berkey  Bot reporting in!", "Greetings from Berkey Bot!", "Hi there!"

  ],
  faq : {

    message2 : [

      "Our knowledge base has just the info you need.", "I was able to find some information in our knowledge base that might help you!","I took a trip over to our knowledge base, and found this!"

    ], message3 : [

      "If you need anything else, just ask!", "Please do let me know if you need anything else!  I'm pretty addicted to my phone.","You will find lot's of great info on our knowledge base, but if you want to know about anything in specific you can just ask me!"

    ]

  }
};
module.exports = {
  buildOrderStatusMessage : function (orderDetails, sessionAttributes, callback) {

    sessionAttributes.message1 = "Excellent!  I've got your order details right here.";
    sessionAttributes.message5 = "If you need any help with your order, just let me know!";
    sessionAttributes.message2 = ("Your order was placed on " + orderDetails.date + " for a total of $" + orderDetails.total + '.');
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
        sessionAttributes.message4 = (itemsMsg);

    }
    itemString();
    sessionAttributes.message3 = (statusMsg + " The package contains " + orderDetails.totalItems + " items.");
    callback();
  },
      buildFAQResponse : function (intent, sessionAttributes, callback){

        var rng = Math.floor(Math.random() * messages.greetings.length);
        sessionAttributes.message1 = messages.greetings[rng];
        rng = Math.floor(Math.random() * messages.faq.message2.length);
        sessionAttributes.message2 = messages.faq.message2[rng];
        rng = Math.floor(Math.random() * messages.faq.message3.length);
        sessionAttributes.message3 = messages.faq.message3[rng];
        callback();

  }
}
