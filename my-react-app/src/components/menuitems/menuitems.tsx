import React from 'react';
import styles from './MenuItems.module.css';

interface MenuItemsProps {
  className?: string;
  /**
   * Controls the visual state of the menu item.
   * @default "Default"
   */
  state?: "Default" | "Hover" | "Pressed" | "Focused"; // Assuming other states might exist, though only "Default" is provided in variants
  /**
   * Controls whether the menu item is disabled.
   * @default "False"
   */
  disabled?: "True" | "False";
  /**
   * Controls whether the menu item is selected.
   * @default "False"
   */
  selected?: "True" | "False";
  /**
   * The text content for the icon element.
   * @default "gauge-min"
   */
  iconText?: string;
  /**
   * The text content for the label element.
   * @default "Dashboard"
   */
  labelText?: string;
}

const MenuItems: React.FC<MenuItemsProps> = ({
  className,
  state = "Default",
  disabled = "False",
  selected = "False",
  iconText,
  labelText,
}) => {
  let rootClassName = '';
  let frame813411ClassName = '';
  let gaugeMinClassName = '';
  let frame813412ClassName = '';
  let dashboardClassName = '';

  // Construct a key from the props to match against known variants
  const variantKey = `state:${state}|disabled:${disabled}|selected:${selected}`;

  switch (variantKey) {
    case 'state:Default|disabled:False|selected:False':
      rootClassName = styles.menu_items_4c4c7aa5;
      frame813411ClassName = styles.frame_813411_78580a86;
      gaugeMinClassName = styles.gauge_min_43c4bf25;
      frame813412ClassName = styles.frame_813412_2eec08de;
      dashboardClassName = styles.dashboard_17010261;
      break;
    default:
      // Fallback to the default variant if no specific match is found
      rootClassName = styles.menu_items_4c4c7aa5;
      frame813411ClassName = styles.frame_813411_78580a86;
      gaugeMinClassName = styles.gauge_min_43c4bf25;
      frame813412ClassName = styles.frame_813412_2eec08de;
      dashboardClassName = styles.dashboard_17010261;
      break;
  }

  return (
    <div className={`${rootClassName} ${className || ''}`}>
      <div className={frame813411ClassName}>
        <span className={gaugeMinClassName}>
          {iconText || "gauge-min"}
        </span>
      </div>
      <div className={frame813412ClassName}>
        <span className={dashboardClassName}>
          {labelText || "Dashboard"}
        </span>
      </div>
    </div>
  );
};

export default MenuItems;