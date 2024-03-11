import axios from "axios";

const URL = "http://192.168.0.8:8088";
// const URL = "https://va-veis-vamobile-dev.azurewebsites.us";

const httpClient = axios.create({
    baseURL: URL,
    headers: {
        Accept: "application/json",
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
    },
});

// httpClient.interceptors.request.use((request) => {
//     console.log('Starting Request', JSON.stringify(request, null, 2))
//     return request;
// });
//
// httpClient.interceptors.response.use((response) => {
//     //console.log('Response:', JSON.stringify(response, null, 2))
//     return response;
// });

export default httpClient;
