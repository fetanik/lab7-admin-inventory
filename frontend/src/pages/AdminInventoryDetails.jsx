import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import InventoryDetails from '../components/inventory/InventoryDetails';
import { getInventoryById } from '../services/inventoryApi';

export default function AdminInventoryDetails() {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadItem = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getInventoryById(id);
      setItem(data);
    } catch (err) {
      setError(err.message || 'Failed to load details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItem();
  }, [id]);

  if (loading) return <p>Loading details...</p>;

  if (error) {
    return (
      <div>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={loadItem}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <p>
        <Link to="/admin/inventory">← Back to inventory</Link>
      </p>

      <InventoryDetails item={item} />

      <div style={{ marginTop: '16px' }}>
        <Link to={`/admin/inventory/${id}/edit`}>
          <button>Edit item</button>
        </Link>
      </div>
    </div>
  );
}