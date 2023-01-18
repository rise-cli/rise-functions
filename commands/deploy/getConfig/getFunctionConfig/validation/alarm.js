export function validateAlarmConfig(input) {
    if (!input.config.alarm) return 'None'
    const alarm = input.config.alarm

    /**
     * Required
     */
    if (!alarm.threshold) {
        throw new Error(
            input.functionName + ' config.alarm must have a threshold property'
        )
    }

    if (typeof alarm.threshold !== 'number') {
        throw new Error(
            input.functionName + ' config.alarm.threshold must be a number'
        )
    }

    if (!alarm.snsTopic) {
        throw new Error(
            input.functionName + ' config.alarm must have a snsTopic property'
        )
    }

    if (typeof alarm.snsTopic !== 'string') {
        throw new Error(
            input.functionName + ' config.alarm.snsTopic must be a string'
        )
    }

    /**
     * Optional
     */
    if (alarm.period && typeof alarm.period !== 'number') {
        throw new Error(
            input.functionName + ' config.alarm.period must be a number'
        )
    }

    if (
        alarm.evaluationPeriods &&
        typeof alarm.evaluationPeriods !== 'number'
    ) {
        throw new Error(
            input.functionName +
                ' config.alarm.evaluationPeriods must be a number'
        )
    }

    if (alarm.evaluationPeriods && alarm.evaluationPeriods < 10) {
        throw new Error(
            input.functionName +
                ' config.alarm.evaluationPeriods must be above or greater than 10'
        )
    }

    if (alarm.description && typeof alarm.description !== 'string') {
        throw new Error(
            input.functionName + ' config.alarm.description must be a string'
        )
    }

    return alarm
}
