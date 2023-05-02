import * as https from 'http';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as readLine from 'readline/promises'
import { Document,ElementNode,TextNode } from './dom';
import { CSV } from './CSV';
import { catType, fileType } from '../types/types';
import { URL } from 'url';
export class InputData{
    fileType:fileType;
    csv:{
        Header:string[];
        keysQuery:string[];
    }|undefined;
    concat:catType|undefined;
    #url:URL;
    constructor(data:string[]=[]){
        if(this.validUrl(data[2])){
            this.#url=new URL(data[2]);
        }else throw 'invalidURL';
        this.fileType=fileType.html;
        switch(data[3].toLowerCase()){
          case 'html'  :
            break;
          case 'csv':
            this.fileType=fileType.csv;
            break;
        }
        if(this.fileType===fileType.csv){
            if((data.length-3)%2===0){
                this.csv={Header:[],
                keysQuery:[]};
                for(let i=4;i < data.length;){
                        this.csv.Header.push(data[i++])
                        this.csv.Header.push(data[i++])
                    }
            }
        }
            else{
                let concat={}as {[index:string]:string|number;}
                [,,,,concat.parentQuery,
                    concat.linkQuery,
                    concat.childParentQuery,
                    concat.childQuery]=data
                    concat.maxNum=Number(data[8]);
                    concat.depth=Number(data[9]);
                this.concat=concat as unknown as catType
            }
    }
    validUrl(url:string){
        //
        //
        //
        //

        return true;
    }
    set url(value:string){
        this.#url=new URL(value)
    }
    get url(){
      return  this.#url.toString();
    }
  }
  export async function start(input:InputData){
    let operating=10;
 //   let pageOptions=new PageOptions(arg);
    const ln=readLine.createInterface({
        input:process.stdin,
        output:process.stdout
    });
    try {
        do{
            if(input?.url){
                const dir=getDataSavePath();
                const FinishHTMLObject=await getFinishHTMLObj(dir,input);
                if(input.csv){
                   const csv=new CSV(FinishHTMLObject,input);
                   await csv.save(dir,FinishHTMLObject.title)
                }else{
                    await saveHTMLPage(FinishHTMLObject.toString(),dir,FinishHTMLObject.title); 
                }
                
                console.log('done')
            }
            let line=await ln.question('please type q or Q then press enter to quite or valid url  then press enter to contine')
            if(line==='q'||line==='Q'){
                console.log('quiting',line);
                break;
            }
            input.url=line;
            console.log('continue',line,operating--);
        }while(operating)
        ln.close(); 
    } catch (error) {
        console.log(error)
    }
    
}
function getDataSavePath(){
    const separator=path.sep;
const dirArray=path.resolve(__dirname as string).split(separator)
dirArray.pop();
dirArray.pop();
const dir=path.join(...dirArray)
return dir;
}
async function getFinishHTMLObj(dir:string,pageOptions:InputData){
    try {
        let htmlPage=await getPage(pageOptions.url)
        await saveHTMLPage(htmlPage,dir,pageOptions.url.toString());
        const HTMLObject=new Document(htmlPage);
        if(pageOptions.csv&&!pageOptions.concat)return HTMLObject;
        await compineLinksPages(HTMLObject,pageOptions.url,pageOptions) 
        return HTMLObject;
    } catch (error) {
        throw error;
    }
   
    
    }
async function getPage(url:string|URL):Promise<string>{
        let result=new Promise<string>((resolve,reject)=>{
            let request;
            try {
                let str='';
             request=https.request(
                url,
                {
                    method:'get'
                    
                },(res)=>{
                    res.on('data',(data)=>{
                        str+=data;
                       
                    })
                    res.on('end',()=>{
                        resolve(str)
                    })
                    res.on('error',(error)=>{
                        if(error instanceof Error)reject(error.toString())
                    })
                }
               
            ) 
        } catch (error) {
         if(error instanceof Error)reject(error.toString())
        }finally{
            request?.end();
        }
        });
       return result;
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

 async function saveHTMLPage(data:string,dir:string,name:string){
    try{
        const filePath=path.join(dir,'data');
        try{
            if(!(await fs.stat(filePath))?.isDirectory()){
                await fs.unlink(filePath);
                await fs.mkdir(filePath);
            } 
            
        }catch(err){
            console.log('creating directory')
            await fs.mkdir(filePath);
        }
        
        await fs.writeFile(path.join(filePath,name+'.html'),data)
       
    }catch(error){
    throw error;
    }
}
  async function compineLinksPages(HTMLObject:Document,url:string,pageOptions:InputData){
    let nodes=HTMLObject.QuerySellectorAll(pageOptions.concat?.linkQuery as string);
    for(let node of nodes){
       let childUrl=new URL(node.getAttribute('href'),node.getAttribute('href').startsWith('http')?(HTMLObject.relativeUrl??url):undefined)
       let htmlPage=await getPage(childUrl)
       const childHTMLObject=new Document(htmlPage);
       const nodes:(ElementNode|TextNode)[]=[];
       childHTMLObject.QuerySellectorAll(pageOptions.concat?.parentQuery as string).forEach((node)=>{
        if(node.childNodes) nodes.push(...node.childNodes);
       })
       HTMLObject.addChildren(...nodes)
        node.setAttribute('href','#'+childHTMLObject.parent?.getAttribute('id'))
    }
 }

    
    