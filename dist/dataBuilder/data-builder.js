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
exports.buildData = void 0;
const dom_1 = require("../util/dom");
const utilites_1 = require("../util/utilites");
function buildData(userInput) {
    return __awaiter(this, void 0, void 0, function* () {
        let pages = [];
        let urlList = new Set(userInput.urls);
        let RelatedUrlList = new Set();
        for (const url of urlList) {
            pages.push(yield getPage(url, RelatedUrlList));
        }
        let innerPages = [];
        pages.forEach((page) => __awaiter(this, void 0, void 0, function* () {
            innerPages = [...yield getInnerPages(page, RelatedUrlList)];
        }));
        pages = [...pages, ...innerPages];
        return { pages, relatedPages: yield BuildRelatedFiles(RelatedUrlList) };
    });
}
exports.buildData = buildData;
function getPage(url, RelatedUrlList) {
    return __awaiter(this, void 0, void 0, function* () {
        const webPage = {};
        const page = yield (0, utilites_1.fetchData)(url);
        const ParsedPage = new dom_1.Document(page);
        ;
        console.log(ParsedPage.toString());
        getRelatedFiles(ParsedPage, url).forEach((url) => {
            RelatedUrlList.add(url.toString());
        });
        return webPage;
    });
}
function getRelatedFiles(content, baseUrl) {
    var _a;
    let relatedFiles = [];
    const querys = [{ queryString: 'link[href]', att: 'href', }, { queryString: 'script[src]', att: 'src', }, { queryString: 'style', att: 'src', }];
    let matchedTags = [];
    for (const query of querys) {
        matchedTags = content.querySelectorAll(query.queryString);
        for (const tag of matchedTags) {
            const url = new URL((_a = tag.getAttribute(query.att)) === null || _a === void 0 ? void 0 : _a.toString(), baseUrl);
            relatedFiles.push(url);
            tag.setAttribute(query.att, url.toString().split('/').pop());
        }
    }
    return relatedFiles;
}
function getInnerPages(page, RelatedUrlList) {
    return __awaiter(this, void 0, void 0, function* () {
        return [];
    });
}
function BuildRelatedFiles(RelatedUrlList) {
    return __awaiter(this, void 0, void 0, function* () {
        return [];
    });
}
