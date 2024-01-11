import { fetch, ResponseType } from '@tauri-apps/api/http';

import {timeout} from "./config"

// request json
async function requestJson(url = "", query = {}) {
    // FIX ME: timeout retry
    const response = await fetch(url, {
        method: "GET",
        responseType: ResponseType.JSON,    // response json
        timeout,
        query
    });
    return response;
}

// request text/HTML
async function requestText(url = "", query = {}) {
    const response = await fetch(url, {
        method: "GET",
        responseType: ResponseType.Text,    // response text
        timeout,
        query
    });
    return response.data;
}

export { requestJson, requestText };


