import { fetch, ResponseType } from '@tauri-apps/api/http';

import {timeout} from "./config"

// request json
export async function getJson(url = "", query = {}) {
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
export async function getText(url = "", query = {}) {
    const response = await fetch(url, {
        method: "GET",
        responseType: ResponseType.Text,    // response text
        timeout,
        query
    });
    return response.data;
}

export async function postJson(url = "", query = {}) {
    // FIX ME: timeout retry
    const response = await fetch(url, {
        method: "POST",
        responseType: ResponseType.JSON,    // response json
        timeout,
        query
    });
    return response;
}



