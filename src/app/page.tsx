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
import Footer from '@/components/Footer';
import prisma from '@/lib/prisma';

// Cache varsayılan olarak aktiftir (Static Generation). 
// Excel yüklendiğinde revalidatePath('/') ile cache temizlenecek.
export default async function Page() {
  // Fetch active products from the database
  const products = await prisma.product.findMany({
    where: { status: 'active' },
    orderBy: { createdAt: 'desc' }
  });

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
        <Shop products={products} />
        <Product />
        <Cart />
      </main>
      <Footer />
    </>
  );
}
