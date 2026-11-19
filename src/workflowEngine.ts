/** Deterministic, offline workflow preparation. No external AI calls. */
export type WorkflowStep={id:string;name:string;template:string};
export type Workflow={id:string;name:string;steps:WorkflowStep[];createdAt:string;updatedAt:string};
export type WorkflowRun={id:string;workflowId:string;createdAt:string;outputs:{stepId:string;name:string;text:string}[]};
export function validateWorkflow(input:Pick<Workflow,'name'|'steps'>):string[]{
 const errors:string[]=[];
 if(!input.name.trim())errors.push('Workflow name is required.');
 if(input.steps.length<1||input.steps.length>20)errors.push('A workflow needs 1–20 steps.');
 const ids=new Set<string>();
 for(const [i,step] of input.steps.entries()){
  if(!step.name.trim())errors.push(`Step ${i+1} needs a name.`);
  if(!step.template.trim())errors.push(`Step ${i+1} needs a prompt.`);
  if(ids.has(step.id))errors.push('Step IDs must be unique.');
  ids.add(step.id);
 }
 return errors;
}
/** {{input}} is the initial text; {{previous}} is the previous prepared prompt. */
export function prepareWorkflow(workflow:Pick<Workflow,'name'|'steps'>,input:string):WorkflowRun['outputs']{
 const errors=validateWorkflow(workflow);if(errors.length)throw new Error(errors.join(' '));
 if(!input.trim())throw new Error('Enter workflow input first.');
 let previous='';
 return workflow.steps.map(step=>{
  const text=step.template.replace(/\{\{(input|previous)\}\}/g,(_token,key:string)=>key==='input'?input:previous);
  previous=text;
  return {stepId:step.id,name:step.name,text};
 });
}
export const starterWorkflow:Workflow={id:'starter',name:'Idea → Draft → Review',createdAt:'',updatedAt:'',steps:[
 {id:'idea',name:'Outline',template:'Create a clear outline for this idea:\n{{input}}'},
 {id:'draft',name:'Draft',template:'Write a detailed first draft based on this outline:\n{{previous}}'},
 {id:'review',name:'Review',template:'Review this draft for clarity and missing details:\n{{previous}}'}
]};
