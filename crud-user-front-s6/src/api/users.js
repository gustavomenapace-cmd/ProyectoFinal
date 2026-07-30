import { request } from './config.js';

export async function getUsersApi(token, queryParams = {}) {
  const query = new URLSearchParams(queryParams).toString();
  const endpoint = `/users${query ? `?${query}` : ''}`;
  return await request(endpoint, {
    method: 'GET',
    token,
  });
}

export async function createUserApi(token, userData) {
  return await request('/users', {
    method: 'POST',
    token,
    body: userData,
  });
}

export async function updateUserApi(token, id, userData) {
  return await request(`/users/${id}`, {
    method: 'PUT',
    token,
    body: userData,
  });
}

export async function deleteUserApi(token, id) {
  return await request(`/users/${id}`, {
    method: 'DELETE',
    token,
  });
}
