'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function SessionUpdater() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session) {
      console.log('Client Session:', session);
    }
  }, [status, session]);

  return null;
}