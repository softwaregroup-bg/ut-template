'use strict';
var Tag = require('marko/compiler/taglibs/Taglib').Tag;
var Att = require('marko/compiler/taglibs/Taglib').Attribute;
var renderer  = require.resolve('./renderer');

function UTLib(methods){
    this.tags = {};
    methods && methods.forEach(this.addMethod.bind(this));
}

UTLib.prototype.id = 'ut';

UTLib.prototype.addMethod = function (name){
    var t=new Tag();
    t.name = 'ut-'+name;
    t.renderer = renderer;
    t.nestedVariables={
        vars:[{nameFromAttribute:'var'}],
    };
    var a=new Att('*');
    t.addAttribute(a);
    a.dynamicAttribute = false;
    delete a.targetProperty;
    a=new Att('var');
    a.type = 'identifier';
    t.addAttribute(a);
    this.tags[t.name]=t;
}

var taglib;

module.exports = function transform(node, compiler, template) {
    if (node.localName == 'c-template'){
        if (template.path.endsWith('.sql.marko') || template.path.endsWith('.json.marko') || template.path.endsWith('.csv.marko')) {
            compiler.options.preserveWhitespace = true;
        }
    } else if (node.namespace && node.namespace.startsWith('ut-')){
        if (!taglib){
            taglib = new UTLib(['security:login','namespace:method']);
            compiler.taglibs.addTaglib(taglib);
        }

        if (!node.getProperty('$$opcode')) {
            node.setProperty('$$opcode', '\'' + node.namespace.substr(3) + '.' + node._localName + '\'');
        }

        var $$=[];
        var propsToRemove = [];

        node.forEachProperty(function (name, value) {
            if (name.startsWith('$$')) {
                $$.push(JSON.stringify(name.substring('$$'.length)) + ': ' + value);
                propsToRemove.push(name);
            }
        });

        propsToRemove.forEach(function (propName) {
            node.removeProperty(propName);
        });

        if ($$.length) {
            node.setProperty('$$', template.makeExpression('{' + $$.join(', ') + '}'));
        }

        if (!template.hasVar('escapeXml')) {
            if (template.path.endsWith('.sql.marko')) {
                template.addVar('escapeXml', 'out.global.escapeSQL');
            } else
            if (template.path.endsWith('.json.marko')) {
                template.addVar('escapeXml', 'out.global.escapeJSON');
            } else
            if (template.path.endsWith('.csv.marko')) {
                template.addVar('escapeXml', 'out.global.escapeCSV');
            };
        }
        if (!template.hasVar('params')) {
            template.addVar('params', 'data.params');
        }
    }
}