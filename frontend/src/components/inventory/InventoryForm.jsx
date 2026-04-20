import { useEffect, useState } from 'react';

const formStyle = {
  display: 'grid',
  gap: '14px',
  maxWidth: '600px',
};

const defaultValues = {
  inventory_name: '',
  description: '',
};

export default function InventoryForm({
  initialValues = defaultValues,
  onSubmit,
  loading = false,
  submitText = 'Save',
  showPhoto = false,
}) {
  const [inventoryName, setInventoryName] = useState(initialValues.inventory_name || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setInventoryName(initialValues.inventory_name || '');
    setDescription(initialValues.description || '');
  }, [initialValues.inventory_name, initialValues.description]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inventoryName.trim()) {
      setError('Inventory name is required.');
      return;
    }

    setError('');

    await onSubmit({
      inventory_name: inventoryName.trim(),
      description: description.trim(),
      photo,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div>
        <label>
          Inventory name *
          <br />
          <input
            type="text"
            value={inventoryName}
            onChange={(e) => setInventoryName(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </label>
      </div>

      <div>
        <label>
          Description
          <br />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            style={{ width: '100%', padding: '8px' }}
          />
        </label>
      </div>

      {showPhoto && (
        <div>
          <label>
            Photo
            <br />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            />
          </label>
        </div>
      )}

      {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : submitText}
      </button>
    </form>
  );
}