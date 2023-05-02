import { Document } from "./dom";
import { InputData } from "./util";
import * as path from 'path';
import * as fs from 'fs/promises';
export class CSV{
    csvTable:string[][];
    #width:number;
    #currentHeight:number=0;
    constructor(document:Document,options:InputData){
        this.#width=options.csv?.Header.length as number;
        this.#currentHeight=1;
        this.csvTable=[[]];
        this.csvTable[0]=structuredClone(options.csv?.Header as string[]);
        let nodesArray=[]
        for(let query of options.csv?.keysQuery as string[]){
           nodesArray.push(document.QuerySellectorAll(query)) ;
        }
        for(let i=1;i< this.#width;i++){
            this.csvTable[i]=[];
           for(let j=0;j< nodesArray.length;j++){
            this.csvTable[i][j]=nodesArray[j][i].textContent;
           }
        }

    }
    static #parseCSVTable(csvTable:string[][]):string{
       let  table=''
       for(let row of csvTable){
        for (let cell of row){
            cell.replace('"','""');
            table+=`"${cell}"`
        }
        table+='\n'
       }
        return table;
    }
     #setCell(rowId:number,ColoumnId:number,value:string):void{
        if(rowId<=0||ColoumnId>=this.#width)return;
        while(rowId>=this.#currentHeight){
            this.csvTable.push([]);
            this.#currentHeight++;
        }
       this.csvTable[rowId][ColoumnId]=value;
    } 
   async save(dir:string,name:string){
    try{
        const csvData=CSV.#parseCSVTable(this.csvTable)
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
        
        await fs.writeFile(path.join(filePath,name+'.csv'),csvData)
       
    }catch(error){
    console.log(error);
    throw error;
    }
    }
}