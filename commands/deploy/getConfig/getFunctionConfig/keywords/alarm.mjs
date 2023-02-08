import * as aws from 'rise-aws-foundation'

export async function addKeywordsToAlarmConfig(config, keywords) {
    if (config.alarm !== 'None') {
        try {
            const res = await aws.account.getKeyword(
                keywords,
                config.alarm.snsTopic
            )
            keywords = res.state
            config.alarm.snsTopic = res.result
        } catch (e) {
            if (e instanceof Error) {
                throw new Error(e.message)
            }
        }
    }

    return {
        config,
        keywords
    }
}
