import { useMutation, useQueryClient } from "@tanstack/react-query";
import OnBoardClientsAPI from "../../../API/OnBoardClientsAPI"

export const useUpdateOnBoardClient = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) =>
            OnBoardClientsAPI.udpateOnBoardClientsAPI(
                id,
                data
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["onboardclient"],
            });
        },
    });
};