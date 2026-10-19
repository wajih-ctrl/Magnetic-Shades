// Illustrative model profiles in metres; these are not manufacturing or fitment data.
export type VehicleProfile = { length:number; width:number; belt:number; roof:number; wheelbase:number; radius:number; nose:number; roofFront:number; roofRear:number; tail:number; truck?:boolean; hatch?:boolean; sculpted?:boolean; color:string };
const sedan:VehicleProfile={length:4.63,width:1.78,belt:1.04,roof:1.48,wheelbase:2.7,radius:.33,nose:1.05,roofFront:.48,roofRear:-.9,tail:-1.65,color:'#b7c3cb'};
export function vehicleProfile(vehicle:{model:string;body:string}):VehicleProfile {
  switch(vehicle.model){
    case 'Corolla': return {...sedan,...(vehicle.body==='Hatchback'?{length:4.37,roofRear:-1.1,tail:-1.83,hatch:true}:{}),color:'#c5ced5'};
    case 'Civic': return {...sedan,length:4.67,width:1.8,roof:1.42,nose:1.15,roofFront:.5,roofRear:-.85,tail:-1.9,hatch:vehicle.body==='Hatchback',color:'#9caebc'};
    case 'Camry': return {...sedan,length:4.92,width:1.84,wheelbase:2.82,nose:1.15,roofRear:-1.02,tail:-1.85,color:'#8c9da7'};
    case 'Accord': return {...sedan,length:4.97,width:1.86,wheelbase:2.83,roof:1.45,roofRear:-1.15,tail:-1.95,color:'#b7bcc3'};
    case 'F-150': return {length:5.89,width:2.03,belt:1.34,roof:1.96,wheelbase:3.69,radius:.43,nose:1.2,roofFront:.92,roofRear:vehicle.body==='SuperCab'?-.55:-.95,tail:vehicle.body==='SuperCab'?-.68:-1.08,truck:true,color:'#879aa7'};
    case 'RAV4': return {...sedan,length:4.6,width:1.86,belt:1.23,roof:1.69,wheelbase:2.69,radius:.38,nose:1.07,roofFront:.58,roofRear:-1.43,tail:-1.96,hatch:true,color:'#afb9ac'};
    case 'CR-V': return {...sedan,length:4.69,width:1.87,belt:1.23,roof:1.68,wheelbase:2.7,radius:.38,nose:1.1,roofFront:.55,roofRear:-1.48,tail:-2.02,hatch:true,color:'#b9c2cb'};
    case 'Bronco Sport': return {...sedan,length:4.39,width:1.89,belt:1.25,roof:1.78,wheelbase:2.67,radius:.39,nose:1.05,roofFront:.8,roofRear:-1.55,tail:-1.8,hatch:true,color:'#a9b4a2'};
    case 'Highlander': return {...sedan,length:4.95,width:1.93,belt:1.27,roof:1.73,wheelbase:2.85,radius:.39,nose:1.15,roofFront:.6,roofRear:-1.62,tail:-2.14,hatch:true,color:'#abb7c3'};
    case 'Escape': return {...sedan,length:4.58,width:1.88,belt:1.19,roof:1.67,wheelbase:2.71,radius:.37,nose:1.06,roofFront:.5,roofRear:-1.34,tail:-1.94,hatch:true,color:'#bcc6cf'};
    case 'Silverado 1500': return {length:5.93,width:2.06,belt:1.35,roof:1.95,wheelbase:3.74,radius:.43,nose:1.22,roofFront:.93,roofRear:-1.0,tail:-1.12,truck:true,color:'#9aa5ad'};
    case 'Malibu': return {...sedan,length:4.93,width:1.85,roof:1.455,wheelbase:2.83,nose:1.14,roofFront:.5,roofRear:-1.0,tail:-1.92,color:'#a9b6bf'};
    case 'Altima': return {...sedan,length:4.9,width:1.85,roof:1.445,wheelbase:2.83,nose:1.13,roofFront:.5,roofRear:-.98,tail:-1.9,color:'#c0c9d0'};
    case 'Elantra': return {...sedan,length:4.68,width:1.81,roof:1.415,wheelbase:2.72,nose:1.1,roofFront:.48,roofRear:-.9,tail:-1.87,color:'#adbac4'};
    case 'Model 3': return {...sedan,length:4.72,width:1.85,belt:1.0,roof:1.44,wheelbase:2.88,radius:.335,nose:1.12,roofFront:.5,roofRear:-.95,tail:-1.86,color:'#b9c2c9'};
    case 'Model Y': return {...sedan,length:4.75,width:1.92,belt:1.2,roof:1.62,wheelbase:2.89,radius:.36,nose:1.1,roofFront:.55,roofRear:-1.45,tail:-1.98,hatch:true,color:'#aeb7bf'};
    case 'Equinox': return {...sedan,length:4.65,width:1.88,belt:1.21,roof:1.66,wheelbase:2.71,radius:.37,nose:1.07,roofFront:.52,roofRear:-1.42,tail:-1.95,hatch:true,color:'#b3bdc6'};
    case 'Tiguan': return {...sedan,length:4.54,width:1.84,belt:1.21,roof:1.67,wheelbase:2.68,radius:.37,nose:1.06,roofFront:.55,roofRear:-1.38,tail:-1.9,hatch:true,color:'#98a4ae'};
    case 'Rogue': return {...sedan,length:4.65,width:1.84,belt:1.2,roof:1.68,wheelbase:2.71,radius:.37,nose:1.07,roofFront:.52,roofRear:-1.42,tail:-1.95,hatch:true,color:'#b5bfc8'};
    case 'Forester': return {...sedan,length:4.62,width:1.86,belt:1.22,roof:1.7,wheelbase:2.67,radius:.375,nose:1.06,roofFront:.58,roofRear:-1.46,tail:-1.95,hatch:true,color:'#a8b5a0'};
    case 'Outback': return {...sedan,length:4.87,width:1.875,belt:1.24,roof:1.675,wheelbase:2.75,radius:.375,nose:1.08,roofFront:.55,roofRear:-1.55,tail:-2.02,hatch:true,color:'#9fae9f'};
    case 'CX-5': return {...sedan,length:4.57,width:1.84,belt:1.2,roof:1.68,wheelbase:2.7,radius:.36,nose:1.06,roofFront:.52,roofRear:-1.38,tail:-1.93,hatch:true,color:'#b0b9c2'};
    case 'Sportage': return {...sedan,length:4.52,width:1.865,belt:1.22,roof:1.655,wheelbase:2.68,radius:.37,nose:1.05,roofFront:.55,roofRear:-1.4,tail:-1.9,hatch:true,color:'#adb8c4'};
    case 'Tucson': return {...sedan,length:4.63,width:1.865,belt:1.21,roof:1.665,wheelbase:2.76,radius:.37,nose:1.06,roofFront:.54,roofRear:-1.42,tail:-1.94,hatch:true,color:'#aebbc7'};
    case 'Grand Cherokee': return {...sedan,length:4.91,width:1.96,belt:1.26,roof:1.72,wheelbase:2.87,radius:.38,nose:1.12,roofFront:.55,roofRear:-1.5,tail:-2.05,hatch:true,color:'#9aa6b1'};
    case 'Wrangler': return {length:4.33,width:1.9,belt:1.28,roof:1.83,wheelbase:2.47,radius:.39,nose:1.0,roofFront:.8,roofRear:-1.42,tail:-1.72,hatch:true,color:'#b6b0a2'};
    case 'Telluride': return {...sedan,length:5.0,width:1.99,belt:1.27,roof:1.75,wheelbase:2.9,radius:.385,nose:1.14,roofFront:.58,roofRear:-1.6,tail:-2.1,hatch:true,color:'#adb6c0'};
    default:return sedan;
  }
}
