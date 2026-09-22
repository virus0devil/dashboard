import { useMutation, useQueryClient } from "@tanstack/react-query";
import AssessmentCategoryAPI from "../../API/AssessmentCategoryAPI";

export const useUpdateAssessmentCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ assessmentId, assessmentData }) =>
            AssessmentCategoryAPI.udpateAssessmentCategoryAPI(
                assessmentId,
                assessmentData
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["assessmentcategory"],
            });
        },
    });
};