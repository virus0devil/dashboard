import { useMutation, useQueryClient } from "@tanstack/react-query";
import OnBoardClientsAPI from "../../../API/OnBoardClientsAPI"

export const useAddOnBoardClient  = () => {
    try {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: (data) => OnBoardClientsAPI.addOnBoardClientsAPI(data),

            onSuccess: () => {
                queryClient.invalidateQueries(["onboardclient"])
            }
        })
    } catch (error) {
        console.error("Error Creating Client:", error);
        throw error;
    }
};
