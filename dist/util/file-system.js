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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = exports.saveFile = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs/promises"));
function getSavePath() {
    return __awaiter(this, void 0, void 0, function* () {
        const separator = path.sep;
        const dirArray = path.resolve(__dirname).split(separator);
        dirArray.pop();
        dirArray.pop();
        const dir = path.join(...dirArray, 'data');
        yield createDir(dir);
        return dir;
    });
}
function saveFile(fileName, projectPath, data) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const file = path.join(projectPath, fileName);
            try {
                if ((_a = (yield fs.stat(file))) === null || _a === void 0 ? void 0 : _a.isDirectory())
                    yield fs.rmdir(file);
                if ((_b = (yield fs.stat(file))) === null || _b === void 0 ? void 0 : _b.isSymbolicLink())
                    yield fs.unlink(file);
            }
            catch (err) {
                console.log(err);
            }
            console.log('creating file');
            yield fs.writeFile(file, data);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.saveFile = saveFile;
function createProject(name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dataDir = yield getSavePath();
            const dir = path.join(dataDir, name);
            yield createDir(dir);
            return dir;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.createProject = createProject;
function createDir(dir) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            try {
                if ((_a = (yield fs.stat(dir))) === null || _a === void 0 ? void 0 : _a.isDirectory())
                    return;
                if ((_b = (yield fs.stat(dir))) === null || _b === void 0 ? void 0 : _b.isSymbolicLink())
                    yield fs.unlink(dir);
                yield fs.rm(dir);
            }
            catch (err) {
                console.log(err);
            }
            console.log('creating directory');
            yield fs.mkdir(dir);
            return;
        }
        catch (error) {
            throw error;
        }
    });
}
