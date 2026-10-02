import React from "react";
import API from "./APIService";

const OnBoardClientsAPI = {
    fetchOnBoardClientsAPI: ({search = "",page = 1,limit = 10,} = {}) =>API.get("clients", {params: {search: search || undefined,page,limit,},}),
    addOnBoardClientsAPI: (data) => API.post("clients/add", data),
    udpateOnBoardClientsAPI: (id, data) => API.patch(`client/update/${id}`, data)
}

export default OnBoardClientsAPI;