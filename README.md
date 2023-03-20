# Rise Functions

Rise Functions is a CLI which takes a `rise.mjs` file, and deploys AWS Lambda functions into your AWS account. All lambda functions are located in a /functions folder. The goal of rise functions is to make building AWS Lambda functions as simple and straight forward as possible.

## Install

```bash
npm i -g rise-functions
```

## Usage

Deploy

```bash
rise-functions deploy
```

## Project Structure

A project as the following structure:

```bash
/functions
    myFunctionA.mjs
    myFunctionB.mjs
    myFunctionC.mjs
rise.mjs
```

If your function requires multiple files, or node_modules, functions can also be defined inside folders.

```bash
/functions
    /myFunctionA
        util.mjs
        index.mjs
    /myFunctionB
        /node_modules
        util.mjs
        index.mjs
rise.mjs
```

## What is the rise.mjs file for?

The `rise.mjs` file is for configuring your project. Here is an example:

```js
export default {
    name: 'nameOfMyProject',
    // optional
    domain: {
        name: 'mydomain.com',
        path: '/serviceA',
        stage: 'dev'
    }
}
```

The only required parameter is the name. This will be used to name:

-   the s3 bucket where your code will be uploaded
-   lambda functions
-   iam roles

## What CLI flags are available?

You can set the region and stage of your deployment like so:

```bash
rise-functions deploy --stage=qa --region=us-east-2
```
