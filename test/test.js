/* eslint no-console:0 */
require('marko/hot-reload').enable();
var fs = require('fs');
fs.existsSync('./test.xml.marko.js') && fs.unlinkSync('./test.xml.marko.js');
fs.existsSync('./test.sql.marko.js') && fs.unlinkSync('./test.sql.marko.js');
fs.existsSync('./test.json.marko.js') && fs.unlinkSync('./test.json.marko.js');
fs.existsSync('./unesc.sql.marko.js') && fs.unlinkSync('./unesc.sql.marko.js');
fs.existsSync('./t.marko.js') && fs.unlinkSync('./t.marko.js');
fs.existsSync('./includes/t.marko.js') && fs.unlinkSync('./includes/t.marko.js');

var t = require('../index');

t.init({
    importMethod: function(name) {
        return {
            'security.login': function(params) {
                console.log(params);
                return {
                    then: function(resolve) {
                        resolve({
                            result: 'login result'
                        });
                        return this;
                    },
                    catch: function() {
                        return this;
                    },
                    done: function() {
                        return this;
                    }
                };
            },
            'namespace.method': function(params) {
                console.log(params);
                return {
                    result: 'method result'
                };
            }
        }[name];
    },
    config: {
        translations: require.resolve('./translations.json')
    }
});

var xml = t.load(require.resolve('./test.xml.marko'));
var sql = t.load(require.resolve('./test.sql.marko'));
var json = t.load(require.resolve('./test.json.marko'));
var unesc = t.load(require.resolve('./unesc.sql.marko'));
var tt = t.load(require.resolve('./t.marko'));

console.log('pre-compiled xml');
console.log(require.resolve('./test.xml.marko'));

xml.render({
    username: 'admin'
}).then(function(res) {
    console.log('\n\n--------------\nXML=', res);
    return true;
}).catch(function(err) {
    console.log('\n\n--------------\nXML error=', err);
});

sql.render({
    username: 'admin'
}).then(function(res) {
    console.log('\n\n--------------\nSQL=', res);
    return true;
}).catch(function(err) {
    console.log('\n\n--------------\nSQL error=', err);
});

json.render({
    username: 'admin'
}).then(function(res) {
    console.log('\n\n--------------\nJSON=', res);
    return true;
}).catch(function(err) {
    console.log('\n\n--------------\nJSON error=', err);
});

unesc.render({
    username: 'admin'
}).then(function(res) {
    console.log('\n\n--------------\nUNESCAPE SQL=', res);
    return true;
}).catch(function(err) {
    console.log('\n\n--------------\nUNESCAPE SQL error=', err);
});

tt.render({}).then(function(res) {
    console.log('\n\n--------------\nTRANSLATED TEMPLATE=', res);
    return true;
}).catch(function(err) {
    console.log('\n\n--------------\nTRANSLATED TEMPLATE error=', err);
});

t.compileMarko({templateContent: '<sg:container>     000     <ut-security:login var="l" userName="${params.username}">aaa         ' +
    '<ut-namespace:method var="y" x="${l.result}">bbb                 ${l.result} ccc                 ' +
    '<someTab q="v">test</someTab>                 ${y.result}         </ut-namespace:method>     </ut-security:login>     ddd </sg:container>'}, {
        username: 'admin'
    }, 'marko').then(function(res) {
        console.log('\n\n--------------\nDYNAMIC XML=', res);
        return true;
    }).catch(function(err) {
        console.log('\n\n--------------\nDYNAMIC XML error=', err);
    });

/*
var compiled = t.compile('<sg:container>     000     <ut-security:login var="l" userName="${params.username}">aaa         ' +
    '<ut-namespace:method var="y" x="${l.result}">bbb                 ${l.result} ccc                 ' +
    '<someTab q="v">test</someTab>                 ${y.result}         </ut-namespace:method>     </ut-security:login>     ddd </sg:container>',
    './','marko' );
console.log('compiled');
console.log(compiled);
compiled
    .then(function(template) {
        console.log('compiled template');
        console.log(template);
    template.render({username: 'Hadmin'}).then(function(res) {
        console.log('\n\n--------------\nDYNAMIC XML=', res);
    }).catch(function(err) {
        console.log('\n\n--------------\nDYNAMIC XML error=', err);
    });
}).catch(function(e) {
        "use strict";

    });

    */
