import { ReportData, UserInput ,Page,File} from "../types/types";
import { ElementNode,Document } from "../util/dom";
import { fetchData } from "../util/utilites";

export  async function buildData(userInput:UserInput):Promise<ReportData>{
    let pages:Page[]=[];
    let urlList=new Set<string>(userInput.urls);
    let RelatedUrlList=new Set<string>();
    for (const url of urlList) {
        pages.push(await getPage(url,RelatedUrlList));
    } 
    
    let innerPages:Page[]=[]
    pages.forEach(async(page)=>{
        innerPages=[...await getInnerPages(page,RelatedUrlList)]
    })
    pages=[...pages,...innerPages]
    return {pages,relatedPages:await BuildRelatedFiles(RelatedUrlList)};
}
async function getPage(url:string,RelatedUrlList:Set<string>):Promise<Page>{
    const webPage:Page={} as Page;
    const page=await fetchData(url);
    const ParsedPage=new Document(page);;
    console.log(ParsedPage.toString())
    getRelatedFiles(ParsedPage,url).forEach((url)=>{
       RelatedUrlList.add(url.toString())
    })
    return webPage;
}
function getRelatedFiles(content:Document,baseUrl:string):URL[]{
    let relatedFiles:URL[]=[];
    const querys:{queryString:string;att:string;}[]=[{queryString:'link[href]',att:'href',},{queryString:'script[src]',att:'src',},{queryString:'style',att:'src',}];
    let matchedTags:ElementNode[]=[]
    for(const query of querys ){
        matchedTags=content.querySelectorAll(query.queryString)
    for (const tag of matchedTags) {
        const url=new URL(tag.getAttribute(query.att)?.toString() as string,baseUrl)
        relatedFiles.push(url)
        tag.setAttribute(query.att,url.toString().split('/').pop()as string)
    }
}
    return relatedFiles;
}
async function getInnerPages(page:Page,RelatedUrlList:Set<string>):Promise<Page[]> {
    
return [];
}
async function BuildRelatedFiles(RelatedUrlList:Set<string>):Promise<File[]> {
    
    return [];
    }