module.exports.config = {
    permissions: [
        {
            Effect: 'Allow',
            Action: 'cloudwatch:PutDashboard',
            Resource: '*'
        }
    ],

    // trigger: 'rispressoapi{@stage}_storeCreated',

    env: {
        STRIPE: '1234'
    }
}

module.exports.handler = async () => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            status: 'success!'
        })
    }
}
