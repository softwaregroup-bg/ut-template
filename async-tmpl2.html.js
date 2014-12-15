module.exports = function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      marko_node_modules_marko_async_async_fragment_tag = require("marko/node_modules/marko-async/async-fragment-tag"),
      _tag = __helpers.t,
      escapeXml = __helpers.x;

  return function render(data, out) {
    _tag(out,
      marko_node_modules_marko_async_async_fragment_tag,
      {
        "dataProvider": data.sgmessage,
        "_name": "data.sgmessage",
        "arg": {"testarg0": "0", "testarg1": "1", "testarg2": "1"},
        "errorMessage": out.captureString(function() {
            out.w('An error occurred!');
          })
      },
      function(out,user) {
        out.w('<ul><li>First name: ' +
          escapeXml(user.firstName) +
          '</li><li>Last name: ' +
          escapeXml(user.lastName) +
          '</li></ul>');
      });
  };
}