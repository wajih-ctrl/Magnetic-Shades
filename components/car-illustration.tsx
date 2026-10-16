'use client';

export function CarIllustration({ zones=[], edge='#d96b36', className='', angle=0, zoom=1 }: {zones?:string[];edge?:string;className?:string;angle?:number;zoom?:number}) {
  const on=(name:string)=>zones.includes(name);
  return <svg viewBox="0 0 860 380" role="img" aria-label="Illustrative side profile of a vehicle with selectable magnetic shade coverage" className={className} style={{transform:`perspective(900px) rotateY(${angle}deg) scale(${zoom})`}}>
    <defs>
      <linearGradient id="body" x1="0" x2="1"><stop stopColor="#d9dde0"/><stop offset=".46" stopColor="#f7f8f8"/><stop offset="1" stopColor="#9fa8af"/></linearGradient>
      <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#273642"/><stop offset="1" stopColor="#101820"/></linearGradient>
    </defs>
    <ellipse cx="430" cy="318" rx="340" ry="34" fill="rgba(0,0,0,.25)"/>
    <path d="M94 256c8-38 27-63 72-76l118-28c55-69 111-91 206-91h75c63 0 112 36 165 101l64 18c34 11 51 35 54 73l-5 35H93z" fill="url(#body)" stroke="#727c84" strokeWidth="4"/>
    <path d="M305 148c46-54 94-70 175-70h77c45 0 84 24 128 78z" fill="url(#glass)" stroke="#65727c" strokeWidth="4"/>
    <path d="M477 78v76M301 153l182 2M484 155l198 1" stroke="#97a0a6" strokeWidth="5"/>
    <path d="M321 149c42-43 82-57 150-60v60z" fill={on('Driver front')?edge:'rgba(25,35,43,.28)'} opacity={on('Driver front')?.86:.35}/>
    <path d="M492 88h61c38 0 72 20 112 61H492z" fill={on('Driver rear')?edge:'rgba(25,35,43,.28)'} opacity={on('Driver rear')?.86:.35}/>
    <path d="M279 164l-52 13" stroke={on('Windshield')?edge:'#87929a'} strokeWidth="13" strokeLinecap="round"/>
    <circle cx="242" cy="278" r="63" fill="#171c22" stroke="#727c84" strokeWidth="9"/><circle cx="242" cy="278" r="27" fill="#aeb5ba"/>
    <circle cx="665" cy="278" r="63" fill="#171c22" stroke="#727c84" strokeWidth="9"/><circle cx="665" cy="278" r="27" fill="#aeb5ba"/>
    <path d="M98 246h51M747 220h90" stroke="#d96b36" strokeWidth="9" strokeLinecap="round"/>
    <path d="M420 186h25M570 186h25" stroke="#778189" strokeWidth="6" strokeLinecap="round"/>
    <path d="M94 288h748" stroke="#8e979e" strokeWidth="4"/>
  </svg>;
}

