const API_URL = 'http://localhost:8080/api';
const BACKEND_URL = API_URL.replace(/\/api$/, '');

async function request(url, options = {}) {
  try {
    return await fetch(url, options);
  } catch {
    throw new Error('No se puede conectar con el backend. Arranca Spring en http://localhost:8080 y vuelve a intentarlo.');
  }
}

async function readResponseBody(response) {
  const contentType = response.headers.get('Content-Type') || '';

  if (contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  try {
    const text = await response.text();
    return text || null;
  } catch {
    return null;
  }
}

async function parseResponse(response) {
  const body = await readResponseBody(response);

  if (!response.ok) {
    const message =
      (typeof body === 'string' && body.trim()) ||
      body?.message ||
      body?.error ||
      response.statusText ||
      `Error ${response.status}`;

    throw new Error(message);
  }

  return body;
}

export async function login(credentials) {
  const response = await request(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });

  return parseResponse(response);
}

export async function registerUser(payload) {
  const response = await request(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return parseResponse(response);
}

export async function fetchProfile(token) {
  const response = await request(`${API_URL}/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return parseResponse(response);
}

function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
}

function authOnlyHeaders(token) {
  return {
    Authorization: `Bearer ${token}`
  };
}

function appendFormDataValue(formData, key, value) {
  if (value === undefined || value === null) {
    return;
  }
  formData.append(key, String(value));
}

function buildCatalogFormData(payload) {
  const formData = new FormData();
  appendFormDataValue(formData, 'type', payload.type);
  appendFormDataValue(formData, 'title', payload.title);
  appendFormDataValue(formData, 'slug', payload.slug);
  appendFormDataValue(formData, 'description', payload.description);
  appendFormDataValue(formData, 'metaPrimary', payload.metaPrimary);
  appendFormDataValue(formData, 'metaSecondary', payload.metaSecondary);
  appendFormDataValue(formData, 'sortOrder', payload.sortOrder ?? 0);
  appendFormDataValue(formData, 'active', payload.active ?? true);
  if (payload.image) {
    formData.append('image', payload.image);
  }
  return formData;
}

function buildTrainingFormData(payload) {
  const formData = new FormData();
  appendFormDataValue(formData, 'title', payload.title);
  appendFormDataValue(formData, 'slug', payload.slug);
  appendFormDataValue(formData, 'summary', payload.summary);
  appendFormDataValue(formData, 'description', payload.description);
  appendFormDataValue(formData, 'priceCents', payload.priceCents);
  appendFormDataValue(formData, 'currency', payload.currency);
  appendFormDataValue(formData, 'durationLabel', payload.durationLabel);
  appendFormDataValue(formData, 'modality', payload.modality);
  appendFormDataValue(formData, 'level', payload.level);
  appendFormDataValue(formData, 'syllabus', payload.syllabus);
  appendFormDataValue(formData, 'downloadFilePath', payload.downloadFilePath);
  appendFormDataValue(formData, 'active', payload.active ?? true);
  if (payload.image) {
    formData.append('image', payload.image);
  }
  return formData;
}

function resolveMediaUrl(imageUrl) {
  if (!imageUrl) {
    return imageUrl;
  }
  if (imageUrl.startsWith('/')) {
    return `${BACKEND_URL}${imageUrl}`;
  }
  return imageUrl;
}

function normalizeCatalogItem(item) {
  return item ? { ...item, imageUrl: resolveMediaUrl(item.imageUrl) } : item;
}

function normalizeTraining(training) {
  return training ? { ...training, imageUrl: resolveMediaUrl(training.imageUrl) } : training;
}

export async function fetchMyAppointments(token) {
  const response = await request(`${API_URL}/appointments/me`, {
    headers: authHeaders(token)
  });

  return parseResponse(response);
}

export async function fetchAllAppointments(token) {
  const response = await request(`${API_URL}/appointments`, {
    headers: authHeaders(token)
  });

  return parseResponse(response);
}

export async function createAppointment(token, payload) {
  const response = await request(`${API_URL}/appointments`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload)
  });

  return parseResponse(response);
}

export async function updateAppointment(token, appointmentId, payload) {
  const response = await request(`${API_URL}/appointments/${appointmentId}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(payload)
  });

  return parseResponse(response);
}

export async function cancelAppointment(token, appointmentId) {
  const response = await request(`${API_URL}/appointments/${appointmentId}`, {
    method: 'DELETE',
    headers: authHeaders(token)
  });

  return parseResponse(response);
}

export async function updateAppointmentStatus(token, appointmentId, status) {
  const response = await request(`${API_URL}/appointments/${appointmentId}/status`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ status })
  });

  return parseResponse(response);
}

export async function fetchTrainings(token) {
  const response = await request(`${API_URL}/trainings`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });

  const data = await parseResponse(response);
  return Array.isArray(data) ? data.map(normalizeTraining) : data;
}

export async function fetchTrainingBySlug(slug, token) {
  const response = await request(`${API_URL}/trainings/${slug}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });

  return normalizeTraining(await parseResponse(response));
}

export async function fetchMyTrainingPurchases(token) {
  const response = await request(`${API_URL}/trainings/purchases/me`, {
    headers: authHeaders(token)
  });

  return parseResponse(response);
}

export async function createTrainingCheckout(token, trainingId) {
  const response = await request(`${API_URL}/trainings/${trainingId}/checkout`, {
    method: 'POST',
    headers: authHeaders(token)
  });

  return parseResponse(response);
}

export async function simulateTrainingPurchase(token, purchaseId) {
  const response = await request(`${API_URL}/trainings/purchases/${purchaseId}/simulate-success`, {
    method: 'POST',
    headers: authHeaders(token)
  });

  return parseResponse(response);
}

export async function downloadTraining(token, trainingId) {
  const response = await request(`${API_URL}/trainings/${trainingId}/download`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const body = await readResponseBody(response);
    const message =
      (typeof body === 'string' && body.trim()) ||
      body?.message ||
      body?.error ||
      'No se pudo descargar la formación';
    throw new Error(message);
  }

  const blob = await response.blob();
  const contentDisposition = response.headers.get('Content-Disposition') || '';
  const match = contentDisposition.match(/filename="?([^"]+)"?/i);

  return {
    blob,
    fileName: match ? match[1] : `formacion-${trainingId}.txt`
  };
}

export async function fetchReviews(type, itemKey) {
  const params = new URLSearchParams({
    type,
    itemKey
  });
  const response = await request(`${API_URL}/reviews?${params.toString()}`);
  return parseResponse(response);
}

export async function fetchFeaturedReviews() {
  const response = await request(`${API_URL}/reviews/featured`);
  return parseResponse(response);
}

export async function fetchCatalogItems(type) {
  const params = new URLSearchParams({ type });
  const response = await request(`${API_URL}/catalog?${params.toString()}`);
  const data = await parseResponse(response);
  return Array.isArray(data) ? data.map(normalizeCatalogItem) : data;
}

export async function fetchAdminCatalogItems(token, type) {
  const params = new URLSearchParams({ type });
  const response = await request(`${API_URL}/catalog/admin?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const data = await parseResponse(response);
  return Array.isArray(data) ? data.map(normalizeCatalogItem) : data;
}

export async function createCatalogItem(token, payload) {
  const response = await request(`${API_URL}/catalog/admin`, {
    method: 'POST',
    headers: authOnlyHeaders(token),
    body: buildCatalogFormData(payload)
  });
  return normalizeCatalogItem(await parseResponse(response));
}

export async function updateCatalogItem(token, itemId, payload) {
  const response = await request(`${API_URL}/catalog/admin/${itemId}`, {
    method: 'PUT',
    headers: authOnlyHeaders(token),
    body: buildCatalogFormData(payload)
  });
  return normalizeCatalogItem(await parseResponse(response));
}

export async function deleteCatalogItem(token, itemId) {
  const response = await request(`${API_URL}/catalog/admin/${itemId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const body = await readResponseBody(response);
    const message =
      (typeof body === 'string' && body.trim()) ||
      body?.message ||
      body?.error ||
      'No se pudo borrar el elemento';
    throw new Error(message);
  }
}

export async function createReview(token, payload) {
  const response = await request(`${API_URL}/reviews`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload)
  });

  return parseResponse(response);
}

export async function fetchPendingReviews(token) {
  const response = await request(`${API_URL}/reviews/pending`, {
    headers: authHeaders(token)
  });

  return parseResponse(response);
}

export async function fetchAllAdminReviews(token) {
  const response = await request(`${API_URL}/reviews/admin`, {
    headers: authHeaders(token)
  });
  return parseResponse(response);
}

export async function updateReviewStatus(token, reviewId, status) {
  const response = await request(`${API_URL}/reviews/${reviewId}/status`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ status })
  });

  return parseResponse(response);
}

export async function fetchAdminUsers(token) {
  const response = await request(`${API_URL}/admin/users`, {
    headers: authHeaders(token)
  });
  return parseResponse(response);
}

export async function deleteAdminUser(token, userId) {
  const response = await request(`${API_URL}/admin/users/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const body = await readResponseBody(response);
    const message =
      (typeof body === 'string' && body.trim()) ||
      body?.message ||
      body?.error ||
      'No se pudo borrar el usuario';
    throw new Error(message);
  }
}

export async function deleteAdminAppointment(token, appointmentId) {
  const response = await request(`${API_URL}/appointments/admin/${appointmentId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const body = await readResponseBody(response);
    const message =
      (typeof body === 'string' && body.trim()) ||
      body?.message ||
      body?.error ||
      'No se pudo borrar la cita';
    throw new Error(message);
  }
}

export async function fetchAdminTrainings(token) {
  const response = await request(`${API_URL}/admin/trainings`, {
    headers: authHeaders(token)
  });
  const data = await parseResponse(response);
  return Array.isArray(data) ? data.map(normalizeTraining) : data;
}

export async function createAdminTraining(token, payload) {
  const response = await request(`${API_URL}/admin/trainings`, {
    method: 'POST',
    headers: authOnlyHeaders(token),
    body: buildTrainingFormData(payload)
  });
  return normalizeTraining(await parseResponse(response));
}

export async function updateAdminTraining(token, trainingId, payload) {
  const response = await request(`${API_URL}/admin/trainings/${trainingId}`, {
    method: 'PUT',
    headers: authOnlyHeaders(token),
    body: buildTrainingFormData(payload)
  });
  return normalizeTraining(await parseResponse(response));
}

export async function deleteAdminTraining(token, trainingId) {
  const response = await request(`${API_URL}/admin/trainings/${trainingId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const body = await readResponseBody(response);
    const message =
      (typeof body === 'string' && body.trim()) ||
      body?.message ||
      body?.error ||
      'No se pudo borrar la formación';
    throw new Error(message);
  }
}
