interface Options {
    method: string, 
    headers: {},
    body: any 
}

const useFetch = (collection: string) => {
    const url = process.env.PUBLIC_URL || "http://localhost:8080"
    const stub = `${url}/${collection}`

    const defaultHeader = {
        Accept: "application/json",
        "Content-Type": "application/json"
    };

    const customFetch = (url, method, body, headers) => {
        const options: Options = {
            method,
            headers,
            body
        };

        if (body){
            options.body = JSON.stringify(body)
        } 

        return fetch(url, options)
            .then(response => response.json())
            .catch(err => {
                throw new Error(err);
            });
    };

    const get = id => {
        const url = `${stub}${id ? `/${id}` : ""}`;
        return customFetch(url, "GET", null, defaultHeader);
    };

    const post = (body) => {
        if (!body) throw new Error("to make a post you must provide a     body");
        return customFetch(stub, "POST", body, defaultHeader);
    };

    const put = (id, body) => {
        if (!id || !body)
            throw new Error("to make a put you must provide the id and the   body");
        const url = `${stub}/${id}`;
        return customFetch(url, "PUT", body, defaultHeader);
    };

    const del = (id = false) => {
        if (!id)
            throw new Error("to make a delete you must provide the id and the body");
        const url = `${stub}/${id}`;
        return customFetch(url, "DELETE", null, defaultHeader);
    };

    return {
        get,
        post,
        put,
        del
    };
};
export default useFetch;