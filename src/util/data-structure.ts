export class TreeLeaf<Value,ParentType,ChildrenTypes>{
    #parent:ParentType;
    #children:Tree<ChildrenTypes>|null;
    #value:Value;
    constructor(parent:ParentType,value:Value,...children:ChildrenTypes[]){
        this.#parent=parent;
        this.#value=value;
        this.#children=children.length?new Tree():null;
        }
        addChildren(...treeLeaf:ChildrenTypes[]){
           if(this.#children)this.#children.add(...treeLeaf);
           else this.#children=new Tree(...treeLeaf)

        }
        protected get value(){
            return this.#value
        }
        get parent(){
            return this.#parent
        }
        protected get subLeaves(){
            if(this.#children)return this.#children.elements;
            return null;
        }
}
export class Tree<LeafTypes>{
    
     #elements:LeafTypes[]=[];
        length:number=this.#elements.length;
    constructor(...leaves:LeafTypes[]){
            this.#elements.push(...leaves)
            length=this.#elements.length;
        }
    get elements():null|LeafTypes[]{
           if(this.#elements.length) return this.#elements;
           return null;
        }
    add(...leaves:LeafTypes[]):void{
            this.#elements.push(...leaves);
            length=this.#elements.length;
        }
    }
