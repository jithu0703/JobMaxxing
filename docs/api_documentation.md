# API & Database Documentation

## Database Schema (SQLAlchemy Models)

The backend uses MySQL with SQLAlchemy as the ORM. The models are defined in `api/models.py`.

### 1. `User` (`users` table)
- `user_id` (PK)
- `username` (String, unique)
- `email` (String, unique)
- `password_hash` (String) - Hashed with Werkzeug
- `role` (String) - Default: "student"
- `resume_link` (String)
- **Relationships:** Many-to-Many with `Job` via `user_likes_job` table.

### 2. `Company` (`companies` table)
- `company_id` (PK)
- `company_name` (String, unique)
- **Relationships:** One-to-Many with `Job` and `JobSource`.

### 3. `JobSource` (`job_sources` table)
- `source_id` (PK)
- `company_id` (FK to `companies.company_id`)
- `source_type` (String)
- `source_url` (String)

### 4. `Job` (`jobs` table)
- `job_id` (PK)
- `title`, `location`, `salary`, `type`, `description`, `apply_url` (Strings/Text)
- `company_id` (FK to `companies`)
- `source_id` (FK to `job_sources`)
- `posted_date`, `deadline` (Date)
- `is_active` (Boolean)
- **Relationships:** Many-to-Many with `User` (likes).

### 5. `user_likes_job` (Association Table)
- `user_id` (FK to `users`)
- `job_id` (FK to `jobs`)
- `liked_at` (DateTime)

## API Structure (Flask Blueprints)

The API is modularized into several Flask Blueprints:

- **`auth_bp` (`/api/routes/auth.py`):** Handles user registration, login, and JWT token issuance.
- **`jobs_bp` (`/api/routes/jobs.py`):** Endpoints for fetching, creating, and liking jobs.
- **`company_bp` (`/api/routes/companies.py`):** Endpoints for fetching company details and their jobs.
- **`dashboard_bp` (`/api/routes/dashboard.py`):** Analytics and data for the admin or user dashboard.
- **`profile_bp` (`/api/routes/profile.py`):** User profile management and resume uploads/links.
- **`scrape_bp` (`/api/routes/scrape.py`):** Triggers BeautifulSoup scraping scripts (e.g., from Internshala) and saves the data to the database.

## Authentication
Authentication is stateless using JSON Web Tokens (JWT).
- **Token Location:** Headers
- **Header Name:** `Authorization`
- **Header Format:** `Bearer <token>`
- Configured using `Flask-JWT-Extended` with the secret key.
