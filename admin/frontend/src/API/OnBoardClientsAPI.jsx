import React from "react";
import API from "./APIService";

const OnBoardClientsAPI = {
    fetchOnBoardClientsAPI: () => API.get("clients"),
    addOnBoardClientsAPI: (data) => API.post("clients/add", data),
    udpateOnBoardClientsAPI: (id, data) => API.patch(`client/update/${id}`, data)
}

export default OnBoardClientsAPI;