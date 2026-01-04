import React from 'react';
import styles from './tablecell.module.css';
import { InlineActionButton } from '../inlineactionbutton/inlineactionbutton';

interface TableCellProps {
  className?: string; // Required by rule, but the root div's className is strictly defined by the JSON node.
  children?: React.ReactNode; // Content for 'Default' or 'Clickable' types
  size: 'Regular'; // Only 'Regular' is present in _known_variants
  type: 'Actions' | 'Clickable' | 'Default'; // Based on _known_variants
}

export const TableCell = ({ children, size, type }: TableCellProps) => {
  let content: React.ReactNode;
  let rootClassName: string;

  const variantKey = `${size}-${type}`;

  switch (variantKey) {
    case 'Regular-Clickable':
      rootClassName = styles.table_cell_42a8541a;
      content = (
        <a className={styles.links_310eeb3a} href="#">
          {children || "Link"}
        </a>
      );
      break;
    case 'Regular-Default':
      rootClassName = styles.table_cell_7c490c5d;
      content = (
        <span className={styles.table_cell_6c11f0}>
          {children || "123123"}
        </span>
      );
      break;
    case 'Regular-Actions':
      rootClassName = styles.table_cell_7501760e;
      content = (
        <>
          <InlineActionButton
            className={styles.inline_action_button_5ea3d41b}
            status="Enabled"
            type="Save"
          >
            Edit
          </InlineActionButton>
          <InlineActionButton
            className={styles.inline_action_button_72c1a098}
            status="Enabled"
            type="Delete"
          >
            trash-alt
          </InlineActionButton>
        </>
      );
      break;
    default:
      // Fallback for unknown variants.
      // Use the className from the main LAYOUT_DATA for the root Table-cell if no variant matches.
      rootClassName = styles.table_cell_7501760e;
      content = children;
      break;
  }

  return (
    <div className={rootClassName}>
      {content}
    </div>
  );
};