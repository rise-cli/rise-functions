/**
 * Config
 */
export const config = {
    url: 'GET /list',
}

/**
 * Handler
 */
export const handler = async (event, rise) => {
    const result = await rise.db.list({
        pk: 'admin',
        sk: 'note'
    })

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify(result)
    }
}
