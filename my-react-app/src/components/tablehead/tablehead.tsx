import React from 'react';

interface TableHeadProps {
  className?: string;
  children?: React.ReactNode;
  size: "Regular" | string;
  moreoption: "False" | "True" | string;
  filter: "False" | "True" | string;
  sort: "False" | "True" | string;
  search: "False" | "True" | string;
  checkbox: "Default" | string;
}

export const TableHead: React.FC<TableHeadProps> = ({
  className,
  children,
  // Destructure all props to define the component's variant,
  // even if not all are directly used in the JSX for this specific variant.
  size,
  moreoption,
  filter,
  sort,
  search,
  checkbox,
}) => {
  // The main container for the Table-head component.
  // The `className` prop passed from a parent component is appended to the base class.
  return (
    <div className={`table_head_1d987343 ${className || ''}`}>
      {/* This div represents the "Table cell" text element. */}
      {/* It uses the `children` prop for its content, with "Plan name" as a fallback,
          adhering to the "Empty Vessel" rule. */}
      <div className="table_cell_3104d8ad">
        {children || "Plan name"}
      </div>

      {/* This div represents the "Sort" text element. */}
      {/* It is conditionally rendered based on the `sort` prop,
          following the "Polymorphic Rule" for handling variants. */}
      {sort === "True" && (
        <div className="sort_1a75d823">
          Sort
        </div>
      )}
    </div>
  );
};

export default TableHead;