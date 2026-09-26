import { useMutation, useQueryClient } from "@tanstack/react-query";
import MasterVulnerabilitiesAPI from "../../../API/MasterVulnerabilitiesAPI";

export const useUpdateMasterVulnerabilities = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ vulnvid, vulnData }) =>
            MasterVulnerabilitiesAPI.udpateMasterVulnerabilitiesAPI(
                vulnvid,
                vulnData
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["mastervulnerabilities"],
            });
        },
    });
};