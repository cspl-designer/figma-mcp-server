import React from 'react';
import styles from './recursivetest.module.css';
import { Table } from '../table/table';

interface RecursiveTestProps {
  className?: string;
  children?: React.ReactNode;
}

export const RecursiveTest: React.FC<RecursiveTestProps> = ({ className }) => {
  // Rule C: The "Repeater" (Lists/Tables)
  // Extract content and className for repeated child components.
  const tableItems = [
    {
      content: "Plan name",
      className: styles.table_362868fa
    },
    {
      content: "Plan name",
      className: styles.table_362868fa
    }
  ] as const;

  return (
    <div className={`${styles.recursive_test_75e3ccfe} ${className || ''}`}>
      {tableItems.map((item, index) => (
        // Rule B: The "Pass-Through" (Parent Components)
        // Pass extracted content to the child component.
        <Table key={index} className={item.className}>
          {item.content}
        </Table>
      ))}
    </div>
  );
};

export default RecursiveTest;