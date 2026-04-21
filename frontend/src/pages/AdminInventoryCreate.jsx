import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InventoryForm from '../components/inventory/InventoryForm';
import { createInventory } from '../services/inventoryApi';

export default function AdminInventoryCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async ({ inventory_name, description, photo }) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('inventory_name', inventory_name);
      formData.append('description', description || '');

      if (photo) {
        formData.append('photo', photo);
      }

      await createInventory(formData);
      navigate('/admin/inventory');
    } catch (err) {
      alert(err.message || 'Create failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create Inventory Item</h1>

      <InventoryForm
        showPhoto={true}
        submitText="Create"
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}