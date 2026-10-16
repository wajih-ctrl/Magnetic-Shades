'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { initialState, type CartItem, type DemoState, type Product } from '@/lib/demo-data';

const STORAGE_KEY = 'magnetic-shades-demo-v5';

type DemoContextValue = {
  state: DemoState;
  ready: boolean;
  cartCount: number;
  cartSubtotal: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  currentFitment: DemoState['fitments'][number];
  setVehicle: (patch: Partial<DemoState['vehicle']>) => void;
  setShade: (patch: Partial<DemoState['shade']>) => void;
  setSign: (patch: Partial<DemoState['sign']>) => void;
  addToCart: (product: Product, meta?: string, price?: number) => void;
  addShadeToCart: () => void;
  updateCartQty: (id: string, qty: number) => void;
  removeCart: (id: string) => void;
  applyDiscount: (code: string) => boolean;
  removeDiscount: () => void;
  addSignToCart: () => void;
  createOrder: (customer: string, email: string, delivery: string, shippingAddress: string) => string;
  updateOrder: (id: string, patch: Partial<DemoState['orders'][number]>) => void;
  submitFitmentRequest: (customer: string) => string;
  submitQuote: (customer: string) => string;
  submitSupport: (name: string, category: string) => string;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  addProduct: (product: Product) => void;
  duplicateProduct: (id: string) => void;
  updateFitment: (id: string, patch: Partial<DemoState['fitments'][number]>, note?: string) => void;
  addFitment: (fitment: DemoState['fitments'][number]) => void;
  updateQuote: (id: string, patch: string | Partial<DemoState['quotes'][number]>) => void;
  updateArtwork: (id: string, status: string) => void;
  setDemoRole: (role: string) => void;
  recordEvent: (event: string) => void;
  resetDemo: () => void;
};

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>(initialState);
  const [ready, setReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    let restored: DemoState | null = null;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as DemoState;
        if (parsed.version === 5) restored = parsed;
      }
    } catch { /* fall back to seeded demo data */ }
    queueMicrotask(() => {
      if (restored) setState(restored);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, ready]);

  const setVehicle = useCallback((patch: Partial<DemoState['vehicle']>) => setState(s => ({...s, vehicle:{...s.vehicle,...patch}})), []);
  const setShade = useCallback((patch: Partial<DemoState['shade']>) => setState(s => ({...s, shade:{...s.shade,...patch}})), []);
  const setSign = useCallback((patch: Partial<DemoState['sign']>) => setState(s => ({...s, sign:{...s.sign,...patch}})), []);

  const currentFitment = useMemo(() => state.fitments.find(f => f.year===state.vehicle.year && f.make===state.vehicle.make && f.model===state.vehicle.model && f.trim===state.vehicle.trim && f.sku===state.shade.productSku) || ({...state.fitments[2], year:state.vehicle.year, make:state.vehicle.make, model:state.vehicle.model, trim:state.vehicle.trim, sku:state.shade.productSku}), [state.fitments, state.vehicle, state.shade.productSku]);
  const cartCount = state.cart.reduce((sum,item)=>sum+item.qty,0);
  const cartSubtotal = state.cart.reduce((sum,item)=>sum+item.qty*item.price,0);

  const addToCart = useCallback((product: Product, meta = 'Standard selection', price = product.price) => {
    if (product.eligibility !== 'buy' || product.inventory < 1 || price <= 0) return;
    setState(s => {
      const existing = s.cart.find(i=>i.productId===product.id && i.meta===meta);
      const cart = existing ? s.cart.map(i=>i.id===existing.id?{...i,qty:i.qty+1}:i) : [...s.cart,{id:`line-${Date.now()}`,productId:product.id,name:product.name,sku:product.sku,qty:1,price,meta,image:product.image}];
      return {...s,cart,events:[...s.events,'add_to_cart']};
    });
    setCartOpen(true);
  }, []);

  const addShadeToCart = useCallback(() => setState(s => {
    const p=s.products.find(product=>product.sku===s.shade.productSku);
    const fitment=s.fitments.find(f=>f.year===s.vehicle.year&&f.make===s.vehicle.make&&f.model===s.vehicle.model&&f.trim===s.vehicle.trim&&f.sku===s.shade.productSku);
    if(!p||!fitment||fitment.status!=='Verified'||p.inventory<1||p.price<=0||!s.shade.zones.length||!s.shade.zones.every(zone=>fitment.zones.includes(zone)))return s;
    const meta=`${s.vehicle.year} ${s.vehicle.make} ${s.vehicle.model} ${s.vehicle.trim} · ${s.shade.zones.join(', ')} · ${s.shade.edge} edge`;
    const item: CartItem={id:`shade-${Date.now()}`,productId:p.id,name:p.name,sku:p.sku,qty:1,price:p.price,meta,image:p.image};
    return {...s,cart:[...s.cart,item],events:[...s.events,'fitment_add_to_cart']};
  }), []);

  const addSignToCart = useCallback(() => {
    setState(s => {
      const p=s.products.find(product=>product.slug==='fleetmark-door-pair');
      if(!p||s.sign.proofStatus!=='Approved'||s.sign.size==='24 × 36 in')return s;
      const unit=s.sign.size==='12 × 18 in'?74:126;
      const item:CartItem={id:`sign-${Date.now()}`,productId:p.id,name:p.name,sku:p.sku,qty:s.sign.qty,price:unit,meta:`${s.sign.size} · ${s.sign.material} · ${s.sign.alignment} · Proof approved`,image:p.image};
      return {...s,cart:[...s.cart,item],events:[...s.events,'approved_sign_add_to_cart']};
    });
    setCartOpen(true);
  },[]);

  const updateCartQty = useCallback((id:string,qty:number)=>setState(s=>({...s,cart:s.cart.map(i=>i.id===id?{...i,qty:Math.max(1,qty)}:i)})),[]);
  const removeCart = useCallback((id:string)=>setState(s=>({...s,cart:s.cart.filter(i=>i.id!==id)})),[]);
  const applyDiscount = useCallback((code:string)=>{const valid=code.trim().toUpperCase()==='DEMO10'; if(valid)setState(s=>({...s,discount:'DEMO10'})); return valid;},[]);
  const removeDiscount=useCallback(()=>setState(s=>({...s,discount:''})),[]);

  const createOrder = useCallback((customer:string,email:string,delivery:string,shippingAddress:string)=>{
    const id=`MS-${10500+Math.floor(Math.random()*400)}`;
    setState(s=>{const subtotal=s.cart.reduce((a,i)=>a+i.price*i.qty,0);const discount=s.discount?subtotal*.1:0;const shipping=delivery.startsWith('Express')?32:18;const total=Number(((subtotal-discount+shipping)*1.07).toFixed(2));return {...s,lastOrderId:id,cart:[],discount:'',orders:[{id,customer,email,shippingAddress,date:'Oct 16, 2026',total,payment:'Paid (demo)',fulfillment:'Received',request:'None',delivery,items:s.cart.map(i=>({name:i.name,qty:i.qty,price:i.price,meta:i.meta})),timeline:['Order created','Demo payment approved','Received']},...s.orders],events:[...s.events,'purchase']};});
    return id;
  },[]);
  const updateOrder=useCallback((id:string,patch:Partial<DemoState['orders'][number]>)=>setState(s=>({...s,orders:s.orders.map(o=>o.id===id?{...o,...patch,timeline:patch.fulfillment?[...o.timeline,patch.fulfillment]:o.timeline}:o)})),[]);
  const submitFitmentRequest=useCallback((customer:string)=>{const id=`FR-${300+Math.floor(Math.random()*600)}`;setState(s=>({...s,fitmentRequests:[{id,customer,vehicle:`${s.vehicle.year} ${s.vehicle.make} ${s.vehicle.model} ${s.vehicle.trim}`,status:'Pending Review'},...s.fitmentRequests],events:[...s.events,'fitment_request']}));return id;},[]);
  const submitQuote=useCallback((customer:string)=>{const id=`QT-${2100+Math.floor(Math.random()*500)}`;setState(s=>({...s,quotes:[{id,customer,product:'Studio Magnetic Panel',qty:s.sign.qty,config:`${s.sign.size} · ${s.sign.material}`,date:'Oct 16, 2026',status:'Submitted',amount:null},...s.quotes],events:[...s.events,'quote_submit']}));return id;},[]);
  const submitSupport=useCallback((name:string,category:string)=>{const id=`SUP-${700+Math.floor(Math.random()*200)}`;setState(s=>({...s,supportRequests:[{id,name,category,status:'Open'},...s.supportRequests]}));return id;},[]);
  const updateProduct=useCallback((id:string,patch:Partial<Product>)=>setState(s=>({...s,products:s.products.map(p=>p.id===id?{...p,...patch,updated:'Oct 16, 2026'}:p)})),[]);
  const addProduct=useCallback((product:Product)=>setState(s=>({...s,products:[product,...s.products]})),[]);
  const duplicateProduct=useCallback((id:string)=>setState(s=>{const source=s.products.find(p=>p.id===id);if(!source)return s;const suffix=Date.now();const copy={...source,id:`p-${suffix}`,slug:`${source.slug}-copy-${suffix}`,name:`${source.name} Copy`,sku:`${source.sku}-COPY`,status:'Draft' as const,updated:'Oct 16, 2026'};return {...s,products:[copy,...s.products]}}),[]);
  const updateFitment=useCallback((id:string,patch:Partial<DemoState['fitments'][number]>,note='Fitment record updated in admin demo.')=>setState(s=>({...s,fitments:s.fitments.map(f=>{if(f.id!==id)return f;const nextRevision=f.revision+1;return {...f,...patch,revision:nextRevision,history:[...f.history,{revision:nextRevision,date:'Oct 16, 2026',note,status:patch.status??f.status,zones:patch.zones??f.zones}]}})})),[]);
  const addFitment=useCallback((fitment:DemoState['fitments'][number])=>setState(s=>({...s,fitments:[fitment,...s.fitments]})),[]);
  const updateQuote=useCallback((id:string,patch:string|Partial<DemoState['quotes'][number]>)=>setState(s=>({...s,quotes:s.quotes.map(q=>q.id===id?{...q,...(typeof patch==='string'?{status:patch}:patch)}:q)})),[]);
  const updateArtwork=useCallback((id:string,status:string)=>setState(s=>({...s,artwork:s.artwork.map(a=>a.id===id?{...a,status,proof:status==='Proof Prepared'?a.proof+1:a.proof,readiness:status==='Approved'?'Ready':'Blocked'}:a)})),[]);
  const setDemoRole=useCallback((demoRole:string)=>setState(s=>({...s,demoRole})),[]);
  const recordEvent=useCallback((event:string)=>setState(s=>({...s,events:[...s.events,event]})),[]);
  const resetDemo=useCallback(()=>setState(initialState()),[]);

  const value={state,ready,cartCount,cartSubtotal,cartOpen,setCartOpen,currentFitment,setVehicle,setShade,setSign,addToCart,addShadeToCart,addSignToCart,updateCartQty,removeCart,applyDiscount,removeDiscount,createOrder,updateOrder,submitFitmentRequest,submitQuote,submitSupport,updateProduct,addProduct,duplicateProduct,updateFitment,addFitment,updateQuote,updateArtwork,setDemoRole,recordEvent,resetDemo};
  if (!ready) return <div className="grid min-h-screen place-items-center bg-[#f8f8f6] text-sm font-semibold text-[#626a73]">Loading Magnetic Shades…</div>;
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(){const value=useContext(DemoContext);if(!value)throw new Error('useDemo must be used inside DemoProvider');return value;}
