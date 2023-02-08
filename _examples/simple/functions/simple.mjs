export const config = {
    url: 'GET /example'
}

export const handler = async () => {
    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: 'Hello from Rise Functions'
        })
    }
}