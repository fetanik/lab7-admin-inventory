import { getPhotoUrl } from '../../services/inventoryApi';

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '16px',
};

const thTdStyle = {
  border: '1px solid #ddd',
  padding: '10px',
  verticalAlign: 'top',
  textAlign: 'left',
};

const actionWrapStyle = {
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
};

export default function InventoryTable({
  items,
  onView,
  onEdit,
  onDelete,
  deleteLoadingId,
}) {
  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={thTdStyle}>Name</th>
          <th style={thTdStyle}>Description</th>
          <th style={thTdStyle}>Photo</th>
          <th style={thTdStyle}>Actions</th>
        </tr>
      </thead>

      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td style={thTdStyle}>{item.inventory_name}</td>
            <td style={thTdStyle}>{item.description || '—'}</td>
            <td style={thTdStyle}>
              {item.photoUrl ? (
                <img
                  src={getPhotoUrl(item)}
                  alt={item.inventory_name}
                  style={{ width: '100px', height: '80px', objectFit: 'cover', borderRadius: '6px' }}
                />
              ) : (
                'No photo'
              )}
            </td>
            <td style={thTdStyle}>
              <div style={actionWrapStyle}>
                <button onClick={() => onView(item.id)}>View</button>
                <button onClick={() => onEdit(item.id)}>Edit</button>
                <button
                  onClick={() => onDelete(item)}
                  disabled={deleteLoadingId === item.id}
                >
                  {deleteLoadingId === item.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}