import * as aws from 'rise-aws-foundation'

export async function addKeywordsToEnv(config, keywords) {
    try {
        for (const k of Object.keys(config.env)) {
            const res = await aws.account.getKeyword(keywords, config.env[k])

            keywords = res.state
            config.env[k] = res.result
        }
    } catch (e) {
        if (e instanceof Error) {
            throw new Error(e.message)
        }
    }

    return {
        config,
        keywords
    }
}
