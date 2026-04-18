const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const CACHE_DIR = path.join(__dirname, 'cache');

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, CACHE_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '');
    const safeExt = ext || '.jpg';
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
  },
});

const upload = multer({ storage });

let inventory = [];
let nextId = 1;

function toDto(item) {
  return {
    id: item.id,
    inventory_name: item.inventory_name,
    description: item.description,
    photoUrl: item.photoFilename ? `/inventory/${item.id}/photo` : null,
  };
}

function findItemById(id) {
  return inventory.find((item) => item.id === id);
}

function removePhotoIfExists(filename) {
  if (!filename) return;

  const filePath = path.join(CACHE_DIR, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

app.get('/', (req, res) => {
  res.json({
    message: 'Inventory API is running',
    endpoints: [
      'GET /inventory',
      'POST /register',
      'GET /inventory/:id',
      'PUT /inventory/:id',
      'PUT /inventory/:id/photo',
      'DELETE /inventory/:id',
    ],
  });
});

app.get('/inventory', (req, res) => {
  res.json(inventory.map(toDto));
});

app.post('/register', upload.single('photo'), (req, res) => {
  const { inventory_name, description } = req.body;

  if (!inventory_name || !inventory_name.trim()) {
    if (req.file) {
      removePhotoIfExists(req.file.filename);
    }

    return res.status(400).json({
      error: 'inventory_name is required',
    });
  }

  const newItem = {
    id: nextId++,
    inventory_name: inventory_name.trim(),
    description: description ? description.trim() : '',
    photoFilename: req.file ? req.file.filename : null,
    photoMimeType: req.file ? req.file.mimetype : null,
  };

  inventory.push(newItem);

  return res.status(201).json(toDto(newItem));
});

app.get('/inventory/:id', (req, res) => {
  const id = Number(req.params.id);
  const item = findItemById(id);

  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  return res.json(toDto(item));
});

app.get('/inventory/:id/photo', (req, res) => {
  const id = Number(req.params.id);
  const item = findItemById(id);

  if (!item || !item.photoFilename) {
    return res.status(404).json({ error: 'Photo not found' });
  }

  const filePath = path.join(CACHE_DIR, item.photoFilename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Photo file does not exist' });
  }

  if (item.photoMimeType) {
    res.type(item.photoMimeType);
  }

  return res.sendFile(filePath);
});

app.put('/inventory/:id', (req, res) => {
  const id = Number(req.params.id);
  const item = findItemById(id);

  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const { inventory_name, description } = req.body;

  if (typeof inventory_name === 'string') {
    if (!inventory_name.trim()) {
      return res.status(400).json({ error: 'inventory_name cannot be empty' });
    }
    item.inventory_name = inventory_name.trim();
  }

  if (typeof description === 'string') {
    item.description = description.trim();
  }

  return res.json(toDto(item));
});

app.put('/inventory/:id/photo', upload.single('photo'), (req, res) => {
  const id = Number(req.params.id);
  const item = findItemById(id);

  if (!item) {
    if (req.file) {
      removePhotoIfExists(req.file.filename);
    }
    return res.status(404).json({ error: 'Item not found' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'photo file is required' });
  }

  if (item.photoFilename) {
    removePhotoIfExists(item.photoFilename);
  }

  item.photoFilename = req.file.filename;
  item.photoMimeType = req.file.mimetype;

  return res.json(toDto(item));
});

app.delete('/inventory/:id', (req, res) => {
  const id = Number(req.params.id);
  const itemIndex = inventory.findIndex((item) => item.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const item = inventory[itemIndex];

  if (item.photoFilename) {
    removePhotoIfExists(item.photoFilename);
  }

  inventory.splice(itemIndex, 1);

  return res.json({ message: 'Item deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});