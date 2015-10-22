var when = require('when');
var viewEngine = require('view-engine');
var Path = require('path');
var _undefined;
viewEngine.register('marko', require('./view-engine-marko'));
var markoCompiler = require('marko/compiler');
var marko = require('marko');

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
        console.log('template:');
        console.log(tmpl);
        return {
            render: function(data, language) {
                if (!data) {
                    data = {};
                }
                return when.promise(function(resolve, reject) {
                    tmpl.render({
                        params:data,
                        t: function(label) {
                            return translate(label, language || data.language || 'en');
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

    },
    compile: function(templateContent, data, engine) {
        if (!templateContent) {
            templateContent = '';
        }
        if (engine === 'marko') {
            return markoCompiler.compile(templateContent, require.resolve('./'), function (err, compiledTemplate) {
                if (err) {
                    return rej(err);
                }
                var tmpl = marko.load(require.resolve('./'), compiledTemplate);
                return {
                    render: function (data, language) {
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
                }
            });
        }

    },
    compileOld: function(templateContent, templatePath, engine) {
        if (!templateContent) {
            templateContent = '';
        }
        if (!templatePath) {
            templatePath = './';
        }
        if (engine === 'marko') {
            return when.promise(function(res, rej) {
                markoCompiler.compile(templateContent, templatePath, function (err, compiledTemplate) {
                    if (err) {
                        return rej(err);
                    }
                    console.log('compiledTemplate:');
                    console.log(compiledTemplate);
                    console.log('compiledTemplate type:');
                    console.log(typeof compiledTemplate);
                    var exec = new Function( compiledTemplate );
                    marko.
                    console.log('exports:');
                    console.log(exports);
                    console.log('exports.create:');
                    console.log(exports.create);
                    var tmpl = exports.create;

                    res( {
                        render: function (data, language) {
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
                            });
                        }
                    });
                });
            });
        } else {
            return {};
        }
    },
    compileNew: function(templateContent, data, engine) {
        var tmpl = viewEngine.load(template);
        console.log('template:');
        console.log(tmpl);
        var tmpl = require('marko').load(require.resolve('./'),compiledTemplate);
        return {
            render: function(data, language) {
                if (!data) {
                    data = {};
                }
                return when.promise(function(resolve, reject) {
                    tmpl.render({
                        params:data,
                        t: function(label) {
                            return translate(label, language || data.language || 'en');
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

    },
}
