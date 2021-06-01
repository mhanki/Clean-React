const dirsToCheck = ["src", "public", "node_modules"]

const filesToRemove = {
  "src": [
    "setupTests.js",
    "reportWebVitals.js",
    "logo.svg",
    "App.test.js"
  ],
  "public": [
    "favicon.ico",
    "logo192.png",
    "logo512.png",
    "manifest.json",
    "robots.txt"
  ]
}

const filesToRewrite = [
{
  "filePath": "public/index.html",
  "content": 
`<!DOCTYPE html>
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
</html>`
},
{
  "filePath": "src/App.js",
  "content": 
`import React from 'react'
import './App.css'

function App() {
  return (
    <div>
      <p>Clean React App</p>
    </div>
  )
}

export default App`
},
{
  "filePath": "src/index.js",
  "content":
`import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)`
},
{
  "filePath": "src/App.css",
  "content": ''
},
{
  "filePath": "src/index.css",
  "content": ''
},
{
  "filePath": "README.md",
  "content": ''
}
]

export { filesToRemove, filesToRewrite, dirsToCheck }