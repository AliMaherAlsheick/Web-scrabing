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
var _TreeLeaf_parent, _TreeLeaf_children, _TreeLeaf_value, _Tree_elements;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tree = exports.TreeLeaf = void 0;
class TreeLeaf {
    constructor(parent, value, ...children) {
        _TreeLeaf_parent.set(this, void 0);
        _TreeLeaf_children.set(this, void 0);
        _TreeLeaf_value.set(this, void 0);
        __classPrivateFieldSet(this, _TreeLeaf_parent, parent, "f");
        __classPrivateFieldSet(this, _TreeLeaf_value, value, "f");
        __classPrivateFieldSet(this, _TreeLeaf_children, children.length ? new Tree() : null, "f");
    }
    addChildren(...treeLeaf) {
        if (__classPrivateFieldGet(this, _TreeLeaf_children, "f"))
            __classPrivateFieldGet(this, _TreeLeaf_children, "f").add(...treeLeaf);
        else
            __classPrivateFieldSet(this, _TreeLeaf_children, new Tree(...treeLeaf), "f");
    }
    get value() {
        return __classPrivateFieldGet(this, _TreeLeaf_value, "f");
    }
    get parent() {
        return __classPrivateFieldGet(this, _TreeLeaf_parent, "f");
    }
    get subLeaves() {
        if (__classPrivateFieldGet(this, _TreeLeaf_children, "f"))
            return __classPrivateFieldGet(this, _TreeLeaf_children, "f").elements;
        return null;
    }
}
exports.TreeLeaf = TreeLeaf;
_TreeLeaf_parent = new WeakMap(), _TreeLeaf_children = new WeakMap(), _TreeLeaf_value = new WeakMap();
class Tree {
    constructor(...leaves) {
        _Tree_elements.set(this, []);
        this.length = __classPrivateFieldGet(this, _Tree_elements, "f").length;
        __classPrivateFieldGet(this, _Tree_elements, "f").push(...leaves);
        length = __classPrivateFieldGet(this, _Tree_elements, "f").length;
    }
    get elements() {
        if (__classPrivateFieldGet(this, _Tree_elements, "f").length)
            return __classPrivateFieldGet(this, _Tree_elements, "f");
        return null;
    }
    add(...leaves) {
        __classPrivateFieldGet(this, _Tree_elements, "f").push(...leaves);
        length = __classPrivateFieldGet(this, _Tree_elements, "f").length;
    }
}
exports.Tree = Tree;
_Tree_elements = new WeakMap();
