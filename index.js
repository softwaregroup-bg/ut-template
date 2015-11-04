var when = require('when');
var viewEngine = require('view-engine');
var Path = require('path');
var _undefined;
viewEngine.register('marko', require('./view-engine-marko'));
var markoCompiler = require('marko/compiler');
var marko = require('marko');
var fs = require('fs');
var requireReload = require('require-reload')(require);

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
            render: function(data, language) {
                if (!data) {
                    data = {};
                }
                return render(tmpl, data, language);
            }
        }
    },
    compileMarko: function(msg) {
        if (!msg.templateContent) {
            msg.templateContent = '';
        }
        if(!msg.path) {
            msg.path = '';
        }
        if(!msg.fileName) {
            return when.reject(new Error('not pass fileName'));
        }
        return when.promise(function (resolve, reject) {
            var html = markoCompiler.compile(msg.templateContent, require.resolve('./'), function (err, compiledTemplate) {
                if (err) {
                    reject(err);
                }
                var template;
                try {
                    template = require(Path.resolve('./'+msg.path+'/'+msg.fileName+'.marko'));
                    if(compiledTemplate.indexOf(template._.toString()) === -1) {
                        console.log('There are a difference between marko templates');
                        throw 'There are a difference between marko templates';
                    }
                    resolve({
                        render: function(data, language){
                            return render(template, data, language);
                        }
                    })
                } catch(e) {
                    fs.writeFile(msg.path+'/'+msg.fileName+'.marko.js', compiledTemplate, function(err) {
                        if(err) {
                            reject(err);
                        }
                        template = requireReload(Path.resolve('./'+msg.path+'/'+msg.fileName+'.marko'));
                        resolve({
                            render : function(data, language){
                                return render(template, data, language);
                            }
                        });
                    });
                }
            });
        });
    },
}

function render (tmpl, data, language) {
    if (!data) {
        data = {};
    }
    return when.promise(function (resolve, reject) {
        tmpl.render({
            params: data,
            t: function (label) {
                return translate(label, language || data.language || 'en');
            },
            $global: {
                bus: bus,
                escapeSQL: escapeSQL,
                escapeCSV: escapeCSV,
                escapeJSON: escapeJSON
            }
        }, function (err, res) {
            if (err) {
                reject(err)
            } else {
                resolve(res);
            }
        });
    })
}