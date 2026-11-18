async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || 'Не удалось выполнить запрос.');
  }
  return payload;
}

export const api = {
  async getReviews() {
    const data = await request('/api/reviews');
    return data.reviews;
  },
  async addReview(review) {
    const data = await request('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(review),
    });
    return data.review;
  },
  async updateStatus(id, status) {
    const data = await request(`/api/reviews/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return data.review;
  },
  async updateCategory(id, category) {
    const data = await request(`/api/reviews/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ category }),
    });
    return data.review;
  },
  async deleteReview(id) {
    const data = await request(`/api/reviews/${id}`, { method: 'DELETE' });
    return data.deleted;
  },
  async reset() {
    const data = await request('/api/reset', { method: 'POST' });
    return data.reviews;
  },
};