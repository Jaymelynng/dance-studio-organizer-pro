import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Activity = Tables<'activities'> & {
  student: { first_name: string; last_name: string } | null;
};

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: activitiesError } = await supabase
          .from('activities')
          .select(`
            *,
            student:students(first_name, last_name)
          `)
          .order('created_at', { ascending: false })
          .limit(10);

        if (activitiesError) throw activitiesError;

        setActivities(data || []);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return { activities, loading, error };
};