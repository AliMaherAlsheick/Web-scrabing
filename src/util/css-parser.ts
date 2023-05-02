import { CSSEementQuery,CssCompination} from "../types/types";
const CSSCOMPINATORS=/ |>|\+/g;
const SELECTORRULE=/^(?<tag>[a-zA-Z!][^#\[\]\.]*)?(?<classes>(?:\.[a-zA-Z0-9]*)*)(?<ids>(?:#[a-zA-Z0-9-_]*)*)(?<atts>(?:\[[a-zA-Z0-9-_]*(?:='[^]*'|"[^]*"|[a-zA-Z0-9-_]+)?\])*)/;
export function selectorParser(selector:string):CSSEementQuery {
    let result:CSSEementQuery;
    const compinations=selector.split(CSSCOMPINATORS);
    const queries=compinations.map<CSSEementQuery>((selec)=>{
        const match=SELECTORRULE.exec(selec);
        return {
            tag:match?.groups?.['tag']??null,
            classes:match?.groups?.['classes'].split('.').slice(1)??[],
            ids:match?.groups?.['ids'].split('#').slice(1)??[],
            attributes:formateAttr( match?.groups?.['atts']),
            compination:[] as CssCompination[]
        }
    })
    result=queries[0];
    result.compination=selector.match(CSSCOMPINATORS)?.map<CssCompination>((compinator,i)=>({compinator,compined:queries[i+1]}))??[]
    return result;
    function formateAttr(params:string|undefined):{name:string;value:string}[] {
        const result:{name:string;value:string}[]=[]
        if(!params)return [];
        let match=/\[([^=]*?)(?:=([^=\]]*?))?\]/.exec(params);
        while(match){
            result.push({name:match?.[1],value:match?.[2]??''})
            match=/\[ \]/.exec(params);  
        }
        return result;
    }
}
