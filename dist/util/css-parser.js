"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorParser = void 0;
const CSSCOMPINATORS = / |>|\+/g;
const SELECTORRULE = /^(?<tag>[a-zA-Z!][^#\[\]\.]*)?(?<classes>(?:\.[a-zA-Z0-9]*)*)(?<ids>(?:#[a-zA-Z0-9-_]*)*)(?<atts>(?:\[[a-zA-Z0-9-_]*(?:='[^]*'|"[^]*"|[a-zA-Z0-9-_]+)?\])*)/;
function selectorParser(selector) {
    var _a, _b;
    let result;
    const compinations = selector.split(CSSCOMPINATORS);
    const queries = compinations.map((selec) => {
        var _a, _b, _c, _d, _e, _f, _g;
        const match = SELECTORRULE.exec(selec);
        return {
            tag: (_b = (_a = match === null || match === void 0 ? void 0 : match.groups) === null || _a === void 0 ? void 0 : _a['tag']) !== null && _b !== void 0 ? _b : null,
            classes: (_d = (_c = match === null || match === void 0 ? void 0 : match.groups) === null || _c === void 0 ? void 0 : _c['classes'].split('.').slice(1)) !== null && _d !== void 0 ? _d : [],
            ids: (_f = (_e = match === null || match === void 0 ? void 0 : match.groups) === null || _e === void 0 ? void 0 : _e['ids'].split('#').slice(1)) !== null && _f !== void 0 ? _f : [],
            attributes: formateAttr((_g = match === null || match === void 0 ? void 0 : match.groups) === null || _g === void 0 ? void 0 : _g['atts']),
            compination: []
        };
    });
    result = queries[0];
    result.compination = (_b = (_a = selector.match(CSSCOMPINATORS)) === null || _a === void 0 ? void 0 : _a.map((compinator, i) => ({ compinator, compined: queries[i + 1] }))) !== null && _b !== void 0 ? _b : [];
    return result;
    function formateAttr(params) {
        var _a;
        const result = [];
        if (!params)
            return [];
        let match = /\[([^=]*?)(?:=([^=\]]*?))?\]/.exec(params);
        while (match) {
            result.push({ name: match === null || match === void 0 ? void 0 : match[1], value: (_a = match === null || match === void 0 ? void 0 : match[2]) !== null && _a !== void 0 ? _a : '' });
            match = /\[ \]/.exec(params);
        }
        return result;
    }
}
exports.selectorParser = selectorParser;
