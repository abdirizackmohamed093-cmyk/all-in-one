import Script from "next/script";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import TawkIdentify from "@/components/TawkIdentify";
import AiChatWidget from "@/components/AiChatWidget";
import PopupAd from "@/components/PopupAd";
import "@/app/globals.css"; // Make sure your global styles path matches

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
          <TawkIdentify />
        </AuthProvider>

        <PopupAd />
        <AiChatWidget />

        <Script id="tawk-to-widget" strategy="afterInteractive">
          {`
            var Tawk_API = Tawk_API || {};
            var Tawk_LoadStart = new Date();
            (function () {
              var s1 = document.createElement("script");
              var s0 = document.getElementsByTagName("script")[0];
              s1.async = true;
              s1.src = 'https://embed.tawk.to/6a587fae940f101d5323995a/1jtkr5ge0';
              s1.charset = 'UTF-8';
              s1.setAttribute('crossorigin', '*');
              s0.parentNode.insertBefore(s1, s0);
            })();
          `}
        </Script>
      </body>
    </html>
  );
}