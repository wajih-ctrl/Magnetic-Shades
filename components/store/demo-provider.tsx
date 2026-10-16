'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { initialState, type CartItem, type DemoState, type FitmentStatus, type Product } from '@/lib/demo-data';

const STORAGE_KEY = 'magnetic-shades-demo-v3';

type DemoContextValue = {
  state: DemoState;
  ready: boolean;
  cartCount: number;
  cartSubtotal: number;
  currentFitment: DemoState['fitments'][number];
  setVehicle: (patch: Partial<DemoState['vehicle']>) => void;
  setShade: (patch: Partial<DemoState['shade']>) => void;
  setSign: (patch: Partial<DemoState['sign']>) => void;
  addToCart: (product: Product, meta?: string, price?: number) => void;
  addShadeToCart: () => void;
  updateCartQty: (id: string, qty: number) => void;
  removeCart: (id: string) => void;
  applyDiscount: (code: string) => boolean;
  createOrder: (customer: string, email: string, delivery: string) => string;
  updateOrder: (id: string, patch: Partial<DemoState['orders'][number]>) => void;
  submitFitmentRequest: (customer: string) => string;
  submitQuote: (customer: string) => string;
  submitSupport: (name: string, category: string) => string;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  updateFitment: (id: string, status: FitmentStatus) => void;
  updateQuote: (id: string, status: string) => void;
  updateArtwork: (id: string, status: string) => void;
  resetDemo: () => void;
};

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>(initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let restored: DemoState | null = null;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as DemoState;
        if (parsed.version === 3) restored = parsed;
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

  const currentFitment = useMemo(() => state.fitments.find(f => f.year===state.vehicle.year && f.make===state.vehicle.make && f.model===state.vehicle.model && f.trim===state.vehicle.trim) || ({...state.fitments[2], year:state.vehicle.year, make:state.vehicle.make, model:state.vehicle.model, trim:state.vehicle.trim}), [state.fitments, state.vehicle]);
  const cartCount = state.cart.reduce((sum,item)=>sum+item.qty,0);
  const cartSubtotal = state.cart.reduce((sum,item)=>sum+item.qty*item.price,0);

  const addToCart = useCallback((product: Product, meta = 'Standard selection', price = product.price) => {
    setState(s => {
      const existing = s.cart.find(i=>i.productId===product.id && i.meta===meta);
      const cart = existing ? s.cart.map(i=>i.id===existing.id?{...i,qty:i.qty+1}:i) : [...s.cart,{id:`line-${Date.now()}`,productId:product.id,name:product.name,sku:product.sku,qty:1,price,meta,image:product.image}];
      return {...s,cart,events:[...s.events,'add_to_cart']};
    });
  }, []);

  const addShadeToCart = useCallback(() => setState(s => {
    const p=s.products[0];
    const meta=`${s.vehicle.year} ${s.vehicle.make} ${s.vehicle.model} ${s.vehicle.trim} · ${s.shade.zones.join(', ')} · ${s.shade.edge} edge`;
    const item: CartItem={id:`shade-${Date.now()}`,productId:p.id,name:p.name,sku:p.sku,qty:1,price:p.price,meta,image:p.image};
    return {...s,cart:[...s.cart,item],events:[...s.events,'fitment_add_to_cart']};
  }), []);

  const updateCartQty = useCallback((id:string,qty:number)=>setState(s=>({...s,cart:s.cart.map(i=>i.id===id?{...i,qty:Math.max(1,qty)}:i)})),[]);
  const removeCart = useCallback((id:string)=>setState(s=>({...s,cart:s.cart.filter(i=>i.id!==id)})),[]);
  const applyDiscount = useCallback((code:string)=>{const valid=code.trim().toUpperCase()==='DEMO10'; if(valid)setState(s=>({...s,discount:'DEMO10'})); return valid;},[]);

  const createOrder = useCallback((customer:string,email:string,delivery:string)=>{
    const id=`MS-${10500+Math.floor(Math.random()*400)}`;
    setState(s=>{const subtotal=s.cart.reduce((a,i)=>a+i.price*i.qty,0);const discount=s.discount?subtotal*.1:0;const total=Number(((subtotal-discount+18)*1.07).toFixed(2));return {...s,lastOrderId:id,cart:[],discount:'',orders:[{id,customer,email,date:'Oct 16, 2026',total,payment:'Paid (demo)',fulfillment:'Received',request:'None',delivery,items:s.cart.map(i=>({name:i.name,qty:i.qty,price:i.price,meta:i.meta})),timeline:['Order created','Demo payment approved','Received']},...s.orders],events:[...s.events,'purchase']};});
    return id;
  },[]);
  const updateOrder=useCallback((id:string,patch:Partial<DemoState['orders'][number]>)=>setState(s=>({...s,orders:s.orders.map(o=>o.id===id?{...o,...patch,timeline:patch.fulfillment?[...o.timeline,patch.fulfillment]:o.timeline}:o)})),[]);
  const submitFitmentRequest=useCallback((customer:string)=>{const id=`FR-${300+Math.floor(Math.random()*600)}`;setState(s=>({...s,fitmentRequests:[{id,customer,vehicle:`${s.vehicle.year} ${s.vehicle.make} ${s.vehicle.model} ${s.vehicle.trim}`,status:'Pending Review'},...s.fitmentRequests],events:[...s.events,'fitment_request']}));return id;},[]);
  const submitQuote=useCallback((customer:string)=>{const id=`QT-${2100+Math.floor(Math.random()*500)}`;setState(s=>({...s,quotes:[{id,customer,product:'Studio Magnetic Panel',qty:s.sign.qty,config:`${s.sign.size} · ${s.sign.material}`,date:'Oct 16, 2026',status:'Submitted',amount:null},...s.quotes],events:[...s.events,'quote_submit']}));return id;},[]);
  const submitSupport=useCallback((name:string,category:string)=>{const id=`SUP-${700+Math.floor(Math.random()*200)}`;setState(s=>({...s,supportRequests:[{id,name,category,status:'Open'},...s.supportRequests]}));return id;},[]);
  const updateProduct=useCallback((id:string,patch:Partial<Product>)=>setState(s=>({...s,products:s.products.map(p=>p.id===id?{...p,...patch,updated:'Oct 16, 2026'}:p)})),[]);
  const updateFitment=useCallback((id:string,status:FitmentStatus)=>setState(s=>({...s,fitments:s.fitments.map(f=>f.id===id?{...f,status,revision:f.revision+1,history:[...f.history,{revision:f.revision+1,date:'Oct 16, 2026',note:`Status changed to ${status} in admin demo.`}]}:f)})),[]);
  const updateQuote=useCallback((id:string,status:string)=>setState(s=>({...s,quotes:s.quotes.map(q=>q.id===id?{...q,status}:q)})),[]);
  const updateArtwork=useCallback((id:string,status:string)=>setState(s=>({...s,artwork:s.artwork.map(a=>a.id===id?{...a,status,proof:status==='Proof Prepared'?a.proof+1:a.proof,readiness:status==='Approved'?'Ready':'Blocked'}:a)})),[]);
  const resetDemo=useCallback(()=>setState(initialState()),[]);

  const value={state,ready,cartCount,cartSubtotal,currentFitment,setVehicle,setShade,setSign,addToCart,addShadeToCart,updateCartQty,removeCart,applyDiscount,createOrder,updateOrder,submitFitmentRequest,submitQuote,submitSupport,updateProduct,updateFitment,updateQuote,updateArtwork,resetDemo};
  if (!ready) return <div className="grid min-h-screen place-items-center bg-[#f8f8f6] text-sm font-semibold text-[#626a73]">Loading Magnetic Shades…</div>;
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(){const value=useContext(DemoContext);if(!value)throw new Error('useDemo must be used inside DemoProvider');return value;}
