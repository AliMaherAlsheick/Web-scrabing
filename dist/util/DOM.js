"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Node_parent, _TextNode_content, _ElementNode_instances, _ElementNode_content, _ElementNode_attributes, _ElementNode_match, _ParentElement_instances, _ParentElement_parseHTML, _Script_code, _Style_css, _Head_title, _Document_head, _Document_body;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Document = exports.Body = exports.Head = exports.ElementNode = exports.AttributeNode = exports.TextNode = void 0;
const css_parser_1 = require("./css-parser");
const HTMLREGEX = /<\/?[a-z!][^<]*?(?:\s+?(?:[^<]*?|'[^]*?'|"*?"))*?\s*?\/?>/ig;
const CLOSEHTMLTAG = /<\/([^]*)>/ig;
const SELFCLOSEDHTMLTAG = /<(?:[a-z!][^]*?\s*?\/\s*|meta[^]*?|br[^]*?|link[^]*?|img[^]*?|hr[^]*?)>/ig;
class Node {
    constructor(parent) {
        _Node_parent.set(this, void 0);
        __classPrivateFieldSet(this, _Node_parent, parent, "f");
    }
    set parent(parent) {
        __classPrivateFieldSet(this, _Node_parent, parent, "f");
    }
    get parent() {
        return __classPrivateFieldGet(this, _Node_parent, "f");
    }
}
_Node_parent = new WeakMap();
class TextNode extends Node {
    constructor(parent, value) {
        super(parent);
        _TextNode_content.set(this, void 0);
        __classPrivateFieldSet(this, _TextNode_content, value, "f");
    }
    match(str) {
        return false;
    }
    toString() {
        return __classPrivateFieldGet(this, _TextNode_content, "f");
    }
}
exports.TextNode = TextNode;
_TextNode_content = new WeakMap();
class AttributeNode extends Node {
    constructor(parent, attr) {
        var _a, _b, _c;
        super(parent);
        this.attribute = (_a = attr === null || attr === void 0 ? void 0 : attr.split('=')[0]) === null || _a === void 0 ? void 0 : _a.trim();
        this.value = (_c = (_b = attr === null || attr === void 0 ? void 0 : attr.split('=')[1]) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : '';
    }
    match(att) {
        return RegExp('^\\s*' + att + '\\s*$', 'i').test(this.attribute);
    }
    toString() {
        return this.attribute + '=' + this.value;
    }
}
exports.AttributeNode = AttributeNode;
class ElementNode extends Node {
    constructor(parent, tag) {
        var _a, _b;
        super(parent);
        _ElementNode_instances.add(this);
        this.closed = false;
        _ElementNode_content.set(this, void 0);
        _ElementNode_attributes.set(this, []);
        this.childNodes = [];
        const match = (_a = tag === null || tag === void 0 ? void 0 : tag.slice(1, -1)) === null || _a === void 0 ? void 0 : _a.trimEnd().split(/\s/);
        __classPrivateFieldSet(this, _ElementNode_content, match[0], "f");
        const me = this;
        match === null || match === void 0 ? void 0 : match.shift();
        __classPrivateFieldSet(this, _ElementNode_attributes, [...((_b = match === null || match === void 0 ? void 0 : match.map((attr) => new AttributeNode(me, attr))) !== null && _b !== void 0 ? _b : [])], "f");
        if (SELFCLOSEDHTMLTAG.test(tag))
            this.closed = true;
    }
    match(str) {
        if (typeof str == 'string')
            return __classPrivateFieldGet(this, _ElementNode_content, "f").includes(str.slice(2, -1));
        if (str instanceof ElementNode)
            return __classPrivateFieldGet(this, _ElementNode_content, "f").includes(__classPrivateFieldGet(str, _ElementNode_content, "f"));
        if (str instanceof TextNode)
            return false;
    }
    get innerText() {
        var _a;
        return (_a = this.childNodes) === null || _a === void 0 ? void 0 : _a.map((node) => {
            if (node.constructor.name === 'ElementNode')
                return node.innerText;
            return node.toString();
        }).join('');
    }
    get textHTML() {
        var _a;
        return (_a = this.childNodes) === null || _a === void 0 ? void 0 : _a.join('');
    }
    get children() {
        var _a;
        return (_a = this.childNodes) === null || _a === void 0 ? void 0 : _a.filter((value) => { return value.constructor.name === 'ElementNode'; });
    }
    getChild(num) {
        var _a;
        return (_a = this.children) === null || _a === void 0 ? void 0 : _a[num];
    }
    getChildNode(num) {
        return this.childNodes[num];
    }
    toString() {
        var _a;
        if (this.childNodes.length)
            return '<' + __classPrivateFieldGet(this, _ElementNode_content, "f") + ' ' + __classPrivateFieldGet(this, _ElementNode_attributes, "f").join(' ') + '>' + ((_a = this.childNodes) === null || _a === void 0 ? void 0 : _a.join('')) + '</' + __classPrivateFieldGet(this, _ElementNode_content, "f") + '>';
        return '<' + __classPrivateFieldGet(this, _ElementNode_content, "f") + ' ' + __classPrivateFieldGet(this, _ElementNode_attributes, "f").join(' ') + '/>';
    }
    hasAttribute(att) {
        return __classPrivateFieldGet(this, _ElementNode_attributes, "f").some((atri) => atri.match(att));
    }
    querySelectorAll(queryString, reg) {
        let nodes = [];
        const queryResault = (0, css_parser_1.selectorParser)(queryString);
        if (__classPrivateFieldGet(this, _ElementNode_instances, "m", _ElementNode_match).call(this, queryResault, this)
            &&
                (!reg || (reg === null || reg === void 0 ? void 0 : reg.test(this.innerText))))
            nodes.push(this);
        this.children.forEach((child) => {
            nodes = [...nodes, ...child.querySelectorAll(queryString)];
        });
        return nodes;
    }
    setAttribute(attribute, value) {
        __classPrivateFieldGet(this, _ElementNode_attributes, "f").forEach((atri) => { if (atri.match(attribute))
            atri.value = value; });
    }
    getAttribute(name) {
        return __classPrivateFieldGet(this, _ElementNode_attributes, "f").find((atri) => atri.match(name));
    }
}
exports.ElementNode = ElementNode;
_ElementNode_content = new WeakMap(), _ElementNode_attributes = new WeakMap(), _ElementNode_instances = new WeakSet(), _ElementNode_match = function _ElementNode_match(matcher, Element) {
    var _a, _b, _c, _d;
    // add compinators
    const classList = (_b = (_a = Element.getAttribute('class')) === null || _a === void 0 ? void 0 : _a.toString()) === null || _b === void 0 ? void 0 : _b.split(/\s+/);
    const idList = (_d = (_c = Element.getAttribute('id')) === null || _c === void 0 ? void 0 : _c.toString()) === null || _d === void 0 ? void 0 : _d.split(/\s+/);
    return (!matcher.tag || matcher.tag === __classPrivateFieldGet(Element, _ElementNode_content, "f")) && (!matcher.classes.length ||
        matcher.classes.every((Class) => classList === null || classList === void 0 ? void 0 : classList.includes(Class)))
        && (!matcher.ids.length ||
            matcher.ids.every((id) => idList === null || idList === void 0 ? void 0 : idList.includes(id)))
        && (!matcher.attributes.length ||
            matcher.attributes.every((attribute) => {
                var _a, _b;
                return (_b = ((_a = Element.getAttribute(attribute.name)) === null || _a === void 0 ? void 0 : _a.toString()) === attribute.name + '=' + attribute.value) !== null && _b !== void 0 ? _b : '';
            }));
};
class ParentElement extends ElementNode {
    constructor(parent, tag, content) {
        var _a, _b;
        super(parent, tag);
        _ParentElement_instances.add(this);
        const me = this;
        this.childNodes = __classPrivateFieldGet(this, _ParentElement_instances, "m", _ParentElement_parseHTML).call(this, content.split(/<script(?:\s+?(?:[^<]*?|'[^]*?'|"*?"))*?\s*?\/?>[^]*?<\/script\s*?\/?>/ig).join(''));
        this.childNodes = [...this.childNodes, ...(_b = ((_a = content.match(/<script(?:\s+?(?:[^<]*?|'[^]*?'|"*?"))*?\s*?\/?>[^]*?<\/script\s*?\/?>/ig)) === null || _a === void 0 ? void 0 : _a.map((script) => new Script(me, script)))) !== null && _b !== void 0 ? _b : []];
    }
}
_ParentElement_instances = new WeakSet(), _ParentElement_parseHTML = function _ParentElement_parseHTML(data) {
    var _a;
    const childNodes = [];
    const tags = (_a = data.match(HTMLREGEX)) !== null && _a !== void 0 ? _a : [];
    const children = data === null || data === void 0 ? void 0 : data.split(HTMLREGEX);
    if (children[0]) {
        childNodes.push(new TextNode(this, children[0]));
    }
    for (let i = 0; i < (tags === null || tags === void 0 ? void 0 : tags.length); i++) {
        if (CLOSEHTMLTAG.test(tags[i])) {
            for (let index = childNodes.length - 1; index >= 0; index--) {
                if (childNodes[index].match(tags[i])) {
                    handleUnclosedTags(childNodes, index);
                    break;
                }
            }
        }
        else {
            childNodes.push(new ElementNode(this, tags[i]));
            if (children[i + 1])
                childNodes.push(new TextNode(this, children[i + 1]));
        }
        console.log('par', children, childNodes);
    }
    return childNodes;
    // let stack:string[]=[]
    //     if (children[0]) {
    //         childNodes.push(new TextNode(this,children[0]))
    //     }
    //     for (let i=0;i<tags?.length;i++) {
    //         console.log('tags in parser',tags.join(' | '))
    //         let closetag=CLOSEHTMLTAG.exec(tags[i])
    //         if ( closetag)for (let j=stack.length-1;j>=0;j--) {
    //             if(stack[j].match(RegExp(closetag[1],'i'))){
    //                 stack=stack.slice(0,j)
    //                 break
    //             };
    //         } else{
    //             if(!stack.length){
    //                 childNodes.push(new ElementNode(this,tags[i]))
    //                 if(OPENHTMLTAG.test(tags[i]))stack.push(tags[i])
    //             }else{
    //                 (childNodes[childNodes.length-1] as ElementNode).
    //                 childNodes.push(new ElementNode(this,tags[i]));
    //                 if(OPENHTMLTAG.test(tags[i]))stack.push(tags[i])
    //             } 
    //         }
    //     if(!stack.length){   
    //             childNodes.push(new TextNode(this,children[i+1]));
    //     }else{
    //         (childNodes[childNodes.length-1] as ElementNode)
    //         .childNodes.push(new TextNode(this,children[i+1]));
    //     } 
    //     }
};
function handleUnclosedTags(nodes, index) {
    for (let i = nodes.length - 1; i > index; i--) {
        if (nodes[i] instanceof ElementNode && !nodes[i].closed) {
            if (!nodes[i].match(nodes[i + 1])) {
                let j = i + 2;
                for (; j < nodes.length; j++) {
                    if (nodes[j].match(nodes[j]))
                        break;
                }
                addChildren(i + 1, j - 1);
            }
        }
    }
    addChildren(index);
    function addChildren(index, end) {
        nodes[index].childNodes = [...nodes[index].childNodes,
            ...nodes[index].childNodes.splice(index, (end !== null && end !== void 0 ? end : (nodes.length - 1)) - index + 1)];
        // console.log('hand',nodes[nodes.length-1].toString(),nodes[nodes.length-2].toString());
        nodes[index].closed = true;
    }
}
class Script extends ElementNode {
    constructor(parent, tag) {
        var _a, _b, _c, _d;
        super(parent, (_b = (_a = tag.match(/<script(?:\s+?(?:[^<]*?|'[^]*?'|"*?"))*?\s*?\/?>/ig)) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : '');
        _Script_code.set(this, void 0);
        __classPrivateFieldSet(this, _Script_code, (_d = (_c = tag.match(/(?<=<script(?:\s+?(?:[^<]*?|'[^]*?'|"*?"))*?\s*?\/?>)[^]*?(?=<\/script\s*?\/?>)/ig)) === null || _c === void 0 ? void 0 : _c[0]) !== null && _d !== void 0 ? _d : '', "f");
    }
    toString() {
        if (__classPrivateFieldGet(this, _Script_code, "f"))
            return super.toString().slice(0, -2) + '>' + __classPrivateFieldGet(this, _Script_code, "f") + '</script>';
        return super.toString();
    }
}
_Script_code = new WeakMap();
class Style extends ElementNode {
    constructor(parent, tag) {
        var _a, _b, _c, _d;
        super(parent, (_b = (_a = tag.match(/<style(?:\s+?(?:[^<]*?|'[^]*?'|"*?"))*?\s*?\/?>/ig)) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : '');
        _Style_css.set(this, void 0);
        __classPrivateFieldSet(this, _Style_css, (_d = (_c = tag.match(/(?<=<style(?:\s+?(?:[^<]*?|'[^]*?'|"*?"))*?\s*?\/?>)[^]*?(?=<\/style\s*?\/?>)/ig)) === null || _c === void 0 ? void 0 : _c[0]) !== null && _d !== void 0 ? _d : '', "f");
    }
}
_Style_css = new WeakMap();
class Head extends ParentElement {
    constructor(parent, content) {
        var _a, _b;
        super(parent, '<head>', content.split(/<style(?:\s+?(?:[^<]*?|'[^]*?'|"*?"))*?\s*?\/?>[^]*?<\/style\s*?\/?>/ig).join(''));
        _Head_title.set(this, void 0);
        __classPrivateFieldSet(this, _Head_title, this.querySelectorAll('title')[0].innerText, "f");
        const me = this;
        this.childNodes = [...this.childNodes, ...(_b = ((_a = content.match(/<style(?:\s+?(?:[^<]*?|'[^]*?'|"*?"))*?\s*?\/?>[^]*?<\/style\s*?\/?>/ig)) === null || _a === void 0 ? void 0 : _a.map((style) => new Style(me, style)))) !== null && _b !== void 0 ? _b : []];
    }
    get title() {
        return __classPrivateFieldGet(this, _Head_title, "f");
    }
    set title(str) {
        __classPrivateFieldSet(this, _Head_title, str, "f");
    }
}
exports.Head = Head;
_Head_title = new WeakMap();
class Body extends ParentElement {
    constructor(parent, content) {
        super(parent, '<body>', content);
    }
}
exports.Body = Body;
class Document {
    constructor(data) {
        var _a, _b, _c, _d;
        _Document_head.set(this, void 0);
        _Document_body.set(this, void 0);
        this.parent = null;
        data = data.split(/<!doctype (?:\s\n*?(?:[^<]*?|'[^]*?'|"*?")?)*?>/ig).join('');
        data = data.split(/<html(?:\s\n*?(?:[^<]*?|'[^]*?'|"*?")?)*?>/ig).join('');
        __classPrivateFieldSet(this, _Document_head, new Head(this, (_b = ((_a = data.match(/(?<=<head>)[^]*?(?=<\/head>)/i)) === null || _a === void 0 ? void 0 : _a[0])) !== null && _b !== void 0 ? _b : ''), "f");
        __classPrivateFieldSet(this, _Document_body, new Body(this, (_d = ((_c = data.match(/(?<=<body>)[^]*?(?=<\/body>)/i)) === null || _c === void 0 ? void 0 : _c[0])) !== null && _d !== void 0 ? _d : data.split(/<head>[^]*<\/head>/i).join('')), "f");
        console.log(this.toString());
    }
    toString() {
        return '<html>' + __classPrivateFieldGet(this, _Document_head, "f").toString() + __classPrivateFieldGet(this, _Document_body, "f").toString() + '</html>';
    }
    querySelectorAll(queryString) {
        return __classPrivateFieldGet(this, _Document_body, "f").querySelectorAll(queryString);
    }
    get title() {
        return __classPrivateFieldGet(this, _Document_head, "f").title;
    }
    get head() {
        return __classPrivateFieldGet(this, _Document_head, "f");
    }
    ;
    get body() {
        return __classPrivateFieldGet(this, _Document_body, "f");
    }
    ;
}
exports.Document = Document;
_Document_head = new WeakMap(), _Document_body = new WeakMap();
