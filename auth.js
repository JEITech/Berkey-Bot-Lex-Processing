'use strict'
var clientHost = "berkeyfilters.com/";
var clientContext = "index.php/rest/V1/integration/admin/token";
var postData = {"username":"chris@james-enterprise.com", "password":"HijJur7"};
var token;
const sa = require('superagent');
module.exports =
{ getAdminToken : function(callback){

  sa.post('www.berkeyfilters.com/index.php/rest/V1/integration/admin/token')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(postData))
      .end(function(er, res){
      if(er){
        console.log(er);
           callback(er);
        }else{
         token = res.text.replace(/['"]+/g, '');
         callback(token);
       }
     });
   }

 }
