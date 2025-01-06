import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

// Lazy load pages
const Home = React.lazy(() => import('../pages/Home'));
const Tours = React.lazy(() => import('../pages/Tours'));
const TourDetails = React.lazy(() => import('../pages/TourDetails'));
const Login = React.lazy(() => import('../pages/Login'));
const Register = React.lazy(() => import('../pages/Register'));
const SearchResultList = React.lazy(() => import('../pages/SearchResultList'));
const ThankYou = React.lazy(() => import('../pages/ThankYou'));
const NotFound = React.lazy(() => import('../pages/NotFound'));

// Example of protected route
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('user'); // Replace with actual auth logic
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const Routers = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/tours" element={<Tours />} />
        <Route
          path="/tours/:id"
          element={
            <ProtectedRoute>
              <TourDetails />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/tours/search" element={<SearchResultList />} />
        <Route path="*" element={<NotFound />} /> {/* Handle 404 */}
      </Routes>
    </Suspense>
  );
};

export default Routers;

