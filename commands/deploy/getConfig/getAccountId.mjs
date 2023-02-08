import AWS from 'aws-sdk'
export async function getAccountId() {
    const sts = new AWS.STS()
    const res = await sts.getCallerIdentity({}).promise()

    if (!res.Account) {
        throw new Error('Rise was unable to get your account id')
    }
    return res.Account
}
