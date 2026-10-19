'use client';

import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { ContactShadows, OrbitControls, RoundedBox } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { CarIllustration } from '@/components/car-illustration';

type ViewerProps = {
  zones: string[];
  edge: string;
  mesh: string;
  view: string;
  zoom: number;
  angle: number;
  resetSignal: number;
  vehicle: { year:string; make:string; model:string; body:string; trim:string };
  vehicleType: 'sedan' | 'truck' | 'suv';
};

type BoundaryProps = { children: ReactNode; fallback: ReactNode };

class SceneBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

const cameraViews: Record<string, [number, number, number]> = {
  'Driver side': [0, 2.45, 7.2],
  'Passenger side': [0, 2.45, -7.2],
  Front: [7.2, 2.35, 0],
  Rear: [-7.2, 2.35, 0],
  'Three-quarter': [5.4, 3.15, 5.7],
};

function CameraRig({ view, zoom, resetSignal }: Pick<ViewerProps, 'view' | 'zoom' | 'resetSignal'>) {
  const { camera } = useThree();
  const controls = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    const position = cameraViews[view] ?? cameraViews['Three-quarter'];
    const distanceScale = 1 / Math.max(.72, zoom);
    camera.position.set(position[0] * distanceScale, position[1] * distanceScale, position[2] * distanceScale);
    camera.lookAt(0, .9, 0);
    controls.current?.target.set(0, .9, 0);
    controls.current?.update();
  }, [camera, resetSignal, view, zoom]);

  return <OrbitControls ref={controls} makeDefault enablePan={false} enableDamping dampingFactor={.08} minDistance={4.6} maxDistance={10.5} minPolarAngle={.55} maxPolarAngle={1.52}/>;
}

function Wheel({ x, z }: { x: number; z: number }) {
  return <group position={[x, .47, z]} rotation={[Math.PI / 2, 0, 0]}>
    <mesh castShadow>
      <cylinderGeometry args={[.45, .45, .3, 36]}/>
      <meshStandardMaterial color="#101317" roughness={.8}/>
    </mesh>
    <mesh position={[0, .16, 0]}>
      <cylinderGeometry args={[.24, .24, .018, 24]}/>
      <meshStandardMaterial color="#aeb5ba" metalness={.85} roughness={.26}/>
    </mesh>
  </group>;
}

function SideWindow({ x, y=1.43, z, selected, edge, mesh, scaleX=1 }: { x: number; y?:number; z: number; selected: boolean; edge: string; mesh: string; scaleX?:number }) {
  const outward = Math.sign(z);
  const shadeColor=mesh==='Privacy mesh'?'#071014':'#243a40';
  return <group position={[x, y, z]} scale={[scaleX,1,1]}>
    <RoundedBox args={[1.02, .6, .055]} radius={.08} smoothness={4}>
      <meshStandardMaterial color={selected ? edge : '#111a21'} metalness={.28} roughness={.42}/>
    </RoundedBox>
    <RoundedBox args={[.91, .49, .025]} radius={.06} smoothness={4} position={[0, 0, outward * .041]}>
      <meshPhysicalMaterial color={selected ? shadeColor : '#243740'} transparent opacity={selected ? (mesh==='Privacy mesh'?.96:.82) : .7} roughness={selected?.62:.14} metalness={.12} transmission={selected ? 0 : .2}/>
    </RoundedBox>
    {selected&&<mesh position={[0,0,outward*.061]}>
      <planeGeometry args={[.82,.4,12,7]}/>
      <meshBasicMaterial color={edge} wireframe transparent opacity={mesh==='Privacy mesh'?.16:.28}/>
    </mesh>}
  </group>;
}

function Windshield({ selected, edge, mesh }: { selected: boolean; edge: string; mesh:string }) {
  return <group position={[1.2, 1.42, 0]} rotation={[0, 0, -.3]}>
    <RoundedBox args={[.06, .73, 1.5]} radius={.03} smoothness={4}>
      <meshStandardMaterial color={selected ? edge : '#111a21'} metalness={.24} roughness={.4}/>
    </RoundedBox>
    <RoundedBox args={[.035, .62, 1.37]} radius={.025} smoothness={4} position={[.041, 0, 0]}>
      <meshPhysicalMaterial color={selected?(mesh==='Privacy mesh'?'#071014':'#243a40'):'#19262d'} transparent opacity={selected ? .94 : .7} roughness={selected?.6:.12} transmission={selected ? 0 : .2}/>
    </RoundedBox>
  </group>;
}

function VehicleModel({ zones, edge, mesh, angle, vehicle, vehicleType }: Pick<ViewerProps, 'zones' | 'edge' | 'mesh' | 'angle' | 'vehicle' | 'vehicleType'>) {
  const selected = (zone: string) => zones.includes(zone);
  const truck=vehicleType==='truck';
  const suv=vehicleType==='suv';
  const bodyLength=truck?5.65:suv?5.05:4.85;
  const bodyHeight=truck?.88:suv?.98:.72;
  const windowY=truck?1.58:suv?1.6:1.43;
  const bodyColor=vehicle.make==='Ford'?'#b8c2c9':vehicle.make==='Honda'?'#d8dadd':'#c7ced2';
  return <group rotation={[0, THREE.MathUtils.degToRad(angle), 0]}>
    <RoundedBox args={[bodyLength, bodyHeight, truck?2.05:1.88]} radius={truck?.16:.27} smoothness={6} position={[0, truck?.94:.83, 0]} castShadow receiveShadow>
      <meshStandardMaterial color={bodyColor} metalness={.72} roughness={.25}/>
    </RoundedBox>
    <RoundedBox args={[truck?1.55:1.35, truck?.5:.36, truck?1.94:1.76]} radius={.18} smoothness={5} position={[truck?1.9:1.72, truck?1.28:1.12, 0]} castShadow>
      <meshStandardMaterial color="#d6dbde" metalness={.68} roughness={.22}/>
    </RoundedBox>
    <RoundedBox args={[truck?2.15:suv?2.9:2.66, truck?.98:suv?1.08:.82, truck?1.84:1.68]} radius={.23} smoothness={6} position={[truck?.38:-.1, windowY, 0]} castShadow>
      <meshStandardMaterial color="#1b2930" metalness={.48} roughness={.2}/>
    </RoundedBox>
    <mesh position={[truck?.35:-.15, truck?2.11:suv?2.15:1.86, 0]} castShadow>
      <boxGeometry args={[truck?1.65:suv?2.25:2.05, .08, truck?1.68:1.53]}/>
      <meshStandardMaterial color="#b9c1c6" metalness={.72} roughness={.24}/>
    </mesh>
    <SideWindow x={truck?.78:.48} y={windowY} z={truck?1.018:.858} selected={selected('Driver front')} edge={edge} mesh={mesh} scaleX={truck?.88:1}/>
    <SideWindow x={truck?-.28:-.66} y={windowY} z={truck?1.018:.858} selected={selected('Driver rear')} edge={edge} mesh={mesh} scaleX={truck?.78:1}/>
    <SideWindow x={truck?.78:.48} y={windowY} z={truck?-1.018:-.858} selected={selected('Passenger front')} edge={edge} mesh={mesh} scaleX={truck?.88:1}/>
    <SideWindow x={truck?-.28:-.66} y={windowY} z={truck?-1.018:-.858} selected={selected('Passenger rear')} edge={edge} mesh={mesh} scaleX={truck?.78:1}/>
    <Windshield selected={selected('Windshield')} edge={edge} mesh={mesh}/>
    {truck&&<RoundedBox args={[2.18,.42,1.92]} radius={.1} smoothness={3} position={[-1.75,1.22,0]} castShadow><meshStandardMaterial color={bodyColor} metalness={.7} roughness={.28}/></RoundedBox>}
    {truck&&<mesh position={[-1.72,1.48,0]}><boxGeometry args={[2.02,.06,1.72]}/><meshStandardMaterial color="#263139" metalness={.35} roughness={.55}/></mesh>}
    {[-(truck?1.72:1.48), truck?1.72:1.5].flatMap(x => [-1, 1].map(z => <Wheel key={`${x}-${z}`} x={x} z={z}/>))}
    <mesh position={[bodyLength/2, truck?1:.9, .55]}>
      <boxGeometry args={[.035, .18, .5]}/>
      <meshStandardMaterial color="#f3e9c8" emissive="#fff2b5" emissiveIntensity={.8}/>
    </mesh>
    <mesh position={[bodyLength/2, truck?1:.9, -.55]}>
      <boxGeometry args={[.035, .18, .5]}/>
      <meshStandardMaterial color="#f3e9c8" emissive="#fff2b5" emissiveIntensity={.8}/>
    </mesh>
    <mesh position={[-bodyLength/2, truck?1:.9, .55]}>
      <boxGeometry args={[.035, .19, .43]}/>
      <meshStandardMaterial color="#8d2528" emissive="#b73538" emissiveIntensity={.65}/>
    </mesh>
    <mesh position={[-bodyLength/2, truck?1:.9, -.55]}>
      <boxGeometry args={[.035, .19, .43]}/>
      <meshStandardMaterial color="#8d2528" emissive="#b73538" emissiveIntensity={.65}/>
    </mesh>
    <mesh position={[0, .48, 0]} castShadow>
      <boxGeometry args={[bodyLength-.9, .12, truck?2.05:1.9]}/>
      <meshStandardMaterial color="#20252a" metalness={.5} roughness={.45}/>
    </mesh>
    <mesh position={[0,.17,0]} rotation={[-Math.PI/2,0,0]}>
      <planeGeometry args={[2.4,.55]}/><meshBasicMaterial color="#20252a" transparent opacity={.52}/>
    </mesh>
  </group>;
}

function Scene(props: ViewerProps) {
  return <>
    <ambientLight intensity={1.2}/>
    <hemisphereLight intensity={1.35} color="#ffffff" groundColor="#647079"/>
    <directionalLight castShadow intensity={3.1} position={[4, 7, 5]} shadow-mapSize-width={1024} shadow-mapSize-height={1024}/>
    <spotLight intensity={2.1} position={[-5, 5, -4]} angle={.5} penumbra={.8}/>
    <VehicleModel zones={props.zones} edge={props.edge} mesh={props.mesh} angle={props.angle} vehicle={props.vehicle} vehicleType={props.vehicleType}/>
    <ContactShadows position={[0, .02, 0]} opacity={.42} scale={8} blur={2.6} far={4}/>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.015, 0]} receiveShadow>
      <circleGeometry args={[6.2, 64]}/>
      <meshStandardMaterial color="#aeb5ba" transparent opacity={.18}/>
    </mesh>
    <CameraRig view={props.view} zoom={props.zoom} resetSignal={props.resetSignal}/>
  </>;
}

function Fallback({ zones, edge, mesh, angle, zoom, vehicle, vehicleType }: Pick<ViewerProps, 'zones' | 'edge' | 'mesh' | 'angle' | 'zoom' | 'vehicle' | 'vehicleType'>) {
  return <div className="absolute inset-0 grid place-items-center">
    <CarIllustration zones={zones} edge={edge} mesh={mesh} angle={angle} zoom={zoom} vehicleType={vehicleType} label={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} className="w-[93%] drop-shadow-2xl"/>
    <span className="absolute left-4 top-4 rounded-full bg-[#101419cc] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.14em] text-white">{vehicle.make} {vehicle.model} · 2D fallback</span>
  </div>;
}

export function ThreeVehicleViewer(props: ViewerProps) {
  const [webgl, setWebgl] = useState<boolean | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const canvas = document.createElement('canvas');
        const options = { failIfMajorPerformanceCaveat: true };
        setWebgl(Boolean(canvas.getContext('webgl2', options) || canvas.getContext('webgl', options)));
      } catch {
        setWebgl(false);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const fallback = <Fallback zones={props.zones} edge={props.edge} mesh={props.mesh} angle={props.angle} zoom={props.zoom} vehicle={props.vehicle} vehicleType={props.vehicleType}/>;

  if (webgl === false) return fallback;
  if (webgl === null) return <div className="absolute inset-0 animate-pulse bg-white/10" aria-label="Loading interactive 3D vehicle"/>;

  return <SceneBoundary fallback={fallback}>
    <div className="absolute inset-0" role="img" aria-label="Interactive 3D vehicle and magnetic shade preview">
      <Canvas shadows dpr={[1, 1.65]} camera={{ position: [5.4, 3.15, 5.7], fov: 34, near: .1, far: 100 }} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}><Scene {...props}/></Suspense>
      </Canvas>
      <span className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/30 bg-[#101419d9] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.14em] text-white backdrop-blur">{props.vehicle.year} {props.vehicle.make} {props.vehicle.model} · Interactive 3D</span>
      <span className="pointer-events-none absolute left-4 top-14 rounded-md bg-white/75 px-2.5 py-1 text-[10px] font-medium text-[#333b42] backdrop-blur">Drag to rotate · Scroll to zoom</span>
    </div>
  </SceneBoundary>;
}
