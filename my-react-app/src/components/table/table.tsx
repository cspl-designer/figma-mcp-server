import React from "react";
import styles from "./table.module.css";
import { TableHead } from "../tablehead/tablehead";
import { TableCell } from "../tablecell/tablecell";

interface TableProps {
  className?: string;
  children?: React.ReactNode;
}

const headerItems = [
  {
    children: "Plan name",
    size: "Regular",
    moreoption: "False",
    filter: "False",
    sort: "True",
    search: "False",
    checkbox: "Default",
    className: "table_head_1d987343",
  },
  {
    children: "Plan ID",
    size: "Regular",
    moreoption: "False",
    filter: "False",
    sort: "True",
    search: "False",
    checkbox: "Default",
    className: "table_head_1efb7916",
  },
  {
    children: "Plan Type",
    size: "Regular",
    moreoption: "False",
    filter: "False",
    sort: "True",
    search: "False",
    checkbox: "Default",
    className: "table_head_1f221ca1",
  },
  {
    children: "Actions",
    size: "Regular",
    moreoption: "False",
    filter: "False",
    sort: "True",
    search: "False",
    checkbox: "Default",
    className: "table_head_1f221ca1",
  },
] as const;

const rowData = [
  [
    { children: "Link", size: "Regular", type: "Clickable", className: "table_cell_42a8541a" },
    { children: "123123", size: "Regular", type: "Default", className: "table_cell_7c490c5d" },
    { children: "401(K)", size: "Regular", type: "Default", className: "table_cell_7c1fae98" },
    { children: "Edit", size: "Regular", type: "Actions", className: "table_cell_7501760e" },
  ],
  [
    { children: "Link", size: "Regular", type: "Clickable", className: "table_cell_3fb948d6" },
    { children: "435343", size: "Regular", type: "Default", className: "table_cell_394028b3" },
    { children: "401(K)", size: "Regular", type: "Default", className: "table_cell_39698678" },
    { children: "Edit", size: "Regular", type: "Actions", className: "table_cell_41bae71e" },
  ],
] as const;

export const Table = ({ className }: TableProps) => {
  return (
    <div className={`${styles.table_141a036e} ${className || ""}`}>
      <div className={styles.header_576dda98}>
        {headerItems.map((item, index) => (
          <TableHead
            key={index}
            size={item.size}
            moreoption={item.moreoption === "True"}
            filter={item.filter === "True"}
            sort={item.sort === "True"}
            search={item.search === "True"}
            checkbox={item.checkbox}
            className={styles[item.className]}
          >
            {item.children}
          </TableHead>
        ))}
      </div>
      <div className={styles.rows_3405bfde}>
        {rowData.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row_29d2642d}>
            {row.map((cell, cellIndex) => (
              <TableCell
                key={cellIndex}
                size={cell.size}
                type={cell.type}
                className={styles[cell.className]}
              >
                {cell.children}
              </TableCell>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};