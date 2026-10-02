import { useQuery } from "@tanstack/react-query";
import OnBoardClientsAPI from "../../../API/OnBoardClientsAPI";

const fetchOnBoardClient = async ({search = "",page = 1,limit = 10,}) => {
    try {
        const response =await OnBoardClientsAPI.fetchOnBoardClientsAPI({search,page,limit,});
        const responseData = response?.data;
        return {
            data: (responseData?.data || []).map((client) => ({
                id: client.id,
                company_name: client.company_name,
                address: client.address,
            })),
            page: responseData?.page ?? page,
            limit: responseData?.limit ?? limit,
            total: responseData?.total ?? 0,
            hasMore: responseData?.hasMore ?? false,
        };
    } catch (error) {
        console.error("Error fetching Clients:", error);
        throw error;
    }
};

export const useOnBoardClient = ({search = "",page = 1,limit = 10,} = {}) => {
    return useQuery({
        queryKey: ["onboardclient",search,page,limit,],

        queryFn: () =>fetchOnBoardClient({search,page,limit,}),
        staleTime: 1000 * 60 * 5,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        placeholderData: (previousData) => previousData,
    });
};