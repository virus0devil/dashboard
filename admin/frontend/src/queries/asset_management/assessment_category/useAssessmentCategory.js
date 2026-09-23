import {useQuery} from "@tanstack/react-query"
import AssessmentCategoryAPI from "../../../API/AssessmentCategoryAPI"

const fetchAssessmentCategory = async () => {
    try{
        const response = await AssessmentCategoryAPI.fetchAssessmentCategoryAPI();
        if(response?.data){
            return response.data.map((assessment) => ({
                id:assessment.id,
                assessment_name: assessment.assessment_name
            }));
        }
        return [];
    } catch(error){
        console.error("Error fetching Assessment Types:", error);
        throw error;
    }
}

export const useAssessmentCategory = () => {
    return useQuery({
        queryKey: ["assessmentcategory"],
        queryFn: fetchAssessmentCategory,
        staleTime: 1000 * 60 * 5,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
};