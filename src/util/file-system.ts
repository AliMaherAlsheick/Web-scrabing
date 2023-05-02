import * as path from 'path';
import * as fs from 'fs/promises'
 async function getSavePath():Promise<string>{
    const separator=path.sep;
const dirArray=path.resolve(__dirname as string).split(separator)
dirArray.pop();
dirArray.pop();
const dir=path.join(...dirArray,'data')
await createDir(dir)
return dir;

}
export async function saveFile(fileName:string,projectPath:string,data:string):Promise<void>{
    try{
        const file=path.join(projectPath,fileName)
        try{
            if((await fs.stat(file))?.isDirectory())await fs.rmdir(file);
            if((await fs.stat(file))?.isSymbolicLink()) await fs.unlink(file);
        }catch(err){
            console.log(err)
        }
        console.log('creating file')
        await fs.writeFile(file,data);
    }catch(error){
    throw error;
    }
    
}
export async function createProject(name:string):Promise<string>  {
    try{
        
        const dataDir=await getSavePath();
        const dir=path.join(dataDir,name)
        await createDir(dir)
        return dir;
    }catch(error){
    throw error;
    } 
}
async function createDir(dir:string) {
    try{
        try{
            if((await fs.stat(dir))?.isDirectory())return;
            if((await fs.stat(dir))?.isSymbolicLink())
                await fs.unlink(dir);
                await fs.rm(dir);
        }catch(err){
            console.log(err)
        }
        console.log('creating directory')
        await fs.mkdir(dir);
        return ;
    }catch(error){
    throw error;
    }
}