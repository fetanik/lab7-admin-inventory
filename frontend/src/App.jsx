import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import AdminInventory from './pages/AdminInventory';
import AdminInventoryCreate from './pages/AdminInventoryCreate';
import AdminInventoryEdit from './pages/AdminInventoryEdit';
import AdminInventoryDetails from './pages/AdminInventoryDetails';

const navStyle = {
  display: 'flex',
  gap: '12px',
  marginBottom: '24px',
};

const layoutStyle = {
  maxWidth: '1100px',
  margin: '0 auto',
  padding: '24px 16px 40px',
  fontFamily: 'Arial, sans-serif',
};

export default function App() {
  return (
    <BrowserRouter>
      <div style={layoutStyle}>
        <nav style={navStyle}>
          <Link to="/admin/inventory">Inventory</Link>
          <Link to="/admin/inventory/create">Create</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/admin/inventory" replace />} />
          <Route path="/admin/inventory" element={<AdminInventory />} />
          <Route path="/admin/inventory/create" element={<AdminInventoryCreate />} />
          <Route path="/admin/inventory/:id" element={<AdminInventoryDetails />} />
          <Route path="/admin/inventory/:id/edit" element={<AdminInventoryEdit />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}