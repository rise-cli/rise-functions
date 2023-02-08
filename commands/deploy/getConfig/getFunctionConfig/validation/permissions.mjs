export function validatePermissions(input) {
    if (!input.config.permissions) return []
    const permissions = input.config.permissions

    permissions.forEach((permission) => {
        if (typeof permission !== 'object') {
            throw new Error(
                input.functionName +
                    ' config.permissions must be an array of objects'
            )
        }

        if (!permission.Action) {
            throw new Error(
                input.functionName +
                    ' config.permissions objects must have a Action property'
            )
        }

        if (
            typeof permission.Action !== 'string' &&
            !Array.isArray(permission.Action)
        ) {
            throw new Error(
                input.functionName +
                    ' config.permissions objects Action must be a string or an array '
            )
        }

        if (!permission.Effect) {
            throw new Error(
                input.functionName +
                    ' config.permissions objects must have a Effect property'
            )
        }

        if (typeof permission.Effect !== 'string') {
            throw new Error(
                input.functionName +
                    ' config.permissions objects Effect must be a string'
            )
        }

        if (!permission.Resource) {
            throw new Error(
                input.functionName +
                    ' config.permissions objects must have a Resource property'
            )
        }

        if (
            typeof permission.Resource !== 'string' &&
            !Array.isArray(permission.Resource)
        ) {
            throw new Error(
                input.functionName +
                    ' config.permissions objects Resource must be a string or an array'
            )
        }
    })

    return permissions
}
