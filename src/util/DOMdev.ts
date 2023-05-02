import { TreeLeaf } from "./data-structure";
import { Element } from "../types/types";
 class Node<NodeType extends (string|Element)> extends TreeLeaf<NodeType,ElementNode|null,ElementNode|TextNode>{
    constructor(parent:ElementNode|null,value:NodeType,...children:(ElementNode|TextNode)[]){
        super(parent,value,...children);
    }
}
export class TextNode extends Node<string>{
    constructor(parent:ElementNode,value:string){
        super(parent,value);
    }
    toString(){
        return this.value;
    }
}

export class ElementNode extends Node<Element>{
    relativeUrl:string|undefined;
    single:boolean=false;
    #children:ElementNode[]|null=null;
    static #createElement(openTag:string):Element{
        const tag=openTag.split(' ')
       const element={
        ElementName:tag.shift() as string,
        attributes:tag.map((attr)=>{
            const attribute=attr.split('=');
            attribute.map((value)=>value.replace(/['"`]/,''))
            return {attributeName:attribute[0],
                attributeValues:attribute[1].split(' ')
            }
        })
    }
        return element;
    }
    constructor(parent:ElementNode|null,openTag:string,childrenData:string){
        super(parent,ElementNode.#createElement(openTag.toLowerCase()));
        this.parseChildren(childrenData)
    }
    get innerText(){
        return '';
    }
    get textContent(){
        return '';
    }
     get children():ElementNode[]|null{
        return this.children;
     }
     get childNodes():(ElementNode|TextNode)[]|null{
        return super.subLeaves;
     }
    getChild(num:number){
        return this.#children?.[num];
    }
    getChildNode(num:number){
        return this.children?.[num];
    }
    toString():string{
        if(this.single)return '<'+this.value+'/>'
        return '<'+this.value.ElementName+' '+this.value.attributes.map((attribute)=>{
            return attribute.attributeName+'="'+attribute.attributeValues.join(' ')+'"'
        }).join(' ')+'>'+((this.childNodes?.map((value)=>value.toString()))?.join(''))??''+'</'+this.value.ElementName+'>'
    }
    protected parseChildren(data:string){
        
        // const stack=[];
        // let index=this.#start;
        // for(let i=0;i< data.length;i++){
            // if(data.charAt(i)==='<') {
            //   let currentTag=new ElementNode(this,i,data);
            //   if(['br'].includes(currenttag.Name))this.single=true;
            //   if(currentTag)this.addChildNode(currentTag)
            // }
        // }
       // if(name==='document'){
            // 
            // 
       // }
    }
    querySelectorAll(queryString:string):ElementNode[]{
         const nodes:ElementNode[]=[];
         //
         //
         //
         //
         //
         return nodes;
    }
    setAttribute(attribute:string,value:string){
        // 
        // 
        // 
    }
    getAttribute(name:string){
        // 
        // 
        // 
        return '';
    }
    // createChild(type:string,childerns:(ElementNode|string)[],...pro:string[]){
    // // 
    // // 
    // // 
    // // 
    // // 
    // }
    addChildren(...nodes:(ElementNode|TextNode)[]){
      super.addChildren(...nodes);
    }
    
}
export class Head extends ElementNode{
    
    constructor(parent:Document,openTag:string,childrenData:string){
        super(parent,'<head>',childrenData)
        //this.title='' 
        //
        //
        //

    }
    get title(){
        return '';
    }
}
export class Body extends ElementNode{
    
    constructor(parent:Document,openTag:string,childrenData:string){
        super(parent,(openTag.toLowerCase().startsWith('body'))?openTag:'body',childrenData)
        //
        //
        //
        //
        //
    }
}
export class Document extends ElementNode{
   #head:Head;
   #body:ElementNode;
   static #parsePage():[string,string]{
    //
    //
    //
    //
    //

    return ['document',''];
   }
   constructor(data:string){
    super(null,...Document.#parsePage())
    this.#head=this.#getHead(data);
    this.#body=this.#getBody(data);
   } 
   get title(){
    return this.#head.title;
   }
   #getHead(data:string){
    let head:string='';
    // 
    // 
    // 
    return new Head(this,head||'<head>',data)
   };
   #getBody(data:string){
    let body:string='';
    // 
    // 
    // 
    // 
    // 
    return new Body(this,body||'<body>',data)
   };
}
 