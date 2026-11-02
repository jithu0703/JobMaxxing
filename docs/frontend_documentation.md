# Frontend Architecture & Documentation

## Overview
The frontend is a Single Page Application (SPA) built with React 19 and Vite. It utilizes React Router for client-side navigation and Axios for making API requests to the Flask backend.

## Directory Structure
- **`src/api/`**: Contains Axios configurations or API service functions for communicating with the backend endpoints.
- **`src/components/`**: Reusable UI components.
  - `Header.jsx`: Top navigation bar.
  - `JobCard.jsx`: Card component displaying job details.
  - `JobList.jsx`: Renders a list of `JobCard` components.
  - `AuthForm.jsx`: Reusable form for login/registration.
  - `InputField.jsx` & `Button.jsx`: Base UI elements.
  - `MessageBox.jsx`: For alerts/notifications.
  - `AdminRoute.jsx`: A protected route wrapper that restricts access based on user roles (Admin).
- **`src/pages/`**: View-level components mapped to routes.
  - `Home.jsx`: Landing page.
  - `Jobs.jsx` & `JobPage.jsx`: Job listing and detailed view.
  - `CompaniesPage.jsx`: List of companies.
  - `LikedJobsPage.jsx`: Dashboard for jobs saved by the user.
  - `Profile.jsx`: User settings and resume management.
  - `LoginPage.jsx` & `SignUpPage.jsx`: Authentication pages.
  - `ScrapePage.jsx`: Admin interface to trigger job scrapers.
- **`src/styles/`**: Global CSS styles, augmented by component-level or inline styling. `index.css` and `App.css` define base themes.

## Routing
Routing is managed by `react-router-dom`. The application has public routes (Home, Login, Signup), protected routes (Profile, Liked Jobs) that require a valid JWT token, and admin-protected routes (ScrapePage) guarded by the `AdminRoute` wrapper component.

## State Management
The application primarily relies on local component state using React Hooks (`useState`, `useEffect`). 
- **Authentication State:** JWT tokens are typically stored in `localStorage` or `sessionStorage` upon successful login, and are attached to subsequent Axios requests via an interceptor or explicit headers.
- **Data Fetching:** Handled inside `useEffect` hooks within Page components, which then pass the fetched data down to Components (like `JobList`) as props.
