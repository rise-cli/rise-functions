export function validateEventRuleConfig(input) {
    if (!input.config.eventRule) return 'None'
    const eventRule = input.config.eventRule

    if (!eventRule.source) {
        throw new Error(
            input.functionName + ' config.eventRule must have a source property'
        )
    }

    if (typeof eventRule.source !== 'string') {
        throw new Error(
            input.functionName + ' config.eventRule.source must be a string'
        )
    }

    if (!eventRule.name) {
        throw new Error(
            input.functionName + ' config.eventRule must have a name property'
        )
    }

    if (typeof eventRule.name !== 'string') {
        throw new Error(
            input.functionName + ' config.eventRule.name must be a string'
        )
    }

    return {
        name: eventRule.name,
        source: eventRule.source,
        bus: eventRule.eventBus || 'default'
    }
}
