## Component Name

Button

## Description

The Button component is a versatile interactive element used for triggering actions within an application. It supports multiple variants, sizes, and colors to accommodate different UI requirements and hierarchies. Buttons can contain text, icons, or both, and feature various states including disabled and loading to provide clear feedback to users during interactions.

## Important Constraints

- `variant="tertiary"` can only be used with `color="tertiary"`

## TypeScript Types

The following types represent the props that the Button component accepts. These types allow you to properly configure the button according to your needs.

components with the following props:

```Json
[{

"componentName": "Button",

"props": {

"label": "Login",

"emphasis": "Primary",

"size": "Regular",

"iconLeft": "False",

"iconRight": "False",

"state": "Normal",

"deletable": "False"}
}]
```

## Example 
Follow this exact structure and naming convention. Do not deviate.

### Basic Button Variants, Sizes, and Colors

This example demonstrates different button variants, sizes, and colors in a payment form.

```tsx
import React from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  emphasis?: 'Primary' | 'Secondary' | 'Tertiary';
  size?: 'Regular' | 'Small' | 'Extra Small';
  iconLeft?: boolean;
  iconRight?: boolean;
  deletable?: boolean;
  label: string;
}

const Button: React.FC<ButtonProps> = ({
  emphasis = 'Primary',
  size = 'Regular',
  iconLeft = false,
  iconRight = false,
  deletable = false,
  label,
  className,
  ...props
}) => {
  // Use clsx to combine the base class, variant classes, and any custom classes.
  const buttonClassName = clsx(
    styles.button,
    styles[emphasis.toLowerCase()], // e.g., styles.primary
    styles[size.toLowerCase().replace(' ', '-')], // e.g., styles.extra-small
    { [styles.iconLeft]: iconLeft },
    className
  );

  return (
    <button className={buttonClassName} {...props}>
      {label}
    </button>
  );
};

export default Button;

```
 

 