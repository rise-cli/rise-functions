# Introduction to Rise Functions

Rise Focus is a CLI which takes a `rise.mjs` file, and deploys AWS Lambda functions into your AWS account. All lambda functions are located in a /functions folder. The goal of rise functions is to make building AWS Lambda functions as simple and straight forward as possible.

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

A rise focus project as the following structure:

```bash
/functions
    /myFunctionA
        config.mjs
        index.mjs
    /myFunctionB
        /node_modules
        config.mjs
        index.mjs
rise.mjs
```

## What is the rise.js file for?

The `rise.mjs` file is for configuring your project. In order to treat this as a rise functions project, type must be set to `functions` in this config. Here is an example:

```js
module.exports = {
    type: 'functions',
    name: 'nameOfMyProject'
}
```

The only required parameter is the name. This will be used to name:

-   the s3 bucket where your code will be uploaded
-   lambda functions
-   iam roles

## What CLI flags are available?

You can set the region and stage of your deployment like so:

```bash
focus deploy --stage=qa --region=us-east-2
```

## More Details

-   [Functions](./docs/functions.md)
-   [Keywords](./docs/keywords.md)
