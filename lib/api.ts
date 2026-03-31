// lib/api.ts
// তোমার backend app.ts অনুযায়ী সব custom route: /api/v1/...
// Better Auth session cookie automatically যাবে credentials: "include" দিয়ে

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
// .env.local: NEXT_PUBLIC_API_URL=https://your-backend.render.com/api/v1

async function request(path: string, options: RequestInit = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        credentials: "include", // Better Auth session cookie পাঠাবে
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
}

// ====== MEDIA (movies/series) ======
// backend: /api/v1/media
export const media = {
    getAll: (params?: Record<string, string>) => {
        const query = params ? "?" + new URLSearchParams(params).toString() : "";
        return request(`/media${query}`);
    },
    getById: (id: string) => request(`/media/${id}`),
    create: (data: any) =>
        request("/media", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
        request(`/media/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
        request(`/media/${id}`, { method: "DELETE" }),
};

// ====== REVIEWS ======
// backend: /api/v1/reviews
export const reviews = {
    getByMedia: (mediaId: string) => request(`/reviews?mediaId=${mediaId}`),
    create: (data: {
        mediaId: string;
        rating: number;
        review: string;
        spoiler: boolean;
        tags: string[];
    }) => request("/reviews", { method: "POST", body: JSON.stringify(data) }),
    update: (reviewId: string, data: any) =>
        request(`/reviews/${reviewId}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (reviewId: string) =>
        request(`/reviews/${reviewId}`, { method: "DELETE" }),
    approve: (reviewId: string) =>
        request(`/reviews/${reviewId}/approve`, { method: "PATCH" }),
    reject: (reviewId: string) =>
        request(`/reviews/${reviewId}/reject`, { method: "PATCH" }),
    like: (reviewId: string) =>
        request(`/reviews/${reviewId}/like`, { method: "POST" }),
    unlike: (reviewId: string) =>
        request(`/reviews/${reviewId}/like`, { method: "DELETE" }),
};

// ====== WATCHLIST ======
// backend: /api/v1/watchlist
export const watchlist = {
    get: () => request("/watchlist"),
    add: (mediaId: string) =>
        request("/watchlist", { method: "POST", body: JSON.stringify({ mediaId }) }),
    remove: (mediaId: string) =>
        request(`/watchlist/${mediaId}`, { method: "DELETE" }),
};

// ====== PAYMENT ======
// backend: /api/v1/payment
export const payments = {
    createCheckout: (planType: "monthly" | "yearly") =>
        request("/payment/checkout", {
            method: "POST",
            body: JSON.stringify({ planType }),
        }),
    getHistory: () => request("/payment/history"),
};

// ====== USERS (admin) ======
// backend: /api/v1/users
export const users = {
    getAll: () => request("/users"),
    getById: (id: string) => request(`/users/${id}`),
    updateRole: (id: string, role: "USER" | "ADMIN") =>
        request(`/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role }) }),
    delete: (id: string) =>
        request(`/users/${id}`, { method: "DELETE" }),
};

// ====== AUTH (custom routes) ======
// backend: /api/v1/auth (তোমার নিজের authRoutes, Better Auth নয়)
export const authApi = {
    getProfile: () => request("/auth/profile"),
    updateProfile: (data: any) =>
        request("/auth/profile", { method: "PUT", body: JSON.stringify(data) }),
};
