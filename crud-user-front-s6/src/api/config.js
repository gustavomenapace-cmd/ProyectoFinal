export const API_BASE_URL = 'http://localhost:7000';

export async function request(endpoint, options = {}) {
  const { token, body, ...customConfig } = options;

  const headers = {
    'Content-Type': 'application/json',
    ...customConfig.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      let errorMessage = (data && data.message) || 'Error en la solicitud al servidor';
      if (data && data.errors && Array.isArray(data.errors)) {
        const details = data.errors.map(e => e.message || e).join(', ');
        errorMessage += `: ${details}`;
      }
      const err = new Error(errorMessage);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('No se pudo conectar con el servidor Backend (http://localhost:7000). Verifique que esté encendido.');
    }
    throw error;
  }
}
