import _ from "underscore";
const DEMO_MODE_DELAY = 300
const METHODS_THAT_ALLOW_PARAMS = ['GET']

export type Params = {
    [key: string]: string | Array<string> | FormData | boolean
}

export type ContentTypes = 'application/json' | 'multipart/form-data'

export const contentTypes: {
    applicationJson: ContentTypes
    multipart: ContentTypes
} = {
    applicationJson: 'application/json',
    multipart: 'multipart/form-data',
}

const doRequest = async function (
    method: 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE',
    baseUrl: string,
    endpoint: string,
    params: Params = {},
    contentType: ContentTypes = contentTypes.applicationJson,
    abortSignal?: AbortSignal,
): Promise<Response | void> {
    const fetchObj: RequestInit = {
        method,
        credentials: 'include',
    }

    if (['POST', 'PUT', 'PATCH', 'DELETE'].indexOf(method) > -1) {
        fetchObj.headers = {
            ...fetchObj.headers,
            'Content-Type': contentType,
        }
        fetchObj.body = contentType === contentTypes.multipart ? (params as unknown as FormData) : JSON.stringify(params)
    }

    if (METHODS_THAT_ALLOW_PARAMS.indexOf(method) > -1) {
        if (_.keys(params).length > 0) {
            endpoint +=
                '?' +
                _.map(params, (val, key) => {
                    if (val instanceof Array) {
                        return _.map(val, (v) => {
                            return `${encodeURIComponent(key)}=${encodeURIComponent(v)}`
                        }).join('&')
                    } else {
                        return `${encodeURIComponent(key)}=${encodeURIComponent(val as string)}`
                    }
                }).join('&')
        }
    }

    return await fetch(`${baseUrl}${endpoint}`, fetchObj).catch((error) => {console.log("An Error Occurred"); console.log(error)}).then((result) => {console.log("Completed fetch"); return result;});
}

const call = async function <T> (
    baseUrl: string,
    method: 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE',
    endpoint: string,
    params: Params = {},
    contentType?: ContentTypes,
    abortSignal?: AbortSignal,
): Promise<T | undefined> {
    let response
    let responseBody
    try {
        response = await doRequest(method, baseUrl, endpoint, params, contentType, abortSignal)
    } catch (networkError) {
        // networkError coming back as `AbortError` means abortController.abort() was called
        // @ts-ignore
        throw { networkError: true }
    }
    return await response!.json()
}

export const get = async function <T>(endpoint: string, params: Params = {}, abortSignal?: AbortSignal): Promise<T> {
      // return await call<T>('https://va-veis-vamobile-dev.azurewebsites.us', 'GET', endpoint, params, undefined, abortSignal).then((result) => {
        return await call<T>('http://192.168.0.8:8088', 'GET', endpoint, params, undefined, abortSignal).then((result) => {

        return result!;
    })
}

