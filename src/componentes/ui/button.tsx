import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button = ({ children, ...props }: ButtonProps) => (
  <button {...props} style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc' }}>
    {children}
  </button>
);
