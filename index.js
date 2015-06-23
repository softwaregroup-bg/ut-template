var when = require('when')
var viewEngine = require('view-engine');
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

function translate(label) {
    return 'dummy translation';
}

module.exports = {
    init: function(b) {
        bus = b;
    },
    load: function(template) {
        var t = viewEngine.load(template);
        return {
            render: function(data) {
                return when.promise(function(resolve, reject) {
                    t.render({
                        params:data,
                        t: translate,
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
