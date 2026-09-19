"use client";

import {
  CalendarDays,
  Mail,
  MapPin,
  MessageCircle,
  Search,
  UserPlus,
  Phone,
  ArrowUpRight,
} from "lucide-react";
import { useMemo, useState } from "react";

type Customer = {
  id: number;
  name: string;
  phone: string;
  service: string;
  location: string;
  projects: number;
  totalValue: string;
  joined: string;
  status: "Active" | "Completed";
};

const customers: Customer[] = [
  {
    id: 1,
    name: "Kevin Otieno",
    phone: "0756789012",
    service: "Full Interior Renovation",
    location: "Nairobi",
    projects: 1,
    totalValue: "KES 850,000",
    joined: "Aug 28, 2026",
    status: "Active",
  },
  {
    id: 2,
    name: "Ann Chebet",
    phone: "0767890123",
    service: "Bathroom Renovation",
    location: "Limuru",
    projects: 1,
    totalValue: "KES 160,000",
    joined: "Aug 25, 2026",
    status: "Active",
  },
  {
    id: 3,
    name: "James Kamau",
    phone: "0711223344",
    service: "Kitchen Renovation",
    location: "Ruiru",
    projects: 2,
    totalValue: "KES 620,000",
    joined: "Aug 18, 2026",
    status: "Completed",
  },
  {
    id: 4,
    name: "Mary Wanjiku",
    phone: "0722334455",
    service: "Wardrobes",
    location: "Kiambu",
    projects: 1,
    totalValue: "KES 210,000",
    joined: "Aug 12, 2026",
    status: "Completed",
  },
  {
    id: 5,
    name: "David Mwangi",
    phone: "0733445566",
    service: "TV Cabinet",
    location: "Thika",
    projects: 1,
    totalValue: "KES 125,000",
    joined: "Aug 5, 2026",
    status: "Completed",
  },
  {
    id: 6,
    name: "Grace Njeri",
    phone: "0744556677",
    service: "Gypsum Ceiling",
    location: "Nairobi",
    projects: 1,
    totalValue: "KES 280,000",
    joined: "Jul 30, 2026",
    status: "Active",
  },
];

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<
    "All" | "Active" | "Completed"
  >("All");

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.phone.includes(search) ||
        customer.service.toLowerCase().includes(search.toLowerCase()) ||
        customer.location.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        status === "All" || customer.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  const openWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/^0/, "254");

    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
        "Hello, this is FINETEX INTERIORS. We are following up regarding your interior project."
      )}`,
      "_blank"
    );
  };

  const activeCustomers = customers.filter(
    (customer) => customer.status === "Active"
  ).length;

  const completedCustomers = customers.filter(
    (customer) => customer.status === "Completed"
  ).length;

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
            Keep track of FINETEX INTERIORS customers, their projects,
            locations and overall customer value.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#171717] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2b2b2b]"
        >
          <UserPlus size={17} />
          Add Customer
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard
          label="Total Customers"
          value={String(customers.length)}
          description="All customers"
        />

        <SummaryCard
          label="Active"
          value={String(activeCustomers)}
          description="Current customers"
        />

        <SummaryCard
          label="Completed"
          value={String(completedCustomers)}
          description="Finished projects"
        />

        <SummaryCard
          label="Projects"
          value={String(
            customers.reduce(
              (total, customer) => total + customer.projects,
              0
            )
          )}
          description="Total projects"
        />
      </div>

      {/* Search + Filter */}
      <div className="rounded-2xl border border-[#e7e2d9] bg-white p-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customers by name, phone, service or location..."
              className="w-full rounded-xl border border-[#e2ddd4] bg-[#faf9f6] py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#aaa] focus:border-[#b18a5a] focus:bg-white"
            />
          </div>

          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as
                  | "All"
                  | "Active"
                  | "Completed"
              )
            }
            className="rounded-xl border border-[#e2ddd4] bg-[#faf9f6] px-4 py-3 text-sm text-[#555] outline-none focus:border-[#b18a5a]"
          >
            <option value="All">All Customers</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Desktop Table */}
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
          <table className="w-full min-w-[1050px]">
            <thead>
              <tr className="border-b border-[#e7e2d9] bg-[#faf9f6] text-left">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Customer
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Service
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Location
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Projects
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Value
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Action
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
                    <div>
                      <p className="text-sm font-semibold text-[#171717]">
                        {customer.name}
                      </p>

                      <p className="mt-1 text-xs text-[#999]">
                        {customer.phone}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm text-[#555]">
                    {customer.service}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-[#555]">
                      <MapPin
                        size={15}
                        className="text-[#b18a5a]"
                      />
                      {customer.location}
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm font-medium text-[#333]">
                    {customer.projects}
                  </td>

                  <td className="px-6 py-5 text-sm font-medium text-[#333]">
                    {customer.totalValue}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
                        customer.status === "Active"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          openWhatsApp(customer.phone)
                        }
                        className="rounded-lg p-2 text-green-600 transition hover:bg-green-50"
                        title="Contact on WhatsApp"
                      >
                        <MessageCircle size={17} />
                      </button>

                      <button
                        type="button"
                        className="rounded-lg p-2 text-[#777] transition hover:bg-[#f5f2ec] hover:text-[#171717]"
                        title="View customer"
                      >
                        <ArrowUpRight size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && <EmptyState />}
      </div>

      {/* Mobile Cards */}
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
                  {customer.name}
                </h3>

                <p className="mt-1 text-xs text-[#999]">
                  {customer.phone}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                  customer.status === "Active"
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {customer.status}
              </span>
            </div>

            <div className="mt-5 space-y-4 border-t border-[#eeeae3] pt-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aaa]">
                  Service
                </p>

                <p className="mt-1 text-sm text-[#444]">
                  {customer.service}
                </p>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aaa]">
                    Location
                  </p>

                  <p className="mt-1 flex items-center gap-1.5 text-sm text-[#444]">
                    <MapPin
                      size={14}
                      className="text-[#b18a5a]"
                    />
                    {customer.location}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aaa]">
                    Projects
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#333]">
                    {customer.projects}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aaa]">
                    Customer Value
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#333]">
                    {customer.totalValue}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aaa]">
                    Joined
                  </p>

                  <p className="mt-1 flex items-center gap-1.5 text-xs text-[#666]">
                    <CalendarDays size={13} />
                    {customer.joined}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openWhatsApp(customer.phone)}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-100"
            >
              <MessageCircle size={17} />
              Contact on WhatsApp
            </button>
          </div>
        ))}

        {filteredCustomers.length === 0 && <EmptyState />}
      </div>

      {/* Demo Notice */}
      <div className="rounded-2xl border border-dashed border-[#d8cbb9] bg-[#fbf8f2] p-5">
        <p className="text-sm font-semibold text-[#8b6a42]">
          Demo data
        </p>

        <p className="mt-1 text-sm leading-6 text-[#777]">
          These customers are sample records for the admin interface.
          Later, customers will be connected to the real database and
          linked to their leads, quotations and projects.
        </p>
      </div>
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
        Try changing your search or filter.
      </p>
    </div>
  );
}
