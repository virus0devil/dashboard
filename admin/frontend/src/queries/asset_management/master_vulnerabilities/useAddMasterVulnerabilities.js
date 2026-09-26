import { useMutation, useQueryClient } from "@tanstack/react-query";
import MasterVulnerabilitiesAPI from "../../../API/MasterVulnerabilitiesAPI";

export const useAddMasterVulnerabilities  = () => {
    try {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: (vid) => MasterVulnerabilitiesAPI.addMasterVulnerabilitiesAPI(vid),

            onSuccess: () => {
                queryClient.invalidateQueries(["mastervulnerabilities"])
            }
        })
    } catch (error) {
        console.error("Error Creating Master Vulnerabilities:", error);
        throw error;
    }
};
