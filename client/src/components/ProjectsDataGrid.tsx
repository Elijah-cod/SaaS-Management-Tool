"use client";

import Link from "next/link";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import type { Project } from "@/types";
import { StatusChip } from "@/shared/ui/primitives";

interface ProjectsDataGridProps {
  projects: Project[];
  loading?: boolean;
}

export default function ProjectsDataGrid({
  projects,
  loading = false,
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
            className="font-semibold text-[var(--foreground)] hover:text-[var(--accent)]"
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
          <StatusChip
            label={String(value)}
            tone={
              value === "Completed"
                ? "success"
                : value === "At Risk"
                  ? "danger"
                  : value === "Planning"
                    ? "warning"
                    : "accent"
            }
          />
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
          <div className="h-1.5 flex-1 rounded-full bg-[var(--surface-strong)]">
            <div
              className="h-1.5 rounded-full bg-[var(--accent)]"
              style={{ width: `${value ?? 0}%` }}
            />
          </div>
          <span className="min-w-10 text-xs font-semibold text-[var(--muted-strong)]">
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
    <div className="ui-panel min-h-[26rem] overflow-x-auto overflow-y-hidden">
      <DataGrid
        rows={projects}
        columns={columns}
        loading={loading}
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
          minWidth: 800,
          color: "var(--foreground)",
          fontFamily: "inherit",
          "& .MuiDataGrid-columnHeaderTitle": { fontWeight: 600 },
          "& .MuiDataGrid-cell:focus-visible, & .MuiDataGrid-columnHeader:focus-visible": {
            outline: "2px solid var(--accent)",
            outlineOffset: "-2px",
          },
        }}
      />
    </div>
  );
}
