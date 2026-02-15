import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

export default function IntakeRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: '/billing' });
  }, [navigate]);

  return null;
}
