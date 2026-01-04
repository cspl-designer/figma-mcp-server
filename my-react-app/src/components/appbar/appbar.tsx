import React from 'react';
import styles from './AppBar.module.css';
import MenuItems from '../menuitems/menuitems';

interface AppBarProps {
  className?: string;
  children?: React.ReactNode;
}

export const AppBar: React.FC<AppBarProps> = ({ className }) => {
  return (
    <div className={`${styles.appbar_64a870a6} ${className || ''}`}>
      <div className={styles.frame_1688d1f6}>
        <div className={styles.vector_678a0d5}></div>
        <div className={styles.vector_678a0d5}></div>
        <div className={styles.vector_678a0d5}></div>
        <div className={styles.vector_678a0d5}></div>
        <div className={styles.vector_678a0d5}></div>
        <div className={styles.vector_678a0d5}></div>
        <div className={styles.vector_678a0d5}></div>
        <div className={styles.vector_678a0d5}></div>
        <div className={styles.vector_678a0d5}></div>
        <div className={styles.vector_678a0d5}></div>
        <div className={styles.vector_678a0d5}></div>
        <div className={styles.vector_678a0d5}></div>
        <div className={styles.vector_678a0d5}></div>
      </div>
      <div className={styles.frame_816493_2a26a196}>
        <MenuItems
          state="Default"
          disabled="False"
          selected="False"
          className={styles.menu_items_4479f1b}
        >
          gauge-min
        </MenuItems>
        <MenuItems
          state="Default"
          disabled="False"
          selected="False"
          className={styles.menu_items_4479f1b}
        >
          file-invoice
        </MenuItems>
        <MenuItems
          state="Default"
          disabled="False"
          selected="False"
          className={styles.menu_items_4479f1b}
        >
          user
        </MenuItems>
        <MenuItems
          state="Default"
          disabled="False"
          selected="False"
          className={styles.menu_items_4479f1b}
        >
          wrench
        </MenuItems>
        <MenuItems
          state="Default"
          disabled="False"
          selected="False"
          className={styles.menu_items_4479f1b}
        >
          right-left
        </MenuItems>
        <MenuItems
          state="Default"
          disabled="False"
          selected="False"
          className={styles.menu_items_4479f1b}
        >
          grid-horizontal
        </MenuItems>
      </div>
    </div>
  );
};

export default AppBar;