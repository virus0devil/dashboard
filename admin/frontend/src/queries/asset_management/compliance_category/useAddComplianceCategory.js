import { useMutation, useQueryClient } from "@tanstack/react-query";
import ComplianceCategoryAPI from "../../../API/ComplianceCategoryAPI";

export const useAddComplianceCategory  = () => {
    try {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: (complianceId) => ComplianceCategoryAPI.addComplianceCategoryAPI(complianceId),

            onSuccess: () => {
                queryClient.invalidateQueries(["compliancecategory"])
            }
        })
    } catch (error) {
        console.error("Error Creating Compliance:", error);
        throw error;
    }
};
