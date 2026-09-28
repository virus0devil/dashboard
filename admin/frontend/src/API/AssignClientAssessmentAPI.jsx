import React from 'react'
import API from './APIService';

const  AssignClientAssignAssessmentAPI = {
  fetchAssignClientAssignAssessmentAPI: (client_id) => API.get(`clients/${client_id}/assessments`),
  AssignClientAssignAssessmentAPI: (client_id,assessment_ids) => API.post(`clients/${client_id}/assessments`,{assessment_ids: assessment_ids,}),
  activateAssessmentAPI: (client_id, assessment_id) => API.put(`clients/${client_id}/assessments/${assessment_id}/activate`),
  deactivateAssessmentAPI: (client_id, assessment_id) => API.put(`clients/${client_id}/assessments/${assessment_id}/deactivate`),
}

export default AssignClientAssignAssessmentAPI;