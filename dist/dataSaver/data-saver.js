"use strict";
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
exports.saveData = void 0;
const file_system_1 = require("../util/file-system");
function saveData(files, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const project = yield (0, file_system_1.createProject)(options.projectName);
        files.forEach((file) => __awaiter(this, void 0, void 0, function* () {
            yield (0, file_system_1.saveFile)(file.name, project, file.data);
        }));
    });
}
exports.saveData = saveData;
