import { getPhotoUrl } from '../../services/inventoryApi';

const boxStyle = {
  border: '1px solid #f1cada',
  borderRadius: '20px',
  padding: '24px',
  maxWidth: '700px',
  background: 'rgba(255, 255, 255, 0.94)',
  boxShadow: '0 14px 32px rgba(216, 112, 154, 0.12)',
};

export default function InventoryDetails({ item }) {
  if (!item) return null;

  return (
    <div style={boxStyle}>
      <h2 style={{ marginTop: 0 }}>{item.inventory_name}</h2>

      <p>
        <strong>Description:</strong>{' '}
        {item.description || 'No description'}
      </p>

      <div>
        <strong>Photo:</strong>
        <div style={{ marginTop: '12px' }}>
          {item.photoUrl ? (
            <img
              src={getPhotoUrl(item)}
              alt={item.inventory_name}
              style={{
                width: '100%',
                maxWidth: '500px',
                borderRadius: '8px',
                objectFit: 'cover',
              }}
            />
          ) : (
            <p>No photo</p>
          )}
        </div>
      </div>
    </div>
  );
}