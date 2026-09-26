import React from "react";
import API from "./APIService";

const MasterVulnerabilitiesAPI = {
    fetchMasterVulnerabilitiesAPI: () => API.get("masterVulnerabilities"),
    addMasterVulnerabilitiesAPI: (data) => API.post("masterVulnerabilities/add", data),
    udpateMasterVulnerabilitiesAPI: (vid, data) => API.patch(`masterVulnerabilities/update/${vid}`, data)
}

export default MasterVulnerabilitiesAPI;