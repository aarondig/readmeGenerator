const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");

const writeFileAsync = util.promisify(fs.writeFile);

function promptUser() {
   return inquirer.prompt([
      {
        type: "input",
        name: "user",
        message: "Enter your GitHub username:"
      },
      {
        type: "input",
        name: "email",
        message: "Enter your email:"
      },
      {
        type: "input",
        name: "title",
        message: "What is your project title?"
      },
      {
        type: "input",
        name: "description",
        message: "Describe your project:"
      },
      {
        type: "list",
        name: "license",
        message: "Enter preferend license:",
        choices: ["MIT","ISC","ZLIB"]
      },
      {
        type: "input",
        name: "installation",
        message: "What command is needed to install dependancies?"
      },
      {
        type: "input",
        name: "test",
        message: "What command is used to run tests?"
      },
      {
        type: "input",
        name: "usage",
        message: "Any additional information needed to use the repo?"
      },
      {
        type: "input",
        name: "contributing",
        message: "Any additional information needed to contribute to the repo?"
      },
    ]);
  }
  
  function generateREADME(response, userUrl, userImg) {
    return `
# ${response.title}

[![License: ${response.license}](https://img.shields.io/badge/License-${response.license}-yellow.svg)](https://opensource.org/licenses/${response.license})

## Description

${response.description}

<br>

## Table of Contents

* [Installation](#installation)

* [Tests](#test)

* [Usage](#usage)

* [License](#license)

* [Contributing](#contributing)

* [Questions](#questions)

<br>

## Installation

Before running a test, be sure to run:

    ${response.installation}

<br>

## Test

Run this command to test:

    ${response.test}

<br>
    
## Usage

${response.usage}

<br>

## License

Copyright protected under the open source ${response.license} License.

<br>

## Contributing

${response.contributing}

<br>

## Questions

If you have any questions, open an issue or contact me directly at [${response.email}](${response.email}). 

More of my work can be found at [${response.user}](${userUrl}).

<br>

<img src="${userImg}" width="25%" alt="User Image">
    `;
  }
  
  promptUser()
    .then(function(response) {
        const url = `https://api.github.com/users/${response.user}`;
        axios.get(url).then(function(userData){
            const userUrl = userData.data.html_url;
            const userImg = userData.data.avatar_url;
            const readme = generateREADME(response, userUrl, userImg);
            return writeFileAsync("Test/README.md", readme);
            })
    })
    .then(function() {
        console.log("Success");
    })
    .catch(function(err) {
        console.log(err);
    });
