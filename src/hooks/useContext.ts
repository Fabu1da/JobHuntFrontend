import { useContext } from 'react';
import { DataContext, type DataContextType } from '../context/dataContextConfig';

export const useFilterContext = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useFilterContext must be used within DataProvider');
  }
  return context;
};
