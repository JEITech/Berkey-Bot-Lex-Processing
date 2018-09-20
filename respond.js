'use strict'
module.exports = {
  close : function (sessionAttributes, fulfillmentState) {
      return {
          sessionAttributes,

          dialogAction: {
              type: 'Close',
              fulfillmentState
          }
      };
  }
}
