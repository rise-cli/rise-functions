export const code = (table) => `
import { handler as code } from './_index.mjs'
import AWS from '/var/runtime/node_modules/aws-sdk/lib/aws.js'
const region = process.env.AWS_REGION
const db = new AWS.DynamoDB.DocumentClient({
    region: region
})

function uuid() {
    return AWS.util.uuid.v4()
}

function formatKeys(oldInput) {
    const input = { ...oldInput }
    if (input.pk && input.pk !== '@id' && input.pk.includes('@id')) {
        input.pk = input.pk.replace('@id', uuid())
    }

    if (input.pk && input.pk === '@id') {
        input.pk = uuid()
    }

    if (input.sk && input.sk !== '@id' && input.sk.includes('@id')) {
        input.sk = input.sk.replace('@id', uuid())
    }

    if (input.sk && input.sk === '@id') {
        input.sk = uuid()
    }

    return input
}

/** Get an item from a DynamoDB table */
export async function dbget(input, table = "${table}") {
    if (!input.sk) {
        throw new Error('Input must have sk defined')
    }

    if (input.pk) {
        const item = await db
            .get({
                TableName: table,
                Key: {
                    pk: input.pk,
                    sk: input.sk
                }
            })
            .promise()

        return item.Item || false
    }

    if (input.pk2) {
        const item = await db
            .get({
                TableName: table,
                IndexName: 'pk2',
                Key: {
                    pk2: input.pk2,
                    sk: input.sk
                }
            })
            .promise()

        return item.Item || false
    }
    if (input.pk3) {
        const item = await db
            .get({
                TableName: table,
                IndexName: 'pk3',
                Key: {
                    pk3: input.pk3,
                    sk: input.sk
                }
            })
            .promise()

        return item.Item || false
    }

    throw new Error('Input must have pk, pk2, or pk3 defined')
}

/** Query items in a DynamoDB table with begins with  */
export async function dblist(input, table = "${table}") {
    if (!input.sk) {
        throw new Error('Input must have sk defined')
    }

    if (!input.pk && !input.pk2 && !input.pk3) {
        throw new Error('Input must have either pk, pk2, or pk3 defined')
    }

    let params = {}

    if (input.pk) {
        params = {
            TableName: table,
            ...(input.limit ? { Limit: input.limit } : {}),
            ...(input.startAt ? { ExclusiveStartKey: input.startAt } : {}),
            KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
            ExpressionAttributeValues: {
                ':pk': input.pk,
                ':sk': input.sk
            }
        }
    }

    if (input.pk2) {
        params = {
            TableName: table,
            ...(input.limit ? { Limit: input.limit } : {}),
            ...(input.startAt ? { ExclusiveStartKey: input.startAt } : {}),
            IndexName: 'pk2',
            KeyConditionExpression: 'pk2 = :gsi AND begins_with(sk, :sk)',
            ExpressionAttributeValues: {
                ':gsi': input.pk2,
                ':sk': input.sk
            }
        }
    }

    if (input.pk3) {
        params = {
            TableName: table,
            ...(input.limit ? { Limit: input.limit } : {}),
            ...(input.startAt ? { ExclusiveStartKey: input.startAt } : {}),
            IndexName: 'pk3',
            KeyConditionExpression: 'pk3 = :gsi AND begins_with(sk, :sk)',
            ExpressionAttributeValues: {
                ':gsi': input.pk3,
                ':sk': input.sk
            }
        }
    }

    const result = await db.query(params).promise()
    return result.Items || []
}

/**
 * Put an item into a DynamoDB table.
 * This will error if item already exists in table
 */
export async function dbcreate(input, table = "${table}") {
    if (!input.pk && !input.pk2 && !input.pk3) {
        throw new Error('create must have either pk, pk2, or pk3 defined')
    }

    if (!input.sk) {
        throw new Error('create must have a sk defined')
    }

    const createItem = async () => {
        const formattedInput = formatKeys(input)

        await db
            .put({
                TableName: table,
                Item: formattedInput,
                ConditionExpression: 'attribute_not_exists(sk)'
            })
            .promise()

        return formattedInput
    }

    try {
        return await createItem()
    } catch (e) {
        if (
            e.message.includes('ConditionalCheckFailedException') &&
            input.sk.includes('@id')
        ) {
            return await createItem()
        }
        throw new Error(e)
    }
}

/**
 * Put an item into a DynamoDB table.
 * This will overwrite if item already exists in table
 */
export async function dbset(input, table = "${table}") {
    if (!input.pk && !input.pk2 && !input.pk3) {
        throw new Error('create must have either pk, pk2, or pk3 defined')
    }

    if (!input.sk) {
        throw new Error('create must have a sk defined')
    }

    const formattedInput = formatKeys(input)
    await db
        .put({
            TableName: table,
            Item: formattedInput
        })
        .promise()

    return formattedInput
}

/** Remove an item from a DynamoDB Tables */
export async function dbremove(input, table = "${table}") {
    await db
        .delete({
            TableName: table,
            Key: {
                pk: input.pk,
                sk: input.sk
            }
        })
        .promise()
    return input
}

const getUserId = (event) => {
    if (!event) return null
    if (!event.requestContext) return null
    if (!event.requestContext.authorizer) return null
    if (!event.requestContext.authorizer.jwt) return null
    if (!event.requestContext.authorizer.jwt.claims) return null
    if (!event.requestContext.authorizer.jwt.claims.sub) return null
    return event.requestContext.authorizer.jwt.claims.sub
}


const getPostData = (event) => {
    return JSON.parse(event.body)
}

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,authorization',
    'Access-Control-Allow-Methods': 'OPTIONS,PUT,GET,POST'
}

export const http = {
    success: (x) => ({
        statusCode: 200,
        body: JSON.stringify(x),
        headers
    }),
    validationError: (message) => ({
        statusCode: 400,
        body: JSON.stringify({ message }),
        headers
    }),
    serviceError: (message) => ({
        statusCode: 500,
        body: JSON.stringify({ message }),
        headers
    })
}

const r = {
    db: {
        get: dbget,
        list: dblist,
        set: dbset,
        remove: dbremove
    },
    uuid,
    getUserId,
    getPostData,
    http
}

export const handler = async (e, c) => {
    return await code(e, r, c)
}
`
