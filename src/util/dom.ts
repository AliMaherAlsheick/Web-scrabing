import { CSSEementQuery } from "../types/types";
import { selectorParser } from "./css-parser";

 const HTMLREGEX=/<\/?[a-z!][^<]*?(?:\s+?(?:[^<]*?|'[^]*?'|"*?"))*?\s*?\/?>/ig;
 const CLOSEHTMLTAG=/<\/([^]*)>/ig;
 const SELFCLOSEDHTMLTAG=/<(?:[a-z!][^]*?\s*?\/\s*|meta[^]*?|br[^]*?|link[^]*?|img[^]*?|hr[^]*?)>/ig;
 class Node{
    #parent:ElementNode|Document;
    constructor(parent:ElementNode|Document){
        this.#parent=parent;
    }
    
     set parent(parent:ElementNode|Document){
        this.#parent=parent;
    }
     get parent(){
       return this.#parent;
    }
}
export class TextNode extends Node{
    #content:string;
    constructor(parent:ElementNode,value:string){
        super(parent);
        this.#content=value;
    }
    match(str:string){
        return false;
    }
    toString(){
        return this.#content;
    }
}
export class AttributeNode extends Node{
    value:string;
    attribute:string;
    constructor(parent:ElementNode,attr:string){
        super(parent);
        this.attribute=attr?.split('=')[0]?.trim();
        this.value=attr?.split('=')[1]?.trim()??'';
    }
    match(att:string){
        return RegExp('^\\s*'+att+'\\s*$','i').test(this.attribute) 
    }
  toString(): string {
      return this.attribute+'='+this.value
  }
}

export class ElementNode extends Node{
    closed:boolean=false;
    #content:string;
    #attributes:AttributeNode[]=[];
    childNodes:Node[]=[];
    constructor(parent:ElementNode|Document,tag:string){
        super(parent);
        const match=tag?.slice(1,-1)?.trimEnd().split(/\s/);
        this.#content=match[0];
        const me=this;
        match?.shift()
        this.#attributes=[...(match?.map((attr)=>new AttributeNode(me,attr))??[])]
        if(SELFCLOSEDHTMLTAG.test(tag))this.closed=true;
    }
    match(str:string|ElementNode|TextNode){
       if (typeof str=='string')return this.#content.includes(str.slice(2,-1));
       if(str instanceof ElementNode) return this.#content.includes(str.#content);
       if(str instanceof TextNode) return false;
    }
    get innerText():string{
        return this.childNodes?.map((node)=>{
            if (node.constructor.name==='ElementNode')return (node as ElementNode).innerText
            return node.toString()
        }).join('');
    }
    get textHTML(){
        return   this.childNodes?.join('');
    }
     get children():ElementNode[]{
        return this.childNodes?.filter((value)=>{return value.constructor.name==='ElementNode'}) as ElementNode[];
     }
    getChild(num:number){
        return this.children?.[num];
    }
    getChildNode(num:number){
        return this.childNodes[num];
    }
    toString():string{
      if(this.childNodes.length)  return '<'+this.#content+' '+this.#attributes.join(' ')+'>'+ this.childNodes?.join('')+'</'+this.#content+'>'
      return '<'+this.#content+' '+this.#attributes.join(' ')+'/>'
    }
    hasAttribute(att:string){
        return this.#attributes.some((atri)=>atri.match(att))
    }
    querySelectorAll(queryString:string,reg?:RegExp):ElementNode[]{
         let nodes:ElementNode[]=[];
         const queryResault=selectorParser(queryString);
         if(this.#match(queryResault,this)
                &&
           (!reg||reg?.test(this.innerText)))
           nodes.push(this)
           this.children.forEach((child)=>{
            nodes=[...nodes,...child.querySelectorAll(queryString)]
           });
         return nodes;
    }
    #match(matcher:CSSEementQuery,Element:ElementNode):boolean{
        // add compinators
        const classList=Element.getAttribute('class')?.toString()?.split(/\s+/);
        const idList=Element.getAttribute('id')?.toString()?.split(/\s+/);
     return (!matcher.tag||matcher.tag===Element.#content)&&(!matcher.classes.length||
        matcher.classes.every((Class)=>classList?.includes(Class)))
        &&(!matcher.ids.length||
           matcher.ids.every((id)=>idList?.includes(id)))
           &&(!matcher.attributes.length||
               matcher.attributes.every((attribute)=>Element.getAttribute(attribute.name)
               ?.toString()===attribute.name+'='+attribute.value??''));
    }
    setAttribute(attribute:string,value:string){
        this.#attributes.forEach((atri)=>{if(atri.match(attribute))atri.value=value});
    }
    getAttribute(name:string):AttributeNode|undefined{
        return this.#attributes.find((atri)=>atri.match(name));
    }
    
}
 class ParentElement extends ElementNode{
    constructor(parent:Document,tag:string,content:string){
        super(parent,tag)
         const me=this;
        this.childNodes=this.#parseHTML(content.split(/<script(?:\s+?(?:[^<]*?|'[^]*?'|"*?"))*?\s*?\/?>[^]*?<\/script\s*?\/?>/ig).join(''))
        this.childNodes=[...this.childNodes,...(content.match(/<script(?:\s+?(?:[^<]*?|'[^]*?'|"*?"))*?\s*?\/?>[^]*?<\/script\s*?\/?>/ig)?.map<Script>((script)=>new Script(me,script)))??[]]
    }
    #parseHTML(data:string):Node[]{
        
        const childNodes:(TextNode|ElementNode)[]=[];
        const tags=data.match(HTMLREGEX)??[];
        const children=data?.split(HTMLREGEX);
        if (children[0]) {
            childNodes.push(new TextNode(this,children[0]))
        }
        for(let i=0;i<tags?.length;i++) {
            if(CLOSEHTMLTAG.test(tags[i])){
                for (let index = childNodes.length-1; index >=0 ; index--) {
                    if(childNodes[index].match(tags[i])){
                        handleUnclosedTags(childNodes,index);
                        break;
                    }
                    
                    
                }
                
            }else{
                childNodes.push(new ElementNode(this,tags[i]))
                if (children[i+1])childNodes.push(new TextNode(this,children[i+1]))
                
                
            }
            
            console.log('par',children,childNodes)
            }
           
       
        return childNodes;
        // let stack:string[]=[]
        //     if (children[0]) {
        //         childNodes.push(new TextNode(this,children[0]))
        //     }
        //     for (let i=0;i<tags?.length;i++) {
        //         console.log('tags in parser',tags.join(' | '))
        //         let closetag=CLOSEHTMLTAG.exec(tags[i])
        //         if ( closetag)for (let j=stack.length-1;j>=0;j--) {
        //             if(stack[j].match(RegExp(closetag[1],'i'))){
        //                 stack=stack.slice(0,j)
        //                 break
        //             };
        //         } else{
        //             if(!stack.length){
                        
        //                 childNodes.push(new ElementNode(this,tags[i]))
        //                 if(OPENHTMLTAG.test(tags[i]))stack.push(tags[i])
                        
        //             }else{
        //                 (childNodes[childNodes.length-1] as ElementNode).
        //                 childNodes.push(new ElementNode(this,tags[i]));
        //                 if(OPENHTMLTAG.test(tags[i]))stack.push(tags[i])
        //             } 
        //         }
        //     if(!stack.length){   
        //             childNodes.push(new TextNode(this,children[i+1]));
                
        //     }else{
        //         (childNodes[childNodes.length-1] as ElementNode)
        //         .childNodes.push(new TextNode(this,children[i+1]));
        //     } 
                
                
        //     }
        
       }
 }
 function handleUnclosedTags(nodes:(ElementNode|TextNode)[],index:number){
        for (let i = nodes.length-1; i >index ; i--) {
            if(nodes[i] instanceof ElementNode &&!(nodes[i] as ElementNode).closed){
                if(!(nodes[i] as ElementNode).match(nodes[i+1])){
                    let j=i+2;
                    for (; j < nodes.length; j++) {
                        if((nodes[j] as ElementNode).match(nodes[j]))break;
                        
                    }
                    addChildren(i+1,j-1)
                }
            }
            }
            addChildren(index);
        function addChildren(index:number,end?:number){
            (nodes[index] as ElementNode).childNodes=[...(nodes[index] as ElementNode).childNodes,
            ...(nodes[index] as ElementNode).childNodes.splice(index,(end??(nodes.length-1))-index+1)];
            // console.log('hand',nodes[nodes.length-1].toString(),nodes[nodes.length-2].toString());
            (nodes[index] as ElementNode).closed=true;
        }
       
    }

 class Script extends ElementNode{
    #code:string;
    constructor(parent:ElementNode,tag:string){
        super(parent,tag.match(/<script(?:\s+?(?:[^<]*?|'[^]*?'|"*?"))*?\s*?\/?>/ig)?.[0]??'')
        this.#code=tag.match(/(?<=<script(?:\s+?(?:[^<]*?|'[^]*?'|"*?"))*?\s*?\/?>)[^]*?(?=<\/script\s*?\/?>)/ig)?.[0]??''
    }
    toString(): string {
       if(this.#code) return super.toString().slice(0,-2)+'>'+this.#code+'</script>';
       return super.toString()
    }

 }
 class Style extends ElementNode{
    #css:string;
    constructor(parent:ElementNode,tag:string){
        super(parent,tag.match(/<style(?:\s+?(?:[^<]*?|'[^]*?'|"*?"))*?\s*?\/?>/ig)?.[0]??'')
        this.#css=tag.match(/(?<=<style(?:\s+?(?:[^<]*?|'[^]*?'|"*?"))*?\s*?\/?>)[^]*?(?=<\/style\s*?\/?>)/ig)?.[0]??''
    }
 }
export class Head extends ParentElement{
    #title:string;
    constructor(parent:Document,content:string){ 
        super(parent,'<head>',content.split(/<style(?:\s+?(?:[^<]*?|'[^]*?'|"*?"))*?\s*?\/?>[^]*?<\/style\s*?\/?>/ig).join(''))
        this.#title=this.querySelectorAll('title')[0].innerText;
        const me=this;
        this.childNodes=[...this.childNodes,...(content.match(/<style(?:\s+?(?:[^<]*?|'[^]*?'|"*?"))*?\s*?\/?>[^]*?<\/style\s*?\/?>/ig)?.map<Style>((style)=>new Style(me,style)))??[]]

    }
    get title():string{
        return this.#title;
    }
    set title(str:string){
        this.#title=str;
    }
}
export class Body extends ParentElement{
    constructor(parent:Document,content:string){
        super(parent,'<body>',content)
        
    }
}
export class Document{
   #head:Head;
   #body:ElementNode;
   parent=null;
   constructor(data:string){
    data=data.split(/<!doctype (?:\s\n*?(?:[^<]*?|'[^]*?'|"*?")?)*?>/ig).join('')
    data=data.split(/<html(?:\s\n*?(?:[^<]*?|'[^]*?'|"*?")?)*?>/ig).join('')
    this.#head=new Head(this,(data.match(/(?<=<head>)[^]*?(?=<\/head>)/i)?.[0])??'');
    this.#body=new Body(this,(data.match(/(?<=<body>)[^]*?(?=<\/body>)/i)?.[0])??
    data.split(/<head>[^]*<\/head>/i).join(''));
    console.log(this.toString())
    
   }


toString():string{
    return '<html>'+ this.#head.toString()+this.#body.toString()+'</html>'
}
querySelectorAll(queryString:string):ElementNode[]{
     return this.#body.querySelectorAll(queryString);
}
   get title(){
    return this.#head.title;
   }
   get head():Head{
    return this.#head;
   };
   get body(){
    return this.#body;
   };
}