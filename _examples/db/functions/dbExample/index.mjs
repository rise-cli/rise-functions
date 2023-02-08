import { list } from './db.mjs'

/**
 * Config
 */
export const config = {
    url: 'GET /list',
    env: {
        TABLE: '{@output.stackName.TableName}'
    },
    permissions: [
        {
            Effect: 'Allow',
            Action: [
                'dynamodb:Query',
                'dynamodb:GetItem',
                'dynamodb:PutItem',
                'dynamodb:DeleteItem'
            ],
            Resource: '{@output.stackName.TableArn}'
        }
    ]
}

/**
 * Handler
 */
export const handler = async (event) => {
    const result = await list({
        pk: 'admin',
        sk: 'note'
    })

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify(result)
    }
}
