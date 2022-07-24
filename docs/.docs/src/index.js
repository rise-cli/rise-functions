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
            <li class='selected'>
    <a href='index.html'>
      
        <span>Intro</span>
    </a>
</li>
<li class='false'>
    <a href='functions.html'>
      
        <span>Functions</span>
    </a>
</li>
<li class='false'>
    <a href='keywords.html'>
      
        <span>Keywords</span>
    </a>
</li>

        </ul>
    </div>
    <div class='wrapper'>
        <h1 id="introduction-to-rise-functions">Introduction to Rise Functions</h1>
<p>Rise Focus is a CLI which takes a <code>rise.js</code> file, and deploys AWS Lambda functions into your AWS account. All lambda functions are located in a /functions folder. The goal of rise functions is to make building AWS Lambda functions as simple and straight forward as possible.</p>
<h2 id="install">Install</h2>
<pre class="hljs language-bash"><code class="hljs language-bash"><span class="token function">npm</span> i -g rise-functions
</code></pre>
<h2 id="usage">Usage</h2>
<p>Deploy</p>
<pre class="hljs language-bash"><code class="hljs language-bash">rise-functions deploy
</code></pre>
<h2 id="project-structure">Project Structure</h2>
<p>A rise focus project as the following structure:</p>
<pre class="hljs language-bash"><code class="hljs language-bash">/functions
    /myFunctionA
        index.js
    /myFunctionB
        /node_modules
        index.js
rise.js
</code></pre>
<h2 id="what-is-the-risejs-file-for">What is the rise.js file for?</h2>
<p>The <code>rise.js</code> file is for configuring your project. In order to treat this as a rise functions project, type must be set to <code>functions</code> in this config. Here is an example:</p>
<pre class="hljs language-js"><code class="hljs language-js">module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">'functions'</span><span class="token punctuation">,</span>
    <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">'nameOfMyProject'</span><span class="token punctuation">,</span>
    <span class="token literal-property property">stage</span><span class="token operator">:</span> <span class="token string">'qa'</span><span class="token punctuation">,</span> <span class="token comment">// optional</span>
    <span class="token literal-property property">region</span><span class="token operator">:</span> <span class="token string">'us-east-1'</span> <span class="token comment">// optiona;</span>
<span class="token punctuation">}</span>
</code></pre>
<p>The only required parameter is the name. This will be used to name:</p>
<ul>
<li>the s3 bucket where your code will be uploaded</li>
<li>lambda functions</li>
<li>iam roles</li>
</ul>
<p>If stage and region are set, those values will inform the cli which region and stage to deploy to. It is much more common to set these values as cli flags in a CICD pipeline than to hard code them here.</p>
<h2 id="what-cli-flags-are-available">What CLI flags are available?</h2>
<h3 id="note-this-is-not-yet-implemented">Note: This is not yet implemented</h3>
<p>You can set the region and stage of your deployment like so:</p>
<pre class="hljs language-bash"><code class="hljs language-bash">focus deploy --stage<span class="token operator">=</span>qa --region<span class="token operator">=</span>us-east-2
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