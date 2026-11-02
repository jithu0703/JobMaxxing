# Velai-Vaaippu: Project Overview

## Introduction
Velai-Vaaippu is a full-stack job board and job aggregation platform. It provides a platform for users (students and admins) to view job listings, save/like jobs, manage profiles, and view company profiles. The backend also supports automated web scraping (e.g., Internshala) to populate the database with real-world job listings.

## Tech Stack

### Frontend (Client)
- **Framework:** React (v19)
- **Build Tool:** Vite
- **Routing:** React Router v7
- **HTTP Client:** Axios
- **Styling:** CSS
- **Code Quality:** ESLint

### Backend (API)
- **Framework:** Flask (Python 3)
- **Database:** MySQL
- **ORM:** SQLAlchemy (Flask-SQLAlchemy)
- **Database Migrations:** Alembic (Flask-Migrate)
- **Authentication:** JWT (Flask-JWT-Extended)
- **Web Scraping:** BeautifulSoup4, Requests
- **CORS:** Flask-CORS

## Architecture
The application uses a standard decoupled client-server architecture:
- **Client (`/client`):** A Single Page Application (SPA) built with React that communicates with the API via RESTful JSON endpoints.
- **API Server (`/api`):** A Flask application serving REST APIs. It connects to a MySQL database to handle CRUD operations and executes scraping scripts to aggregate jobs.

## Core Features
1. **User Authentication:** Registration and login using JWT. Supports roles (e.g., `student`).
2. **Job Browsing:** View listed jobs, with details like location, salary, type, and apply URLs.
3. **Job Interactions:** Users can "like" jobs and view them in a dedicated Liked Jobs page.
4. **Company Directory:** View companies and their associated job openings.
5. **Job Aggregation (Scraping):** Admins can trigger scraping scripts to pull jobs from external sites (like Internshala) into the database.
6. **Profile Management:** Users can manage their profile and resume links.

## Setup Instructions

### Backend Setup
1. Navigate to `/api`
2. Create and activate a virtual environment (`python -m venv venv`, `source venv/bin/activate` or `venv\Scripts\activate`)
3. Install dependencies: `pip install -r requirements.txt`
4. Setup MySQL Database: Create a database named `vv_db` and a user. Update the `SQLALCHEMY_DATABASE_URI` in `.env` or `api.py`.
5. Run migrations: `flask db upgrade`
6. Run the server: `flask run`

### Frontend Setup
1. Navigate to `/client`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
*(Note: There is a convenient `npm run api` script in package.json to start the Flask backend directly from the client folder)*
