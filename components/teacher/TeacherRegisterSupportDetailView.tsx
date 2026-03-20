'use client';

import { useEffect, useState } from 'react';
import RegisterSupportDetailView from '@/components/admin/RegisterSupportDetailView';

interface TeacherRegisterSupportDetailViewProps {
  id: string;
  initialData: any;
}

export default function TeacherRegisterSupportDetailView({ id }: TeacherRegisterSupportDetailViewProps) {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      try {
        const response = await fetch('/api/registration-settings', { cache: 'no-store' });
        const data = await response.json();
        
        if (data.success && data.settings) {
          setIsRegistrationOpen(data.settings.registerSupportOpen);
        }
      } catch (error) {
        console.error('Error fetching registration status:', error);
        // Default to open if there's an error
        setIsRegistrationOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrationStatus();
  }, []);

  // Teachers should have export and edit functionality, but not delete
  // hideScores=true to hide scoring details
  // readOnly=true when registration is closed (toggle is OFF)
  // hideDelete=true to hide delete button
  return (
    <RegisterSupportDetailView 
      id={id} 
      hideScores={true} 
      readOnly={!isRegistrationOpen || loading} 
      hideDelete={true} 
    />
  );
}
