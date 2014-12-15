var template = require('marko').load('async-tmpl.html');

var data = {
    name: 'Frank',
    count: 30,
    colors:['red','green','blue'],
    userDataProvider: function(data, callback){
        setTimeout(function(){
            callback(new Error('abc'));
            // callback(null, {"a":"a","b":'b'});
            // console.log(data);
        },1000);
    }
};

template.render(data, process.stdout);