import {File, UserInput } from "../types/types";
import { createProject, saveFile } from "../util/file-system";

export async function saveData(files:File[],options:UserInput) {
    const project=await createProject(options.projectName);
    files.forEach(async (file)=>{
        await saveFile(file.name,project,file.data);
    })
}