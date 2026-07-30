import { request } from './config.js';

export async function loginApi({ email, password }) {
  return await request('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}
