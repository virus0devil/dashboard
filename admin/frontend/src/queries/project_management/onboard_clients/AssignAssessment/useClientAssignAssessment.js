import { useQuery } from '@tanstack/react-query'
import AssignClientAssignAssessmentAPI from '../../../../API/AssignClientAssessmentAPI';

export const useClientAssignAssessments = (client_id) => {
  return useQuery({
    queryKey: ["clientAssessments", client_id],

    queryFn: async () => {
      const res = await AssignClientAssignAssessmentAPI.fetchAssignClientAssignAssessmentAPI(client_id);
      return res?.data || [];
    },

    enabled: !!client_id,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};