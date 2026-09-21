
"use client";

import {
  CalendarDays,
  MapPin,
  MessageCircle,
  Search,
  UserPlus,
  ArrowUpRight,
  Loader2,
  RefreshCw,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Customer = {
  id: number;
  full_name: string;
  phone: string;
  location: string | null;
  email: string | null;
  notes: string | null;
  created_at: string;
};

type CustomerForm = {
  full_name: string;
  phone: string;
  location: string;
  email: string;
  notes: string;
};

const emptyForm: CustomerForm = {
  full_name: "",
  phone: "",
  location: "",
  email: "",
  notes: "",
};

export default function CustomersPage() {
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] =
    useState<Customer | null>(null);
  const [form, setForm] = useState<CustomerForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    setError("");

    const supabase = createClient();

    const { data, error: fetchError } = await supabase
      .from("customers")
      .select(`
        id,
        full_name,
        phone,
        location,
        email,
        notes,
        created_at
      `)
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error("Customers fetch error:", fetchError);
      setError("Unable to load customers. Please try again.");
      setCustomers([]);
      setLoading(false);
      return;
    }

    setCustomers((data ?? []) as Customer[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      return customers;
    }

    return customers.filter((customer) => {
      return (
        customer.full_name.toLowerCase().includes(searchValue) ||
        customer.phone.toLowerCase().includes(searchValue) ||
        (customer.location ?? "")
          .toLowerCase()
          .includes(searchValue) ||
        (customer.email ?? "")
          .toLowerCase()
          .includes(searchValue)
      );
    });
  }, [customers, search]);

  const openWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "").replace(/^0/, "254");

    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
        "Hello, this is FINETEX INTERIORS. We are following up regarding your interior project."
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  const openAddForm = () => {
    setEditingCustomer(null);
    setForm(emptyForm);
    setShowForm(true);
    setError("");
  };

  const openEditForm = (customer: Customer) => {
    setEditingCustomer(customer);

    setForm({
      full_name: customer.full_name,
      phone: customer.phone,
      location: customer.location ?? "",
      email: customer.email ?? "",
      notes: customer.notes ?? "",
    });

    setShowForm(true);
    setError("");
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingCustomer(null);
    setForm(emptyForm);
  };

  const handleSave = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!form.full_name.trim() || !form.phone.trim()) {
      setError("Customer name and phone number are required.");
      return;
    }

    setSaving(true);
    setError("");

    const supabase = createClient();

    const customerData = {
      full_name: form.full_name.trim(),
      phone: form.phone.trim(),
      location: form.location.trim() || null,
      email: form.email.trim() || null,
      notes: form.notes.trim() || null,
    };

    if (editingCustomer) {
      const { data, error: updateError } = await supabase
        .from("customers")
        .update(customerData)
        .eq("id", editingCustomer.id)
        .select()
        .single();

      if (updateError) {
        console.error("Customer update error:", updateError);
        setError("Unable to update customer. Please try again.");
        setSaving(false);
        return;
      }

      setCustomers((current) =>
        current.map((customer) =>
          customer.id === editingCustomer.id
            ? (data as Customer)
            : customer
        )
      );
    } else {
      const { data, error: insertError } = await supabase
        .from("customers")
        .insert(customerData)
        .select()
        .single();

      if (insertError) {
        console.error("Customer insert error:", insertError);
        setError("Unable to add customer. Please try again.");
        setSaving(false);
        return;
      }

      setCustomers((current) => [
        data as Customer,
        ...current,
      ]);
    }

    setSaving(false);
    closeForm();
  };

  const deleteCustomer = async (customer: Customer) => {
    const confirmed = window.confirm(
      `Delete ${customer.full_name}? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(customer.id);
    setError("");

    const supabase = createClient();

    const { error: deleteError } = await supabase
      .from("customers")
      .delete()
      .eq("id", customer.id);

    if (deleteError) {
      console.error("Customer delete error:", deleteError);
      setError(
        "Unable to delete this customer. They may be linked to a quotation or project."
      );
      setDeletingId(null);
      return;
    }

    setCustomers((current) =>
      current.filter((item) => item.id !== customer.id)
    );

    setDeletingId(null);
  };

  /*
   * CUSTOMER DETAILS NAVIGATION
   *
   * Clicking View sends the user to:
   * /admin/customers/[customer-id]
   *
   * Example:
   * /admin/customers/1
   */
  const viewCustomer = (customerId: number) => {
    if (!customerId) {
      console.error("Invalid customer ID:", customerId);
      return;
    }

    router.push(`/admin/customers/${customerId}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b18a5a]">
            Management
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#171717]">
            Customers
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#777]">
            Manage real FINETEX INTERIORS customers and keep their
            contact information organized.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={fetchCustomers}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e2ddd4] bg-white px-5 py-3 text-sm font-semibold text-[#555] transition hover:border-[#b18a5a] hover:text-[#171717] disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#171717] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2b2b2b]"
          >
            <UserPlus size={17} />
            Add Customer
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <SummaryCard
          label="Total Customers"
          value={String(customers.length)}
          description="All customers"
        />

        <SummaryCard
          label="With Email"
          value={String(
            customers.filter((customer) => customer.email).length
          )}
          description="Contact records"
        />

        <SummaryCard
          label="Locations"
          value={String(
            new Set(
              customers
                .map((customer) => customer.location)
                .filter(Boolean)
            ).size
          )}
          description="Different locations"
        />
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-[#e7e2d9] bg-white p-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search customers by name, phone, location or email..."
            className="w-full rounded-xl border border-[#e2ddd4] bg-[#faf9f6] py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#aaa] focus:border-[#b18a5a] focus:bg-white"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-semibold text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={() => setError("")}
            className="mt-2 text-xs text-red-600 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Customer List */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-[#e7e2d9] bg-white">
          <div className="flex items-center gap-3 text-sm text-[#777]">
            <Loader2
              size={20}
              className="animate-spin text-[#b18a5a]"
            />
            Loading customers...
          </div>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden overflow-hidden rounded-2xl border border-[#e7e2d9] bg-white lg:block">
            <div className="border-b border-[#e7e2d9] px-6 py-5">
              <h2 className="text-base font-semibold text-[#171717]">
                Customer Directory
              </h2>

              <p className="mt-1 text-xs text-[#999]">
                {filteredCustomers.length} customer
                {filteredCustomers.length === 1 ? "" : "s"} found
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="border-b border-[#e7e2d9] bg-[#faf9f6] text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#999]">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#999]">
                      Phone
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#999]">
                      Location
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#999]">
                      Email
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#999]">
                      Added
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#999]">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-[#eeeae3] last:border-0 hover:bg-[#fcfbf9]"
                    >
                      <td className="px-6 py-5">
                        <p className="text-sm font-semibold text-[#171717]">
                          {customer.full_name}
                        </p>

                        {customer.notes && (
                          <p className="mt-1 max-w-[220px] truncate text-xs text-[#999]">
                            {customer.notes}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-5 text-sm text-[#555]">
                        {customer.phone}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-[#555]">
                          <MapPin
                            size={15}
                            className="text-[#b18a5a]"
                          />
                          {customer.location || "Not provided"}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-[#555]">
                        {customer.email || "Not provided"}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-xs text-[#888]">
                          <CalendarDays size={14} />
                          {formatDate(customer.created_at)}
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          {/* VIEW */}
                          <button
                            type="button"
                            onClick={() =>
                              viewCustomer(customer.id)
                            }
                            className="inline-flex items-center justify-center rounded-lg bg-[#171717] p-2 text-white transition hover:bg-[#b18a5a] focus:outline-none focus:ring-2 focus:ring-[#b18a5a] focus:ring-offset-2"
                            title="View customer details"
                            aria-label={`View ${customer.full_name}`}
                          >
                            <ArrowUpRight size={17} />
                          </button>

                          {/* WHATSAPP */}
                          <button
                            type="button"
                            onClick={() =>
                              openWhatsApp(customer.phone)
                            }
                            className="rounded-lg p-2 text-green-600 transition hover:bg-green-50"
                            title="Contact on WhatsApp"
                            aria-label={`Contact ${customer.full_name} on WhatsApp`}
                          >
                            <MessageCircle size={17} />
                          </button>

                          {/* EDIT */}
                          <button
                            type="button"
                            onClick={() =>
                              openEditForm(customer)
                            }
                            className="rounded-lg p-2 text-[#777] transition hover:bg-[#f5f2ec] hover:text-[#171717]"
                            title="Edit customer"
                            aria-label={`Edit ${customer.full_name}`}
                          >
                            <Pencil size={17} />
                          </button>

                          {/* DELETE */}
                          <button
                            type="button"
                            onClick={() =>
                              deleteCustomer(customer)
                            }
                            disabled={
                              deletingId === customer.id
                            }
                            className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                            title="Delete customer"
                            aria-label={`Delete ${customer.full_name}`}
                          >
                            {deletingId === customer.id ? (
                              <Loader2
                                size={17}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2 size={17} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredCustomers.length === 0 && (
              <EmptyState />
            )}
          </div>

          {/* Mobile */}
          <div className="space-y-4 lg:hidden">
            <div>
              <h2 className="text-base font-semibold text-[#171717]">
                Customer Directory
              </h2>

              <p className="mt-1 text-xs text-[#999]">
                {filteredCustomers.length} customer
                {filteredCustomers.length === 1 ? "" : "s"} found
              </p>
            </div>

            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="rounded-2xl border border-[#e7e2d9] bg-white p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-[#171717]">
                      {customer.full_name}
                    </h3>

                    <p className="mt-1 text-xs text-[#999]">
                      {customer.phone}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      openEditForm(customer)
                    }
                    className="rounded-lg p-2 text-[#777] hover:bg-[#f5f2ec]"
                    title="Edit customer"
                  >
                    <Pencil size={16} />
                  </button>
                </div>

                <div className="mt-5 space-y-4 border-t border-[#eeeae3] pt-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aaa]">
                      Location
                    </p>

                    <p className="mt-1 flex items-center gap-1.5 text-sm text-[#444]">
                      <MapPin
                        size={14}
                        className="text-[#b18a5a]"
                      />
                      {customer.location || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aaa]">
                      Email
                    </p>

                    <p className="mt-1 text-sm text-[#444]">
                      {customer.email || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aaa]">
                      Added
                    </p>

                    <p className="mt-1 flex items-center gap-1.5 text-xs text-[#666]">
                      <CalendarDays size={13} />
                      {formatDate(customer.created_at)}
                    </p>
                  </div>

                  {customer.notes && (
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aaa]">
                        Notes
                      </p>

                      <p className="mt-1 text-sm leading-6 text-[#555]">
                        {customer.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  {/* MOBILE VIEW */}
                  <button
                    type="button"
                    onClick={() =>
                      viewCustomer(customer.id)
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#171717] px-3 py-3 text-sm font-semibold text-white transition hover:bg-[#b18a5a] focus:outline-none focus:ring-2 focus:ring-[#b18a5a]"
                    aria-label={`View ${customer.full_name}`}
                  >
                    <ArrowUpRight size={17} />
                    <span>View</span>
                  </button>

                  {/* MOBILE WHATSAPP */}
                  <button
                    type="button"
                    onClick={() =>
                      openWhatsApp(customer.phone)
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-green-50 px-3 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-100"
                  >
                    <MessageCircle size={17} />
                    <span>WhatsApp</span>
                  </button>

                  {/* MOBILE DELETE */}
                  <button
                    type="button"
                    onClick={() =>
                      deleteCustomer(customer)
                    }
                    disabled={
                      deletingId === customer.id
                    }
                    className="flex items-center justify-center rounded-xl border border-red-200 px-3 py-3 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                    title="Delete customer"
                  >
                    {deletingId === customer.id ? (
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <Trash2 size={17} />
                    )}
                  </button>
                </div>
              </div>
            ))}

            {filteredCustomers.length === 0 && (
              <EmptyState />
            )}
          </div>
        </>
      )}

      {/* ADD / EDIT CUSTOMER MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#eeeae3] px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-[#171717]">
                  {editingCustomer
                    ? "Edit Customer"
                    : "Add Customer"}
                </h2>

                <p className="mt-1 text-xs text-[#999]">
                  Customer information is stored in the FINETEX database.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-lg p-2 text-[#777] hover:bg-[#f5f2ec]"
              >
                <X size={19} />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="space-y-5 p-6"
            >
              <FormField
                label="Full Name"
                value={form.full_name}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    full_name: value,
                  }))
                }
                placeholder="Customer full name"
                required
              />

              <FormField
                label="Phone Number"
                value={form.phone}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    phone: value,
                  }))
                }
                placeholder="07XXXXXXXX"
                type="tel"
                required
              />

              <FormField
                label="Location"
                value={form.location}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    location: value,
                  }))
                }
                placeholder="e.g. Nairobi, Ruiru, Kiambu"
              />

              <FormField
                label="Email"
                value={form.email}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    email: value,
                  }))
                }
                placeholder="Optional"
                type="email"
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-[#333]">
                  Notes
                </label>

                <textarea
                  value={form.notes}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      notes: event.target.value,
                    }))
                  }
                  placeholder="Optional customer notes..."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-[#e2ddd4] bg-[#faf9f6] px-4 py-3 text-sm text-[#333] outline-none transition placeholder:text-[#aaa] focus:border-[#b18a5a] focus:bg-white"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="flex-1 rounded-xl border border-[#e2ddd4] px-5 py-3 text-sm font-semibold text-[#555] hover:bg-[#faf9f6] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#171717] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2b2b2b] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  )}

                  {saving
                    ? "Saving..."
                    : editingCustomer
                      ? "Save Changes"
                      : "Add Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#333]">
        {label}
        {required && (
          <span className="ml-1 text-[#b18a5a]">*</span>
        )}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-[#e2ddd4] bg-[#faf9f6] px-4 py-3 text-sm text-[#333] outline-none transition placeholder:text-[#aaa] focus:border-[#b18a5a] focus:bg-white"
      />
    </div>
  );
}

function SummaryCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e7e2d9] bg-white p-5">
      <p className="text-xs font-medium text-[#999]">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold tracking-tight text-[#171717]">
        {value}
      </p>

      <p className="mt-1 text-xs text-[#aaa]">
        {description}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-12 text-center">
      <p className="text-sm font-medium text-[#555]">
        No customers found
      </p>

      <p className="mt-1 text-xs text-[#999]">
        Add a customer or change your search.
      </p>
    </div>
  );
}
