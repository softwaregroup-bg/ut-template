var template = require('marko').load('async-tmpl.html');



var data = {
    colors:[],
    "predefFunct":function(out, next){//next is callback with error,data params

      setTimeout(function(){
        next(undefined,{"firstName":'desi',"lastName":'tsolova'});//error
      },1000);

    }
};

template.render(data, process.stdout);