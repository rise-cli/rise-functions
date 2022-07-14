const { makeFolders } = require('./makeFolders')
const { getAppConfig } = require('./getAppConfig')
const { getAccountId } = require('./getAccountId')
const { getFunctionConfig } = require('./getFunctionConfig')

module.exports.getConfig = async (cli, aws) => {
    let stage = 'dev'
    let region = 'us-east-1'

    await makeFolders(cli)

    let config = getAppConfig(cli)

    config.accountId = await getAccountId()

    if (stage) {
        config.stage = stage
    }
    if (region) {
        config.region = region
    }

    const c = await getFunctionConfig(cli, aws, region, stage)
    return {
        name: config.appName,
        stage: config.stage,
        region: config.region,
        accountId: config.accountId,
        bucketName: config.bucketName,
        lambda: c.lambdaConfig,
        dashboard: config.dashboard
    }
}
