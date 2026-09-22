import React from "react";
import API from "./APIService";

const AssessmentCategoryAPI = {
    fetchAssessmentCategoryAPI: () => API.get("assessmentcategory"),
    addAssessmentCategoryAPI: (data) => API.post("assessmentcategory/add", data),
    udpateAssessmentCategoryAPI: (id, data) => API.patch(`assessmentcategory/update/${id}`, data)
}

export default AssessmentCategoryAPI;