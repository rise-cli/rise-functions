import * as aws from 'rise-aws-foundation'

export async function addKeywordsToEventRule(config, keywords) {
    if (config.eventRule === 'None') {
        return {
            config,
            keywords
        }
    }

    try {
        const sourceK = await aws.keywords.getKeyword(
            keywords,
            config.eventRule.source
        )
        keywords = sourceK.state
        const nameK = await aws.keywords.getKeyword(
            keywords,
            config.eventRule.name
        )
        keywords = nameK.state
        const busK = config.eventRule.bus
            ? await aws.keywords.getKeyword(keywords, config.eventRule.bus)
            : { result: 'default' }
        config.eventRule = {
            source: sourceK.result,
            name: nameK.result,
            bus: busK.result
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
