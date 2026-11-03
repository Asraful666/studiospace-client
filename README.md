# StudioSpace

A peer-to-peer creative workspace booking application for photography
studios, film stages, podcast lounges, music suites, and workshops.

> Educational demonstration. No online payments, insurance coverage,
> independent identity verification, or staffed 24/7 support are provided.


## Repositories

- Client: https://github.com/Asraful666/studiospace-client
- Server: https://github.com/Asraful666/studiospace-server

## Features

- Responsive interface with light and dark themes.
- Three-slide hero, dynamic featured studios, and category navigation.
- Studio search, category filtering, sorting, and pagination.
- Email/password and Google authentication through Better Auth.
- Protected studio creation with ImgBB image uploads.
- Owner-only studio editing and deletion with confirmation dialogs.
- Booking requests with server-calculated rental prices and deposits.
- Personal booking history and cancellation of Pending requests.
- Host confirmation, rejection, and completion of booking requests.
- Transaction-based prevention of overlapping confirmed bookings.
- Reviews from guests with Completed bookings and automatic rating updates.
- Session-bound JWT protection using HTTPOnly cookies.
- Public newsletter interest registration with duplicate prevention.
- Loading skeletons, empty states, custom 404 pages, and toast feedback.

## Technology Stack

### Frontend

- Next.js App Router
- React
- JavaScript
- Tailwind CSS
- DaisyUI
- Swiper
- Lucide React and inline brand SVG icons
- React Hot Toast
- next-themes

### Backend

- Node.js
- Express
- MongoDB
- Better Auth with MongoDB adapter
- JSON Web Tokens
- Multer and ImgBB
- express-rate-limit

## Local Setup

### 1. Clone the repositories

```bash
git clone https://github.com/Asraful666/studiospace-client.git
git clone https://github.com/Asraful666/studiospace-server.git
```

### 2. Configure and start the server

Open a terminal in `studiospace-server`:

```bash
npm install
```

Create `.env` using the server's `.env.example` as a reference.
Supply your MongoDB connection, authentication secrets, Google OAuth
credentials, and ImgBB API key.

Use a MongoDB deployment that supports transactions, such as the
MongoDB Atlas deployment used by this project.

```bash
npm run dev
```

Local API: http://localhost:8000

Health check: http://localhost:8000/api/health

### 3. Configure and start the client

Open another terminal in `studiospace-client`:

```bash
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the client:

```bash
npm run dev
```

Local website: http://localhost:3000

Use `localhost` consistently for both applications during local testing.

### 4. Google OAuth configuration

For local development:

- Authorized JavaScript origin: `http://localhost:3000`
- Authorized redirect URI:
  `http://localhost:8000/api/auth/callback/google`

## Validation Commands

Run in the client repository:

```bash
npm run lint
npm run build
```

Run in the server repository:

```bash
node --check index.js
```

These commands do not replace end-to-end authentication, booking,
authorization, and concurrency tests.

## Examiner Test Accounts

These accounts must be registered in the database used by the running API.

| Purpose | Email | Password |
| --- | --- | --- |
| Host | host@studiospace.example | REPLACE_WITH_CREATED_HOST_DEMO_PASSWORD |
| Guest | guest@studiospace.example | REPLACE_WITH_CREATED_GUEST_DEMO_PASSWORD |

These are demonstration accounts containing test data only.

### Suggested test flow

1. Sign in as the host and open My Listings.
2. Open the Examiner Demo Studio.
3. Sign in as the guest in a separate browser session.
4. Request a future booking for the host's studio.
5. Return to the host account and open Booking Requests.
6. Confirm or reject the request.
7. Refresh the guest's My Bookings page to inspect the status.
8. Confirmed sessions can be completed only after their scheduled end.
9. A guest can publish one review for each Completed booking.

## Main Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Home |
| `/studios` | Public | Explore studios |
| `/studios/[id]` | Public | Studio details and reviews |
| `/login` | Public | Login |
| `/register` | Public | Registration |
| `/dashboard` | Private | Account workspace |
| `/add-studio` | Private | Create a studio |
| `/my-listings` | Private | Manage owned studios |
| `/studios/edit/[id]` | Private | Edit an owned studio |
| `/my-bookings` | Private | Guest booking history |
| `/host-bookings` | Private | Host booking management |
| `/terms` | Public | Platform notice |

## Booking Rules

- All booking times use Bangladesh time (`Asia/Dhaka`).
- Sessions use full hours within one calendar day.
- New requests start as `Pending`.
- Guests can cancel their own Pending requests.
- Hosts can confirm or reject Pending requests.
- Overlapping Confirmed reservations are blocked.
- Hosts can mark Confirmed bookings Completed after the end time.
- Each Completed booking permits one guest review.
- Studios with booking history cannot be deleted.

## Security

- Private API access requires a valid Better Auth session and matching JWT.
- JWTs are stored in HTTPOnly cookies.
- The server checks ownership and booking status before mutations.
- The server derives user identity from authentication, not request-body email.
- Booking prices are calculated from database values.
- Review submission and rating updates run within a transaction.
- Secrets belong in server environment variables and are not committed.

## Current Limitations

- No payment collection, deposit holding, refunds, or payouts.
- Newsletter registration stores interest only; emails are not sent.
- No independent identity verification or insurance coverage.
- Confirmed booking cancellation is not available.
- PDF invoices and saved-studio wishlists are not implemented.
- Demo listings are fictional and use illustrative photography.

## Author

Md Asraful Islam

GitHub: https://github.com/Asraful666