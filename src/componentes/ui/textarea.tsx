import React from 'react';

export const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', minHeight: '80px' }} />
);
