'use client';

type CarIllustrationProps = {
  zones?:string[];
  edge?:string;
  mesh?:string;
  className?:string;
  angle?:number;
  zoom?:number;
  vehicleType?:'sedan'|'truck'|'suv';
  label?:string;
};

export function CarIllustration({ zones=[], edge='#d96b36', mesh='Performance mesh', className='', angle=0, zoom=1, vehicleType='sedan', label='Selected vehicle' }:CarIllustrationProps) {
  const on=(...names:string[])=>names.some(name=>zones.includes(name));
  const truck=vehicleType==='truck';
  const suv=vehicleType==='suv';
  const shadeFill=mesh==='Privacy mesh'?'#11191d':'#2f464c';
  const bodyPath=truck
    ?'M70 255c8-37 26-61 67-71l142-21c45-68 87-88 164-88h54c47 0 78 24 111 76h151l70 28c31 13 45 36 47 72l-5 38H68z'
    :suv
      ?'M86 255c7-40 27-68 70-81l118-30c45-80 94-105 188-105h99c69 0 117 41 169 115l66 23c32 12 47 37 49 74l-5 38H84z'
      :'M94 256c8-38 27-63 72-76l118-28c55-69 111-91 206-91h75c63 0 112 36 165 101l64 18c34 11 51 35 54 73l-5 35H93z';
  const glassPath=truck?'M298 155c40-57 82-72 151-72h40c38 0 69 21 98 72z':suv?'M290 142c42-66 91-88 174-88h88c52 0 91 30 133 95z':'M305 148c46-54 94-70 175-70h77c45 0 84 24 128 78z';
  const frontPath=truck?'M313 149c34-42 70-57 128-59v59z':suv?'M311 137c39-49 79-66 145-69v69z':'M321 149c42-43 82-57 150-60v60z';
  const rearPath=truck?'M456 89h31c34 0 62 21 88 60H456z':suv?'M476 68h72c45 0 79 26 118 69H476z':'M492 88h61c38 0 72 20 112 61H492z';
  return <svg viewBox="0 0 860 380" role="img" aria-label={`${label} with selectable magnetic shade coverage`} className={className} style={{transform:`perspective(900px) rotateY(${angle}deg) scale(${zoom})`}}>
    <defs>
      <linearGradient id="body" x1="0" x2="1"><stop stopColor="#c9d0d4"/><stop offset=".46" stopColor="#f7f8f8"/><stop offset="1" stopColor="#89959d"/></linearGradient>
      <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#40535e"/><stop offset="1" stopColor="#101820"/></linearGradient>
      <pattern id="meshPattern" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 0L7 7M7 0L0 7" stroke={edge} strokeOpacity={mesh==='Privacy mesh'?.16:.36} strokeWidth="1"/></pattern>
    </defs>
    <ellipse cx="430" cy="318" rx="340" ry="34" fill="rgba(0,0,0,.25)"/>
    <path d={bodyPath} fill="url(#body)" stroke="#65717a" strokeWidth="4"/>
    {truck&&<path d="M610 163h139v70H610z" fill="#26343c" opacity=".58"/>}
    <path d={glassPath} fill="url(#glass)" stroke="#65727c" strokeWidth="4"/>
    <path d={frontPath} fill={on('Driver front','Passenger front')?shadeFill:'rgba(25,35,43,.28)'} stroke={on('Driver front','Passenger front')?edge:'transparent'} strokeWidth="8" opacity={on('Driver front','Passenger front')?.96:.35}/>
    <path d={rearPath} fill={on('Driver rear','Passenger rear')?shadeFill:'rgba(25,35,43,.28)'} stroke={on('Driver rear','Passenger rear')?edge:'transparent'} strokeWidth="8" opacity={on('Driver rear','Passenger rear')?.96:.35}/>
    {on('Driver front','Passenger front')&&<path d={frontPath} fill="url(#meshPattern)"/>}
    {on('Driver rear','Passenger rear')&&<path d={rearPath} fill="url(#meshPattern)"/>}
    <path d="M278 163l-53 14" stroke={on('Windshield')?edge:'#87929a'} strokeWidth={on('Windshield')?17:11} strokeLinecap="round"/>
    <circle cx="242" cy="278" r="63" fill="#171c22" stroke="#727c84" strokeWidth="9"/><circle cx="242" cy="278" r="27" fill="#aeb5ba"/>
    <circle cx="665" cy="278" r="63" fill="#171c22" stroke="#727c84" strokeWidth="9"/><circle cx="665" cy="278" r="27" fill="#aeb5ba"/>
    <path d="M98 246h51M747 220h90" stroke="#d96b36" strokeWidth="9" strokeLinecap="round"/>
    <path d="M420 186h25M570 186h25" stroke="#778189" strokeWidth="6" strokeLinecap="round"/>
    <path d="M94 288h748" stroke="#8e979e" strokeWidth="4"/>
    <text x="430" y="350" textAnchor="middle" fill="#30383e" fontSize="16" fontWeight="700">{label} · {mesh}</text>
  </svg>;
}
