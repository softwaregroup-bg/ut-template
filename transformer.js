'use strict';
var util = require('util');
var Taglib = require('marko/compiler/taglibs/Taglib');
var Tag = Taglib.Tag;
var Att = Taglib.Attribute;
var renderer  = require.resolve('./renderer');

function UTLib(methods){
    Taglib.call(this, 'ut');
    methods && methods.forEach(this.addMethod.bind(this));
}

util.inherits(UTLib, Taglib);

UTLib.prototype.addMethod = function (name){
    var t=new Tag(this);
    t.name = name;
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
    this.addTag(t);
}

var taglib;

var t = {
    pattern :  /\$\[([^\]]+)\]/gi,
    escape: /['\\]/g,
    replace: function(match, label){
        return '${t(\'' + label.replace(t.escape, '\\$&') + '\')}';
    },
    preProcess: function(template) {
        function preProcess(node){
            node.forEachChild(function(node) {
                if (node.nodeType === 'text' && node.text.indexOf('$[') !== -1){
                    node.text = node.text.replace(t.pattern, t.replace);
                } else {
                    preProcess(node); // do recursively for all non-text children
                }
            });
        }
        preProcess(template.rootNode);
    }
};

module.exports = function transform(node, compiler, template) {
    var templateType = template.path.split('.').slice(-2)[0];
    if (node.localName == 'c-template') {
        switch (templateType) {
            case 'sql':
                node.escapeXmlBodyText = false;
            case 'json':
            case 'csv':
                compiler.options.preserveWhitespace = true;
            default:
                break;
        }
    } else if (node.namespace && node.namespace.startsWith('ut-')){
        var tagName = node.namespace + ':' + node._localName;
        if (!taglib){
            taglib = new UTLib([tagName]);
            compiler.taglibs.addTaglib(taglib);
        } else if(!taglib.tags[tagName]) {
            taglib.addMethod(tagName);
            compiler.taglibs.merged.tags[tagName] = taglib.tags[tagName];
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
    }
    if (!template.hasVar('escapeXml')) {
        switch (templateType) {
            case 'sql':
                template.addVar('escapeXml', 'out.global.escapeSQL');
                break;
            case 'json':
                template.addVar('escapeXml', 'out.global.escapeJSON');
                break;
            case 'csv':
                template.addVar('escapeXml', 'out.global.escapeCSV');
                break;
            default:
                break;
        }
    }
    if (!template.hasVar('params')) {
        template.addVar('params', 'data.params');
    }
    if (!template.hasVar('t')) {
        template.addVar('t', 'data.t');
        t.preProcess(template);
    }
}