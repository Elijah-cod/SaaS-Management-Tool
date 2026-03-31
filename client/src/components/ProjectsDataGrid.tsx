"use client";

import Link from "next/link";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import type { Project } from "@/types";

const statusStyles: Record<string, string> = {
  Completed: "bg-emerald-100 text-emerald-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Planning: "bg-amber-100 text-amber-700",
  "At Risk": "bg-rose-100 text-rose-700",
};

interface ProjectsDataGridProps {
  projects: Project[];
}

export default function ProjectsDataGrid({
  projects,
}: ProjectsDataGridProps) {
  const columns: GridColDef<Project>[] = [
    {
      field: "name",
      headerName: "Project",
      flex: 1.3,
      minWidth: 220,
      renderCell: ({ row }) => (
        <div className="flex h-full items-center">
          <Link
            href={`/projects/${row.id}`}
            className="font-semibold text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-300"
          >
            {row.name}
          </Link>
        </div>
      ),
    },
    {
      field: "owner",
      headerName: "Owner",
      flex: 0.8,
      minWidth: 140,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      minWidth: 130,
      renderCell: ({ value }) => (
        <div className="flex h-full items-center">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              statusStyles[String(value)] ?? "bg-slate-100 text-slate-700"
            }`}
          >
            {String(value)}
          </span>
        </div>
      ),
    },
    {
      field: "priority",
      headerName: "Priority",
      flex: 0.6,
      minWidth: 110,
    },
    {
      field: "progress",
      headerName: "Progress",
      flex: 0.8,
      minWidth: 130,
      renderCell: ({ value }) => (
        <div className="flex h-full w-full items-center gap-3">
          <div className="h-2 flex-1 rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-2 rounded-full bg-slate-900 dark:bg-white"
              style={{ width: `${value ?? 0}%` }}
            />
          </div>
          <span className="min-w-10 text-xs font-semibold text-slate-600 dark:text-slate-300">
            {value ?? 0}%
          </span>
        </div>
      ),
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      flex: 0.8,
      minWidth: 130,
      valueFormatter: (value) =>
        value ? new Date(String(value)).toLocaleDateString() : "No due date",
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <DataGrid
        rows={projects}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
              page: 0,
            },
          },
        }}
        getRowHeight={() => 72}
        sx={{
          border: 0,
          backgroundColor: "transparent",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "transparent",
          },
          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": {
            outline: "none",
          },
        }}
      />
    </div>
  );
}
