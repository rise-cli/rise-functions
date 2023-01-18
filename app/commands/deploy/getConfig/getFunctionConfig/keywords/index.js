import { addKeywordsToAlarmConfig } from './alarm.js'
import { addKeywordsToEnv } from './env.js'
import { addKeywordsToEventRule } from './eventRule.js'
import { addKeywordsToPermissions } from './permissions.js'

export async function applyKeywords(config, keywords) {
    await addKeywordsToAlarmConfig(config, keywords)
    await addKeywordsToEnv(config, keywords)
    await addKeywordsToEventRule(config, keywords)
    await addKeywordsToPermissions(config, keywords)

    return config
}
