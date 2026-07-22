const API_BASE_URL = "http://localhost:3001/api";

async function handleResponse(response) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.message || "Something went wrong");
  }
  return body.data;
}

// ---- Users ----
export function fetchUsers() {
  return fetch(`${API_BASE_URL}/users`).then(handleResponse);
}

export function createUser(username) {
  return fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  }).then(handleResponse);
}

export function deleteUser(id) {
  return fetch(`${API_BASE_URL}/users/${id}`, {
    method: "DELETE",
  }).then(handleResponse);
}

// ---- Entries ----
export function fetchEntries(userId, filters = {}) {
  const params = new URLSearchParams({ userId });
  if (filters.type) params.set("type", filters.type);
  if (filters.status) params.set("status", filters.status);
  if (filters.search) params.set("search", filters.search);
  if (filters.sort) params.set("sort", filters.sort);
  return fetch(`${API_BASE_URL}/entries?${params}`).then(handleResponse);
}

export function fetchEntry(id) {
  return fetch(`${API_BASE_URL}/entries/${id}`).then(handleResponse);
}

export function createEntry(entry) {
  return fetch(`${API_BASE_URL}/entries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  }).then(handleResponse);
}

export function updateEntry(id, changes) {
  return fetch(`${API_BASE_URL}/entries/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes),
  }).then(handleResponse);
}

export function deleteEntry(id) {
  return fetch(`${API_BASE_URL}/entries/${id}`, {
    method: "DELETE",
  }).then(handleResponse);
}