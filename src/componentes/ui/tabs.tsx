import React, { useState } from 'react';

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}

export const Tabs = ({ children }: TabsProps) => <div>{children}</div>;

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export const TabsList = ({ children, className }: TabsListProps) => (
  <div className={className}>{children}</div>
);

interface TabsTriggerProps {
  children: React.ReactNode;
  value: string;
}

export const TabsTrigger = ({ children }: TabsTriggerProps) => (
  <button style={{ margin: '4px', padding: '6px 12px' }}>{children}</button>
);

interface TabsContentProps {
  children: React.ReactNode;
  value: string;
}

export const TabsContent = ({ children }: TabsContentProps) => (
  <div style={{ padding: '12px', border: '1px solid #ccc' }}>{children}</div>
);
