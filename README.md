# mindee-api-node

# Installation
## From source code

Download and decompress or clone the source code from github and then do in your node project :

```sh
npm install path\to\mindee-api-node
```

# Run tests

First, link your package to the test repository by linking the node package to the tests :
```sh
cd mindee-api-node/
npm link
cd tests/
npm link mindee
```
To run the tests, use the command `node index.js` inside the `tests` folder
