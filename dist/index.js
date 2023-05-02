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
const input_1 = require("./userIputHandler/input");
const data_builder_1 = require("./dataBuilder/data-builder");
const data_saver_1 = require("./dataSaver/data-saver");
const project_files_builder_1 = require("./ProjectFilesBuilder/project-files-builder");
//main loop
try {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        do {
            try {
                const userInput = yield (0, input_1.getUserInput)();
                const data = yield (0, data_builder_1.buildData)(userInput);
                const files = (0, project_files_builder_1.buildProjectFiles)(data, userInput);
                (0, data_saver_1.saveData)(files, userInput);
            }
            catch (error) {
                console.log(error);
            }
        } while (true);
    }))();
}
catch (error) {
    console.log(error);
}
