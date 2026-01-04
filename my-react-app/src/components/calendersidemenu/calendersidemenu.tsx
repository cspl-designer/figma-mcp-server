import React from 'react';
import styles from './CalenderSideMenu.module.css';
import { SideMenuItem } from '../sidemenuitem/sidemenuitem';

interface CalenderSideMenuProps {
  className?: string;
  property1: "Calender side menu"; // Prop derived from _known_variants
}

export const CalenderSideMenu: React.FC<CalenderSideMenuProps> = ({ className, property1 }) => {
  // Data for the repeated SideMenuItem components, derived from the parent's _known_variants
  // This ensures the children's properties match the active variant of the parent.
  const menuItems = [
    { property1: "Enabled", children: "Last 07 days", className: styles.side_menu_item_3d27dec },
    { property1: "Enabled", children: "Last 07 days", className: styles.side_menu_item_3d27dec },
    { property1: "Enabled", children: "Last 07 days", className: styles.side_menu_item_3d27dec },
    { property1: "Enabled", children: "Last 07 days", className: styles.side_menu_item_3d27dec },
    { property1: "Enabled", children: "Last 07 days", className: styles.side_menu_item_3d27dec },
    { property1: "Enabled", children: "Last 07 days", className: styles.side_menu_item_3d27dec },
    { property1: "Enabled", children: "Last 07 days", className: styles.side_menu_item_3d27dec },
    { property1: "Enabled", children: "Last 07 days", className: styles.side_menu_item_3d27dec },
    { property1: "Enabled", children: "Last 07 days", className: styles.side_menu_item_3d27dec },
  ] as const;

  // Determine the root component's class name based on its variant prop
  let rootClassName = '';
  switch (property1) {
    case "Calender side menu":
      rootClassName = styles.calender_side_menu_16d5f722;
      break;
    default:
      // Fallback to the default variant if property1 doesn't match a known case
      rootClassName = styles.calender_side_menu_16d5f722;
      break;
  }

  return (
    <div className={`${rootClassName} ${className || ''}`}>
      {menuItems.map((item, index) => (
        <SideMenuItem
          key={index} // Using index as key for static lists where order doesn't change
          className={item.className}
          property1={item.property1} // Rule 2: Prop fidelity - pass as string literal
        >
          {item.children}
        </SideMenuItem>
      ))}
    </div>
  );
};