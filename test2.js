var markoExt = require('./marko-ext');

var data = {
    name: 'Frank',
    count: 30
};

markoExt.render('async-tmpl2.html', data, process.stdout);
