"use client";
import { useState } from 'react';
import { AuthModal } from '../components/AuthModal';
import { useRouter } from 'next/navigation';

export default function LoginLayout() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    // Redirect after successful login
    router.push('/');
  };

  const handleClose = () => {
    // Redirect when modal is closed
    router.push('/');
  };

  return (
    <div>
      <AuthModal 
        isOpen={true}
        onClose={handleClose}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}