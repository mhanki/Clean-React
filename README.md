# Clean React App

Clean React App is a CLI tool that removes and modifies some of the boilerplate files and code that are being generated when initiating a new project with [Create React App](https://create-react-app.dev/).

The tool is designed to provide a clean and minimalistic code base to your new project. It will first check to make sure you actually are in a Create React App project and then proceed to delete and overwrite [these files](https://github.com/mhanki/clean-react-app#modified-files).

## Installation
To install the package on your system, use global npm install
```
npm install -g clean-react-app
```  

## Usage
If you installed the package locally, simply cd into your project and run
```
clean-react-app
```
Alternatively you can also use [npx](https://docs.npmjs.com/cli/v7/commands/npx):
```
npx clean-react-app
```  

If you already modified one or more of the files that Clean React App [tries to rewrite](https://github.com/mhanki/clean-react-app#files-that-will-be-modified), it will prompt you with a warning and ask for your permission to proceed. Since the intended use of the app is to clean out the project *before* you start with your own code though, just beware that it **will delete** [these files](https://github.com/mhanki/clean-react-app#files-that-will-be-removed) without giving extra warnings.  

## Modified Files
### Files that will be removed:

- favicon.ico
- all logo files (logo192.png, logo512.png, logo.svg)
- manifest.json
- robots.txt
- reportWebVitals.js
- setupTests.js
- App.test.js

### Files that will be modified:
Clean React App will empty the following files:
- index.css
- App.css
- README.md

And replace these files with the following content:  
  
- index.html
```js
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title></title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

- index.js
```js
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
```

- App.js
```js
import React from 'react'
import './App.css'

function App() {
  return (
    <div>
      <p>Clean React App</p>
    </div>
  )
}

export default App
```