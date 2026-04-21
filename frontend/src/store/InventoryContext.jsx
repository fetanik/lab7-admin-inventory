import { createContext, useCallback, useContext, useState } from 'react';
import { getAllInventory } from '../services/inventoryApi';

const InventoryContext = createContext(null);

export function InventoryProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getAllInventory();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load inventory.');
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    items,
    setItems,
    loading,
    error,
    setError,
    fetchInventory,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);

  if (!context) {
    throw new Error('useInventory must be used inside InventoryProvider');
  }

  return context;
}