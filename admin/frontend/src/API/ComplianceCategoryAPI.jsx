import React from "react";
import API from "./APIService";

const ComplianceCategoryAPI = {
    fetchComplianceCategoryAPI: () => API.get("compliancecategory"),
    addComplianceCategoryAPI: (data) => API.post("compliancecategory/add", data),
    udpateComplianceCategoryAPI: (id, data) => API.patch(`compliancecategory/update/${id}`, data)
}

export default ComplianceCategoryAPI;