import { addKeywordsToAlarmConfig } from './alarm.mjs'
import { addKeywordsToEnv } from './env.mjs'
import { addKeywordsToEventRule } from './eventRule.mjs'
import { addKeywordsToPermissions } from './permissions.mjs'

export async function applyKeywords(config, keywords) {
    await addKeywordsToAlarmConfig(config, keywords)
    await addKeywordsToEnv(config, keywords)
    await addKeywordsToEventRule(config, keywords)
    await addKeywordsToPermissions(config, keywords)

    return config
}
