// pages/add-eee.js
import React, { useEffect } from 'react';
import AddEEE from '../components/AddEEE';
import { useAuth } from '../lib/auth';
import { useRouter } from 'next/router';

const AddEEEPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to home if not authenticated
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  // Show nothing while checking authentication
  if (!user) return null;

  return <AddEEE />;
};

export default AddEEEPage;