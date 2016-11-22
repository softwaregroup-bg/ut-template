exports.render = function(input, out) {
    var asyncOut = out.beginAsync();
    var params = input || {};
    params.$$ = input.$$;
    var methodName = input && input.$$ && input.$$.opcode;
    var method = out && out.global && out.global.bus && out.global.bus.importMethod && out.global.bus.importMethod(methodName);
    if (!method) {
        return Promise.reject('Cannot find bus and/or method ' + methodName);
    }
    return Promise.resolve(method(params))
        .then(function(result) {
            if (input.renderBody) {
                input.renderBody(asyncOut, result);
            }
            asyncOut.end();
            return true;
        })
        .catch(function() {
            asyncOut.write('Error');
            asyncOut.end();
        });
};
