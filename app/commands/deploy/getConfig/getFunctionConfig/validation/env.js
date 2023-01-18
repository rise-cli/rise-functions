export function validateEnv(input) {
    if (!input.config.env) return {}
    const env = input.config.env

    Object.keys(env).forEach((k) => {
        if (typeof env[k] !== 'string') {
            throw new Error(
                input.functionName + ' config.env values must be a string'
            )
        }
    })

    return env
}
