export type Product = {
  id: string; slug: string; name: string; sku: string; category: 'vehicle-shades' | 'magnetic-signs' | 'future-products';
  type: string; price: number; inventory: number; status: 'Active' | 'Draft'; tag: string;
  eligibility: 'buy' | 'configure' | 'customize' | 'quote' | 'soon' | 'unavailable';
  color: string; updated: string; description: string; image: string; approvedClaims: string;
  images?: string[]; variants?: string[]; shippingWeight?: number; shippingClass?: string; taxCategory?: string;
};

export type FitmentStatus = 'Verified' | 'Needs Confirmation' | 'Unsupported';
export type Fitment = {
  id: string; year: string; make: string; model: string; trim: string; body: string; market: string; sku: string;
  zones: string[]; status: FitmentStatus; tested: string; revision: number; geometry: string; notes: string; exclusions: string;
  history: { revision: number; date: string; note: string; status?: FitmentStatus; zones?: string[] }[];
};

export type CartItem = { id: string; productId: string; name: string; sku: string; qty: number; price: number; meta: string; image: string };
export type DemoOrder = { id: string; customer: string; email: string; shippingAddress: string; date: string; total: number; payment: string; fulfillment: string; request: string; delivery: string; items: { name: string; qty: number; price: number; meta: string }[]; timeline: string[] };
export type Quote = { id: string; customer: string; product: string; qty: number; config: string; date: string; status: string; amount: number | null };
export type Artwork = { id: string; customer: string; product: string; filename: string; proof: number; status: string; readiness: string };

export const categories = [
  { slug: 'vehicle-shades', name: 'Exterior Magnetic Vehicle Shades', kicker: 'Vehicle-specific comfort', image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1600&q=85', copy: 'Configure shade coverage around compatible exterior metal surfaces and door-frame areas.' },
  { slug: 'magnetic-signs', name: 'Magnetic Advertising Signs & Accessories', kicker: 'Brand while you move', image: 'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1600&q=85', copy: 'Size, finish, artwork and proof workflows made clear from first draft to quote.' },
  { slug: 'future-products', name: 'Future Products', kicker: 'In development', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=85', copy: 'A considered preview of seasonal, interior and lighting concepts coming later.' },
] as const;

export const seedProducts: Product[] = [
  { id:'p1', slug:'aero-edge-kit', name:'Aero Edge Shade Kit', sku:'MS-AE-240', category:'vehicle-shades', type:'Vehicle shade', price:289, inventory:18, status:'Active', tag:'Best seller', eligibility:'configure', color:'Graphite', updated:'Oct 14, 2026', description:'A tailored four-window magnetic shade set for supported demonstration vehicle records.', image:'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=85', approvedClaims:'Exterior magnetic mounting on compatible metal frame surfaces.' },
  { id:'p2', slug:'city-pair-shades', name:'City Pair Shade Set', sku:'MS-CP-118', category:'vehicle-shades', type:'Vehicle shade', price:169, inventory:31, status:'Active', tag:'Everyday', eligibility:'configure', color:'Black', updated:'Oct 12, 2026', description:'Driver and passenger front-window coverage in a light, compact format.', image:'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=85', approvedClaims:'Window-specific coverage for supported demo fitments.' },
  { id:'p3', slug:'fleetmark-door-pair', name:'Fleetmark Door Pair', sku:'MS-FM-1824', category:'magnetic-signs', type:'Custom sign', price:126, inventory:74, status:'Active', tag:'Custom artwork', eligibility:'customize', color:'White', updated:'Oct 15, 2026', description:'A removable magnetic sign pair with guided artwork proofing.', image:'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=85', approvedClaims:'Removable magnetic signage for suitable clean steel panels.' },
  { id:'p4', slug:'studio-magnetic-panel', name:'Studio Magnetic Panel', sku:'MS-SP-2436', category:'magnetic-signs', type:'Custom sign', price:0, inventory:40, status:'Active', tag:'Quote only', eligibility:'quote', color:'White', updated:'Oct 11, 2026', description:'Large-format magnetic panel for custom fleet applications and manual quotation.', image:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85', approvedClaims:'Custom sizing and artwork review available.' },
  { id:'p5', slug:'surface-prep-kit', name:'Surface Prep Kit', sku:'MS-CARE-01', category:'magnetic-signs', type:'Care accessory', price:28, inventory:56, status:'Active', tag:'Ready to ship', eligibility:'buy', color:'Neutral', updated:'Oct 10, 2026', description:'Soft cloths, panel-safe cleaning solution and storage sleeve for routine care.', image:'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1200&q=85', approvedClaims:'For general cleaning and dry storage.' },
  { id:'p6', slug:'winter-interior-screen', name:'Winter Interior Screen', sku:'MS-FUT-02', category:'future-products', type:'Seasonal concept', price:0, inventory:0, status:'Draft', tag:'Coming soon', eligibility:'soon', color:'Silver', updated:'Oct 08, 2026', description:'An early concept preview for future seasonal interior coverage.', image:'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85', approvedClaims:'Concept preview only.' },
  { id:'p7', slug:'halo-entry-light', name:'Halo Entry Light', sku:'MS-FUT-04', category:'future-products', type:'Lighting concept', price:0, inventory:0, status:'Draft', tag:'Coming soon', eligibility:'soon', color:'Copper', updated:'Oct 07, 2026', description:'A restrained courtesy-light concept for a future accessory line.', image:'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=85', approvedClaims:'Concept preview only.' },
  { id:'p8', slug:'edge-storage-sleeve', name:'Edge Storage Sleeve', sku:'MS-CASE-02', category:'vehicle-shades', type:'Storage accessory', price:42, inventory:0, status:'Active', tag:'Out of stock', eligibility:'unavailable', color:'Graphite', updated:'Oct 09, 2026', description:'A structured storage sleeve sized for paired exterior shades.', image:'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=85', approvedClaims:'Dry storage accessory.' },
];

export const vehicleData: Record<string, Record<string, string[]>> = {
  Toyota: { Corolla: ['LE', 'SE'] },
  Ford: { 'F-150': ['XLT', 'Lariat'] },
  Honda: { Civic: ['Touring', 'Sport'] },
};

export const seedFitments: Fitment[] = [
  { id:'FIT-101', year:'2023', make:'Toyota', model:'Corolla', trim:'LE', body:'Sedan', market:'Demo / PK', sku:'MS-AE-240', zones:['Driver front','Driver rear','Passenger front','Passenger rear'], status:'Verified', tested:'Oct 02, 2026', revision:2, geometry:'GEO-CRL-02', notes:'Apply only to compatible clean metal door-frame areas. Windshield not supported.', exclusions:'Windshield; direct glass mounting', history:[{revision:1,date:'Sep 18, 2026',note:'Initial front-pair demo record.'},{revision:2,date:'Oct 02, 2026',note:'Rear door coverage added to sample record.'}] },
  { id:'FIT-102', year:'2022', make:'Ford', model:'F-150', trim:'XLT', body:'Crew Cab', market:'Demo / PK', sku:'MS-AE-240', zones:['Driver front','Passenger front'], status:'Needs Confirmation', tested:'Sep 28, 2026', revision:1, geometry:'GEO-F150-01', notes:'Manual review required for body-style details.', exclusions:'Rear doors and windshield pending review', history:[{revision:1,date:'Sep 28, 2026',note:'Created as confirmation-only demo record.'}] },
  { id:'FIT-103', year:'2024', make:'Honda', model:'Civic', trim:'Touring', body:'Sedan', market:'Demo / PK', sku:'MS-AE-240', zones:[], status:'Unsupported', tested:'Sep 14, 2026', revision:1, geometry:'GEO-CVC-01', notes:'No supported shade configuration in sample records.', exclusions:'All coverage zones', history:[{revision:1,date:'Sep 14, 2026',note:'Marked unsupported for demonstration.'}] },
];

export const seedOrders: DemoOrder[] = [
  { id:'MS-10428', customer:'Amina Shah', email:'amina@example.demo', shippingAddress:'12 Demo Avenue, Lahore, Punjab 54000, Pakistan', date:'Oct 15, 2026', total:356.48, payment:'Paid (demo)', fulfillment:'Preparing', request:'None', delivery:'Illustrative delivery: Oct 22–24', items:[{name:'Aero Edge Shade Kit',qty:1,price:289,meta:'2023 Toyota Corolla LE · Four-window coverage'}], timeline:['Order created','Demo payment approved','Preparing'] },
  { id:'MS-10396', customer:'Omar Rizvi', email:'omar@example.demo', shippingAddress:'88 Sample Road, Karachi, Sindh 75500, Pakistan', date:'Oct 12, 2026', total:154.22, payment:'Paid (demo)', fulfillment:'Packed', request:'Refund requested', delivery:'Illustrative delivery: Oct 19–21', items:[{name:'Fleetmark Door Pair',qty:1,price:126,meta:'18 × 24 in · Matte'}], timeline:['Order created','Proof approved','Packed','Refund requested'] },
];

export const seedQuotes: Quote[] = [
  { id:'QT-2081', customer:'Northline Studio', product:'Studio Magnetic Panel', qty:4, config:'24 × 36 in · High-tack magnetic', date:'Oct 15, 2026', status:'Under Review', amount:null },
  { id:'QT-2074', customer:'Beacon Coffee', product:'Fleetmark Door Pair', qty:2, config:'18 × 24 in · Matte', date:'Oct 13, 2026', status:'Quoted', amount:264 },
];

export const seedArtwork: Artwork[] = [
  { id:'ART-641', customer:'Northline Studio', product:'Studio Magnetic Panel', filename:'northline-mark.pdf', proof:1, status:'Awaiting Review', readiness:'Blocked' },
  { id:'ART-638', customer:'Beacon Coffee', product:'Fleetmark Door Pair', filename:'beacon-coffee.png', proof:2, status:'Approved', readiness:'Ready' },
];

export const faqItems = [
  { category:'Products', q:'Do magnetic shades attach directly to window glass?', a:'No. The exterior shade concepts shown here mount to compatible metal vehicle body or door-frame surfaces described by the selected demonstration fitment record.' },
  { category:'Vehicle Compatibility', q:'What does Verified mean in this prototype?', a:'Verified means eligible within the fabricated demonstration dataset. It is not a claim of physical testing or real-world compatibility.' },
  { category:'Installation', q:'How should I prepare a mounting surface?', a:'Use a clean, dry and suitable metal surface. Review the vehicle-specific notes and never cover controls, cameras or required visibility areas.' },
  { category:'Magnetic Signs', q:'Can I upload my own artwork?', a:'Yes. The prototype accepts PNG, JPG and PDF files up to 10 MB locally for a simulated proof workflow. Files are not uploaded to a production service.' },
  { category:'Artwork & Proofs', q:'Does approving a proof start production?', a:'No. Proof approval, quotation and a confirmed production order are separate states in this demonstration.' },
  { category:'Ordering', q:'Will the checkout charge my card?', a:'No. Checkout is simulated and never asks for a real card number, CVV or payment token.' },
  { category:'Shipping & Returns', q:'Are the delivery dates guaranteed?', a:'No. Delivery ranges and policies shown here are illustrative sample content pending business approval.' },
];

export type DemoState = {
  version:number; products:Product[]; fitments:Fitment[]; orders:DemoOrder[]; quotes:Quote[]; artwork:Artwork[]; cart:CartItem[];
  vehicle:{year:string;make:string;model:string;trim:string}; shade:{zones:string[];mesh:string;edge:string;view:string;zoom:number;angle:number;productSku:string};
  sign:{size:string;material:string;qty:number;color:string;assist:boolean;filename:string;proofStatus:string;productType:string;alignment:string;assistNotes:string;requestedChanges:string}; discount:string; lastOrderId:string;
  fitmentRequests:{id:string;customer:string;vehicle:string;status:string}[]; supportRequests:{id:string;name:string;category:string;status:string}[]; demoRole:string; events:string[];
};

export function initialState(): DemoState {
  return {
    version:4, products:structuredClone(seedProducts), fitments:structuredClone(seedFitments), orders:structuredClone(seedOrders), quotes:structuredClone(seedQuotes), artwork:structuredClone(seedArtwork),
    cart:[
      {id:'line-seed-1',productId:'p5',name:'Surface Prep Kit',sku:'MS-CARE-01',qty:1,price:28,meta:'Neutral finish · Standard kit',image:seedProducts[4].image},
      {id:'line-seed-2',productId:'p3',name:'Fleetmark Door Pair',sku:'MS-FM-1824',qty:1,price:126,meta:'18 × 24 in · Matte magnetic · Proof ART-638 approved',image:seedProducts[2].image},
    ],
    vehicle:{year:'2023',make:'Toyota',model:'Corolla',trim:'LE'}, shade:{zones:['Driver front','Passenger front'],mesh:'Performance mesh',edge:'Copper',view:'Driver side',zoom:1,angle:0,productSku:'MS-AE-240'},
    sign:{size:'18 × 24 in',material:'Matte magnetic',qty:2,color:'#f5f3ee',assist:false,filename:'',proofStatus:'Awaiting Review',productType:'Fleetmark Door Pair',alignment:'Centered',assistNotes:'',requestedChanges:''}, discount:'', lastOrderId:'MS-10428',
    fitmentRequests:[], supportRequests:[], demoRole:'Retail customer', events:[],
  };
}
