"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
var _InputData_url;
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = exports.InputData = void 0;
const https = __importStar(require("http"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs/promises"));
const readLine = __importStar(require("readline/promises"));
const dom_1 = require("./dom");
const CSV_1 = require("./CSV");
const types_1 = require("../types/types");
const url_1 = require("url");
class InputData {
    constructor(data = []) {
        _InputData_url.set(this, void 0);
        if (this.validUrl(data[2])) {
            __classPrivateFieldSet(this, _InputData_url, new url_1.URL(data[2]), "f");
        }
        else
            throw 'invalidURL';
        this.fileType = types_1.fileType.html;
        switch (data[3].toLowerCase()) {
            case 'html':
                break;
            case 'csv':
                this.fileType = types_1.fileType.csv;
                break;
        }
        if (this.fileType === types_1.fileType.csv) {
            if ((data.length - 3) % 2 === 0) {
                this.csv = { Header: [],
                    keysQuery: [] };
                for (let i = 4; i < data.length;) {
                    this.csv.Header.push(data[i++]);
                    this.csv.Header.push(data[i++]);
                }
            }
        }
        else {
            let concat = {};
            [, , , , concat.parentQuery,
                concat.linkQuery,
                concat.childParentQuery,
                concat.childQuery] = data;
            concat.maxNum = Number(data[8]);
            concat.depth = Number(data[9]);
            this.concat = concat;
        }
    }
    validUrl(url) {
        //
        //
        //
        //
        return true;
    }
    set url(value) {
        __classPrivateFieldSet(this, _InputData_url, new url_1.URL(value), "f");
    }
    get url() {
        return __classPrivateFieldGet(this, _InputData_url, "f").toString();
    }
}
exports.InputData = InputData;
_InputData_url = new WeakMap();
function start(input) {
    return __awaiter(this, void 0, void 0, function* () {
        let operating = 10;
        //   let pageOptions=new PageOptions(arg);
        const ln = readLine.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        try {
            do {
                if (input === null || input === void 0 ? void 0 : input.url) {
                    const dir = getDataSavePath();
                    const FinishHTMLObject = yield getFinishHTMLObj(dir, input);
                    if (input.csv) {
                        const csv = new CSV_1.CSV(FinishHTMLObject, input);
                        yield csv.save(dir, FinishHTMLObject.title);
                    }
                    else {
                        yield saveHTMLPage(FinishHTMLObject.toString(), dir, FinishHTMLObject.title);
                    }
                    console.log('done');
                }
                let line = yield ln.question('please type q or Q then press enter to quite or valid url  then press enter to contine');
                if (line === 'q' || line === 'Q') {
                    console.log('quiting', line);
                    break;
                }
                input.url = line;
                console.log('continue', line, operating--);
            } while (operating);
            ln.close();
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.start = start;
function getDataSavePath() {
    const separator = path.sep;
    const dirArray = path.resolve(__dirname).split(separator);
    dirArray.pop();
    dirArray.pop();
    const dir = path.join(...dirArray);
    return dir;
}
function getFinishHTMLObj(dir, pageOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let htmlPage = yield getPage(pageOptions.url);
            yield saveHTMLPage(htmlPage, dir, pageOptions.url.toString());
            const HTMLObject = new dom_1.Document(htmlPage);
            if (pageOptions.csv && !pageOptions.concat)
                return HTMLObject;
            yield compineLinksPages(HTMLObject, pageOptions.url, pageOptions);
            return HTMLObject;
        }
        catch (error) {
            throw error;
        }
    });
}
function getPage(url) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = new Promise((resolve, reject) => {
            let request;
            try {
                let str = '';
                request = https.request(url, {
                    method: 'get'
                }, (res) => {
                    res.on('data', (data) => {
                        str += data;
                    });
                    res.on('end', () => {
                        resolve(str);
                    });
                    res.on('error', (error) => {
                        if (error instanceof Error)
                            reject(error.toString());
                    });
                });
            }
            catch (error) {
                if (error instanceof Error)
                    reject(error.toString());
            }
            finally {
                request === null || request === void 0 ? void 0 : request.end();
            }
        });
        return result;
    });
}
// export class PageOptions{
//     csv:boolean;
//     query:string;
//     container:string;
//     constructor(argument:string[]){
//         let csv:string;
//         // query=a[href=%S+%]
//         [this.query='',this.container='body',csv='']=argument
//          this.csv=Boolean(csv);
//     }
// }
function saveHTMLPage(data, dir, name) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const filePath = path.join(dir, 'data');
            try {
                if (!((_a = (yield fs.stat(filePath))) === null || _a === void 0 ? void 0 : _a.isDirectory())) {
                    yield fs.unlink(filePath);
                    yield fs.mkdir(filePath);
                }
            }
            catch (err) {
                console.log('creating directory');
                yield fs.mkdir(filePath);
            }
            yield fs.writeFile(path.join(filePath, name + '.html'), data);
        }
        catch (error) {
            throw error;
        }
    });
}
function compineLinksPages(HTMLObject, url, pageOptions) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        let nodes = HTMLObject.QuerySellectorAll((_a = pageOptions.concat) === null || _a === void 0 ? void 0 : _a.linkQuery);
        for (let node of nodes) {
            let childUrl = new url_1.URL(node.getAttribute('href'), node.getAttribute('href').startsWith('http') ? ((_b = HTMLObject.relativeUrl) !== null && _b !== void 0 ? _b : url) : undefined);
            let htmlPage = yield getPage(childUrl);
            const childHTMLObject = new dom_1.Document(htmlPage);
            const nodes = [];
            childHTMLObject.QuerySellectorAll((_c = pageOptions.concat) === null || _c === void 0 ? void 0 : _c.parentQuery).forEach((node) => {
                if (node.childNodes)
                    nodes.push(...node.childNodes);
            });
            HTMLObject.addChildren(...nodes);
            node.setAttribute('href', '#' + ((_d = childHTMLObject.parent) === null || _d === void 0 ? void 0 : _d.getAttribute('id')));
        }
    });
}
