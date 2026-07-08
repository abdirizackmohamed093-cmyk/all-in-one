import { CartProvider } from "@/context/CartContext";
import "./globals.css";

export const metadata = {
  title: "ALL IN ONE SHOP",
  description: "Premium E-Commerce Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}