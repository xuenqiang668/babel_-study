const babelPluginImport = require('./babel-plugin-import')
const core = require("@babel/core")


const sourceCode = `
    import {cloneDeep, sum} from 'lodash'

    sum(1,2)

    var a = 2
    b = a
`

const preseCode = core.transform(sourceCode,{
    plugins: [
        babelPluginImport({
            libraryName: "lodash"
        })
    ]
}).code

// console.log(sourceCode);
console.log(preseCode);