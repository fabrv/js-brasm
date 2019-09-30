import { Lexer, Parser } from "./src/Compiler";
import * as fs from 'fs'
import * as inquirer from 'inquirer'
const inquirerFileTreeSelection = require('inquirer-file-tree-selection-prompt')

inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection)

//const path = `${process.cwd()}\\${process.argv[2]}`
//const code = fs.readFileSync(path,'utf8')
console.log(process.argv)

inquirer.prompt(
  [
    {
      type: 'file-tree-selection',
      name: 'input',
      message: 'Select input file'
    },
    {
      type: 'input',
      name: 'output',
      message: "Select output name"
    },
    {
      type: 'list',
      name: 'stage',
      message: 'Select stage',
      choices: [
        'Scanning',
        'Parsing',
        {
          name: 'AST',
          disabled: 'Unavailable at this time'
        },
        {
          name: 'Semantic',
          disabled: 'Unavailable at this time'
        },
        {
          name: 'IRT',
          disabled: 'Unavailable at this time'
        },
        {
          name: 'Codegen',
          disabled: 'Unavailable at this time'
        }
      ]
    },
    {
      type: 'list',
      name: 'opt',
      message: 'Select optimization',
      choices: [
        'Constant',
        'Algebraic',
      ]
    }
  ])
  .then(answers => {
    console.log(answers);
  }
);

/*

const rules = JSON.parse(fs.readFileSync('./regex/tokensRegex.json', 'utf8'))
const grammar = JSON.parse(fs.readFileSync('./regex/grammar.json', 'utf8'))

const Lex = new Lexer(rules, code)
const tokens = Lex.tokenize()

const parse = new Parser(grammar, tokens)
console.log(tokens)
console.log('---')
console.log(JSON.stringify(parse.parse(), null, 2))
*/