var marko = require('marko');

module.exports = {
  'render':function render(tmpls, data, stream) {
    var template = marko.load(tmpls);

    data.sgmessage = function(data, callback){
      setTimeout(function(){
          // callback(new Error('abc'));
          callback(null, {"firstName":"stamen","lastName":'Peevskii'});
          // console.log(data);
      },1000);
    };
    template.render(data, stream);
  }
};