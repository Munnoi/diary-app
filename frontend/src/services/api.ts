const BASE_URL = "http://127.0.0.1:8000/api";

type FetchOptions = RequestInit & { auth?: boolean };

async function refreshAccessToken() {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) {
    throw new Error("No refresh token available");
  }

  const response = await fetch(`${BASE_URL}/auth/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh access token");
  }

  const data = await response.json();
  localStorage.setItem("access", data.access);
  return data.access as string;
}

export async function apiFetch(path: string, options: FetchOptions = {}) {
  const { auth = true, headers, ...rest } = options;
  const access = localStorage.getItem("access");

  const finalHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(headers || {}),
    ...(auth && access ? { Authorization: `Bearer ${access}` } : {}),
  };

  let res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
  });

  if (res.status === 401 && auth) {
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      res = await fetch(`${BASE_URL}${path}`, {
        ...rest,
        headers: {
          ...finalHeaders,
          Authorization: `Bearer ${newAccess}`,
        },
      });
    }
  }

  return res;
}

export async function login(username: string, password: string) {
  const response = await apiFetch("/auth/login/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
    auth: false,
  });

  const data = await response.json();
  if (!response.ok || !data.access || !data.refresh) {
    throw new Error(`Login failed: ${JSON.stringify(data)}`);
  }
  localStorage.setItem("access", data.access);
  localStorage.setItem("refresh", data.refresh);
}

export async function register(username: string, password: string) {
  const response = await apiFetch("/auth/register/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
    auth: false,
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  }
}

export async function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}
