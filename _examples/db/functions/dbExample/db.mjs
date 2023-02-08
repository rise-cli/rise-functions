import AWS from '/var/runtime/node_modules/aws-sdk/lib/aws.js'
const table = process.env.TABLE
const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: process.env.AWS_REGION
})

export const list = async ({ pk, sk, cursor = null }) => {
    const params = {
        TableName: table,
        KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
        ExpressionAttributeValues: {
            ':pk': pk,
            ':sk': sk
        },
        Limit: 10
    }

    if (cursor) {
        params.ExclusiveStartKey = {
            pk: pk,
            sk: cursor
        }
    }

    const result = await dynamoDb.query(params).promise()
    return {
        items: result.Items,
        next: result.LastEvaluatedKey ? result.LastEvaluatedKey.sk : false
    }
}

export const get = async ({ pk, sk }) => {
    const params = {
        TableName: table,
        Key: {
            pk: pk,
            sk: sk
        }
    }

    const result = await dynamoDb.get(params).promise()
    return result.Item
}

export const set = async (data) => {
    const params = {
        TableName: table,
        Item: data
    }

    return await dynamoDb.put(params).promise()
}

export const remove = async ({ pk, sk }) => {
    const params = {
        TableName: table,
        Key: {
            pk: pk,
            sk: sk
        }
    }

    return await dynamoDb.delete(params).promise()
}
