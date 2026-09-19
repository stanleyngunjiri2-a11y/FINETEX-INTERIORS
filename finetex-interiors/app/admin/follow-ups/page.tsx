"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MessageCircle,
  Plus,
  Search,
  Phone,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";

type FollowUpStatus = "Pending" | "Completed" | "Overdue";

type FollowUp = {
  id: number;
  customer: string;
  phone: string;
  reason: string;
  date: string;
  time: string;
  status: FollowUpStatus;
  assignedTo: string;
};

const initialFollowUps: FollowUp[] = [
  {
    id: 1,
    customer: "Brian Mwangi",
    phone: "0712345678",
    reason: "Follow up on kitchen renovation enquiry",
    date: "Today",
    time: "10:00 AM",
    status: "Pending",
    assignedTo: "Admin",
  },
  {
    id: 2,
    customer: "Mercy Njeri",
    phone: "0745678901",
    reason: "Follow up on quotation",
    date: "Today",
    time: "2:00 PM",
    status: "Pending",
    assignedTo: "Admin",
  },
  {
    id: 3,
    customer: "David Kamau",
    phone: "0734567890",
    reason: "Confirm site visit",
    date: "Tomorrow",
    time: "11:30 AM",
    status: "Pending",
    assignedTo: "Admin",
  },
  {
    id: 4,
    customer: "Sarah Wanjiku",
    phone: "0723456789",
    reason: "Check wardrobe quotation decision",
    date: "Yesterday",
    time: "3:00 PM",
    status: "Overdue",
    assignedTo: "Admin",
  },
  {
    id: 5,
    customer: "James Kamau",
    phone: "0711223344",
    reason: "Project progress check",
    date: "Sep 7, 2026",
    time: "10:00 AM",
    status: "Completed",
    assignedTo: "Admin",
  },
  {
    id: 6,
    customer: "Grace Njeri",
    phone: "0744556677",
    reason: "Confirm gypsum ceiling measurements",
    date: "Sep 6, 2026",
    time: "1:00 PM",
    status: "Completed",
    assignedTo: "Admin",
  },
];

const statusStyles: Record<FollowUpStatus, string> = {
  Pending: "bg-blue-50 text-blue-700",
  Completed: "bg-green-50 text-green-700",
  Overdue: "bg-red-50 text-red-700",
};

export default function FollowUpsPage() {
  const [followUps, setFollowUps] =
    useState<FollowUp[]>(initialFollowUps);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    FollowUpStatus | "All"
  >("All");

  const filteredFollowUps = useMemo(() => {
    return followUps.filter((followUp) => {
      const searchTerm = search.toLowerCase();

      const matchesSearch =
        followUp.customer.toLowerCase().includes(searchTerm) ||
        followUp.phone.includes(search) ||
        followUp.reason.toLowerCase().includes(searchTerm);

      const matchesStatus =
        statusFilter === "All" ||
        followUp.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [followUps, search, statusFilter]);

  const pendingCount = followUps.filter(
    (followUp) => followUp.status === "Pending"
  ).length;

  const overdueCount = followUps.filter(
    (followUp) => followUp.status === "Overdue"
  ).length;

  const completedCount = followUps.filter(
    (followUp) => followUp.status === "Completed"
  ).length;

  const markAsComplete = (id: number) => {
    setFollowUps((currentFollowUps) =>
      currentFollowUps.map((followUp) =>
        followUp.id === id
          ? {
              ...followUp,
              status: "Completed",
            }
          : followUp
      )
    );
  };

  const openWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/^0/, "254");

    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
        "Hello, this is FINETEX INTERIORS. We are following up regarding your interior project."
      )}`,
      "_blank"
    );
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

      {/* Action Alert */}
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
                possible so potential business is not lost.
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
              placeholder="Search customers or follow-up reason..."
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

        <div className="divide-y divide-[#eeeae3]">
          {filteredFollowUps.map((followUp) => (
            <div
              key={followUp.id}
              className="p-5 transition hover:bg-[#fcfbf9] sm:p-6"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                {/* Customer */}
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f1eadf] text-[#8b6a42]">
                    <UserRound size={19} />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-[#171717]">
                        {followUp.customer}
                      </h3>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyles[followUp.status]}`}
                      >
                        {followUp.status}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-[#999]">
                      {followUp.phone}
                    </p>

                    <p className="mt-3 text-sm text-[#555]">
                      {followUp.reason}
                    </p>
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
                      {followUp.date}
                    </p>

                    <p className="mt-1 text-xs text-[#999]">
                      {followUp.time}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aaa]">
                      Assigned To
                    </p>

                    <p className="mt-1 text-sm text-[#555]">
                      {followUp.assignedTo}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {/* WhatsApp */}
                    <button
                      type="button"
                      onClick={() =>
                        openWhatsApp(followUp.phone)
                      }
                      className="rounded-xl bg-green-50 p-3 text-green-600 transition hover:bg-green-100"
                      title="Contact on WhatsApp"
                    >
                      <MessageCircle size={17} />
                    </button>

                    {/* Mark Complete */}
                    {followUp.status !== "Completed" && (
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

                    {/* Completed State */}
                    {followUp.status === "Completed" && (
                      <div className="inline-flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-xs font-semibold text-green-700">
                        <CheckCircle2 size={15} />
                        Completed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFollowUps.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-sm font-medium text-[#555]">
              No follow-ups found
            </p>

            <p className="mt-1 text-xs text-[#999]">
              Try changing your search or filter.
            </p>
          </div>
        )}
      </div>

      {/* Demo Notice */}
      <div className="rounded-2xl border border-dashed border-[#d8cbb9] bg-[#fbf8f2] p-5">
        <p className="text-sm font-semibold text-[#8b6a42]">
          Demo data
        </p>

        <p className="mt-1 text-sm leading-6 text-[#777]">
          These follow-ups are sample records. Later, the system
          will store real follow-up dates, notes, assigned staff
          members and completed activities in the database.
        </p>
      </div>
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