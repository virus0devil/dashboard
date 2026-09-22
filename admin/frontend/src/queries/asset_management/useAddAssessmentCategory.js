import { useMutation, useQueryClient } from "@tanstack/react-query";
import AssessmentCategoryAPI from "../../API/AssessmentCategoryAPI";

export const useAddAssessmentCategory  = () => {
    try {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: (assessmentId) => AssessmentCategoryAPI.addAssessmentCategoryAPI(assessmentId),

            onSuccess: () => {
                queryClient.invalidateQueries(["assessmentcategory"])
            }
        })
    } catch (error) {
        console.error("Error Creating Employee:", error);
        throw error;
    }
};
