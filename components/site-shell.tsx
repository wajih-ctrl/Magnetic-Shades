'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Brand } from '@/components/brand';
import { useDemo } from '@/components/store/demo-provider';

const nav=[['Shop','/shop'],['Vehicle Configurator','/configure/vehicle'],['Custom Signs','/custom-signs/design'],['Installation & Care','/installation-care'],['About','/about']];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const path=usePathname(); const {cartCount}=useDemo(); const [searchOpen,setSearchOpen]=useState(false);
  return <div className="min-h-screen bg-[#f8f8f6] text-[#1d2329]">
    <a href="#main" className="fixed -top-20 left-4 z-[100] rounded-lg bg-white px-4 py-2 focus:top-4">Skip to content</a>
    <div className="bg-[#101419] py-2 text-xs text-[#cbd0d4]"><div className="site-container flex justify-between"><span>Interactive commerce prototype</span><span>All pricing and fitments are demo data</span></div></div>
    <header className="sticky top-0 z-50 border-b border-[#e1e5e8]/90 bg-[#f8f8f6]/95 backdrop-blur-xl">
      <div className="site-container flex h-[74px] items-center gap-8">
        <Brand />
        <nav className="mr-auto hidden items-center gap-6 lg:flex" aria-label="Main navigation">{nav.map(([label,href])=><Link key={href} href={href} className={`text-sm font-semibold transition-colors hover:text-[#d96b36] ${path.startsWith(href)?'text-[#d96b36]':''}`}>{label}</Link>)}</nav>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full" onClick={()=>setSearchOpen(v=>!v)} aria-label="Search"><Search className="size-4"/></Button>
          <Button variant="outline" size="icon" className="hidden rounded-full sm:inline-flex" asChild><Link href="/login" aria-label="Demo roles"><UserRound className="size-4"/></Link></Button>
          <Button variant="outline" size="icon" className="relative rounded-full" asChild><Link href="/cart" aria-label={`Cart with ${cartCount} items`}><ShoppingBag className="size-4"/>{cartCount>0&&<span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-[#d96b36] text-[10px] text-white">{cartCount}</span>}</Link></Button>
          <Sheet><SheetTrigger asChild><Button variant="outline" size="icon" className="rounded-full lg:hidden"><Menu className="size-4"/></Button></SheetTrigger><SheetContent><SheetHeader><SheetTitle><Brand/></SheetTitle></SheetHeader><nav className="mt-8 grid gap-2">{nav.map(([label,href])=><Button key={href} variant="ghost" className="justify-start" asChild><Link href={href}>{label}</Link></Button>)}<Button variant="ghost" className="justify-start" asChild><Link href="/admin">Admin demo</Link></Button></nav></SheetContent></Sheet>
        </div>
      </div>
      {searchOpen&&<form action="/shop" className="site-container flex gap-2 border-t border-[#e1e5e8] py-3"><input name="q" autoFocus aria-label="Search products" placeholder="Search shades, signs or accessories…" className="h-11 flex-1 rounded-xl border border-[#e1e5e8] bg-white px-4 outline-none focus:border-[#d96b36]"/><Button type="submit" className="bg-[#171c22]">Search</Button><Button variant="ghost" size="icon" type="button" onClick={()=>setSearchOpen(false)}><X className="size-4"/></Button></form>}
    </header>
    <main id="main">{children}</main>
    <footer className="bg-[#101419] py-16 text-white"><div className="site-container grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]"><div><Brand inverse/><p className="mt-5 max-w-sm text-sm leading-7 text-[#aeb6bc]">Premium magnetic automotive accessories, explored through a fully simulated customer and operations experience.</p><span className="mt-5 inline-block rounded-full border border-white/15 px-3 py-1.5 text-[11px] text-[#aeb6bc]">Prototype experience · No live transactions</span></div><FooterCol title="Shop" links={[["Shop all","/shop"],["Vehicle shades","/collections/vehicle-shades"],["Magnetic signs","/collections/magnetic-signs"],["Future products","/collections/future-products"]]}/><FooterCol title="Support" links={[["Installation & care","/installation-care"],["FAQ","/faq"],["Contact","/contact"],["Order status","/orders/status"]]}/><FooterCol title="Demo" links={[["Choose a role","/login"],["Admin portal","/admin"],["Policies","/policies"],["Reset demo data","/admin/settings"]]}/></div><div className="site-container mt-12 flex flex-col justify-between gap-3 border-t border-white/10 pt-5 text-xs text-[#7f8a92] sm:flex-row"><span>© 2026 Magnetic Shades prototype</span><span>Sample fitments are illustrative and not physically validated.</span></div></footer>
  </div>;
}

function FooterCol({title,links}:{title:string;links:string[][]}){return <div><h3 className="mb-4 text-sm font-semibold">{title}</h3>{links.map(([l,h])=><Link key={h} href={h} className="mb-2 block text-sm text-[#aeb6bc] hover:text-white">{l}</Link>)}</div>}

