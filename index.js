import { Lexer, Parser } from './src/Compiler';
import { AST } from './src/AST';
import * as fs from 'fs';
import inquirer from 'inquirer'
import minimist from 'minimist';

const inquirerFileTreeSelection = require('inquirer-file-tree-selection-prompt')

inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection)

const args = minimist(process.argv.slice(2))
let cmd = args._[0] || 'help'

const config = { input: `${process.cwd()}\\${cmd}`, output: 'a.out', stage: 'parse', opt: 'constant' }

if (args.help || args.h) {
  cmd = 'help'
}

if (args.o) {
  config.output = args.o
}

if (args.target) {
  console.log(args.target)
  config.stage = args.target
}

if (args.opt) {
  config.opt = args.opt
}

// eslint-disable-next-line eqeqeq
if (cmd == 'help') {
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
        message: 'Select output name'
      },
      {
        type: 'list',
        name: 'stage',
        message: 'Select stage',
        choices: [
          'scan',
          'parse',
          {
            name: 'ast',
            disabled: 'Unavailable at this time'
          },
          {
            name: 'semantic',
            disabled: 'Unavailable at this time'
          },
          {
            name: 'irt',
            disabled: 'Unavailable at this time'
          },
          {
            name: 'codegen',
            disabled: 'Unavailable at this time'
          }
        ]
      },
      {
        type: 'list',
        name: 'opt',
        message: 'Select optimization',
        choices: [
          'constant',
          'algebraic',
        ]
      }
    ])
    .then(answers => {
      console.log(answers)
      run(answers)
    }
    )
} else {
  run(config)
}

function run (config) {
  const code = fs.readFileSync(config.input,'utf8')

  const rules = JSON.parse(fs.readFileSync('./regex/tokensRegex.json', 'utf8'))
  const grammar = JSON.parse(fs.readFileSync('./regex/grammar.json', 'utf8'))

  const Lex = new Lexer(rules, code)
  const tokens = Lex.tokenize()

  switch (config.stage) {
    case 'scan':
      console.log(tokens)
      break;
    case 'parse':
      const parse = new Parser(grammar, tokens)
      const tree = new AST(parse.parse()).cleanTree()
      console.log(JSON.stringify(tree, null, 2))
      const semCheck = new AST(tree).semCheck()
      break;
    default:
      console.error('Stage not available')
  }
}