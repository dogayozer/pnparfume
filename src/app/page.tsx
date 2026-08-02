import Header from '@/components/Header';
import HomeSection from '@/components/Home';
import Products from '@/components/Products';
import Creation from '@/components/Creation';
import CreateScent from '@/components/CreateScent';
import DigitalFranchise from '@/components/DigitalFranchise';
import BuildBrand from '@/components/BuildBrand';
import SalesChannels from '@/components/SalesChannels';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Shop from '@/components/Shop';
import Product from '@/components/Product';
import Cart from '@/components/Cart';
import Admin from '@/components/Admin';
import Footer from '@/components/Footer';

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <HomeSection />
        <Products />
        <Creation />
        <CreateScent />
        <DigitalFranchise />
        <BuildBrand />
        <SalesChannels />
        <About />
        <Contact />
        <Shop />
        <Product />
        <Cart />
        <Admin />
      </main>
      <Footer />
    </>
  );
}
