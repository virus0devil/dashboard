import { useMutation, useQueryClient } from "@tanstack/react-query";
import ComplianceCategoryAPI from "../../../API/ComplianceCategoryAPI";

export const useUpdateComplianceCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ complianceId, complianceData }) =>
            ComplianceCategoryAPI.udpateComplianceCategoryAPI(
                complianceId,
                complianceData
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["compliancecategory"],
            });
        },
    });
};