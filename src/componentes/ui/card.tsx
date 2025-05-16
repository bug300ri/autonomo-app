import React from 'react';

interface CardProps {
  children: React.ReactNode;
}

export const Card = ({ children }: CardProps) => (
  <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', background: '#fff' }}>
    {children}
  </div>
);

export const CardContent = ({ children }: CardProps) => (
  <div style={{ padding: '8px' }}>
    {children}
  </div>
);
