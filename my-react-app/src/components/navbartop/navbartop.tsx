import * as React from 'react';
import styles from './NavbarTop.module.css';
import TenentLogo from '../tenentlogo/tenentlogo';
import BadgeCount from '../badgecount/badgecount';
import Switchnobdefault from '../switchnobdefault/switchnobdefault';
import AvatarSmallActiveImage from '../avatarsmallactiveimage/avatarsmallactiveimage';

interface NavbarTopProps {
  className?: string;
  property1: "Default"; // Prop for variant selection
  children?: React.ReactNode; // For potential future content, though not directly used in this specific structure
}

export const NavbarTop: React.FC<NavbarTopProps> = ({ className, property1 }) => {
  // The component's structure is determined by the 'property1' prop.
  // We use a switch statement to handle different variants.
  // Based on the provided JSON, only the "Default" variant is defined.
  switch (property1) {
    case "Default":
      return (
        <div className={`${styles.navbar___top_3233c0b5} ${className || ''}`}>
          <div className={styles.menu_bar_1fb53726}>
            <div className={styles.rectangle_1015_6adb834a} />
            <div className={styles.frame_813351_40006e37}>
              <span className={styles.arrow_alt_left_72ad7e2f}>arrow-alt-left</span>
              <div className={styles.rectangle_1016_6acde028} />
            </div>
            <div className={styles.rectangle_1015_6adb834a} />
          </div>
          <div className={styles.frame_812993_73a9881c}>
            <div className={styles.logos___nav_bar_c2d0934}>
              <TenentLogo className={styles.tenent_logo_37883666} property1="Marker" />
            </div>
            <div className={styles.frame_813401_189d804f}>
              <div className={styles.frame_816494_c6aa44a}>
                <div className={styles.group_1684_11c05553}>
                  <span className={styles.bell_d9ad09b}>bell</span>
                  <BadgeCount className={styles.badge___count_384fc96b} type="Critical" filled="True">
                    +25
                  </BadgeCount>
                </div>
                <div className={styles.frame_1683_7476b2f0}>
                  <span className={styles.expand_42c0fb7a}>expand</span>
                </div>
                <div className={styles.switch_circle_text___on_6896d671}>
                  <Switchnobdefault className={styles.default_3d3fc1c3} />
                  <div className={styles.content_1c994aba}>
                    <span className={styles.on_text_42457b3c}>moon</span>
                  </div>
                </div>
                <div className={styles.group_1684_6927f65}>
                  <span className={styles.bell_d9ad09b}>question-circle</span>
                </div>
                <AvatarSmallActiveImage className={styles.image_2f28980f}>
                  check-circle
                </AvatarSmallActiveImage>
              </div>
            </div>
          </div>
        </div>
      );
    default:
      // Fallback for any unspecified 'property1' values.
      // For this component, "Default" is the only known variant.
      // In a real application, you might render a warning or a simplified default.
      // For now, we'll render the "Default" variant as it's the only one available.
      return (
        <div className={`${styles.navbar___top_3233c0b5} ${className || ''}`}>
          <div className={styles.menu_bar_1fb53726}>
            <div className={styles.rectangle_1015_6adb834a} />
            <div className={styles.frame_813351_40006e37}>
              <span className={styles.arrow_alt_left_72ad7e2f}>arrow-alt-left</span>
              <div className={styles.rectangle_1016_6acde028} />
            </div>
            <div className={styles.rectangle_1015_6adb834a} />
          </div>
          <div className={styles.frame_812993_73a9881c}>
            <div className={styles.logos___nav_bar_c2d0934}>
              <TenentLogo className={styles.tenent_logo_37883666} property1="Marker" />
            </div>
            <div className={styles.frame_813401_189d804f}>
              <div className={styles.frame_816494_c6aa44a}>
                <div className={styles.group_1684_11c05553}>
                  <span className={styles.bell_d9ad09b}>bell</span>
                  <BadgeCount className={styles.badge___count_384fc96b} type="Critical" filled="True">
                    +25
                  </BadgeCount>
                </div>
                <div className={styles.frame_1683_7476b2f0}>
                  <span className={styles.expand_42c0fb7a}>expand</span>
                </div>
                <div className={styles.switch_circle_text___on_6896d671}>
                  <Switchnobdefault className={styles.default_3d3fc1c3} />
                  <div className={styles.content_1c994aba}>
                    <span className={styles.on_text_42457b3c}>moon</span>
                  </div>
                </div>
                <div className={styles.group_1684_6927f65}>
                  <span className={styles.bell_d9ad09b}>question-circle</span>
                </div>
                <AvatarSmallActiveImage className={styles.image_2f28980f}>
                  check-circle
                </AvatarSmallActiveImage>
              </div>
            </div>
          </div>
        </div>
      );
  }
};

export default NavbarTop;