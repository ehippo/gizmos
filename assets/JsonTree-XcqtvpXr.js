import{c as p,j as s,r as f}from"./index-BoOI1u5f.js";/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=p("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=p("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);function u({data:n,initialExpanded:e=!1}){return n===void 0?null:typeof n!="object"||n===null?s.jsx("div",{className:"json-tree-container",children:s.jsx("span",{className:`json-value json-${n===null?"null":typeof n}`,children:typeof n=="string"?`"${n}"`:String(n)})}):s.jsx("div",{className:"json-tree-container",children:s.jsx(h,{value:n,depth:0,initialExpanded:e})})}function h({name:n,value:e,depth:r,initialExpanded:i}){const t=typeof e=="object"&&e!==null,l=Array.isArray(e),[c,d]=f.useState(i||r<1),x=o=>{o.stopPropagation(),t&&d(!c)};if(!t)return s.jsxs("div",{className:"json-row",style:{paddingLeft:r*16},children:[s.jsx("span",{className:"json-icon"}),n&&s.jsxs("span",{className:"json-key",children:[n,": "]}),s.jsx("span",{className:`json-value json-${typeof e}`,children:typeof e=="string"?`"${e}"`:String(e)})]});const j=Object.keys(e),m=l?`Array[${j.length}]`:"Object",a=c?"":l?" [...]":" {...}";return s.jsxs("div",{className:"json-node",children:[s.jsxs("div",{className:"json-row clickable",onClick:x,style:{paddingLeft:r*16},children:[s.jsx("span",{className:"json-icon",children:c?s.jsx(y,{size:14}):s.jsx(N,{size:14})}),n&&s.jsxs("span",{className:"json-key",children:[n,": "]}),s.jsx("span",{className:"json-label",children:m}),a&&s.jsx("span",{className:"json-preview",children:a})]}),c&&s.jsx("div",{className:"json-children",children:j.map(o=>s.jsx(h,{name:o,value:e[o],depth:r+1,initialExpanded:i},o))})]})}export{u as J};
