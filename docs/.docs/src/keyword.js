module.exports = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
    <title>Document</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/highlight.min.js"></script>
   
    <style>
        body {
            font-family: system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,Helvetica,Arial,Apple Color Emoji,Segoe UI Emoji;
            color: rgb(17, 24, 39);
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Inter;
        }

        h1 {
            opacity: 1;
            margin-top: 5rem;
            line-height: 1.25;
            font-size: 3rem;
            font-weight: 700;
            font-family: Inter;
            border-bottom: 1px solid rgb(229, 231, 235);
            margin-bottom: 20px;
            padding-bottom: 1rem;
        }

        h2 {
            margin-top: 2.5rem;
            line-height: 2.25;
            font-size: 2rem;
            font-weight: 700;
            font-family: Inter;

            margin-top: 2rem;
            margin-bottom: 1.5rem;
        }

        p {
            color: rgb(55, 65, 81);
            margin: 0;
            margin-bottom: 1rem;
        }

        nav {
            height: 60px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #f4f4f8;
            padding: 0 20px;
            position: fixed;
            z-index: 100;
            top: 0;
            right: 0;
            left: 0;
            background: white;
        }
        nav p {
            margin: 0;
        }

        .wrapper {
            max-width: 768px;
            margin-left: auto;
            margin-right: auto;
            line-height: 1.5;
            width: 90%;
        }
     
        .side-container {
            position: fixed;
            top: 61px;
            left: 0px;
            bottom: 20px;
            background: white;
            width: 200px;
            margin: 0;
            padding: 0;
            padding-top: 20px;
         
        }

        .side-container ul {
            margin: 0;
            padding: 0 20px;
        }

        .side-container li {
            list-style: none;
            padding: 6px 0 6px 0;
            border: 1px solid #fff;
            border-radius: 6px;
        }

        .side-container li.selected {
            background: #f4f4f8;
            border: 1px solid #eaeaed;
            border-radius: 6px;
        }

        .side-container a {
            color: rgb(113, 113, 113);
            display: flex;
            align-items: center;
            text-decoration: none;
            font-size: 14px;
            margin-left: 20px;
            
        }

        .side-container svg {
            margin-right: 6px;
            opacity: 0.3;
            margin-left: 20px;
        }

        .hamburger {
            margin-left: auto;
            display: none;
        }


        @media(max-width: 1200px) {
            .side-container {
               
                overflow-y: scroll;
                height: 100vh;
                width: 100%;
                transform: translateX(100%);
            }
            .side-container.open {
                transform: translateX(0);
            }
            .hamburger {
                display: block;
            }
        }

     
        .hamburger .line{
            width: 16px;
            height: 2px;
            background-color: rgb(17, 24, 39);
            display: block;
            margin: 3px auto;
            -webkit-transition: all 0.2s ease-in-out;
            -o-transition: all 0.2s ease-in-out;
            transition: all 0.2s ease-in-out;
        }

        .hamburger:hover{
            cursor: pointer;
        }

        .hamburger.open .line:nth-child(2){
            opacity: 0;
        }

        .hamburger.open .line:nth-child(1){
            -webkit-transform: translateY(5px) rotate(45deg);
            -ms-transform: translateY(5px) rotate(45deg);
            -o-transform: translateY(5px) rotate(45deg);
            transform: translateY(5px) rotate(45deg);
        }

        .hamburger.open .line:nth-child(3){
            -webkit-transform: translateY(-5px) rotate(-45deg);
            -ms-transform: translateY(-5px) rotate(-45deg);
            -o-transform: translateY(-5px) rotate(-45deg);
            transform: translateY(-5px) rotate(-45deg);
        }

        code[class*='language-'],
            pre[class*='language-'] {
            color: #e4f0fb;
            background: none;
            text-shadow: 0 1px rgba(0, 0, 0, 0.3);
            font-family: Menlo, Monaco, 'Courier New', monospace;
            font-size: 0.95em;
            text-align: left;
            white-space: pre;
            word-spacing: normal;
            word-break: normal;
            word-wrap: normal;
            line-height: 1.5;

            -moz-tab-size: 4;
            -o-tab-size: 4;
            tab-size: 4;

            -webkit-hyphens: none;
            -moz-hyphens: none;
            -ms-hyphens: none;
            hyphens: none;
        }

        /* Code blocks */
        pre[class*='language-'] {
            --comment: #a6accd;
            --punctuation: #e4f0fb;
            --property: #e4f0fb;
            --boolean: #5de4c7;
            --string: #5de4c7;
            --operator: #add7ff;
            --function: #5de4c7;
            --keyword: #add7ff;
            --literal: #fffac2;
            --falsy: #f087bd;

            padding: 1.75em;
            margin: 1.5em 0;
            overflow: auto;
            border-radius: 0.75em;
            border-radius: 0.75em;
        }

        :not(pre) > code[class*='language-'],
            pre[class*='language-'] {
            background: #252b37;
            
        }

        /* Inline code */
        :not(pre) > code[class*='language-'] {
            padding: 0.1em;
            border-radius: 0.3em;
            white-space: normal;
        }

        .token.namespace {
            opacity: 0.7;
        }

        .token.comment,
        .token.prolog,
        .token.doctype,
        .token.cdata {
            color: var(--comment);
        }

        .token.punctuation {
            color: var(--punctuation);
        }

        .token.property,
        .token.tag,
        .token.constant,
        .token.symbol,
        .token.deleted {
            color: var(--property);
        }

        .token.boolean,
        .token.number {
            color: var(--boolean);
        }

        .token.selector,
        .token.attr-value,
        .token.string,
        .token.char,
        .token.builtin,
        .token.inserted {
            color: var(--string);
        }

        .token.attr-name,
        .token.operator,
        .token.entity,
        .token.url,
        .language-css .token.string,
        .style .token.string,
        .token.variable {
            color: var(--operator);
        }

        .token.atrule,
        .token.function,
        .token.class-name {
            color: var(--function);
        }

        .token.keyword {
            color: var(--keyword);
        }

        .token.regex,
        .token.important {
            color: var(--literal);
        }

        .token.deleted {
            color: var(--falsy);
        }

        .token.important,
        .token.bold {
            font-weight: bold;
        }
        .token.italic {
            font-style: italic;
        }

        .token.entity {
            cursor: help;
        }
    </style>
</head>
<body>
    <nav>
        <svg  height="14px" viewBox="0 0 50 50" version="1.1">
    <defs>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-1">
            <stop stop-color="#F0649B" offset="0%"></stop>
            <stop stop-color="#E95076" offset="100%"></stop>
        </linearGradient>
    </defs>
    <g id="logo" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <circle id="circle" fill="url(#linearGradient-1)" cx="25" cy="25" r="25"></circle>
    </g>
</svg><p style='margin-left: 6px; font-weight: bold'>Rise Functions</p>
        <p style='font-weight: normal; color: #adb3be; margin-left: 4px;'> Documentation</p>
     
        <div id='menu-button' class="hamburger" id="hamburger-1">
          <span class="line"></span>
          <span class="line"></span>
          <span class="line"></span>
        </div>
    </nav>
    <div id='menu' class="side-container">
        <ul>
            <li class='false'>
    <a href='index.html'>
      
        <span>Intro</span>
    </a>
</li>
<li class='false'>
    <a href='functions.html'>
      
        <span>Functions</span>
    </a>
</li>
<li class='selected'>
    <a href='keyword.html'>
      
        <span>Keyword</span>
    </a>
</li>

        </ul>
    </div>
    <div class='wrapper'>
        <h1 id="keywords">Keywords</h1>
<p>Keywords are a way to reference dynamic values in your rise.js file or functionconfig, you can reference:</p>
<ul>
<li>Stage</li>
<li>Region</li>
<li>AccountId</li>
<li>CloudFormation Outputs</li>
<li>SSM Parameter Store</li>
</ul>
<p>All keywords use the following format: <code>{@keyword}</code>.</p>
<h2 id="stage">Stage</h2>
<p>It is common to deploy to many stages, and there may be times we want to reference a value or resource based on the stage we are in. We can do this by using the stage keyword:</p>
<pre class="hljs language-js"><code class="hljs language-js"><span class="token keyword">const</span> stage <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">{@stage}</span><span class="token template-punctuation string">`</span></span>
</code></pre>
<p>An example of when we might use stage is to pass this as an env variable into our Lambda function:</p>
<pre class="hljs language-js"><code class="hljs language-js"><span class="token comment">// index.js</span>
module<span class="token punctuation">.</span>exports<span class="token punctuation">.</span>config <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">env</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token constant">STAGE</span><span class="token operator">:</span> <span class="token string">'{@stage}'</span><span class="token punctuation">,</span>
        <span class="token constant">SOME_ENDPOINT</span><span class="token operator">:</span> <span class="token string">'https://myendpoint-{@stage}.com'</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre>
<h2 id="region">Region</h2>
<p>You can reference the region as follows:</p>
<pre class="hljs language-js"><code class="hljs language-js"><span class="token keyword">const</span> region <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">{@region}</span><span class="token template-punctuation string">`</span></span>
</code></pre>
<p>An example of when we might use region is to build up an arn value:</p>
<pre class="hljs language-js"><code class="hljs language-js"><span class="token comment">// index.js</span>
module<span class="token punctuation">.</span>exports<span class="token punctuation">.</span>config <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">env</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token constant">TOPIC</span><span class="token operator">:</span> <span class="token string">'arn:aws:sns:{@region}:12341234:ChatOpsTopic'</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre>
<h2 id="accountid">AccountId</h2>
<p>You can reference your account id as follows:</p>
<pre class="hljs language-js"><code class="hljs language-js"><span class="token keyword">const</span> accountId <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">{@accountId}</span><span class="token template-punctuation string">`</span></span>
</code></pre>
<p>An example of when we might use accountId is to build up an arn value:</p>
<pre class="hljs language-js"><code class="hljs language-js"><span class="token comment">// index.js</span>
module<span class="token punctuation">.</span>exports<span class="token punctuation">.</span>config <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">permissions</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
            <span class="token literal-property property">Effect</span><span class="token operator">:</span> <span class="token string">'Allow'</span><span class="token punctuation">,</span>
            <span class="token literal-property property">Action</span><span class="token operator">:</span> <span class="token string">'dynamodb:Query'</span><span class="token punctuation">,</span>
            <span class="token literal-property property">Resource</span><span class="token operator">:</span> <span class="token string">'arn:aws:dynamodb:us-east-1:{@accountId}:table/myTable'</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre>
<h2 id="cloudformation-outputs">CloudFormation Outputs</h2>
<p>Every deployed CloudFormation template has the option of defining outputs. This is great for dynamically referring to resource names or resource arns. Example, if we have deployed the following template:</p>
<pre class="hljs language-bash"><code class="hljs language-bash">Resources:
    Notes:
        Type: <span class="token string">'AWS::DynamoDB::Table'</span>
        Properties:
            <span class="token comment">#...bunch of properties</span>
Outputs:
    NotesArn:
        Value:
            <span class="token string">'Fn::GetAtt'</span><span class="token builtin class-name">:</span>
                - Notes
                - Arn
</code></pre>
<p>The ARN of the table is made available for us to reference by refering to the NotesArn output. You can reference this value with the following keyword:</p>
<pre class="hljs language-js"><code class="hljs language-js"><span class="token keyword">const</span> arn <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">{@output.stackName.NotesArn}</span><span class="token template-punctuation string">`</span></span>
</code></pre>
<p>A common scenario for using outputs would be to define iam permissions for a lambda function, Example:</p>
<pre class="hljs language-js"><code class="hljs language-js"><span class="token comment">// index.js</span>
module<span class="token punctuation">.</span>exports<span class="token punctuation">.</span>config <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">permissions</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
            <span class="token literal-property property">Effect</span><span class="token operator">:</span> <span class="token string">'Allow'</span><span class="token punctuation">,</span>
            <span class="token literal-property property">Action</span><span class="token operator">:</span> <span class="token string">'dynamodb:Query'</span><span class="token punctuation">,</span>
            <span class="token literal-property property">Resource</span><span class="token operator">:</span> <span class="token string">'{@output.stackName.NotesArn}'</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre>
<h2 id="ssm-parameter-store">SSM Parameter Store</h2>
<p>SSM Parameter Store is an AWS service for storing parameters in your account.
This can be likened to other services like Github or Vercel which allow you to set
env variables to reference in your deployment pipeline. It is important to note that
you should not use parameter store if the value is a secret. Consider using AWS Secret Manager
for senstive secrets and keys, and parameter store for values you are fine being visible as plain text
in code or in Lambda config.</p>
<p>You can reference a parameter as follows:</p>
<pre class="hljs language-js"><code class="hljs language-js"><span class="token keyword">const</span> endpoint <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">{@ssm.external_service_endpoint}</span><span class="token template-punctuation string">`</span></span>
</code></pre>
<p>An example of when we might use ssm is to pass this as an env variable into our Lambda function:</p>
<pre class="hljs language-js"><code class="hljs language-js"><span class="token comment">// index.js</span>
module<span class="token punctuation">.</span>exports<span class="token punctuation">.</span>config <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">env</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token constant">EXTERNAL_SERVICE_ENDPOINT</span><span class="token operator">:</span> <span class="token string">'{@ssm.my_external_service_endpoint}'</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre>

    </div>
    <script>
            let menuOpen = false;
            document.getElementById('menu-button')
                .addEventListener('click', () => {
                    menuOpen = !menuOpen
                    if (menuOpen) {
                        document.getElementById('menu').className = 'side-container open'
                        document.getElementById('menu-button').className = 'hamburger open'
                    } else {
                        document.getElementById('menu').className = 'side-container'
                        document.getElementById('menu-button').className = 'hamburger'
                    }
                })
    </script>
</body>
</html>`