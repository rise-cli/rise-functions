function isInt(n) {
    return n % 1 === 0
}

export function validateTimeout(input) {
    if (!input.config.timeout) return 6
    const timeout = input.config.timeout

    if (typeof timeout !== 'number') {
        throw new Error(input.functionName + ' config.timeout must be a number')
    }

    if (timeout < 0) {
        throw new Error(
            input.functionName + ' config.timeout cannot be a negative number'
        )
    }

    if (timeout > 900) {
        throw new Error(
            input.functionName +
                ' config.timeout cannot be bigger than 900 (15 minutes)'
        )
    }

    if (!isInt(timeout)) {
        throw new Error(
            input.functionName + ' config.timeout must not be a float'
        )
    }
    return timeout
}
