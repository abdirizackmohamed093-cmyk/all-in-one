"use client";

import { useEffect, useState } from "react";
import DataTable, { Column } from "@/components/admin/DataTable";
import { fetchCustomers, setUserRole, Customer } from "@/lib/firebase/customers";
import { useAuth } from "@/context/AuthContext";

export default function AdminCustomersPage() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers().then((data) => {
      setCustomers(data);
      setLoading(false);
    });
  }, []);

  const handleRoleChange = async (
    targetUid: string,
    newRole: "customer" | "admin"
  ) => {
    // Guard against an admin accidentally revoking their own access — if
    // you're the only admin and demote yourself, you'd be locked out of
    // /admin with no way back in short of editing Firestore by hand again.
    if (targetUid === user?.uid && newRole === "customer") {
      const confirmed = confirm(
        "This will remove your own admin access and you'll be signed out of the admin dashboard. Continue?"
      );
      if (!confirmed) return;
    }

    setCustomers((prev) =>
      prev.map((c) => (c.uid === targetUid ? { ...c, role: newRole } : c))
    );

    const ok = await setUserRole(targetUid, newRole);
    if (!ok) {
      fetchCustomers().then(setCustomers);
    }
  };

  const columns: Column<Customer>[] = [
    { header: "Name", accessor: (c) => c.name || "—" },
    { header: "Email", accessor: "email" },
    {
      header: "Role",
      accessor: (c) => (
        <select
          value={c.role}
          onChange={(e) =>
            handleRoleChange(c.uid, e.target.value as "customer" | "admin")
          }
          className={`text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded border ${
            c.role === "admin"
              ? "bg-burgundy/10 text-burgundy border-burgundy/30"
              : "bg-neutral-50 text-charcoal/60 border-neutral-200"
          }`}
        >
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
      ),
    },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-charcoal mb-6">Customers</h1>

      <DataTable
        data={customers}
        columns={columns}
        loading={loading}
        getRowId={(c) => c.id}
        emptyMessage="No customers yet."
      />
    </div>
  );
}