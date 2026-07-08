import { AuthUserProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthUserProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthUserProvider>
  );
}