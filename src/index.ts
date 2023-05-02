import {getUserInput} from './userIputHandler/input';
import {buildData} from './dataBuilder/data-builder';
import {saveData} from './dataSaver/data-saver'
import { File } from './types/types';
import { buildProjectFiles } from './ProjectFilesBuilder/project-files-builder';
//main loop
try {
    (async()=>{
        do {
            try {
            const userInput=await getUserInput();
            const data=await buildData(userInput);
            const files:File[]=buildProjectFiles(data,userInput)
            saveData(files,userInput);
        } catch (error) {
           console.log(error)   
           }
            
        } while (true);  
    })()
} catch (error) {
         console.log(error) 
}
