export function validateUrlConfig(input) {
    if (!input.config.url) return 'None'
    let rawUrl = input.config.url

    const url = {
        method: rawUrl.split(' ')[0],
        path: rawUrl.split(' ')[1]
    }

    if (!url.method) {
        throw new Error(
            input.functionName + ' config.url must have a method property'
        )
    }

    if (!['POST', 'GET', 'PUT', 'DELETE'].includes(url.method)) {
        throw new Error(
            input.functionName +
                ' config.url.method can only be GET, POST, PUT or DELETE'
        )
    }

    if (!url.path) {
        throw new Error(
            input.functionName + ' config.url must have a path property'
        )
    }

    if (typeof url.path !== 'string') {
        throw new Error(
            input.functionName + ' config.url.path must be a string'
        )
    }

    /**
     * If someone puts a / infront of their path, trim it.
     */
    if (url.path.startsWith('/')) {
        url.path = url.path.slice(1)
    }

    /**
     * If there are still /'s, then they are trying to do
     * nested routes, we dont yet support it, (although
     * referencing sls@1.52.2, we can figure out how to
     * do it)
     */
    if (url.path.includes('/')) {
        throw new Error(
            input.functionName +
                ' config.url.path cannot have a nested path. Rise Functions does not yet support nested routes'
        )
    }
    return {
        path: url.path,
        method: url.method,
        auth: false
    }
}
