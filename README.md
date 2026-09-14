# Enterprise MySQL & Backend Engineering Ecosystem: Raw SQL to Modern ORMs 🚀🛡️

Welcome to my advanced backend engineering workspace! This repository documents an exhaustive reference environment for high-performance relational database architecture. It scales sequentially from raw connection adapters to modern type-safe ORMs (**Prisma** and **Drizzle**), implementing production-grade authentication systems, data pipelines, secure asset ingestion frameworks, and enterprise-grade validation patterns.

## 📂 Architectural Directory Map

The ecosystem isolates core database connectivity models from fully realized, feature-dense Model-View-Controller web applications:

```text
├── 01) MySQL/                              # Native client database connectivity & raw SQL scripting
├── 02) Prisma_MySQL/                       # Type-safe object mapping schemas & database migration setups
├── 03) Drizzle_MySQL/                      # Ultra-lightweight TypeScript-first schema definitions
├── 04) Project URL Shortener with Prisma/  # Full-scale URL Shortener powered by Prisma ORM
└── 05) Project URL Shortener with Drizzle/ # Full-scale URL Shortener powered by Drizzle ORM & Advanced Middleware
```

---

## 🛠️ Comprehensive Feature Matrix

### 1. Relational Database Engineering (`SQL`, `Prisma`, `Drizzle`)
* **Raw SQL Foundation:** Advanced query structuring spanning transaction rollbacks, custom execution indexing, engine optimizations, and complex multi-table joins (`INNER`, `LEFT`, `RIGHT`).
* **Prisma ORM Pipeline:** Declarative modeling workflows utilizing native migration engines, structural data seeds, automated connection pooling, and the dynamic `PrismaClient` data proxy.
* **Drizzle ORM Integration:** High-performance TypeScript-first relational design patterns using explicit structural schemas, quick migration scripts, and highly optimized query generation blocks.

### 2. Deep-Dive Authentication & Cyber-Security
* **Hybrid Auth Architectures:** Concurrently managing persistent web state topologies using Stateful Sessions alongside Stateless **JWT (JSON Web Tokens)** containing dual Access & Refresh token cycles over HttpOnly cookies.
* **Cryptographic Hashing:** Military-grade credential defenses utilizing variable salt profiles via **Bcrypt** and computationally intensive **Argon2** algorithms.
* **Multi-Provider OAuth Integration:** Decoupled passportless social entries utilizing standard Authorization Code Grants to interface securely with **Google Account Services** and **GitHub Developer Portals** (including downstream manual password creation flows).
* **Account Lifecycle Security:** Time-restricted password reset matrices using one-time cryptographic tokens, multi-stage state validators, and forced verification procedures.

### 3. Verification & Ingestion Engine
* **Zod Data Sanitization:** Strict request validation middleware capturing malformed JSON vectors, parameter tampering, and body formatting exceptions before they reach the controller database queue.
* **Multer File Streams:** Secure multipart/form-data interceptor handling image uploads, validating file headers, generating real-time UI thumbnail previews, and cleansing local disk trees during target deletion cycles.
* **Transactional Mail Delivery:** Automated notification pipelines leveraging **Nodemailer**, **Ethereal sandbox spaces**, and production **Resend** nodes driven by clean, professional **MJML templates** for account verifications and token distributions.

### 4. Advanced Frontend UX Support
* **EJS Architecture:** Dynamic component templating backed by functional navigation routing, profile interfaces, server-flash alerting triggers, and sleek visual styling choices handled natively via **Tailwind CSS v4**.

---

## 🏗️ Tech Stack Summary

* **Backends:** Node.js, Express.js (Advanced Middleware Chains)
* **Databases:** MySQL (Workbench Core / Remote Connection Strings)
* **Data Layers:** Prisma ORM, Drizzle ORM, Native `mysql2` client
* **Security & Invalidation:** JWT, Express-Session, Bcrypt, Argon2, Cookie-Parser
* **Validation & Formatting:** Zod, Tailwind CSS v4, MJML, Multer

---

## 🏃‍♂️ Local Installation and Setup

Follow these configuration sequences to establish individual execution nodes or fire up the main platforms locally:

### 1. Clone the Target Repository
```bash
git clone https://github.com
cd MySQL-2026
```

### 2. Install Dependency Clusters
Run install sequences inside whichever project directory node you plan to execute:
```bash
cd "04) Project URL Shortener with Prisma"
npm install
```

### 3. Establish Your Database & Secrets Environment
Create a dedicated local `.env` file within your active folder layer. Use these key-value configurations:
```env
PORT=3000
DATABASE_URL="mysql://db_user:db_password@localhost:3306/shortener_db"
JWT_SECRET="your_high_entropy_access_token_string"
JWT_REFRESH_SECRET="your_high_entropy_refresh_token_string"
GOOGLE_CLIENT_ID="your_google_oauth_://googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_google_oauth_secret_hash"
GITHUB_CLIENT_ID="your_github_oauth_id"
GITHUB_CLIENT_SECRET="your_github_oauth_secret_hash"
RESEND_API_KEY="re_your_live_email_delivery_hash"
```

### 4. Execute Relational Migrations & Launch Servers
```bash
# Push database schemas to your live MySQL local engine
npx prisma db push  # For Prisma instances
# OR 
npx drizzle-kit push  # For Drizzle instances

# Fire up the application runtime
node app.js
```
*Open your web browser and navigate directly to `http://localhost:3000` to evaluate the interface systems live!*

## 🛡️ Applied Enterprise Architecture
* **Strict Separation of Concerns:** Route handling matrices, controller blocks, services, operational validation schemas, and database instances are decoupled into single-responsibility directory profiles.
* **Defensive Error Middleware:** Centralized try-catch safety middleware shields stack traces from standard end-user view windows while writing detailed logs to the console terminal.
* **Credential Isolation Block:** Connection hashes are entirely abstracted out of configuration modules to remain resilient against repository exposure risks.

## 📄 License
This ecosystem is open-source and available under the [MIT License](LICENSE).
