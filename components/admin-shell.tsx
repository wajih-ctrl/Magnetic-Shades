'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Boxes, CarFront, ChevronRight, FileImage, LayoutDashboard, LogOut, Package, Store, Wrench } from 'lucide-react';
import { Brand } from '@/components/brand';
import { Button } from '@/components/ui/button';

const links=[
  ['Overview','/admin',LayoutDashboard],['Products','/admin/products',Boxes],['Orders','/admin/orders',Package],['Quotes & Artwork','/admin/quotes-artwork',FileImage],['Vehicle Fitments','/admin/fitments',CarFront],['Analytics','/admin/analytics',BarChart3],['Demo Settings','/admin/settings',Wrench],
] as const;

export function AdminShell({children}:{children:React.ReactNode}){const path=usePathname();return <div className="min-h-screen bg-[#f3f4f4] text-[#1d2329]"><aside className="bg-[#101419] p-4 text-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:p-6"><Brand inverse/><nav className="mt-7 flex gap-1 overflow-x-auto lg:grid" aria-label="Admin navigation">{links.map(([label,href,Icon])=><Link key={href} href={href} className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${path===href?'bg-white/12 text-white':'text-[#b9c0c5] hover:bg-white/8 hover:text-white'}`}><Icon className="size-4"/>{label}</Link>)}</nav><div className="mt-5 hidden border-t border-white/10 pt-5 lg:absolute lg:bottom-6 lg:left-6 lg:right-6 lg:grid lg:gap-2"><Button variant="outline" className="border-white/15 bg-transparent text-white hover:bg-white hover:text-[#171c22]" asChild><Link href="/"><Store/>View storefront</Link></Button><Button variant="ghost" className="justify-start text-[#aeb6bc]" asChild><Link href="/login"><LogOut/>Exit admin demo</Link></Button></div></aside><div className="lg:ml-64"><header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[#e1e5e8] bg-white px-5 sm:px-8"><div className="flex items-center gap-2 text-sm text-[#626a73]">Admin <ChevronRight className="size-3"/> <span className="font-semibold text-[#1d2329]">{links.find(([,href])=>href===path)?.[0]||'Overview'}</span></div><span className="rounded-full bg-[#f1f3f4] px-3 py-1.5 text-xs font-semibold">Demo administrator</span></header>{children}</div></div>}

