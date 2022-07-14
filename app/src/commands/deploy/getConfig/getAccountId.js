const AWS = require('aws-sdk')
module.exports.getAccountId = async function getAccountId() {
    const sts = new AWS.STS()
    const res = await sts.getCallerIdentity({}).promise()
    return res.Account
}
