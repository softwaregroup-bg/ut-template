var when = require('when');
var methods = {};
exports.render = function(input, out) {
    var asyncOut = out.beginAsync();
    var params = input || {};
    params.$$ = input.$$;
    var methodName = input && input.$$ && input.$$.opcode
    var method = out && out.global && out.global.bus && out.global.bus.importMethod && out.global.bus.importMethod(methodName);
    if (!method) {
        return when.reject('Cannot find bus and/or method ' + methodName)
    }
    when(method(params))
        .then(function(result) {
            if (input.renderBody) {
                input.renderBody(asyncOut, result);
            }
            asyncOut.end();
        })
        .catch(function(err) {
            asyncOut.write('Error');
            asyncOut.end();
        })
        .done();
}
