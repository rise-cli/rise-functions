import { validateAlarmConfig } from './alarm.js'
import { validateEnv } from './env.js'
import { validateEventRuleConfig } from './eventRule.js'
import { validatePermissions } from './permissions.js'
import { validateTimeout } from './timeout.js'
import { validateUrlConfig } from './url.js'

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
