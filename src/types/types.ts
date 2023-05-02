
import { URL } from "url";
import { ElementNode } from "../util/dom";
export interface UserInput{
 closeApp:boolean;
 projectName:string;
 urls:string[];
 baseQuery:Query;
 nextQuery:Query;
 saveOption:{
  saveAs:'separated files'|'compined html file'|'csv';
  structure?:csvStructur|compinedHTMLStructure;
};
}
//
export type csvStructur={
  
}
export type CSSEementQuery={
  tag:string|null;
  classes:string[];
  ids:string[];
  attributes:{name:string;value:string}[]
  compination:CssCompination[]
}
export type CssCompination={
  compinator:string;
  compined:CSSEementQuery
}
//
export type compinedHTMLStructure={
  
}
export type Query={
  queryText:string;
  REGEX:RegExp;
}
export interface ReportData{
   pages:Page[];
   relatedPages:File[];
}
export type File={name:string;data:string}
export type Page={
  name:string;
  content:ElementNode;
}
export type inputQuery={queryState:'always'|Function;query:string,key:keyof UserInput,strigtify:Function}[];
export interface attribute{
    attributeName:string;
    attributeValues:(string|null|number|boolean)[]
  }
  export interface Element{
      ElementName:string;
      attributes:attribute[];
  
  }
 export enum fileType{
    html,
    csv
  }
 export interface catType{
    parentQuery:string;
    linkQuery:string;
    maxNum:number|undefined;
    depth:number|undefined;
    childParentQuery:string|undefined;
    childQuery:string|undefined;
}