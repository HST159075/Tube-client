
# CineRate — Frontend (Next.js 14)



---

## 🗺️ Route Map (backend ↔ frontend)

| Backend (app.ts) | Frontend কী করে |
|---|---|
| `POST /api/auth/sign-in/email` | `signIn.email()` — Better Auth client |
| `POST /api/auth/sign-up/email` | `signUp.email()` — Better Auth client |
| `GET /api/v1/media` | `media.getAll()` — lib/api.ts |
| `GET /api/v1/media/:id` | `media.getById(id)` |
| `POST /api/v1/reviews` | `reviews.create(data)` |
| `GET /api/v1/watchlist` | `watchlist.get()` |
| `POST /api/v1/payment/checkout` | `payments.createCheckout()` |
| `GET /api/v1/users` | `users.getAll()` — admin only |

---



```env
# Better Auth → backend root (client appends /api/auth/*)
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Custom API routes → /api/v1/...
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

---

## 📦 Install

```bash
npm install better-auth
npm run dev
```

---



```ts
app.all("/api/auth/*all", toNodeHandler(auth));
```

Frontend client:
```ts
// lib/auth-client.ts
createAuthClient({ baseURL: "http://localhost:5000" })
// → calls http://localhost:5000/api/auth/sign-in/email ✅
```

Session hooks:
```tsx
const { data: session } = useSession();
const user = session?.user;
// user.role === "ADMIN" — তোমার additionalField
// user.status === "ACTIVE"
// user.phone
```

---


```ts
// বর্তমান (সমস্যা):
origin: "https://chine-tube.vercel.app"

// ঠিক করো:
origin: ["https://chine-tube.vercel.app", "http://localhost:3000"],
credentials: true,
```


---

## 📁 Structure

```
tube-client/
├── app/
│   ├── page.tsx                  # Home
│   ├── layout.tsx                # Root layout + Navbar
│   ├── globals.css
│   ├── (auth)/
│   │   ├── login/page.tsx        # signIn.email()
│   │   └── register/page.tsx     # signUp.email()
│   ├── movies/
│   │   ├── page.tsx              # Browse + filter
│   │   └── [id]/page.tsx         # Detail + reviews
│   ├── subscription/page.tsx     # Plans
│   └── admin/
│       └── dashboard/page.tsx    # Admin panel
├── components/
│   └── Navbar.tsx                # useSession hook
└── lib/
    ├── auth-client.ts            # Better Auth createAuthClient
    └── api.ts                    # /api/v1/* calls
```
