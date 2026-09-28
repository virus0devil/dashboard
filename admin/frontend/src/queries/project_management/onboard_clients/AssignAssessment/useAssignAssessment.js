import { useMutation } from '@tanstack/react-query'
import AssignClientAssignAssessmentAPI from '../../../../API/AssignClientAssessmentAPI';

const assignAssessment = async ({ client_id, assessment_ids }) => {
    try {
        const response = await AssignClientAssignAssessmentAPI.AssignClientAssignAssessmentAPI(
            client_id,
            assessment_ids
        );

        return response.data;
    } catch (error) {
        console.error("Error assigning assessments:", error);
        throw error;
    }
};

export const useAssignAssessment = () => {
    return useMutation({
        mutationFn: assignAssessment,
    });
};