'use client';

import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { ContactShadows, OrbitControls, RoundedBox, Line, Environment, Lightformer } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { vehicleProfile, type VehicleProfile } from '@/lib/vehicle-geometry';
import { VehicleDiagram } from '@/components/vehicle-diagram';

type ViewerProps = { zones:string[]; edge:string; mesh:string; view:string; zoom:number; angle:number; resetSignal:number; vehicle:{year:string;make:string;model:string;body:string;trim:string}; vehicleType:'sedan'|'truck'|'suv' };
class SceneBoundary extends Component<{children:ReactNode;fallback:ReactNode},{failed:boolean}> {
  state={failed:false}; static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?this.props.fallback:this.props.children;}
}
const cameraViews:Record<string,[number,number,number]>={'Driver side':[0,2.5,7.8],'Passenger side':[0,2.5,-7.8],Front:[7.8,2.7,0],Rear:[-7.8,2.7,0],'Three-quarter':[5.8,3.4,6.2]};
function CameraRig({view,zoom,resetSignal,vehicle}:ViewerProps){
  const {camera,size}=useThree();const controls=useRef<OrbitControlsImpl>(null);
  useEffect(()=>{const p=cameraViews[view]??cameraViews['Three-quarter'];const factor=(vehicle.model==='F-150'?1.15:1)*Math.max(1,1.2/(size.width/size.height))/zoom;camera.position.set(p[0]*factor,p[1]*factor,p[2]*factor);camera.lookAt(0,size.width<450?.55:.85,0);controls.current?.target.set(0,size.width<450?.55:.85,0);controls.current?.update();},[camera,view,zoom,resetSignal,vehicle.model,size.width,size.height]);
  return <OrbitControls ref={controls} makeDefault enablePan={false} enableDamping minDistance={3.7} maxDistance={19} minPolarAngle={.3} maxPolarAngle={1.54}/>;
}
type Point=[number,number,number];
function Surface({points,color,opacity=1,metalness=0,roughness=.4,crown=0}:{points:Point[];color:string;opacity?:number;metalness?:number;roughness?:number;crown?:number}){
  const geometry=useMemo(()=>{
    const g=new THREE.BufferGeometry(), vertices:number[]=[], indices:number[]=[];
    const n=crown?16:1;
    for(let i=0;i<=n;i++)for(let j=0;j<=n;j++){
      const u=i/n,v=j/n;
      for(let axis=0;axis<3;axis++)vertices.push((1-u)*((1-v)*points[0][axis]+v*points[1][axis])+u*((1-v)*points[3][axis]+v*points[2][axis])+(axis===1?crown*Math.sin(Math.PI*u)*Math.sin(Math.PI*v):0));
    }
    for(let i=0;i<n;i++)for(let j=0;j<n;j++){const a=i*(n+1)+j;indices.push(a,a+1,a+n+2,a,a+n+2,a+n+1);}
    g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setIndex(indices);g.computeVertexNormals();return g;
  },[points,crown]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  return <mesh geometry={geometry} castShadow receiveShadow><meshStandardMaterial side={THREE.DoubleSide} color={color} metalness={metalness} roughness={roughness} transparent={opacity<1} opacity={opacity}/></mesh>;
}
function Glass({points,selected,edge,mesh}:{points:Point[];selected:boolean;edge:string;mesh:string}){
  const middle=points.reduce((a,p)=>a.map((n,i)=>n+p[i]/4) as Point,[0,0,0] as Point);
  const normal=new THREE.Vector3().subVectors(new THREE.Vector3(...points[1]),new THREE.Vector3(...points[0])).cross(new THREE.Vector3().subVectors(new THREE.Vector3(...points[2]),new THREE.Vector3(...points[0]))).normalize();
  if(normal.dot(new THREE.Vector3(middle[0],0,middle[2]))<0)normal.negate();
  const inner=points.map(p=>p.map((v,i)=>middle[i]+(v-middle[i])*.91+normal.getComponent(i)*.004) as Point);
  const grid=useMemo(()=>{
    const mix=(a:Point,b:Point,t:number)=>a.map((v,i)=>v+(b[i]-v)*t) as Point;
    const lines:Point[][]=[];
    for(let i=1;i<24;i++)lines.push([mix(inner[0],inner[1],i/24),mix(inner[3],inner[2],i/24)]);
    for(let i=1;i<12;i++)lines.push([mix(inner[0],inner[3],i/12),mix(inner[1],inner[2],i/12)]);
    return lines;
  },[inner]);
  return <group><Surface points={points} color={selected?edge:'#141c22'} roughness={.4}/><Surface points={inner} color={selected?(mesh==='Privacy mesh'?'#111a1e':'#354c53'):'#567580'} metalness={selected?.05:.55} roughness={selected?.9:.14}/>{selected&&grid.map((p,i)=><Line key={i} points={p.map(v=>v.map((n,i)=>n+normal.getComponent(i)*.004) as Point)} color={mesh==='Privacy mesh'?'#293638':'#78918e'} lineWidth={.6} transparent opacity={.65}/>)}<Line points={[...points,points[0]]} color={selected?edge:'#26343d'} lineWidth={selected?4:1.4}/></group>;
}
function Wheel({x,z,r}:{x:number;z:number;r:number}){
  const side=Math.sign(z);
  return <group position={[x,r,z]}>
    <mesh rotation={[Math.PI/2,0,0]} castShadow><cylinderGeometry args={[r,r,.23,48]}/><meshStandardMaterial color="#16191b" roughness={.92}/></mesh>
    <mesh position={[0,0,side*.123]}><torusGeometry args={[r*.76,r*.11,10,48]}/><meshStandardMaterial color="#101417"/></mesh>
    <mesh rotation={[Math.PI/2,0,0]} position={[0,0,side*.14]}><cylinderGeometry args={[r*.64,r*.64,.015,36]}/><meshStandardMaterial color="#30383e" metalness={.85} roughness={.3}/></mesh>
    {Array.from({length:10},(_,i)=><mesh key={i} position={[Math.sin(i*Math.PI/5)*r*.37,Math.cos(i*Math.PI/5)*r*.37,side*.158]} rotation={[0,0,-i*Math.PI/5]}><boxGeometry args={[r*.1,r*.52,.025]}/><meshStandardMaterial color="#ccd4da" metalness={.85} roughness={.25}/></mesh>)}
    <mesh position={[0,0,side*.18]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[r*.16,r*.16,.03,20]}/><meshStandardMaterial color="#b6c0c7" metalness={.8} roughness={.25}/></mesh>
  </group>;
}
function Body({p}:{p:VehicleProfile}){
  const geometry=useMemo(()=>{
    // Sample the shell along its length so fenders, shoulders and rocker panels
    // have continuous curvature instead of extruding a flat side silhouette.
    const positions:number[]=[], indices:number[]=[];
    const nx=160, ny=20, half=p.length/2, axle=p.wheelbase/2;
    const top=(x:number)=>p.belt-.16*Math.pow(Math.max(0,(x-p.nose)/(half-p.nose)),1.6)-.08*Math.pow(Math.max(0,(-x+p.tail)/(half+p.tail)),2);
    const bottom=(x:number)=>{
      const d=Math.min(Math.abs(x-axle),Math.abs(x+axle)), radius=p.radius+.065;
      return d<radius?Math.max(.37,p.radius+Math.sqrt(radius*radius-d*d)):.37;
    };
    const width=(x:number,y:number)=>{
      const end=Math.max(0,(Math.abs(x)-axle)/(half-axle));
      const h=THREE.MathUtils.clamp((y-.37)/(p.belt-.37),0,1);
      const shoulder=.045*Math.sin(h*Math.PI)-.055*Math.pow(1-h,3);
      return p.width/2-.025+shoulder-(p.truck?.045:.12)*end*end;
    };
    const patch=(rows:number,cols:number,point:(i:number,j:number)=>Point)=>{
      const offset=positions.length/3;
      for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++)positions.push(...point(i/rows,j/cols));
      for(let i=0;i<rows;i++)for(let j=0;j<cols;j++){const a=offset+i*(cols+1)+j;indices.push(a,a+1,a+cols+2,a,a+cols+2,a+cols+1);}
    };
    for(const side of [-1,1])patch(nx,ny,(u,v)=>{
      const x=-half+p.length*u, lo=bottom(x), y=lo+(top(x)-lo)*v;
      return [x,y,side*width(x,y)];
    });
    patch(nx,24,(u,v)=>{const x=-half+p.length*u,y=top(x),z=(2*v-1)*width(x,y);return [x,y+.045*Math.sin(Math.PI*v),z];});
    for(const x of [-half,half])patch(12,24,(u,v)=>{const y=.37+(top(x)-.37)*u;return [x,y,(2*v-1)*width(x,y)];});
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();return g;
  },[p]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  return <mesh geometry={geometry} castShadow receiveShadow><meshPhysicalMaterial side={THREE.DoubleSide} color={p.color} metalness={.65} roughness={.25} clearcoat={1} clearcoatRoughness={.22}/></mesh>;
}
function VehicleModel(props:ViewerProps){
  const p=useMemo(()=>vehicleProfile(props.vehicle),[props.vehicle.model,props.vehicle.body]);
  const z=p.width/2-.025,rz=z-.15, b=p.belt+.03,r=p.roof;
  const at=(x:number,y:number,side:number):Point=>[x,y,side*(z-(y-b)/(r-b)*.15+.012)];
  const pillar=p.truck?.05:-.22;
  const rearEnd=p.truck?p.tail:p.hatch?p.roofRear+.25:p.tail+.18;
  return <group rotation={[0,THREE.MathUtils.degToRad(props.angle),0]}>
    <Body p={p}/>
    {[-1,1].map(side=><group key={`details-${side}`}>
      {[-1,1].map(axle=><Line key={axle} points={Array.from({length:49},(_,i)=>{const a=i*Math.PI/48;return [axle*p.wheelbase/2+Math.cos(a)*(p.radius+.072),p.radius+Math.sin(a)*(p.radius+.072),side*(z+.018)] as Point;})} color={p.hatch||p.truck?'#30383c':'#98a4ad'} lineWidth={p.hatch||p.truck?5:2}/>)}
      <Line points={[[p.nose+.06,b+.009,side*(z-.12)],[p.length/2-.48,b-.065,side*(z-.19)],[p.length/2-.14,b-.14,side*(z-.23)]]} color="#65727b" lineWidth={.8}/>
      <RoundedBox args={[p.wheelbase-.6,.075,.055]} radius={.025} position={[0,.4,side*(z-.01)]}><meshStandardMaterial color={p.hatch?'#30383c':'#82909a'} metalness={.5} roughness={.4}/></RoundedBox>
      {p.hatch&&<Line points={[[p.roofFront-.12,r+.045,side*(rz-.09)],[p.roofRear+.12,r+.045,side*(rz-.09)]]} color="#465159" lineWidth={3}/>}
    </group>)}
    <Surface points={[[p.nose,b,z],[p.roofFront,r,rz],[p.roofRear,r,rz],[p.tail,b,z]]} color={p.color} metalness={.6}/>
    <Surface points={[[p.nose,b,-z],[p.roofFront,r,-rz],[p.roofRear,r,-rz],[p.tail,b,-z]]} color={p.color} metalness={.6}/>
    <Surface points={[[p.roofFront,r+.015,rz],[p.roofFront,r+.015,-rz],[p.roofRear,r+.015,-rz],[p.roofRear,r+.015,rz]]} color={p.color} metalness={.65} crown={.065}/>
    <Glass points={[[p.nose+.018,b+.04,z-.055],[p.roofFront+.018,r-.035,rz-.055],[p.roofFront+.018,r-.035,-rz+.055],[p.nose+.018,b+.04,-z+.055]]} selected={props.zones.includes('Windshield')} edge={props.edge} mesh={props.mesh}/>
    <Surface points={[[p.tail-.015,b+.03,z-.06],[p.roofRear-.015,r-.03,rz-.06],[p.roofRear-.015,r-.03,-rz+.06],[p.tail-.015,b+.03,-z+.06]]} color="#304955" metalness={.45} roughness={.18}/>
    {[-1,1].map(side=><group key={side}>
      <Glass points={[at(p.nose-.09,b+.045,side),at(p.roofFront-.045,r-.055,side),at(pillar+.045,r-.055,side),at(pillar+.045,b+.045,side)]} selected={props.zones.includes(side===1?'Driver front':'Passenger front')} edge={props.edge} mesh={props.mesh}/>
      <Glass points={[at(pillar-.045,b+.045,side),at(pillar-.045,r-.055,side),at(p.roofRear+.075,r-.055,side),at(rearEnd,b+.045,side)]} selected={props.zones.includes(side===1?'Driver rear':'Passenger rear')} edge={props.edge} mesh={props.mesh}/>
      {p.hatch&&!p.truck&&<Surface points={[at(rearEnd-.07,b+.045,side),at(p.roofRear+.01,r-.09,side),at(p.roofRear-.12,r-.15,side),at(p.tail+.09,b+.045,side)]} color="#304955" metalness={.4}/>}
      {[pillar,p.nose-.04,rearEnd-.06].map(x=><Line key={x} points={[[x,b-.04,side*(z+.026)],[x-.04,.53,side*(z+.026)]]} color="#687780" lineWidth={.8}/>)}
      <Line points={[[-p.length/2+.22,b-.13,side*(z+.035)],[p.length/2-.26,b-.13,side*(z+.035)]]} color="#dce2e6" lineWidth={1}/>
      {[pillar+.16,rearEnd+.18].map(x=><RoundedBox key={x} args={[.19,.038,.035]} radius={.016} position={[x,b-.13,side*(z+.045)]}><meshStandardMaterial color="#d4dce2" metalness={.8} roughness={.2}/></RoundedBox>)}
      <RoundedBox args={[.24,.13,.19]} radius={.045} position={[p.nose-.1,b+.04,side*(z+.12)]} castShadow><meshStandardMaterial color={p.color} metalness={.5} roughness={.3}/></RoundedBox>
      <Wheel x={p.wheelbase/2} z={side*(p.width/2-.025)} r={p.radius}/><Wheel x={-p.wheelbase/2} z={side*(p.width/2-.025)} r={p.radius}/>
    </group>)}
    {p.truck&&<group><Surface points={[[p.tail-.08,b+.015,z-.1],[p.tail-.08,b+.015,-z+.1],[-p.length/2+.16,b+.015,-z+.1],[-p.length/2+.16,b+.015,z-.1]]} color="#263139"/>{[-1,1].map(side=><RoundedBox key={side} args={[p.length/2+p.tail-.06,.17,.11]} radius={.03} position={[(p.tail-p.length/2)/2,b+.065,side*(z-.015)]}><meshStandardMaterial color={p.color} metalness={.6} roughness={.3}/></RoundedBox>)}</group>}
    <RoundedBox args={[.045,p.truck?.4:.21,p.width*.60]} radius={.02} position={[p.length/2+.018,b-.45,0]}><meshStandardMaterial color="#152027" metalness={.4}/></RoundedBox>
    {[0,1,2,3].map(i=><mesh key={i} position={[p.length/2+.047,b-.53+i*.055,0]}><boxGeometry args={[.012,.012,p.width*.5]}/><meshStandardMaterial color="#71818b" metalness={.8} roughness={.3}/></mesh>)}
    {[-1,1].map(side=><group key={side}><RoundedBox args={[.06,p.truck?.21:.075,p.width*.19]} radius={.025} position={[p.length/2+.018,b-.31,side*p.width*.36]}><meshStandardMaterial color="#edf5fa" emissive="#d7e9fa" emissiveIntensity={.7}/></RoundedBox><RoundedBox args={[.06,p.truck?.3:.1,p.width*.2]} radius={.025} position={[-p.length/2-.018,b-.15,side*p.width*.35]}><meshStandardMaterial color="#a91d2b" emissive="#b32231" emissiveIntensity={.5}/></RoundedBox></group>)}
    <RoundedBox args={[.07,.11,p.width*.87]} radius={.025} position={[p.length/2+.018,.46,0]}><meshStandardMaterial color="#27333d" metalness={.7} roughness={.3}/></RoundedBox><RoundedBox args={[.045,.1,.39]} radius={.012} position={[p.length/2+.047,.53,0]}><meshStandardMaterial color="#d6dfe2"/></RoundedBox>
  </group>;
}
function Scene(props:ViewerProps){return <><Environment resolution={256}><Lightformer form="rect" intensity={3.2} position={[0,6,1]} rotation={[Math.PI/2,0,0]} scale={[12,5,1]}/><Lightformer form="rect" intensity={2.4} position={[1,2,-6]} scale={[10,3,1]}/><Lightformer form="rect" intensity={2} position={[-2,3,5]} rotation={[0,Math.PI,0]} scale={[9,3,1]}/></Environment><ambientLight intensity={.85}/><hemisphereLight intensity={1.6} color="#fbfdff" groundColor="#4c5963"/><directionalLight castShadow intensity={3.5} position={[4,7,5]} shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-.0004} shadow-normalBias={.03}/><directionalLight intensity={1.8} position={[-5,3,-4]}/><VehicleModel {...props}/><mesh receiveShadow rotation={[-Math.PI/2,0,0]} position={[0,-.015,0]}><circleGeometry args={[8,96]}/><meshStandardMaterial color="#9fa8ae" roughness={.92} metalness={.04}/></mesh><ContactShadows position={[0,.018,0]} opacity={.62} scale={10} blur={1.8} far={3}/><CameraRig {...props}/></>;}
export function ThreeVehicleViewer(props:ViewerProps){
  const [webgl,setWebgl]=useState<boolean|null>(null);const [diagram,setDiagram]=useState(false);
  useEffect(()=>{queueMicrotask(()=>setWebgl(typeof window.WebGL2RenderingContext!=='undefined'));},[]);
  const fallback=<VehicleDiagram {...props}/>;
  return <><div className="absolute inset-0" role="img" aria-label={`${props.vehicle.make} ${props.vehicle.model} interactive shade preview`}>{diagram||webgl===false?fallback:webgl===null?<div className="grid h-full place-items-center text-sm text-slate-600">Preparing vehicle preview…</div>:<SceneBoundary fallback={fallback}><Canvas shadows dpr={[1.25,2]} camera={{position:[5.8,3.4,6.2],fov:31,near:.1,far:100}} gl={{antialias:true,alpha:true,powerPreference:'high-performance'}} onCreated={({gl})=>{gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=1.08;gl.outputColorSpace=THREE.SRGBColorSpace;gl.domElement.addEventListener('webglcontextlost',(event)=>{event.preventDefault();if(gl.domElement.isConnected)setWebgl(false);},{once:true});}}><Suspense fallback={null}><Scene {...props}/></Suspense></Canvas></SceneBoundary>}</div><div className="pointer-events-none absolute left-4 top-4 max-w-[55%] rounded-xl border border-white/60 bg-white/88 px-3 py-2 text-[#28333c] shadow-md backdrop-blur"><strong className="block text-xs">{props.vehicle.year} {props.vehicle.make} {props.vehicle.model}</strong><span className="text-[10px]">{props.vehicle.body} · {props.vehicle.trim} · {props.zones.length} shades</span></div><button className="absolute left-4 top-[76px] z-20 rounded-full border border-slate-300 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm" onClick={()=>{if(webgl===false){setWebgl(true);setDiagram(false);}else setDiagram(v=>!v);}}>{webgl===false?'Retry 3D preview':diagram?'Show 3D vehicle':'2D coverage map'}</button></>;
}
