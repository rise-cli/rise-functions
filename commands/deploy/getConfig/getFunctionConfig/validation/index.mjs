import { validateAlarmConfig } from './alarm.mjs'
import { validateEnv } from './env.mjs'
import { validateEventRuleConfig } from './eventRule.mjs'
import { validatePermissions } from './permissions.mjs'
import { validateTimeout } from './timeout.mjs'
import { validateUrlConfig } from './url.mjs'

export function validateFunctionConfig(config, functionName) {
    const defualtConfig = {
        url: 'None',
        eventRule: 'None',
        env: {},
        permissions: [],
        alarm: 'None',
        timeout: 6,
        schedule: 'None',
        layers: []
    }

    if (!config) return defualtConfig

    return {
        url: validateUrlConfig({ config, functionName }),
        eventRule: validateEventRuleConfig({ config, functionName }),
        env: validateEnv({ config, functionName }),
        permissions: validatePermissions({ config, functionName }),
        alarm: validateAlarmConfig({ config, functionName }),
        timeout: validateTimeout({ config, functionName }),
        dashboard: config.dashboard || {},
        schedule: config.schedule || 'None',
        layers: []
    }
}
