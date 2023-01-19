# Single File Functions

To define a single file Lambda function:

-   create a functions folder
-   create a .mjs file for your function

```bash
/functions
    myBlueFunction.mjs
```

## What does a single file function look like?

A single file function must export 2 things: a handler, and a config object:

```js
export const config = {
    // ...my config. More details below
}

export const handler = async (event, rise, context) => {
    return 123
}
```

# Folder Functions

To define a Lambda function:

-   create a functions folder
-   create another folder with the name of your function
-   create an index.mjs file for your code.
-   create a config.mjs file for your lambda config

```bash
/functions
    /myBlueFunction
        config.mjs
        index.mjs
```

## index.mjs

Inside index.mjs, you can write your Lambda function like so:

```js
export const handler = async (event, rise, context) => {
    return 123
}
```

The only requirement is that you export a handler function. Any additional files or node_modules located inside this folder will also be included in the deployment.

## config.mjs

Inside your config file, you will export a config object:

```js
export const config = {
    // ...my config. More details below
}
```

# Configuring your Lambda Function

Whether you are working with single file functions or folder functions, the config works the exact same way. The config object is how you configure your lambda function.

### Lambda Url

If `url` is set to true, your lambda function will deploy with a public url

```js
export const config = {
    url: true
}
```

### EventBridge Rule

If `eventRule` is defined, rise-functions will setup an event bridge rule to trigger your lambda function

```js
export const config = {
    eventRule: {
        source: 'user-service',
        event: 'user-created',
        eventBus: 'my bus' // optional, Defaults to "default"
    }
}
```

### Permissions

If `permissions` is set, you can add an array of IAM permissions to your Lambd function:

```js
export const config = {
    permissions: [
        {
            Effect: 'Allow',
            Action: 'dynamodb:Query',
            Resource: 'arn:aws:dynamodb:us-east-1:123412341234:table/myTable'
        }
    ]
}
```

### Environment variables

If `env` is defined, rise-functions provide the values defined in this object as environment variables. Your lambda function code will be able to reference them with `process.env.STRIPE_ID`.

```js
export const config = {
    env: {
        STRIPE_ID: '12341234'
    }
}
```

### Timeout

Timeout is set to 6 seconds by default. If you need your lambda function to run longer, you can increase the timeout to up to 900 seconds (15 minutes)

```js
export const config = {
    timeout: 300
}
```

### Alarm

If `alarm` is defined, rise-functions will create a CloudWatch Alarm on your lambda function to track errors.

```js
export const config = {
    alarm: {
        threshold: 3, // number of errors that will trigger this alarm
        snsTopic: 'mytopic that sends notification somewhere',
        period: 60, // number of seconds the threshold will be evaulated.  Valid values are 10, 30, 60, and any multiple of 60.
        evaluationPeriods: 4,
        description: 'helpful text'
    }
}
```
