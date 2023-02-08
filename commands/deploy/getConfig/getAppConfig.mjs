import * as filesystem from 'rise-filesystem-foundation'
import { getAccountId } from './getAccountId.mjs'
import process from 'node:process'

async function getLocalAppConfig() {
    try {
        const app = await filesystem.getJsFile({
            path: '/rise.mjs',
            projectRoot: process.cwd()
        })

        const config = app.default

        return {
            appName: config.name,
            region: config.region || 'us-east-1',
            stage: config.stage || 'dev',
            dashboard: config.dashboard || false
        }
    } catch (e) {
        throw new Error('Must have a rise.mjs file')
    }
}

async function getLocalBucketName() {
    try {
        const { config } = await filesystem.getJsFile({
            path: '/.rise/data.mjs',
            projectRoot: process.cwd()
        })

        return config.bucketName
    } catch (e) {
        return undefined
    }
}

export async function getAppConfig() {
    const config = await getLocalAppConfig()
    let bucketName = await getLocalBucketName()
    const accountId = await getAccountId()
    return {
        appName: config.appName,
        bucketName: bucketName,
        region: config.region || 'us-east-1',
        stage: config.stage || 'dev',
        accountId,
        dashboard: config.dashboard
    }
}
