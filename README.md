<p align="center"><img alt="clean react logo" src="https://raw.githubusercontent.com/mhanki/Clean-React/master/assets/logo.png" /></p>

---

Clean React is a CLI tool that removes and modifies some of the boilerplate files that are generated when initiating a new project with [Create React App](https://create-react-app.dev/).

The tool is designed to provide a clean and minimalistic code base to your new project. It will first check to make sure you actually are in a Create React App project, and then proceed to delete and overwrite files [based on these templates](https://github.com/mhanki/clean-react/tree/master/templates/default).

Clean React supports cleanup for both default Create React App templates ([JavaScript](https://github.com/facebook/create-react-app/tree/master/packages/cra-template) and [TypeScript](https://github.com/facebook/create-react-app/tree/master/packages/cra-template-typescript)). 

Please note: This is just a quick helper tool. If you find yourself wanting to create and use your own custom template from the get-go, you can actually do so via Create React App itself. Find more information [here](https://create-react-app.dev/docs/custom-templates/).

## Installation

Please install the package **globally**

```sh
npm install -g @mhanki/clean-react
```  

## Usage

From the root of your project, simply run the command:

```sh
clean-react
```


If you already modified one or more of the files that Clean React tries to rewrite, it will prompt you with a warning and ask if you want to keep the changes before it proceeds.  
