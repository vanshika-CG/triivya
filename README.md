# ✨ Triivya: Modern E-commerce Web Application

![Triivya Banner](https://via.placeholder.com/1200x400/007bff/ffffff?text=Triivya+E-commerce+Platform)

## 🚀 Overview

**Triivya** is a cutting-edge, fully-featured e-commerce and web application designed for high performance, scalability, and an exceptional user experience. Built on the **Next.js App Router**, it provides a comprehensive and intuitive platform for product discovery, secure user authentication, efficient cart management, and robust administrative control.

This application is meticulously structured to handle all major aspects of a transactional website, offering a seamless journey from browsing products to order fulfillment.

## ✨ Key Features

Triivya comes packed with functionalities to create a rich e-commerce ecosystem.

### User-Facing (Client)

Experience a smooth and intuitive shopping journey:

* **Product Catalog & Details:** Browse through a diverse range of products, view high-quality images, detailed descriptions, and customer reviews.
    ![Product Listing](https://via.placeholder.com/800x450/28a745/ffffff?text=Dynamic+Product+Listing)
* **Intuitive Shopping Cart:** Easily add, remove, and manage items in your cart, with real-time updates on totals.
* **Personalized Wishlist:** Save your favorite products for later, making future shopping effortless.
* **Secure Checkout Flow:** A streamlined and secure process from cart to payment, with order confirmation.
    ![Checkout Flow](https://via.placeholder.com/800x450/ffc107/000000?text=Secure+Checkout+Process)
* **Robust User Authentication:** Seamless and secure login, registration, and password recovery.
* **Comprehensive User Account Management:** Access and update personal profiles, addresses, and order history.
* **Real-time Order Tracking:** Stay updated on the status of your purchases from dispatch to delivery.
* **Informational & Legal Pages:** Dedicated sections for "About Us," "Contact," "FAQ," "Privacy Policy," and "Terms & Conditions" to build trust and transparency.

### Administrative (Dashboard)

Empowering administrators with powerful tools to manage the platform:

* **Secure Admin Login:** A dedicated and protected portal for administrative access.
* **Intuitive Admin Dashboard:** A central hub for managing products, orders, users, categories, and more.
    ![Admin Dashboard](https://via.placeholder.com/800x450/dc3545/ffffff?text=Powerful+Admin+Dashboard)
* **(Potential) Product Management:** Add, edit, and remove products with ease.
* **(Potential) Order Management:** View and update order statuses, manage shipments, and handle returns.
* **(Potential) User Management:** Monitor user accounts and manage roles.

## 🛠️ Tech Stack

Triivya is built on a modern, high-performance stack, ensuring scalability, maintainability, and a top-tier developer experience.

| Category          | Technology                                         | Key Dependencies/Features                                                                       |
| :---------------- | :------------------------------------------------- | :---------------------------------------------------------------------------------------------- |
| **Framework** | **Next.js 15+** | App Router, Server Components, Routing, Image Optimization                                      |
| **Language** | **TypeScript** | Static typing for improved code quality, readability, and maintainability.                      |
| **Frontend** | **React 19+** | Declarative, component-based UI development for a dynamic user interface.                       |
| **Styling** | **Tailwind CSS** | Utility-first CSS framework for rapid and consistent styling.                                   |
| **UI Components** | **shadcn/ui** (built on Radix UI)                  | Accessible, customizable, and reusable UI components.                                           |
| **Data Fetching** | **TanStack Query (React Query)** | Efficient data fetching, caching, synchronization, and global state management.                 |
| **Form Handling** | **React Hook Form & Zod** | Powerful form validation and state management.                                                  |
| **HTTP Client** | **Axios** | Promise-based HTTP client for robust API interactions.                                          |
| **Package Mgr.** | **pnpm** (recommended, as per `pnpm-lock.yaml`)    | Fast, disk space efficient package manager.                                                     |
| **Linting** | **ESLint** | Maintain code quality and consistent styling.                                                   |
| **Formatting** | **Prettier** | Automated code formatting for a unified codebase.                                               |

## 📁 Project Structure

```text
triivya/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public-facing routes
│   │   ├── page.tsx              # Home page
│   │   ├── about/                # About Us
│   │   ├── contact/              # Contact Us
│   │   └── faq/                  # FAQs
│   │
│   ├── (auth)/                   # Authentication routes (route group)
│   │   ├── login/                # User login
│   │   └── register/             # User registration
│   │
│   ├── (user)/                   # Logged-in user routes
│   │   ├── account/              # Account overview
│   │   ├── profile/              # Profile management
│   │   ├── wishlist/             # Wishlist
│   │   ├── track-order/          # Order tracking
│   │   └── order-confirmation/   # Post-checkout confirmation
│   │
│   ├── admin/                    # Admin panel (protected)
│   │   ├── login/                # Admin login
│   │   └── dashboard/            # Admin dashboard
│   │
│   ├── cart/                     # Shopping cart
│   ├── checkout/                 # Checkout flow
│   │
│   ├── products/                 # Product routes
│   │   ├── page.tsx              # Product listing
│   │   ├── [id]/                 # Dynamic product details
│   │   └── ProductsContent.tsx   # Product list logic
│   │
│   ├── policies/                 # Legal & policy pages
│   │   ├── privacy-policy/
│   │   ├── terms-conditions/
│   │   └── return-refund-policy/
│   │
│   ├── context/                  # App-level contexts
│   │   └── AuthContext.tsx        # Authentication context
│   │
│   ├── globals.css               # Global styles
│   └── layout.tsx                # Root layout
│
├── components/                   # Reusable UI components
│   ├── ui/                       # shadcn/ui base components
│   └── common/                   # App-specific components
│       ├── navbar.tsx
│       ├── footer.tsx
│       ├── category-showcase.tsx
│       ├── PaymentButton.tsx
│       └── ProtectedLayout.tsx
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts
│   ├── useCart.ts
│   └── useWishlist.ts
│
├── lib/                          # Core utilities & configuration
│   ├── api.ts                    # Axios API instance
│   └── utils.ts                  # Shared helpers
│
├── public/                       # Static assets
│   └── images/
│
├── .gitignore
├── next.config.mjs               # Next.js config
├── postcss.config.mjs            # PostCSS config
├── tailwind.config.ts            # Tailwind config
├── tsconfig.json                 # TypeScript config
├── package.json
└── pnpm-lock.yaml
```

**Why this structure is better**

* Uses **route groups** `(auth)`, `(user)`, `(public)` for clarity
* Groups **policies** and **user flows** logically
* Separates **ui** vs **common components**
* Scales cleanly as the app grows

The project strictly adheres to the Next.js App Router conventions, promoting clear separation of concerns and maintainability.
## ⚙️ Getting Started

Follow these instructions to set up and run Triivya on your local development environment.

### Prerequisites

Ensure you have the following software installed:

* **Node.js**: [Download & Install Node.js (LTS)](https://nodejs.org/en/download/)
* **pnpm**: Recommended package manager. Install via `npm install -g pnpm`

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/vanshika-CG/triivya.git](https://github.com/vanshika-CG/triivya.git)
    cd triivya
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    # Or if you prefer npm:
    # npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root of the project.
    ```
    # Example environment variables (adjust as needed for your backend/APIs)
    NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
    # NEXTAUTH_SECRET=YOUR_NEXTAUTH_SECRET_HERE
    ```
    *Replace placeholders with your actual values.*

### Running the Application

1.  **Start the development server:**
    ```bash
    pnpm dev
    # Or:
    # npm run dev
    ```

2.  **Access the application:**
    Open your web browser and navigate to `http://localhost:3000`.

## 🤝 Contributing

We welcome contributions from the community\! If you'd like to contribute to Triivya, please follow these guidelines:

1.  **Fork** the repository.
2.  **Clone** your forked repository.
3.  Create a new **feature branch** (`git checkout -b feature/your-feature-name`).
4.  Make your changes and ensure tests pass (if any).
5.  **Commit** your changes with a descriptive message (`git commit -m 'feat: Add amazing new feature'`).
6.  **Push** your branch (`git push origin feature/your-feature-name`).
7.  Open a **Pull Request** to the `main` branch of the original repository.

Please ensure your code adheres to the project's coding standards and includes appropriate tests.

## 📄 License

This project is open-sourced under the **MIT License**. See the `LICENSE` file (if present, otherwise assume MIT for open-source projects) for more details.

---
