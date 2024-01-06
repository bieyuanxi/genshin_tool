import { fetch, ResponseType } from '@tauri-apps/api/http';

// import config from "./config"

// request json
async function requestJson(url = "", query = {}) {
    const response = await fetch(url, {
        method: "GET",
        responseType: ResponseType.JSON,    // response json
        timeout: 15 * 1000,
        query
    });
    return response.data;
}

// request text/HTML
async function requestText(url = "", query = {}) {
    const response = await fetch(url, {
        method: "GET",
        responseType: ResponseType.Text,    // response text
        timeout: 15 * 1000,
        query
    });
    return response.data;
}

export { requestJson, requestText };


