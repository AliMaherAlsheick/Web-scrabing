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
var _CSV_instances, _a, _CSV_width, _CSV_currentHeight, _CSV_parseCSVTable, _CSV_setCell;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSV = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs/promises"));
class CSV {
    constructor(document, options) {
        var _b, _c, _d;
        _CSV_instances.add(this);
        _CSV_width.set(this, void 0);
        _CSV_currentHeight.set(this, 0);
        __classPrivateFieldSet(this, _CSV_width, (_b = options.csv) === null || _b === void 0 ? void 0 : _b.Header.length, "f");
        __classPrivateFieldSet(this, _CSV_currentHeight, 1, "f");
        this.csvTable = [[]];
        this.csvTable[0] = structuredClone((_c = options.csv) === null || _c === void 0 ? void 0 : _c.Header);
        let nodesArray = [];
        for (let query of (_d = options.csv) === null || _d === void 0 ? void 0 : _d.keysQuery) {
            nodesArray.push(document.QuerySellectorAll(query));
        }
        for (let i = 1; i < __classPrivateFieldGet(this, _CSV_width, "f"); i++) {
            this.csvTable[i] = [];
            for (let j = 0; j < nodesArray.length; j++) {
                this.csvTable[i][j] = nodesArray[j][i].textContent;
            }
        }
    }
    save(dir, name) {
        var _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const csvData = __classPrivateFieldGet(CSV, _a, "m", _CSV_parseCSVTable).call(CSV, this.csvTable);
                const filePath = path.join(dir, 'data');
                try {
                    if (!((_b = (yield fs.stat(filePath))) === null || _b === void 0 ? void 0 : _b.isDirectory())) {
                        yield fs.unlink(filePath);
                        yield fs.mkdir(filePath);
                    }
                }
                catch (err) {
                    console.log('creating directory');
                    yield fs.mkdir(filePath);
                }
                yield fs.writeFile(path.join(filePath, name + '.csv'), csvData);
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
}
exports.CSV = CSV;
_a = CSV, _CSV_width = new WeakMap(), _CSV_currentHeight = new WeakMap(), _CSV_instances = new WeakSet(), _CSV_parseCSVTable = function _CSV_parseCSVTable(csvTable) {
    let table = '';
    for (let row of csvTable) {
        for (let cell of row) {
            cell.replace('"', '""');
            table += `"${cell}"`;
        }
        table += '\n';
    }
    return table;
}, _CSV_setCell = function _CSV_setCell(rowId, ColoumnId, value) {
    var _b;
    if (rowId <= 0 || ColoumnId >= __classPrivateFieldGet(this, _CSV_width, "f"))
        return;
    while (rowId >= __classPrivateFieldGet(this, _CSV_currentHeight, "f")) {
        this.csvTable.push([]);
        __classPrivateFieldSet(this, _CSV_currentHeight, (_b = __classPrivateFieldGet(this, _CSV_currentHeight, "f"), _b++, _b), "f");
    }
    this.csvTable[rowId][ColoumnId] = value;
};
