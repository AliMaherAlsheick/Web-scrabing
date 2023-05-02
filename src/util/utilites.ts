import * as http from 'http';
import * as fs from 'fs/promises'
export async function fetchData(url:string) {
    let result:string=await (await fs.readFile('./index.html')).toString();
    // let result=new Promise<string>((resolve,reject)=>{
    //     let request;
    //     try {
    //         let str='';
    //      request=http.request(
    //         url,
    //         {
    //             method:'get'
                
    //         },(res)=>{
    //             res.on('data',(data)=>{
    //                 str+=data;
                   
    //             })
    //             res.on('end',()=>{
    //                 resolve(str)
    //             })
    //             res.on('error',(error)=>{
    //                 if(error instanceof Error)reject(error.toString())
    //             })
    //         }
           
    //     ) 
    // } catch (error) {
    //  if(error instanceof Error)reject(error.toString())
    // }finally{
    //     request?.end();
    // }
    // });
   return result;
}