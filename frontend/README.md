# Social Media App - React Frontend

This is the React frontend for the Social Media App, built with Vite, React Router, Redux Toolkit, and Tailwind CSS.

## Features

- User authentication (login/register)
- Redux state management
- React Router for navigation
- Tailwind CSS for styling
- Toast notifications
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```
VITE_BACKEND_API=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the app for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── api/           # API configuration
├── components/    # Reusable components
├── pages/         # Page components
├── redux/         # Redux store and slices
├── utility/       # Utility functions
├── constants.js   # App constants
├── App.jsx        # Main app component
└── main.jsx       # Entry point
```

## Technologies Used

- React 19
- Vite
- React Router DOM
- Redux Toolkit
- Tailwind CSS
- Axios
- React Toastify
- Framer Motion
- React Icons

## Backend Integration

This frontend is designed to work with the Node.js/Express backend. Make sure the backend server is running on `http://localhost:5000` before starting the frontend.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
