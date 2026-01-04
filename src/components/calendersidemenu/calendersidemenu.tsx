import React from 'react';
import styles from './CalenderSideMenu.module.css';
import { SideMenuItem } from '../sidemenuitem/sidemenuitem';

interface CalenderSideMenuProps {
  className?: string;
  children?: React.ReactNode;
}

export const CalenderSideMenu: React.FC<CalenderSideMenuProps> = ({ className }) => {
  // Rule C: The "Repeater" - Extract content into a data array for mapping.
  // Rule B: The "Pass-Through" - Use _inferred_content for child components.
  // Rule 4: Data Fidelity - Scrape actual text from the JSON.
  const menuItemsData = [
    { content: "Last 07 days", className: styles.side_menu_item_4479f1b },
    { content: "Last 07 days", className: styles.side_menu_item_4479f1b },
    { content: "Last 07 days", className: styles.side_menu_item_4479f1b },
    { content: "Last 07 days", className: styles.side_menu_item_4479f1b },
    { content: "Last 07 days", className: styles.side_menu_item_4479f1b },
    { content: "Last 07 days", className: styles.side_menu_item_4479f1b },
    { content: "Last 07 days", className: styles.side_menu_item_4479f1b },
    { content: "Last 07 days", className: styles.side_menu_item_4479f1b },
    { content: "Last 07 days", className: styles.side_menu_item_4479f1b },
  ] as const;

  return (
    <div className={`${styles.calender_side_menu_16d5f722} ${className || ''}`}>
      {menuItemsData.map((item, index) => (
        <SideMenuItem key={index} className={item.className}>
          {item.content}
        </SideMenuItem>
      ))}
    </div>
  );
};