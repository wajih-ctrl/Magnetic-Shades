'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { DemoProvider } from '@/components/store/demo-provider';
import { SiteShell } from '@/components/site-shell';
import { AdminShell } from '@/components/admin-shell';
import { HomePage, ShopPage, CollectionPage, ProductPage, LoginPage } from '@/components/pages/storefront-pages';
import { VehicleSelectionPage, ConfiguratorPage, FitmentResultPage, FitmentRequestPage, SignDesignPage, ArtworkPage } from '@/components/pages/configurator-pages';
import { CartPage, CheckoutPage, ConfirmationPage, QuoteRequestPage, OrderStatusPage } from '@/components/pages/commerce-pages';
import { AboutPage, InstallationPage, FaqPage, ContactPage, PoliciesPage } from '@/components/pages/info-pages';
import { AdminAnalytics, AdminDashboard, AdminFitments, AdminOrders, AdminProducts, AdminQuotesArtwork, AdminSettings } from '@/components/pages/admin-pages';
import { PageHero } from '@/components/page-primitives';

function RouteView(){
  const path=usePathname(); const params=useSearchParams();
  if(path.startsWith('/admin')){
    const page=path==='/admin'?<AdminDashboard/>:path==='/admin/products'?<AdminProducts/>:path==='/admin/orders'?<AdminOrders/>:path==='/admin/quotes-artwork'?<AdminQuotesArtwork/>:path==='/admin/fitments'?<AdminFitments/>:path==='/admin/analytics'?<AdminAnalytics/>:path==='/admin/settings'?<AdminSettings/>:<AdminDashboard/>;
    return <AdminShell>{page}</AdminShell>;
  }
  let page:React.ReactNode;
  if(path==='/')page=<HomePage/>;
  else if(path==='/login'||path==='/demo-access')page=<LoginPage/>;
  else if(path==='/shop')page=<ShopPage initialQuery={params.get('q')||''}/>;
  else if(path.startsWith('/collections/'))page=<CollectionPage slug={path.split('/')[2]||''}/>;
  else if(path.startsWith('/products/'))page=<ProductPage slug={path.split('/')[2]||''}/>;
  else if(path==='/configure/vehicle')page=<VehicleSelectionPage/>;
  else if(path==='/configure/vehicle/preview')page=<ConfiguratorPage/>;
  else if(path==='/configure/fitment-result')page=<FitmentResultPage/>;
  else if(path==='/configure/fitment-request')page=<FitmentRequestPage/>;
  else if(path==='/custom-signs/design')page=<SignDesignPage/>;
  else if(path==='/custom-signs/artwork')page=<ArtworkPage/>;
  else if(path==='/cart')page=<CartPage/>;
  else if(path==='/checkout')page=<CheckoutPage/>;
  else if(path.startsWith('/checkout/confirmation/'))page=<ConfirmationPage orderId={path.split('/')[3]||''}/>;
  else if(path==='/quote/request')page=<QuoteRequestPage/>;
  else if(path==='/orders/status')page=<OrderStatusPage/>;
  else if(path==='/about')page=<AboutPage/>;
  else if(path==='/installation-care')page=<InstallationPage/>;
  else if(path==='/faq')page=<FaqPage/>;
  else if(path==='/contact')page=<ContactPage/>;
  else if(path==='/policies')page=<PoliciesPage initialTab={params.get('section')||'shipping'}/>;
  else page=<PageHero eyebrow="Magnetic Shades" title="That page is outside this prototype." copy="Use the navigation to return to a working customer or admin journey."/>;
  return <SiteShell>{page}</SiteShell>;
}

export function PrototypeApp(){return <DemoProvider><RouteView/></DemoProvider>}

