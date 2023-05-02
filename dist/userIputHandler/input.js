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
exports.getUserInput = void 0;
const readLine = __importStar(require("readline"));
function getUserInput() {
    return __awaiter(this, void 0, void 0, function* () {
        //
        const question = [
            'type your project name',
            'enter url and press enter twice in case of' +
                ' you want multible urls enter them them one by one and separate them by pressing enter ' +
                'and press enter twice after the last one or type exit to close app',
            'type 1 if you want to save the result as separate html files ,2 to save it in a compined html file' +
                'or  to save it as csv file',
            '',
            '',
            'enter the query for the main page then enter then the query for the other pages (we use the ancher' +
                ' that match the query and use the pages they referance to build your project)'
        ];
        const input = new Promise((res, rej) => {
            const userInput = { closeApp: false, urls: [] };
            const rl = readLine.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            function exit() {
                rl.close();
                process.exit();
            }
            function resolve() {
                rl.close();
                res(userInput);
            }
            let currentInput = 0;
            function addURL(url) {
                //computed urls
                userInput.urls.push(url);
            }
            try {
                handleInput();
                rl.on('line', handleInput);
            }
            catch (err) {
                rej(err);
            }
            function handleInput(data) {
                switch (currentInput) {
                    case 0:
                        currentInput++;
                        break;
                    case 1:
                        if (data) {
                            currentInput++;
                            userInput.projectName = data;
                        }
                        else
                            console.log('please enter name');
                        break;
                    case 2:
                        if (data === '')
                            currentInput++;
                        else
                            addURL(data);
                        break;
                    case 6:
                        if (!data)
                            return resolve();
                        if (!userInput.baseQuery)
                            userInput.baseQuery = query(data);
                        else if (!userInput.nextQuery)
                            userInput.nextQuery = query(data);
                        else
                            return resolve();
                        break;
                    case 3:
                        switch (data) {
                            case '1':
                                userInput.saveOption = { saveAs: 'separated files' };
                                currentInput = 6;
                                break;
                            case '2':
                                userInput.saveOption = { saveAs: 'compined html file' };
                                currentInput = 4;
                                break;
                            case '3':
                                userInput.saveOption = { saveAs: 'csv' };
                                currentInput = 5;
                                break;
                            default:
                                console.log('invalid input');
                                return;
                        }
                        break;
                    case 4:
                        //
                        userInput.saveOption.structure = {};
                        currentInput = 6;
                        break;
                    case 5:
                        //
                        userInput.saveOption.structure = {};
                        currentInput = 6;
                        break;
                }
                if (/^exit$/i.test(data + '')) {
                    userInput.closeApp = true;
                    return exit();
                }
                if (currentInput > 1)
                    console.clear();
                if (userInput.projectName) {
                    console.log('Project : ' + userInput.projectName);
                    console.log();
                }
                console.log(question[currentInput - 1]);
            }
        });
        return input;
        function query(data) {
            return {
                queryText: data.split(':')[0],
                REGEX: RegExp(data.split(':')[1], data.split(':')[2])
            };
        }
        // const userquery:inputQuery=[{queryState:'always',query:'type your project name',key:'projectName',strigtify(name:string):string{
        //     return name;
        // }},{queryState:'always',query:'type start url',key:'baseUrl',strigtify(name:string):URL{
        //     return new URL(name);
        // }}]
        // const rl=readLine.createInterface({
        //                        input:process.stdin,
        //                        output:process.stdout
        //                   });
        // for (let i=0;i< userquery.length;i++) {
        //     if (userquery[i].queryState==='always'||(userquery[i].queryState as Function)(userInput)) {
        //         rl.question(userquery[i].query,(answer)=>{
        //             try {
        //              userInput[userquery[i].key]??userquery[i].strigtify(answer);
        //             }catch(err) {
        //                 console.log(err);
        //                 i--;
        //             }
        //         }); 
        //     }
        // }
        // } catch (error) {
        //     console.log(error)
        //     return {close:true} as UserInput;
        // }
        // do{
        //     if(input?.url){
        //         const dir=getDataSavePath();
        //         const FinishHTMLObject=await getFinishHTMLObj(dir,input);
        //         if(input.csv){
        //            const csv=new CSV(FinishHTMLObject,input);
        //            await csv.save(dir,FinishHTMLObject.title)
        //         }else{
        //             await saveHTMLPage(FinishHTMLObject.toString(),dir,FinishHTMLObject.title); 
        //         }
        //         console.log('done')
        //     }
        //     let line=await ln.question('please type q or Q then press enter to quite or valid url  then press enter to contine')
        //     if(line==='q'||line==='Q'){
        //         console.log('quiting',line);
        //         break;
        //     }
        //     input.url=line;
        //     console.log('continue',line,operating--);
        // }while(operating)      
    });
}
exports.getUserInput = getUserInput;
// export function finalization(report:ReportData):void{
