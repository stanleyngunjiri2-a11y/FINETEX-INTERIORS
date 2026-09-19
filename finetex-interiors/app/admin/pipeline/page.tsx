"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Phone,
  MapPin,
  CalendarDays,
  ArrowRight,
  Users,
} from "lucide-react";

type PipelineStage =
  | "New Lead"
  | "Contacted"
  | "Site Visit"
  | "Quotation"
  | "Approved"
  | "Project"
  | "Completed";

type Lead = {
  id: number;
  name: string;
  service: string;
  location: string;
  value: number;
  date: string;
  phone: string;
  stage: PipelineStage;
};

const stages: {
  name: PipelineStage;
  description: string;
}[] = [
  {
    name: "New Lead",
    description: "New enquiries",
  },
  {
    name: "Contacted",
    description: "Client contacted",
  },
  {
    name: "Site Visit",
    description: "Visit scheduled",
  },
  {
    name: "Quotation",
    description: "Quote prepared",
  },
  {
    name: "Approved",
    description: "Quote accepted",
  },
  {
    name: "Project",
    description: "Work in progress",
  },
  {
    name: "Completed",
    description: "Project finished",
  },
];

const leads: Lead[] = [
  {
    id: 1,
    name: "James Mwangi",
    service: "Kitchen Renovation",
    location: "Ruiru",
    value: 285000,
    date: "Sep 9, 2026",
    phone: "254712345678",
    stage: "New Lead",
  },
  {
    id: 2,
    name: "Sarah Wanjiku",
    service: "Custom Wardrobes",
    location: "Kilimani",
    value: 175000,
    date: "Sep 8, 2026",
    phone: "254723456789",
    stage: "New Lead",
  },
  {
    id: 3,
    name: "Brian Kamau",
    service: "TV Cabinet",
    location: "Thika",
    value: 95000,
    date: "Sep 7, 2026",
    phone: "254734567890",
    stage: "Contacted",
  },
  {
    id: 4,
    name: "Mercy Njeri",
    service: "Gypsum Ceiling",
    location: "Roysambu",
    value: 145000,
    date: "Sep 6, 2026",
    phone: "254745678901",
    stage: "Contacted",
  },
  {
    id: 5,
    name: "David Otieno",
    service: "Full Interior Renovation",
    location: "Westlands",
    value: 650000,
    date: "Sep 5, 2026",
    phone: "254756789012",
    stage: "Site Visit",
  },
  {
    id: 6,
    name: "Anne Wambui",
    service: "Bathroom Renovation",
    location: "Kiambu",
    value: 210000,
    date: "Sep 4, 2026",
    phone: "254767890123",
    stage: "Site Visit",
  },
  {
    id: 7,
    name: "Peter Kariuki",
    service: "Kitchen Renovation",
    location: "Lavington",
    value: 420000,
    date: "Sep 3, 2026",
    phone: "254778901234",
    stage: "Quotation",
  },
  {
    id: 8,
    name: "Lucy Achieng",
    service: "Wardrobes & Cabinets",
    location: "South B",
    value: 260000,
    date: "Sep 2, 2026",
    phone: "254789012345",
    stage: "Quotation",
  },
  {
    id: 9,
    name: "Kevin Maina",
    service: "TV Cabinet",
    location: "Kasarani",
    value: 120000,
    date: "Sep 1, 2026",
    phone: "254790123456",
    stage: "Approved",
  },
  {
    id: 10,
    name: "Grace Njoki",
    service: "Kitchen Renovation",
    location: "Runda",
    value: 580000,
    date: "Aug 30, 2026",
    phone: "254701234567",
    stage: "Approved",
  },
  {
    id: 11,
    name: "Samuel Kibet",
    service: "Full Interior Renovation",
    location: "Karen",
    value: 850000,
    date: "Aug 28, 2026",
    phone: "254711234567",
    stage: "Project",
  },
  {
    id: 12,
    name: "Faith Wairimu",
    service: "Custom Wardrobes",
    location: "Ruaka",
    value: 320000,
    date: "Aug 25, 2026",
    phone: "254722345678",
    stage: "Project",
  },
  {
    id: 13,
    name: "Daniel Kamau",
    service: "Gypsum Ceiling",
    location: "Embakasi",
    value: 180000,
    date: "Aug 20, 2026",
    phone: "254733456789",
    stage: "Completed",
  },
  {
    id: 14,
    name: "Mary Wanjiru",
    service: "Bathroom Renovation",
    location: "Lavington",
    value: 240000,
    date: "Aug 18, 2026",
    phone: "254744567890",
    stage: "Completed",
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);
}

function stageColor(stage: PipelineStage) {
  switch (stage) {
    case "New Lead":
      return "bg-blue-100 text-blue-700";

    case "Contacted":
      return "bg-purple-100 text-purple-700";

    case "Site Visit":
      return "bg-orange-100 text-orange-700";

    case "Quotation":
      return "bg-yellow-100 text-yellow-700";

    case "Approved":
      return "bg-green-100 text-green-700";

    case "Project":
      return "bg-indigo-100 text-indigo-700";

    case "Completed":
      return "bg-gray-100 text-gray-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function PipelinePage() {
  const [search, setSearch] = useState("");

  const filteredLeads = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return leads;
    }

    return leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(query) ||
        lead.service.toLowerCase().includes(query) ||
        lead.location.toLowerCase().includes(query)
    );
  }, [search]);

  const totalPipelineValue = leads.reduce(
    (total, lead) => total + lead.value,
    0
  );

  const activeLeads = leads.filter(
    (lead) => lead.stage !== "Completed"
  ).length;

  const completedProjects = leads.filter(
    (lead) => lead.stage === "Completed"
  ).length;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#b58b2a]">
            Sales & Project Pipeline
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            Pipeline
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Track every FINETEX client from the first enquiry to completed
            project.
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative w-full lg:w-80">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#b58b2a] focus:ring-2 focus:ring-[#b58b2a]/10"
          />
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Active Pipeline
            </p>

            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <Users size={19} />
            </div>
          </div>

          <p className="mt-4 text-2xl font-bold text-gray-900">
            {activeLeads}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Leads currently being handled
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Pipeline Value
            </p>

            <div className="rounded-xl bg-green-50 p-2.5 text-green-600">
              <ArrowRight size={19} />
            </div>
          </div>

          <p className="mt-4 text-2xl font-bold text-gray-900">
            {formatCurrency(totalPipelineValue)}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Estimated value across all records
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Completed
            </p>

            <div className="rounded-xl bg-gray-100 p-2.5 text-gray-700">
              <CalendarDays size={19} />
            </div>
          </div>

          <p className="mt-4 text-2xl font-bold text-gray-900">
            {completedProjects}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Projects completed
          </p>
        </div>
      </div>

      {/* PIPELINE */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Client Pipeline
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Follow the progress of every client and project.
              </p>
            </div>

            <div className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-[#9a751f]">
              Demo pipeline
            </div>
          </div>
        </div>

        {/* KANBAN BOARD */}
        <div className="overflow-x-auto p-5 sm:p-6">
          <div className="flex min-w-[1450px] gap-4">
            {stages.map((stage) => {
              const stageLeads = filteredLeads.filter(
                (lead) => lead.stage === stage.name
              );

              const stageValue = stageLeads.reduce(
                (total, lead) => total + lead.value,
                0
              );

              return (
                <div
                  key={stage.name}
                  className="flex w-[200px] shrink-0 flex-col"
                >
                  {/* COLUMN HEADER */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-gray-800">
                        {stage.name}
                      </h3>

                      <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-gray-100 px-2 text-xs font-semibold text-gray-600">
                        {stageLeads.length}
                      </span>
                    </div>

                    <p className="mt-1 text-[11px] text-gray-400">
                      {stage.description}
                    </p>

                    {stageLeads.length > 0 && (
                      <p className="mt-1 text-[11px] font-medium text-[#b58b2a]">
                        {formatCurrency(stageValue)}
                      </p>
                    )}
                  </div>

                  {/* COLUMN */}
                  <div className="min-h-[500px] rounded-2xl bg-[#f7f5f0] p-2">
                    <div className="space-y-3">
                      {stageLeads.length === 0 ? (
                        <div className="flex min-h-[150px] items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white/60 p-4 text-center">
                          <p className="text-xs text-gray-400">
                            No clients here
                          </p>
                        </div>
                      ) : (
                        stageLeads.map((lead) => (
                          <div
                            key={lead.id}
                            className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                          >
                            {/* CLIENT */}
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="text-sm font-bold text-gray-900">
                                  {lead.name}
                                </h4>

                                <p className="mt-1 text-xs leading-5 text-gray-500">
                                  {lead.service}
                                </p>
                              </div>

                              <span
                                className={`h-2 w-2 shrink-0 rounded-full ${getDotColor(
                                  lead.stage
                                )}`}
                              />
                            </div>

                            {/* VALUE */}
                            <div className="mt-4 rounded-lg bg-gray-50 p-2.5">
                              <p className="text-[10px] uppercase tracking-wide text-gray-400">
                                Estimated Value
                              </p>

                              <p className="mt-0.5 text-sm font-bold text-gray-900">
                                {formatCurrency(lead.value)}
                              </p>
                            </div>

                            {/* LOCATION */}
                            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                              <MapPin size={13} />

                              <span>{lead.location}</span>
                            </div>

                            {/* DATE */}
                            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                              <CalendarDays size={13} />

                              <span>{lead.date}</span>
                            </div>

                            {/* ACTIONS */}
                            <div className="mt-4 flex gap-2">
                              <a
                                href={`https://wa.me/${lead.phone}?text=${encodeURIComponent(
                                  `Hello ${lead.name}, this is FINETEX INTERIORS regarding your ${lead.service} project.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#b58b2a] px-2 py-2 text-[11px] font-semibold text-white transition hover:bg-[#9d771f]"
                              >
                                <Phone size={13} />
                                WhatsApp
                              </a>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* EXPLANATION */}
      <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="rounded-xl bg-white p-2.5 text-[#b58b2a]">
            <ArrowRight size={18} />
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">
              How the pipeline will work
            </h3>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              When we connect the admin dashboard to the database, every
              estimate submitted from the public website will automatically
              enter the <strong>New Lead</strong> stage. You will then be able
              to move the client through the pipeline as the project
              progresses.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-medium text-gray-600">
              {stages.map((stage, index) => (
                <div
                  key={stage.name}
                  className="flex items-center gap-2"
                >
                  <span
                    className={`rounded-full px-2.5 py-1 ${stageColor(
                      stage.name
                    )}`}
                  >
                    {stage.name}
                  </span>

                  {index < stages.length - 1 && (
                    <ArrowRight
                      size={12}
                      className="text-gray-400"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DEMO NOTICE */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <p className="text-xs leading-5 text-gray-500">
          <strong className="text-gray-700">Demo data:</strong>{" "}
          These pipeline records are currently stored inside the page for
          demonstration. Later, we will connect this section to the real
          FINETEX database so leads and project statuses update automatically.
        </p>
      </div>
    </div>
  );
}

function getDotColor(stage: PipelineStage) {
  switch (stage) {
    case "New Lead":
      return "bg-blue-500";

    case "Contacted":
      return "bg-purple-500";

    case "Site Visit":
      return "bg-orange-500";

    case "Quotation":
      return "bg-yellow-500";

    case "Approved":
      return "bg-green-500";

    case "Project":
      return "bg-indigo-500";

    case "Completed":
      return "bg-gray-500";

    default:
      return "bg-gray-400";
  }
}
