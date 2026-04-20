const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(110, 67, 86, 0.25)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  backdropFilter: 'blur(3px)',
};

const modalStyle = {
  background: '#fffafd',
  padding: '24px',
  borderRadius: '20px',
  width: '100%',
  maxWidth: '420px',
  boxShadow: '0 18px 40px rgba(216, 112, 154, 0.18)',
  border: '1px solid #f1cada',
};

const actionsStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px',
  marginTop: '18px',
};

export default function ConfirmModal({
  isOpen,
  title = 'Confirm action',
  message = 'Are you sure?',
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        <p>{message}</p>

        <div style={actionsStyle}>
          <button onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}