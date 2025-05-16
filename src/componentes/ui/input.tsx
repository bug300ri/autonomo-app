import React from 'react';

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }} />
);
