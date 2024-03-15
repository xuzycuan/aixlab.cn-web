import axios from 'axios'
import {Message} from "element-ui";

const tunnelUrl = "http://localhost:4998"


const tunnel = axios.create({
    baseURL: tunnelUrl,
});

tunnel.interceptors.request.use((config) => {
    return config
}, (error => {
    return Promise.reject(error);
}));

tunnel.interceptors.response.use(response => {
    return response
}, err => {
     Message({
        type: "error",
        message: err.response.data.Message
    });
    return Promise.resolve(err.response)
})

export default tunnel;

