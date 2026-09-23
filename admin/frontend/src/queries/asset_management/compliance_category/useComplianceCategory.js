import {useQuery} from "@tanstack/react-query"
import ComplianceCategoryAPI from "../../../API/ComplianceCategoryAPI";

const fetchComplianceCategory = async () => {
    try{
        const response = await ComplianceCategoryAPI.fetchComplianceCategoryAPI();
        if(response?.data){
            return response.data.map((compliance) => ({
                id:compliance.id,
                compliance_name: compliance.compliance_name
            }));
        }
        return [];
    } catch(error){
        console.error("Error fetching Compliance Types:", error);
        throw error;
    }
}

export const usecomplianceCategory = () => {
    return useQuery({
        queryKey: ["compliancecategory"],
        queryFn: fetchComplianceCategory,
        staleTime: 1000 * 60 * 5,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
};