var when = require('when')
var viewEngine = require('view-engine');
var Path = require('path');
var _undefined;
viewEngine.register('marko', require('./view-engine-marko'));

var bus;

function escapeSQL(s) {
    if (s == null) {
        return 'null';
    } else {
        return 'N\'' + s.toString().replace(/'/g, '\'') + '\'';
    }
}

function escapeCSV(s) {
    return s;
}

function escapeJSON(s) {
    if (s == null) {
        return 'null';
    } else {
        return JSON.stringify(s);
    }
}

var translations;
function translate(label, lang) {
    var langObject = translations[lang] || {};
    var translation = langObject[label] || label;
    langObject = _undefined; // releasing memory just in case won't harm. langObject could be big.
    return translation;
}

module.exports = {
    init: function(b) {
        bus = b;
        try {
            translations = require(Path.resolve(b.config.translations));
        } catch (e) {
            translations = {};
        }
    },
    load: function(template) {
        var tmpl = viewEngine.load(template);
        return {
            render: function(data) {
                return when.promise(function(resolve, reject) {
                    tmpl.render({
                        params:data,
                        t: function(label){
                            return translate(label, (data.$$ && data.$$.lang) || 'en');
                        },
                        $global:{
                            bus:bus,
                            escapeSQL:escapeSQL,
                            escapeCSV:escapeCSV,
                            escapeJSON:escapeJSON
                        }
                    }, function(err, res) {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(res);
                        }
                    });
                })
            }
        }
    }
}
