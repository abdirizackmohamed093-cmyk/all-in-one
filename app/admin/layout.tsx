import { AuthUserProvider } from "@/context/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthUserProvider>
      {children}
    </AuthUserProvider>
  );
}