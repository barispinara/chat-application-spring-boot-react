
import React from 'react'
import { useAppSelector } from '../redux/hooks'
import { Navigate } from 'react-router-dom';

const ProtectedRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login"/>;
  }

  return <>{children}</>
}

export default ProtectedRouter
