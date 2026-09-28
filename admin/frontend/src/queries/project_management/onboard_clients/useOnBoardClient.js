import {useQuery} from "@tanstack/react-query"
import OnBoardClientsAPI from "../../../API/OnBoardClientsAPI"

const fetchOnBoardClient = async () => {
    try{
        const response = await OnBoardClientsAPI.fetchOnBoardClientsAPI();
        if(response?.data){
            return response.data.map((client) => ({
                id:client.id,
                company_name: client.company_name,
                address: client.address
            }));
        }
        return [];
    } catch(error){
        console.error("Error fetching Clients:", error);
        throw error;
    }
}

export const useOnBoardClient = () => {
    return useQuery({
        queryKey: ["onboardclient"],
        queryFn: fetchOnBoardClient,
        staleTime: 1000 * 60 * 5,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
};