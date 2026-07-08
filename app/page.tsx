import Header from "@/components/layout/Header";
import ProductCard from "@/components/products/ProductCard";
import Footer from "@/components/Footer"; // Resolves the footer component sitting in your tree tabs

const DUMMY_PRODUCTS = [
  {
    id: "prod_01",
    name: "The Executive Burgundy Silk Blazer",
    price: 24500,
    imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=600",
    category: "Apparel",
    stockCount: 5,
  },
  {
    id: "prod_02",
    name: "Classic Soft Gold Minimalist Chronograph",
    price: 18900,
    imageUrl: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=600",
    category: "Timepieces",
    stockCount: 2,
  },
  {
    id: "prod_03",
    name: "Premium Suede Charcoal Chelsea Boot",
    price: 16000,
    imageUrl: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&q=80&w=600",
    category: "Footwear",
    stockCount: 8,
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between">
      <div>
        <Header />
        
        {/* Main Content Area bounded neatly inside layout safe boundaries */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h1 className="font-serif text-3xl font-bold tracking-wide text-neutral-900">
              Curated Collections
            </h1>
            <p className="text-neutral-500 text-sm mt-2">
              Experience premium craftsmanship engineered for modern luxury.
            </p>
          </div>
          
          {/* Main Grid Interface with clean column structures across viewport steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 elements-center justify-center">
            {DUMMY_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}