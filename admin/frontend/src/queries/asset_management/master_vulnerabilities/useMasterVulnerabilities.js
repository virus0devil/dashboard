import {useQuery} from "@tanstack/react-query"
import MasterVulnerabilitiesAPI from "../../../API/MasterVulnerabilitiesAPI";

const fetchMasterVulnerabilities = async () => {
    try{
        const response = await MasterVulnerabilitiesAPI.fetchMasterVulnerabilitiesAPI();
        if(response?.data){
            return response.data.map((vuln) => ({
                vid:vuln.vid,
                vulnerability_name: vuln.vulnerability_name,
                category: vuln.category,
                cvss_score: vuln.cvss_score,
                severity: vuln.severity,
                cvss_vector: vuln.cvss_vector,
                cwe_id:vuln.cwe_id,
                description:vuln.description,
                remediation:vuln.remediation,
                impact:vuln.impact,
                reference:vuln.reference
            }));
        }
        return [];
    } catch(error){
        console.error("Error fetching Master Vulnerabilities:", error);
        throw error;
    }
}

export const useMasterVulnerabilities = () => {
    return useQuery({
        queryKey: ["mastervulnerabilities"],
        queryFn: fetchMasterVulnerabilities,
        staleTime: 1000 * 60 * 5,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
};