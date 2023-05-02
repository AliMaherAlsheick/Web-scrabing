import {UserInput,ReportData, inputQuery, Query} from '../types/types'
import * as readLine from 'readline'

export async function getUserInput():Promise<UserInput>{
    //
    const question=[
        'type your project name',
        'enter url and press enter twice in case of'+
        ' you want multible urls enter them them one by one and separate them by pressing enter '+
        'and press enter twice after the last one or type exit to close app',
        'type 1 if you want to save the result as separate html files ,2 to save it in a compined html file'+
        'or  to save it as csv file',
        '',
        '',
        'enter the query for the main page then enter then the query for the other pages (we use the ancher'+
        ' that match the query and use the pages they referance to build your project)'
    ]
    const input=new Promise<UserInput>((res,rej)=>{
        const userInput:UserInput={closeApp:false,urls:[]as string[]} as UserInput;
        const rl=readLine.createInterface({
            input:process.stdin,
            output:process.stdout
       });
       function exit() {
        rl.close()
        process.exit();
    }
    function resolve() {
        rl.close()
        res(userInput);
    }
    let currentInput:number=0;
    function addURL(url:string) {
        //computed urls
            userInput.urls.push(url)
    }
       try {
        handleInput()
        rl.on('line',handleInput)
                            }catch(err) {
                               rej(err) 
                            }
        
        function handleInput(data?:string) {
            switch (currentInput) {
                case 0:
                    currentInput++;
                    break;
                case 1:
                    if (data) {
                    currentInput++;
                    userInput.projectName=data;
                    }else console.log('please enter name')
                    
                    break;
                case 2:
                    if(data==='')currentInput++;
                    else addURL(data as string)
                    break;
                    
                
                case 6:
                    if (!data) return resolve(); 
                    if (!userInput.baseQuery)userInput.baseQuery=query(data);
                    else if (!userInput.nextQuery)userInput.nextQuery=query(data);
                    else return resolve();
                    break;
                case 3:
                        switch (data) {
                            case '1':
                                userInput.saveOption={saveAs:'separated files'}
                                currentInput=6
                                break;
                            case '2':
                                userInput.saveOption={saveAs:'compined html file'}
                                currentInput=4
                                break;
                            case '3':
                                userInput.saveOption={saveAs:'csv'}
                                currentInput=5
                                break;
                            default:
                                console.log('invalid input')
                                return;
                        }
                        break;
                case 4:
                        //
                        userInput.saveOption.structure={}
                        currentInput=6;
                        break;
                case 5:
                        //
                        userInput.saveOption.structure={}
                        currentInput=6;
                        break;
            }
            if (/^exit$/i.test(data+'')) {
                userInput.closeApp=true;
            return exit();
            }
            if(currentInput>1)console.clear()
            if (userInput.projectName) {
                console.log('Project : '+userInput.projectName)
                console.log()
            }
            console.log(question[currentInput-1])
        }
    });
    return input;
    
    function query(data:string|undefined):Query {
        
        return {
            queryText:(data as string).split(':')[0],
            REGEX:RegExp((data as string).split(':')[1],(data as string).split(':')[2])
        }
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
}

// export function finalization(report:ReportData):void{

 