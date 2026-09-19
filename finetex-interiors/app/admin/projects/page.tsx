"use client";

import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FolderKanban,
  MapPin,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

type ProjectStatus =
  | "Planning"
  | "In Progress"
  | "On Hold"
  | "Completed";

type Project = {
  id: string;
  name: string;
  customer: string;
  service: string;
  location: string;
  budget: string;
  startDate: string;
  deadline: string;
  progress: number;
  status: ProjectStatus;
};

const projects: Project[] = [
  {
    id: "PRJ-001",
    name: "Karen Residence",
    customer: "Kevin Otieno",
    service: "Full Interior Renovation",
    location: "Nairobi",
    budget: "KES 850,000",
    startDate: "Sep 2, 2026",
    deadline: "Oct 15, 2026",
    progress: 35,
    status: "In Progress",
  },
  {
    id: "PRJ-002",
    name: "Limuru Bathroom",
    customer: "Ann Chebet",
    service: "Bathroom Renovation",
    location: "Limuru",
    budget: "KES 160,000",
    startDate: "Sep 4, 2026",
    deadline: "Sep 18, 2026",
    progress: 55,
    status: "In Progress",
  },
  {
    id: "PRJ-003",
    name: "Ruiru Kitchen",
    customer: "James Kamau",
    service: "Kitchen Renovation",
    location: "Ruiru",
    budget: "KES 320,000",
    startDate: "Aug 20, 2026",
    deadline: "Sep 12, 2026",
    progress: 80,
    status: "In Progress",
  },
  {
    id: "PRJ-004",
    name: "Kiambu Wardrobes",
    customer: "Mary Wanjiku",
    service: "Custom Wardrobes",
    location: "Kiambu",
    budget: "KES 210,000",
    startDate: "Aug 10, 2026",
    deadline: "Aug 28, 2026",
    progress: 100,
    status: "Completed",
  },
  {
    id: "PRJ-005",
    name: "Westlands TV Cabinet",
    customer: "David Mwangi",
    service: "TV Cabinet",
    location: "Nairobi",
    budget: "KES 125,000",
    startDate: "Sep 8, 2026",
    deadline: "Sep 20, 2026",
    progress: 0,
    status: "Planning",
  },
  {
    id: "PRJ-006",
    name: "Kilimani Gypsum",
    customer: "Grace Njeri",
    service: "Gypsum Ceiling",
    location: "Nairobi",
    budget: "KES 280,000",
    startDate: "Sep 6, 2026",
    deadline: "Sep 25, 2026",
    progress: 20,
    status: "In Progress",
  },
];

const statusStyles: Record<ProjectStatus, string> = {
  Planning: "bg-blue-50 text-blue-700",
  "In Progress": "bg-orange-50 text-orange-700",
  "On Hold": "bg-yellow-50 text-yellow-700",
  Completed: "bg-green-50 text-green-700",
};

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    ProjectStatus | "All"
  >("All");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        project.customer
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        project.service
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        project.location
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const totalProjects = projects.length;

  const activeProjects = projects.filter(
    (project) => project.status === "In Progress"
  ).length;

  const planningProjects = projects.filter(
    (project) => project.status === "Planning"
  ).length;

  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  const totalValue = projects.reduce((total, project) => {
    const amount = Number(
      project.budget.replace(/[^0-9]/g, "")
    );

    return total + amount;
  }, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b18a5a]">
            Management
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#171717]">
            Projects
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#777]">
            Track active FINETEX INTERIORS renovation projects,
            deadlines, budgets and completion progress.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#171717] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2b2b2b]"
        >
          <Plus size={17} />
          New Project
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard
          label="Total Projects"
          value={String(totalProjects)}
          description="All projects"
          icon={FolderKanban}
        />

        <SummaryCard
          label="In Progress"
          value={String(activeProjects)}
          description="Currently active"
          icon={Clock3}
        />

        <SummaryCard
          label="Planning"
          value={String(planningProjects)}
          description="Starting soon"
          icon={CalendarDays}
        />

        <SummaryCard
          label="Completed"
          value={String(completedProjects)}
          description="Finished projects"
          icon={CheckCircle2}
        />
      </div>

      {/* Project Value */}
      <div className="rounded-2xl border border-[#e7e2d9] bg-white p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium text-[#999]">
              Total Project Value
            </p>

            <p className="mt-2 text-3xl font-semibold tracking-tight text-[#171717]">
              KES {totalValue.toLocaleString()}
            </p>

            <p className="mt-1 text-xs text-[#aaa]">
              Combined value of current and completed projects
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f1eadf] text-[#b18a5a]">
            <FolderKanban size={21} />
          </div>
        </div>
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
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search projects, customers, services or locations..."
              className="w-full rounded-xl border border-[#e2ddd4] bg-[#faf9f6] py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#aaa] focus:border-[#b18a5a] focus:bg-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as
                  | ProjectStatus
                  | "All"
              )
            }
            className="rounded-xl border border-[#e2ddd4] bg-[#faf9f6] px-4 py-3 text-sm text-[#555] outline-none focus:border-[#b18a5a]"
          >
            <option value="All">All Projects</option>
            <option value="Planning">Planning</option>
            <option value="In Progress">In Progress</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-[#e7e2d9] bg-white lg:block">
        <div className="border-b border-[#e7e2d9] px-6 py-5">
          <h2 className="text-base font-semibold text-[#171717]">
            Project Directory
          </h2>

          <p className="mt-1 text-xs text-[#999]">
            {filteredProjects.length} project
            {filteredProjects.length === 1 ? "" : "s"} found
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr className="border-b border-[#e7e2d9] bg-[#faf9f6] text-left">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Project
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Customer
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Location
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Budget
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Progress
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
              {filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-[#eeeae3] last:border-0 hover:bg-[#fcfbf9]"
                >
                  <td className="px-6 py-5">
                    <p className="text-sm font-semibold text-[#171717]">
                      {project.name}
                    </p>

                    <p className="mt-1 text-xs text-[#999]">
                      {project.id} · {project.service}
                    </p>
                  </td>

                  <td className="px-6 py-5 text-sm text-[#444]">
                    {project.customer}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-[#555]">
                      <MapPin
                        size={15}
                        className="text-[#b18a5a]"
                      />
                      {project.location}
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm font-semibold text-[#333]">
                    {project.budget}
                  </td>

                  <td className="px-6 py-5">
                    <div className="w-32">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs text-[#888]">
                          {project.progress}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-[#eeeae3]">
                        <div
                          className="h-full rounded-full bg-[#b18a5a]"
                          style={{
                            width: `${project.progress}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[project.status]}`}
                    >
                      {project.status}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="rounded-lg p-2 text-[#777] transition hover:bg-[#f5f2ec] hover:text-[#171717]"
                        title="View project"
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

        {filteredProjects.length === 0 && <EmptyState />}
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 lg:hidden">
        <div>
          <h2 className="text-base font-semibold text-[#171717]">
            Project Directory
          </h2>

          <p className="mt-1 text-xs text-[#999]">
            {filteredProjects.length} project
            {filteredProjects.length === 1 ? "" : "s"} found
          </p>
        </div>

        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="rounded-2xl border border-[#e7e2d9] bg-white p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aaa]">
                  {project.id}
                </p>

                <h3 className="mt-1 text-sm font-semibold text-[#171717]">
                  {project.name}
                </h3>

                <p className="mt-1 text-xs text-[#999]">
                  {project.customer}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${statusStyles[project.status]}`}
              >
                {project.status}
              </span>
            </div>

            <div className="mt-5 space-y-4 border-t border-[#eeeae3] pt-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aaa]">
                  Service
                </p>

                <p className="mt-1 text-sm text-[#444]">
                  {project.service}
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
                    {project.location}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aaa]">
                    Budget
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#333]">
                    {project.budget}
                  </p>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aaa]">
                    Progress
                  </p>

                  <p className="text-xs font-semibold text-[#555]">
                    {project.progress}%
                  </p>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-[#eeeae3]">
                  <div
                    className="h-full rounded-full bg-[#b18a5a]"
                    style={{
                      width: `${project.progress}%`,
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aaa]">
                    Start Date
                  </p>

                  <p className="mt-1 flex items-center gap-1.5 text-xs text-[#666]">
                    <CalendarDays size={13} />
                    {project.startDate}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#aaa]">
                    Deadline
                  </p>

                  <p className="mt-1 text-xs text-[#666]">
                    {project.deadline}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#f5f2ec] px-4 py-3 text-sm font-semibold text-[#555] transition hover:bg-[#eee9df] hover:text-[#171717]"
            >
              <ArrowUpRight size={17} />
              View Project
            </button>
          </div>
        ))}

        {filteredProjects.length === 0 && <EmptyState />}
      </div>

      {/* Demo Notice */}
      <div className="rounded-2xl border border-dashed border-[#d8cbb9] bg-[#fbf8f2] p-5">
        <p className="text-sm font-semibold text-[#8b6a42]">
          Demo data
        </p>

        <p className="mt-1 text-sm leading-6 text-[#777]">
          These projects are sample records for the admin interface.
          Later, projects will be connected to customers and approved
          quotations, with real progress tracking and project details.
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
  icon: typeof FolderKanban;
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

function EmptyState() {
  return (
    <div className="px-6 py-12 text-center">
      <p className="text-sm font-medium text-[#555]">
        No projects found
      </p>

      <p className="mt-1 text-xs text-[#999]">
        Try changing your search or status filter.
      </p>
    </div>
  );
}
