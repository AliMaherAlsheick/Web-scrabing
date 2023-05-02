"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _a, _ElementNode_children, _ElementNode_createElement, _Document_instances, _b, _Document_head, _Document_body, _Document_parsePage, _Document_getHead, _Document_getBody;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Document = exports.Body = exports.Head = exports.ElementNode = exports.TextNode = void 0;
const data_structure_1 = require("./data-structure");
class Node extends data_structure_1.TreeLeaf {
    constructor(parent, value, ...children) {
        super(parent, value, ...children);
    }
}
class TextNode extends Node {
    constructor(parent, value) {
        super(parent, value);
    }
    toString() {
        return this.value;
    }
}
exports.TextNode = TextNode;
class ElementNode extends Node {
    constructor(parent, openTag, childrenData) {
        super(parent, __classPrivateFieldGet(ElementNode, _a, "m", _ElementNode_createElement).call(ElementNode, openTag.toLowerCase()));
        this.single = false;
        _ElementNode_children.set(this, null);
        this.parseChildren(childrenData);
    }
    get innerText() {
        return '';
    }
    get textContent() {
        return '';
    }
    get children() {
        return this.children;
    }
    get childNodes() {
        return super.subLeaves;
    }
    getChild(num) {
        var _c;
        return (_c = __classPrivateFieldGet(this, _ElementNode_children, "f")) === null || _c === void 0 ? void 0 : _c[num];
    }
    getChildNode(num) {
        var _c;
        return (_c = this.children) === null || _c === void 0 ? void 0 : _c[num];
    }
    toString() {
        var _c, _d, _e;
        if (this.single)
            return '<' + this.value + '/>';
        return (_e = '<' + this.value.ElementName + ' ' + this.value.attributes.map((attribute) => {
            return attribute.attributeName + '="' + attribute.attributeValues.join(' ') + '"';
        }).join(' ') + '>' + ((_d = ((_c = this.childNodes) === null || _c === void 0 ? void 0 : _c.map((value) => value.toString()))) === null || _d === void 0 ? void 0 : _d.join(''))) !== null && _e !== void 0 ? _e : '' + '</' + this.value.ElementName + '>';
    }
    parseChildren(data) {
        // const stack=[];
        // let index=this.#start;
        // for(let i=0;i< data.length;i++){
        // if(data.charAt(i)==='<') {
        //   let currentTag=new ElementNode(this,i,data);
        //   if(['br'].includes(currenttag.Name))this.single=true;
        //   if(currentTag)this.addChildNode(currentTag)
        // }
        // }
        // if(name==='document'){
        // 
        // 
        // }
    }
    querySelectorAll(queryString) {
        const nodes = [];
        //
        //
        //
        //
        //
        return nodes;
    }
    setAttribute(attribute, value) {
        // 
        // 
        // 
    }
    getAttribute(name) {
        // 
        // 
        // 
        return '';
    }
    // createChild(type:string,childerns:(ElementNode|string)[],...pro:string[]){
    // // 
    // // 
    // // 
    // // 
    // // 
    // }
    addChildren(...nodes) {
        super.addChildren(...nodes);
    }
}
exports.ElementNode = ElementNode;
_a = ElementNode, _ElementNode_children = new WeakMap(), _ElementNode_createElement = function _ElementNode_createElement(openTag) {
    const tag = openTag.split(' ');
    const element = {
        ElementName: tag.shift(),
        attributes: tag.map((attr) => {
            const attribute = attr.split('=');
            attribute.map((value) => value.replace(/['"`]/, ''));
            return { attributeName: attribute[0],
                attributeValues: attribute[1].split(' ')
            };
        })
    };
    return element;
};
class Head extends ElementNode {
    constructor(parent, openTag, childrenData) {
        super(parent, '<head>', childrenData);
        //this.title='' 
        //
        //
        //
    }
    get title() {
        return '';
    }
}
exports.Head = Head;
class Body extends ElementNode {
    constructor(parent, openTag, childrenData) {
        super(parent, (openTag.toLowerCase().startsWith('body')) ? openTag : 'body', childrenData);
        //
        //
        //
        //
        //
    }
}
exports.Body = Body;
class Document extends ElementNode {
    constructor(data) {
        super(null, ...__classPrivateFieldGet(Document, _b, "m", _Document_parsePage).call(Document));
        _Document_instances.add(this);
        _Document_head.set(this, void 0);
        _Document_body.set(this, void 0);
        __classPrivateFieldSet(this, _Document_head, __classPrivateFieldGet(this, _Document_instances, "m", _Document_getHead).call(this, data), "f");
        __classPrivateFieldSet(this, _Document_body, __classPrivateFieldGet(this, _Document_instances, "m", _Document_getBody).call(this, data), "f");
    }
    get title() {
        return __classPrivateFieldGet(this, _Document_head, "f").title;
    }
    ;
    ;
}
exports.Document = Document;
_b = Document, _Document_head = new WeakMap(), _Document_body = new WeakMap(), _Document_instances = new WeakSet(), _Document_parsePage = function _Document_parsePage() {
    //
    //
    //
    //
    //
    return ['document', ''];
}, _Document_getHead = function _Document_getHead(data) {
    let head = '';
    // 
    // 
    // 
    return new Head(this, head || '<head>', data);
}, _Document_getBody = function _Document_getBody(data) {
    let body = '';
    // 
    // 
    // 
    // 
    // 
    return new Body(this, body || '<body>', data);
};
