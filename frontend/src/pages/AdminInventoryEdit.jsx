import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import InventoryForm from '../components/inventory/InventoryForm';
import { getInventoryById, getPhotoUrl, updateInventoryPhoto, updateInventoryText } from '../services/inventoryApi';

const sectionStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '20px',
  maxWidth: '700px',
};

export default function AdminInventoryEdit() {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [textLoading, setTextLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const loadItem = async () => {
    try {
      setPageLoading(true);
      setPageError('');
      const data = await getInventoryById(id);
      setItem(data);
    } catch (err) {
      setPageError(err.message || 'Failed to load item.');
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadItem();
  }, [id]);

  const handleTextSubmit = async ({ inventory_name, description }) => {
    try {
      setTextLoading(true);
      await updateInventoryText(id, { inventory_name, description });
      await loadItem();
      alert('Text data updated successfully.');
    } catch (err) {
      alert(err.message || 'Text update failed.');
    } finally {
      setTextLoading(false);
    }
  };

  const handlePhotoSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPhoto) {
      alert('Please select a photo first.');
      return;
    }

    try {
      setPhotoLoading(true);

      const formData = new FormData();
      formData.append('photo', selectedPhoto);

      await updateInventoryPhoto(id, formData);
      setSelectedPhoto(null);
      await loadItem();
      alert('Photo updated successfully.');
    } catch (err) {
      alert(err.message || 'Photo update failed.');
    } finally {
      setPhotoLoading(false);
    }
  };

  if (pageLoading) return <p>Loading item...</p>;

  if (pageError) {
    return (
      <div>
        <p style={{ color: 'red' }}>{pageError}</p>
        <button onClick={loadItem}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Edit Inventory Item</h1>
      <p>
        <Link to={`/admin/inventory/${id}`}>Open details</Link>
      </p>

      <div style={sectionStyle}>
        <h2>Update text data</h2>
        <InventoryForm
          initialValues={{
            inventory_name: item?.inventory_name || '',
            description: item?.description || '',
          }}
          submitText="Save text changes"
          onSubmit={handleTextSubmit}
          loading={textLoading}
          showPhoto={false}
        />
      </div>

      <div style={sectionStyle}>
        <h2>Update photo</h2>

        {item?.photoUrl ? (
          <div style={{ marginBottom: '14px' }}>
            <img
              src={getPhotoUrl(item)}
              alt={item.inventory_name}
              style={{ width: '220px', borderRadius: '8px', objectFit: 'cover' }}
            />
          </div>
        ) : (
          <p>No current photo.</p>
        )}

        <form onSubmit={handlePhotoSubmit}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedPhoto(e.target.files?.[0] || null)}
          />
          <br />
          <br />
          <button type="submit" disabled={photoLoading}>
            {photoLoading ? 'Uploading...' : 'Update photo'}
          </button>
        </form>
      </div>
    </div>
  );
}