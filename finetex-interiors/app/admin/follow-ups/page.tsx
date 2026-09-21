
"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  MessageCircle,
  Plus,
  Search,
  UserRound,
  X,
  Pencil,
  Trash2,
  Phone,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

type FollowUpStatus = "Pending" | "Completed" | "Overdue";

type FollowUpType =
  | "Call"
  | "WhatsApp"
  | "Email"
  | "Meeting"
  | "Site Visit";

type Customer = {
  id: number;
  full_name: string;
  phone: string;
};

type Quotation = {
  id: number;
  quotation_number: string;
  customer_id: number;
  title: string;
};

type Project = {
  id: number;
  project_number: string;
  customer_id: number;
  project_name: string;
};

type FollowUp = {
  id: number;
  lead_id: number | null;
  customer_id: number | null;
  quotation_id: number | null;
  project_id: number | null;
  title: string;
  description: string | null;
  follow_up_type: FollowUpType;
  due_at: string;
  status: FollowUpStatus;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  customer: Customer | null;
};

const statusStyles: Record<FollowUpStatus, string> = {
  Pending: "bg-blue-50 text-blue-700",
  Completed: "bg-green-50 text-green-700",
  Overdue: "bg-red-50 text-red-700",
};

const emptyForm = {
  customerId: "",
  quotationId: "",
  projectId: "",
  title: "",
  description: "",
  followUpType: "Call" as FollowUpType,
  dueAt: "",
  notes: "",
};

export default function FollowUpsPage() {
  const supabase = createClient();

  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<FollowUpStatus | "All">("All");

  const [showModal, setShowModal] = useState(false);
  const [editingFollowUp, setEditingFollowUp] =
    useState<FollowUp | null>(null);

  const [form, setForm] = useState(emptyForm);

  const loadData = async () => {
    setLoading(true);

    const [
      followUpsResult,
      customersResult,
      quotationsResult,
      projectsResult,
    ] = await Promise.all([
      supabase
        .from("follow_ups")
        .select(
          `
          id,
          lead_id,
          customer_id,
          quotation_id,
          project_id,
          title,
          description,
          follow_up_type,
          due_at,
          status,
          completed_at,
          notes,
          created_at,
          updated_at,
          customer:customers (
            id,
            full_name,
            phone
          )
        `
        )
        .order("due_at", { ascending: true }),

      supabase
        .from("customers")
        .select("id, full_name, phone")
        .order("full_name", { ascending: true }),

      supabase
        .from("quotations")
        .select("id, quotation_number, customer_id, title")
        .order("created_at", { ascending: false }),

      supabase
        .from("projects")
        .select("id, project_number, customer_id, project_name")
        .order("created_at", { ascending: false }),
    ]);

    if (followUpsResult.error) {
      console.error("Follow-ups error:", followUpsResult.error);
    }

    if (customersResult.error) {
      console.error("Customers error:", customersResult.error);
    }

    if (quotationsResult.error) {
      console.error("Quotations error:", quotationsResult.error);
    }

    if (projectsResult.error) {
      console.error("Projects error:", projectsResult.error);
    }

    setFollowUps(
      (followUpsResult.data as unknown as FollowUp[]) ?? []
    );

    setCustomers(customersResult.data ?? []);
    setQuotations(quotationsResult.data ?? []);
    setProjects(projectsResult.data ?? []);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const getEffectiveStatus = (
    followUp: FollowUp
  ): FollowUpStatus => {
    if (followUp.status === "Completed") {
      return "Completed";
    }

    const dueTime = new Date(followUp.due_at).getTime();

    if (dueTime < Date.now()) {
      return "Overdue";
    }

    return "Pending";
  };

  const filteredFollowUps = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();

    return followUps.filter((followUp) => {
      const effectiveStatus = getEffectiveStatus(followUp);

      const matchesSearch =
        followUp.title.toLowerCase().includes(searchTerm) ||
        followUp.description?.toLowerCase().includes(searchTerm) ||
        followUp.customer?.full_name
          .toLowerCase()
          .includes(searchTerm) ||
        followUp.customer?.phone.includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        effectiveStatus === statusFilter;

      return Boolean(matchesSearch) && matchesStatus;
    });
  }, [followUps, search, statusFilter]);

  const pendingCount = followUps.filter(
    (followUp) =>
      getEffectiveStatus(followUp) === "Pending"
  ).length;

  const overdueCount = followUps.filter(
    (followUp) =>
      getEffectiveStatus(followUp) === "Overdue"
  ).length;

  const completedCount = followUps.filter(
    (followUp) =>
      getEffectiveStatus(followUp) === "Completed"
  ).length;

  const openCreateModal = () => {
    setEditingFollowUp(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (followUp: FollowUp) => {
    setEditingFollowUp(followUp);

    const localDate = new Date(followUp.due_at);

    const formattedDate = `${localDate.getFullYear()}-${String(
      localDate.getMonth() + 1
    ).padStart(2, "0")}-${String(localDate.getDate()).padStart(
      2,
      "0"
    )}T${String(localDate.getHours()).padStart(2, "0")}:${String(
      localDate.getMinutes()
    ).padStart(2, "0")}`;

    setForm({
      customerId: followUp.customer_id
        ? String(followUp.customer_id)
        : "",
      quotationId: followUp.quotation_id
        ? String(followUp.quotation_id)
        : "",
      projectId: followUp.project_id
        ? String(followUp.project_id)
        : "",
      title: followUp.title,
      description: followUp.description ?? "",
      followUpType: followUp.follow_up_type,
      dueAt: formattedDate,
      notes: followUp.notes ?? "",
    });

    setShowModal(true);
  };

  const handleCustomerChange = (customerId: string) => {
    setForm((current) => ({
      ...current,
      customerId,
      quotationId: "",
      projectId: "",
    }));
  };

  const selectedQuotations = useMemo(() => {
    if (!form.customerId) return [];

    return quotations.filter(
      (quotation) =>
        quotation.customer_id === Number(form.customerId)
    );
  }, [quotations, form.customerId]);

  const selectedProjects = useMemo(() => {
    if (!form.customerId) return [];

    return projects.filter(
      (project) =>
        project.customer_id === Number(form.customerId)
    );
  }, [projects, form.customerId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.customerId) {
      alert("Please select a customer.");
      return;
    }

    if (!form.title.trim()) {
      alert("Please enter a follow-up title.");
      return;
    }

    if (!form.dueAt) {
      alert("Please select a date and time.");
      return;
    }

    setSaving(true);

    const payload = {
      customer_id: Number(form.customerId),
      quotation_id: form.quotationId
        ? Number(form.quotationId)
        : null,
      project_id: form.projectId
        ? Number(form.projectId)
        : null,
      title: form.title.trim(),
      description: form.description.trim() || null,
      follow_up_type: form.followUpType,
      due_at: new Date(form.dueAt).toISOString(),
      notes: form.notes.trim() || null,
      updated_at: new Date().toISOString(),
    };

    if (editingFollowUp) {
      const { error } = await supabase
        .from("follow_ups")
        .update(payload)
        .eq("id", editingFollowUp.id);

      if (error) {
        console.error("Update follow-up error:", error);
        alert(`Could not update follow-up: ${error.message}`);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from("follow_ups")
        .insert({
          ...payload,
          status: "Pending",
          completed_at: null,
        });

      if (error) {
        console.error("Create follow-up error:", error);
        alert(`Could not create follow-up: ${error.message}`);
        setSaving(false);
        return;
      }
    }

    setShowModal(false);
    setEditingFollowUp(null);
    setForm(emptyForm);

    await loadData();

    setSaving(false);
  };

  const markAsComplete = async (id: number) => {
    const { error } = await supabase
      .from("follow_ups")
      .update({
        status: "Completed",
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Complete follow-up error:", error);
      alert(`Could not complete follow-up: ${error.message}`);
      return;
    }

    await loadData();
  };

  const deleteFollowUp = async (id: number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this follow-up?"
      )
    ) {
      return;
    }

    setDeleting(id);

    const { error } = await supabase
      .from("follow_ups")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete follow-up error:", error);
      alert(`Could not delete follow-up: ${error.message}`);
      setDeleting(null);
      return;
    }

    await loadData();
    setDeleting(null);
  };

  const openWhatsApp = (phone: string) => {
    const cleanPhone = phone
      .replace(/\s+/g, "")
      .replace(/^0/, "254");

    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
        "Hello, this is FINETEX INTERIORS. We are following up regarding your interior project."
      )}`,
      "_blank"
    );
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dateString));
  };

  const formatTime = (dateString: string) => {
    return new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(dateString));
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
            Follow-ups
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#777]">
            Keep track of customer calls, messages, site visits and
            other important follow-up activities.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#171717] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2b2b2b]"
        >
          <Plus size={17} />
          Add Follow-up
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard
          label="Total"
          value={String(followUps.length)}
          description="All follow-ups"
          icon={CalendarDays}
        />

        <SummaryCard
          label="Pending"
          value={String(pendingCount)}
          description="Need attention"
          icon={Clock3}
        />

        <SummaryCard
          label="Overdue"
          value={String(overdueCount)}
          description="Need immediate action"
          icon={Phone}
        />

        <SummaryCard
          label="Completed"
          value={String(completedCount)}
          description="Completed tasks"
          icon={CheckCircle2}
        />
      </div>

      {/* Overdue Alert */}
      {overdueCount > 0 && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-red-600">
              <Clock3 size={17} />
            </div>

            <div>
              <p className="text-sm font-semibold text-red-700">
                {overdueCount} overdue follow-up
                {overdueCount === 1 ? "" : "s"}
              </p>

              <p className="mt-1 text-sm leading-6 text-red-600/80">
                These customers should be contacted as soon as
                possible.
              </p>
            </div>
          </div>
        </div>
      )}

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
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search customers or follow-up..."
              className="w-full rounded-xl border border-[#e2ddd4] bg-[#faf9f6] py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#aaa] focus:border-[#b18a5a] focus:bg-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as FollowUpStatus | "All"
              )
            }
            className="rounded-xl border border-[#e2ddd4] bg-[#faf9f6] px-4 py-3 text-sm text-[#555] outline-none focus:border-[#b18a5a]"
          >
            <option value="All">All Follow-ups</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Follow-up List */}
      <div className="rounded-2xl border border-[#e7e2d9] bg-white">
        <div className="border-b border-[#e7e2d9] px-6 py-5">
          <h2 className="text-base font-semibold text-[#171717]">
            Follow-up Schedule
          </h2>

          <p className="mt-1 text-xs text-[#999]">
            {filteredFollowUps.length} follow-up
            {filteredFollowUps.length === 1 ? "" : "s"} found
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 px-6 py-16 text-sm text-[#777]">
            <Loader2 size={18} className="animate-spin" />
            Loading follow-ups...
          </div>
        ) : (
          <div className="divide-y divide-[#eeeae3]">
            {filteredFollowUps.map((followUp) => {
              const effectiveStatus =
                getEffectiveStatus(followUp);

              return (
                <div
                  key={followUp.id}
                  className="p-5 transition hover:bg-[#fcfbf9] sm:p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    {/* Customer + Follow-up */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f1eadf] text-[#8b6a42]">
                        <UserRound size={19} />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-[#171717]">
                            {followUp.customer?.full_name ??
                              "No customer"}
                          </h3>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyles[effectiveStatus]}`}
                          >
                            {effectiveStatus}
                          </span>
                        </div>

                        {followUp.customer?.phone && (
                          <p className="mt-1 text-xs text-[#999]">
                            {followUp.customer.phone}
                          </p>
                        )}

                        <p className="mt-3 text-sm font-medium text-[#444]">
                          {followUp.title}
                        </p>

                        {followUp.description && (
                          <p className="mt-1 max-w-xl text-sm leading-6 text-[#777]">
                            {followUp.description}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-[#f5f2ec] px-2.5 py-1 text-[10px] font-semibold text-[#777]">
                            {followUp.follow_up_type}
                          </span>

                          {followUp.quotation_id && (
                            <span className="rounded-full bg-[#f5f2ec] px-2.5 py-1 text-[10px] font-semibold text-[#777]">
                              Quotation linked
                            </span>
                          )}

                          {followUp.project_id && (
                            <span className="rounded-full bg-[#f5f2ec] px-2.5 py-1 text-[10px] font-semibold text-[#777]">
                              Project linked
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Date + Actions */}
                    <div className="flex flex-wrap items-center gap-5 lg:justify-end">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aaa]">
                          Scheduled
                        </p>

                        <p className="mt-1 flex items-center gap-2 text-sm font-medium text-[#444]">
                          <CalendarDays
                            size={15}
                            className="text-[#b18a5a]"
                          />
                          {formatDate(followUp.due_at)}
                        </p>

                        <p className="mt-1 text-xs text-[#999]">
                          {formatTime(followUp.due_at)}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {followUp.customer?.phone && (
                          <button
                            type="button"
                            onClick={() =>
                              openWhatsApp(
                                followUp.customer!.phone
                              )
                            }
                            className="rounded-xl bg-green-50 p-3 text-green-600 transition hover:bg-green-100"
                            title="Contact on WhatsApp"
                          >
                            <MessageCircle size={17} />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(followUp)
                          }
                          className="rounded-xl bg-[#f5f2ec] p-3 text-[#555] transition hover:bg-[#eee9df] hover:text-[#171717]"
                          title="Edit follow-up"
                        >
                          <Pencil size={17} />
                        </button>

                        {effectiveStatus !== "Completed" && (
                          <button
                            type="button"
                            onClick={() =>
                              markAsComplete(followUp.id)
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-[#f5f2ec] px-4 py-3 text-xs font-semibold text-[#555] transition hover:bg-[#eee9df] hover:text-[#171717]"
                          >
                            <CheckCircle2 size={15} />
                            Mark Complete
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            deleteFollowUp(followUp.id)
                          }
                          disabled={deleting === followUp.id}
                          className="rounded-xl bg-red-50 p-3 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Delete follow-up"
                        >
                          {deleting === followUp.id ? (
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
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filteredFollowUps.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-sm font-medium text-[#555]">
              No follow-ups found
            </p>

            <p className="mt-1 text-xs text-[#999]">
              Add a follow-up or change your search/filter.
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e7e2d9] px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-[#171717]">
                  {editingFollowUp
                    ? "Edit Follow-up"
                    : "Add Follow-up"}
                </h2>

                <p className="mt-1 text-xs text-[#999]">
                  Record an upcoming customer activity.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl p-2 text-[#777] transition hover:bg-[#f5f2ec] hover:text-[#171717]"
              >
                <X size={19} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              {/* Customer */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-[#555]">
                  Customer *
                </label>

                <select
                  value={form.customerId}
                  onChange={(event) =>
                    handleCustomerChange(event.target.value)
                  }
                  className="w-full rounded-xl border border-[#e2ddd4] bg-[#faf9f6] px-4 py-3 text-sm outline-none focus:border-[#b18a5a] focus:bg-white"
                  required
                >
                  <option value="">Select customer</option>

                  {customers.map((customer) => (
                    <option
                      key={customer.id}
                      value={customer.id}
                    >
                      {customer.full_name} — {customer.phone}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-[#555]">
                  Follow-up Title *
                </label>

                <input
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  placeholder="e.g. Follow up on kitchen quotation"
                  className="w-full rounded-xl border border-[#e2ddd4] bg-[#faf9f6] px-4 py-3 text-sm outline-none focus:border-[#b18a5a] focus:bg-white"
                  required
                />
              </div>

              {/* Type + Date */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-[#555]">
                    Follow-up Type
                  </label>

                  <select
                    value={form.followUpType}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        followUpType:
                          event.target.value as FollowUpType,
                      }))
                    }
                    className="w-full rounded-xl border border-[#e2ddd4] bg-[#faf9f6] px-4 py-3 text-sm outline-none focus:border-[#b18a5a] focus:bg-white"
                  >
                    <option value="Call">Call</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Email">Email</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Site Visit">
                      Site Visit
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-[#555]">
                    Date & Time *
                  </label>

                  <input
                    type="datetime-local"
                    value={form.dueAt}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        dueAt: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-[#e2ddd4] bg-[#faf9f6] px-4 py-3 text-sm outline-none focus:border-[#b18a5a] focus:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Quotation */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-[#555]">
                  Related Quotation
                </label>

                <select
                  value={form.quotationId}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      quotationId: event.target.value,
                    }))
                  }
                  disabled={!form.customerId}
                  className="w-full rounded-xl border border-[#e2ddd4] bg-[#faf9f6] px-4 py-3 text-sm outline-none focus:border-[#b18a5a] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {form.customerId
                      ? "No quotation"
                      : "Select customer first"}
                  </option>

                  {selectedQuotations.map((quotation) => (
                    <option
                      key={quotation.id}
                      value={quotation.id}
                    >
                      {quotation.quotation_number} —{" "}
                      {quotation.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Project */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-[#555]">
                  Related Project
                </label>

                <select
                  value={form.projectId}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      projectId: event.target.value,
                    }))
                  }
                  disabled={!form.customerId}
                  className="w-full rounded-xl border border-[#e2ddd4] bg-[#faf9f6] px-4 py-3 text-sm outline-none focus:border-[#b18a5a] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {form.customerId
                      ? "No project"
                      : "Select customer first"}
                  </option>

                  {selectedProjects.map((project) => (
                    <option
                      key={project.id}
                      value={project.id}
                    >
                      {project.project_number} —{" "}
                      {project.project_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-[#555]">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  rows={3}
                  placeholder="What needs to be discussed or done?"
                  className="w-full resize-none rounded-xl border border-[#e2ddd4] bg-[#faf9f6] px-4 py-3 text-sm outline-none focus:border-[#b18a5a] focus:bg-white"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-[#555]">
                  Internal Notes
                </label>

                <textarea
                  value={form.notes}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      notes: event.target.value,
                    }))
                  }
                  rows={3}
                  placeholder="Add internal notes..."
                  className="w-full resize-none rounded-xl border border-[#e2ddd4] bg-[#faf9f6] px-4 py-3 text-sm outline-none focus:border-[#b18a5a] focus:bg-white"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t border-[#eeeae3] pt-5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-[#e2ddd4] px-5 py-3 text-sm font-semibold text-[#555] transition hover:bg-[#f5f2ec]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#171717] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2b2b2b] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  {editingFollowUp
                    ? "Save Changes"
                    : "Create Follow-up"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: string;
  description: string;
  icon: typeof CalendarDays;
}) {
  return (
    <div className="rounded-2xl border border-[#e7e2d9] bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
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

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f5f2ec] text-[#b18a5a]">
          <Icon size={17} />
        </div>
      </div>
    </div>
  );
}
