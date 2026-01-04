import * as React from "react";
import styles from "./InlineActionButton.module.css";

interface InlineActionButtonProps {
  status: "Enabled" | "Disabled"; // Assuming 'Disabled' is a possible status, though not explicitly shown in variants
  type: "Delete" | "Save";
  className?: string;
  children?: React.ReactNode;
}

export const InlineActionButton = ({
  status: _status, // Renamed to _status as it's part of the variant definition but not directly used in the switch for these specific variants
  type,
  className,
  children,
}: InlineActionButtonProps) => {
  switch (type) {
    case "Save":
      return (
        <div className={`${styles.inline_action_button_5ea3d41b} ${className || ""}`}>
          <span className={styles.check_3035d0d}>
            {children || "Edit"}
          </span>
        </div>
      );
    case "Delete":
    default: // Default to Delete if type is not recognized or missing
      return (
        <div className={`${styles.inline_action_button_72c1a098} ${className || ""}`}>
          <span className={styles.trash_alt_23637fa1}>
            {children || "trash-alt"}
          </span>
        </div>
      );
  }
};