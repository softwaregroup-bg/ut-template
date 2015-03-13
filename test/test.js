var fs = require('fs');
if (fs.existsSync('./test.xml.marko.js')) fs.unlinkSync('./test.xml.marko.js');
if (fs.existsSync('./test.sql.marko.js')) fs.unlinkSync('./test.sql.marko.js');
if (fs.existsSync('./test.json.marko.js')) fs.unlinkSync('./test.json.marko.js');

var t = require('ut-template');
t.init({
    importMethod:function(name){
        return {
            'security.login': function (params) {
                console.log(params);
                return {
                    then: function (resolve) {
                        resolve({result: 'login result'});
                        return this;
                    },
                    catch: function () {
                        return this;
                    },
                    done: function () {
                        return this;
                    }
                }
            },
            'namespace.method': function (params) {
                console.log(params);
                return {result: 'method result'};
            }
        }[name];
    }
})

var xml = t.load(require.resolve('./test.xml.marko'));
var sql = t.load(require.resolve('./test.sql.marko'));
var json = t.load(require.resolve('./test.json.marko'));

xml.render({username:'admin'}).then(function(res){
    console.log('XML=',res);
}).catch(function(err){
    console.log('XML error=',err);
})

sql.render({username:'admin'}).then(function(res){
    console.log('SQL=',res);
}).catch(function(err){
    console.log('SQL error=',err);
})

json.render({username:'admin'}).then(function(res){
    console.log('JSON=',res);
}).catch(function(err){
    console.log('JSON error=',err);
})