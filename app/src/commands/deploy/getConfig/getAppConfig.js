module.exports.getAppConfig = function getAppConfig(cli, path) {
    const folderPath = path || process.cwd()
    try {
        const config = require(folderPath + '/rise.js')
        let bucketName = undefined
        try {
            const data = require(folderPath + '/.rise/data.js')
            bucketName = data.bucketName
        } catch (e) {
            bucketName = undefined
        }

        return {
            appName: config.name,
            bucketName: bucketName,
            region: config.region || 'us-east-1',
            stage: config.stage || 'dev',
            dashboard: config.dashboard ? true : false
        }
    } catch (e) {
        throw new Error('Must have a rise.js file')
    }
}
