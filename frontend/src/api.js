const API_URL = 'http://localhost:8080/api';

async function parseResponse(response) {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Ha ocurrido un error inesperado');
  }

  return response.json();
}

export async function login(credentials) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });

  return parseResponse(response);
}

export async function registerUser(payload) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return parseResponse(response);
}

export async function fetchProfile(token) {
  const response = await fetch(`${API_URL}/user/me`, {
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

export async function fetchMyAppointments(token) {
  const response = await fetch(`${API_URL}/appointments/me`, {
    headers: authHeaders(token)
  });

  return parseResponse(response);
}

export async function fetchAllAppointments(token) {
  const response = await fetch(`${API_URL}/appointments`, {
    headers: authHeaders(token)
  });

  return parseResponse(response);
}

export async function createAppointment(token, payload) {
  const response = await fetch(`${API_URL}/appointments`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload)
  });

  return parseResponse(response);
}

export async function updateAppointment(token, appointmentId, payload) {
  const response = await fetch(`${API_URL}/appointments/${appointmentId}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(payload)
  });

  return parseResponse(response);
}

export async function cancelAppointment(token, appointmentId) {
  const response = await fetch(`${API_URL}/appointments/${appointmentId}`, {
    method: 'DELETE',
    headers: authHeaders(token)
  });

  return parseResponse(response);
}

export async function updateAppointmentStatus(token, appointmentId, status) {
  const response = await fetch(`${API_URL}/appointments/${appointmentId}/status`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ status })
  });

  return parseResponse(response);
}
