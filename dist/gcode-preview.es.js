import{Scene as e,Color as t,PerspectiveCamera as r,WebGLRenderer as s,Group as i,Euler as n,BufferGeometry as a,Float32BufferAttribute as o,LineBasicMaterial as h,LineSegments as c}from"three";import*as l from"three-orbitcontrols";class d{constructor(e,t){this.gcode=e,this.comment=t}}class m extends d{constructor(e,t,r){super(e,r),this.params=t}}class u{constructor(e,t){this.layer=e,this.commands=t}}class p{constructor(){this.layers=[],this.curZ=0,this.maxZ=0}parseCommand(e,t=!0){const r=e.trim().split(";"),s=r[0],i=t&&r[1]||null,n=s.split(/ +/g),a=n[0].toLowerCase();switch(a){case"g0":case"g1":const e=this.parseMove(n.slice(1));return new m(a,e,i);default:return null}}parseMove(e){return e.reduce((e,t)=>{const r=t.charAt(0).toLowerCase();return"x"!=r&&"y"!=r&&"z"!=r&&"e"!=r||(e[r]=parseFloat(t.slice(1))),e},{})}groupIntoLayers(e){for(const t of e.filter(e=>e instanceof m)){const e=t.params;e.z&&(this.curZ=e.z),e.e>0&&this.curZ>this.maxZ?(this.maxZ=this.curZ,this.currentLayer=new u(this.layers.length,[t]),this.layers.push(this.currentLayer)):this.currentLayer&&this.currentLayer.commands.push(t)}return this.layers}parseGcode(e){const t=Array.isArray(e)?e:e.split("\n").filter(e=>e.length>0),r=this.lines2commands(t);return this.groupIntoLayers(r),{layers:this.layers}}lines2commands(e){return e.filter(e=>e.length>0).map(e=>this.parseCommand(e)).filter(e=>null!==e)}}class g{constructor(i){if(this.parser=new p,this.backgroundColor=14737632,this.travelColor=10027008,this.extrusionColor=65280,this.upperLayerColor=null,this.currentSegmentColor=null,this.renderExtrusion=!0,this.renderTravel=!1,this.scene=new e,this.scene.background=new t(this.backgroundColor),this.targetId=i.targetId,this.container=document.getElementById(this.targetId),!this.container)throw new Error("Unable to find element "+this.targetId);this.camera=new r(75,this.container.offsetWidth/this.container.offsetHeight,.1,1e3),this.camera.position.set(0,0,50),this.renderer=new s,this.renderer.setSize(this.container.offsetWidth,this.container.offsetHeight),this.renderer.setPixelRatio(window.devicePixelRatio),this.canvas=this.renderer.domElement,this.container.appendChild(this.canvas);new l(this.camera,this.renderer.domElement);this.animate()}get layers(){return this.parser.layers}animate(){requestAnimationFrame(()=>this.animate()),this.renderer.render(this.scene,this.camera)}processGCode(e){this.parser.parseGcode(e),this.limit=this.layers.length-1,this.render()}render(){for(;this.scene.children.length>0;)this.scene.remove(this.scene.children[0]);this.group=new i,this.group.name="gcode";const e={x:0,y:0,z:0,e:0};for(let r=0;r<this.layers.length&&!(r>this.limit);r++){const s={extrusion:[],travel:[],z:e.z},i=this.layers[r];for(const t of i.commands)if("g0"==t.gcode||"g1"==t.gcode){const r=t,i={x:void 0!==r.params.x?r.params.x:e.x,y:void 0!==r.params.y?r.params.y:e.y,z:void 0!==r.params.z?r.params.z:e.z,e:void 0!==r.params.e?r.params.e:e.e},n=r.params.e>0;(n&&this.renderExtrusion||!n&&this.renderTravel)&&this.addLineSegment(s,e,i,n),r.params.x&&(e.x=r.params.x),r.params.y&&(e.y=r.params.y),r.params.z&&(e.z=r.params.z),r.params.e&&(e.e=r.params.e)}if(this.renderExtrusion){const e=Math.round(80*r/this.layers.length),i=new t(`hsl(0, 0%, ${e}%)`).getHex();if(r==this.limit){const e=null!=this.upperLayerColor?this.upperLayerColor:i,t=null!=this.currentSegmentColor?this.currentSegmentColor:e,r=s.extrusion.splice(-3);this.addLine(s.extrusion,e);const n=s.extrusion.splice(-3);this.addLine([...n,...r],t)}else this.addLine(s.extrusion,i)}this.renderTravel&&this.addLine(s.travel,this.travelColor)}this.group.quaternion.setFromEuler(new n(-Math.PI/2,0,0)),this.group.position.set(-100,-20,100),this.scene.add(this.group),this.renderer.render(this.scene,this.camera)}resize(){this.renderer.setSize(this.container.offsetWidth,this.container.offsetHeight),this.renderer.setPixelRatio(window.devicePixelRatio),this.camera.aspect=this.container.offsetWidth/this.container.offsetHeight,this.camera.updateProjectionMatrix()}addLineSegment(e,t,r,s){const i=s?e.extrusion:e.travel;i.push(t.x,t.y,t.z),i.push(r.x,r.y,r.z)}addLine(e,t){const r=new a;r.setAttribute("position",new o(e,3));const s=new h({color:t}),i=new c(r,s);this.group.add(i)}}export{g as WebGLPreview};
