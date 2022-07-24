# Functions

To define a Lambda function:

-   create a functions folder
-   create another folder with the name of your function
-   create an index.js file.

```bash
/functions
    /myBlueFunction
        index.js
```

## index.js

Inside index.js, you can write your Lambda function like so:

```js
module.exports.handler = async (event) => {
    return 123
}
```

The only requirement is that you export a handler function. Any additional files or node_modules located inside this folder will also be included in the deployment.

## Configuring your Lambda Function

Along with exporting a `handler` function, you can also export a config function, which rise will read as config to setup your lambda:

```js
module.exports.config = {
    // ... my config
}

module.exports.handler = async (event) => {
    return 123
}
```

### Lambda Url

If `url` is set to true, your lambda function will deploy with a public url

```js
module.exports.config = {
    url: true
}

module.exports.handler = async (event) => {
    return 123
}
```

### Lambda EventBridge Rule

If `trigger` is set to a string, rise-functions will setup an event bridge rule to trigger your lambda function

```js
module.exports.config = {
    trigger: 'user-created'
}

module.exports.handler = async (event) => {
    return 123
}
```

### Lambda Permissions

If `permissions` is set, you can add an array of IAM permissions to your Lambd function:

```js
module.exports.config = {
    permissions: [
        {
            Effect: 'Allow',
            Action: 'dynamodb:Query',
            Resource: 'arn:aws:dynamodb:us-east-1:123412341234:table/myTable'
        }
    ]
}

module.exports.handler = async (event) => {
    return 123
}
```
