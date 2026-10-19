// Illustrative model profiles in metres; these are not manufacturing or fitment data.
export type VehicleProfile = { length:number; width:number; belt:number; roof:number; wheelbase:number; radius:number; nose:number; roofFront:number; roofRear:number; tail:number; truck?:boolean; hatch?:boolean; color:string };
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
    default:return sedan;
  }
}
