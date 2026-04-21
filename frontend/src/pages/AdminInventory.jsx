import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InventoryTable from '../components/inventory/InventoryTable';
import ConfirmModal from '../components/inventory/ConfirmModal';
import { useInventory } from '../store/InventoryContext';
import { deleteInventory } from '../services/inventoryApi';

const topBarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'wrap',
};

export default function AdminInventory() {
  const navigate = useNavigate();
  const { items, loading, error, fetchInventory } = useInventory();

  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;

    try {
      setDeleteLoadingId(selectedItem.id);
      await deleteInventory(selectedItem.id);
      setSelectedItem(null);
      await fetchInventory();
    } catch (err) {
      alert(err.message || 'Delete failed.');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <div>
      <div style={topBarStyle}>
        <h1>Admin Inventory</h1>
        <button onClick={() => navigate('/admin/inventory/create')}>
          Add inventory
        </button>
      </div>

      {loading && <p>Loading inventory...</p>}

      {!loading && error && (
        <div>
          <p style={{ color: 'red' }}>{error}</p>
          <button onClick={fetchInventory}>Retry</button>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <p>Inventory list is empty.</p>
      )}

      {!loading && !error && items.length > 0 && (
        <InventoryTable
          items={items}
          onView={(id) => navigate(`/admin/inventory/${id}`)}
          onEdit={(id) => navigate(`/admin/inventory/${id}/edit`)}
          onDelete={handleDeleteClick}
          deleteLoadingId={deleteLoadingId}
        />
      )}

      <ConfirmModal
        isOpen={Boolean(selectedItem)}
        title="Delete inventory item"
        message={
          selectedItem
            ? `Are you sure you want to delete "${selectedItem.inventory_name}"?`
            : ''
        }
        onConfirm={handleDeleteConfirm}
        onCancel={() => setSelectedItem(null)}
        loading={Boolean(deleteLoadingId)}
      />
    </div>
  );
}