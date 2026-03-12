import React from 'react';
import { useData } from '../hooks/useData';
import { DataContext } from './dataContextConfig';

export type { DataContextType } from './dataContextConfig';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dataState = useData();

  return (
    <DataContext.Provider value={dataState}>
      {children}
    </DataContext.Provider>
  );
};
