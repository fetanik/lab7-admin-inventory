const API_BASE_URL = 'http://localhost:3000';

function buildUrl(path) {
  return `${API_BASE_URL}${path}`;
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || '';

  if (!response.ok) {
    let errorMessage = 'Request failed';

    try {
      if (contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } else {
        errorMessage = await response.text();
      }
    } catch {
      errorMessage = 'Request failed';
    }

    throw new Error(errorMessage);
  }

  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

export function getPhotoUrl(item) {
  if (!item?.photoUrl) return '';
  if (item.photoUrl.startsWith('http')) return item.photoUrl;
  return buildUrl(item.photoUrl);
}

export async function getAllInventory() {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const response = await fetch(buildUrl('/inventory'));
  return parseResponse(response);
}

export async function getInventoryById(id) {
  const response = await fetch(buildUrl(`/inventory/${id}`));
  return parseResponse(response);
}

export async function createInventory(formData) {
  const response = await fetch(buildUrl('/register'), {
    method: 'POST',
    body: formData,
  });

  return parseResponse(response);
}

export async function updateInventoryText(id, payload) {
  const response = await fetch(buildUrl(`/inventory/${id}`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function updateInventoryPhoto(id, formData) {
  const response = await fetch(buildUrl(`/inventory/${id}/photo`), {
    method: 'PUT',
    body: formData,
  });

  return parseResponse(response);
}

export async function deleteInventory(id) {
  const response = await fetch(buildUrl(`/inventory/${id}`), {
    method: 'DELETE',
  });

  return parseResponse(response);
}