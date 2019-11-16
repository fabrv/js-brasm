/* eslint-disable no-case-declarations */
import { Lexer, Parser } from './src/Compiler'
import { AST } from './src/AST'
import * as fs from 'fs'
import inquirer from 'inquirer'
import minimist from 'minimist'
import { Codegen } from './src/Codegen'

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
          'algebraic'
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
  const code = fs.readFileSync(config.input, 'utf8')

  const rules = JSON.parse(fs.readFileSync('./regex/tokensRegex.json', 'utf8'))
  const grammar = JSON.parse(fs.readFileSync('./regex/grammar.json', 'utf8'))

  const Lex = new Lexer(rules, code)
  const tokens = Lex.tokenize()

  switch (config.stage) {
    case 'scan':
      console.log(tokens)
      break
    case 'parse':
      const parse = new Parser(grammar, tokens)
      const tree = new AST(parse.parse()).cleanTree()
      // const semCheck = new AST(tree).semCheck()
      // console.log(JSON.stringify(tree))
      const codegen = new Codegen(tree)
      codegen.AST = codegen.traverse()
      // codegen.AST = [["\n f proc \n push bp \n mov bp, sp",[["\n mov ax, ",{"code":["\n mov ax, ","word ptr [bp + 4]","\n mov cx, ","word ptr [bp + 6]","\n add ax, cx","\n mov ","word ptr [bp + 4]",", ax"],"return":"word ptr [bp + 4]"},"\n jmp .012"],"\n .012:"],"\n pop bp \n ret 4 \n f endp"],["\n main proc \n push bp \n mov bp, sp","\n mov bx, 3000",["","",["\n mov ax, ","word ptr [bx - 4]","\n mov cx, ","2","\n mov ax, cx \n mov ","word ptr [bx - 4]",", ax"],["\n call f\n push 8\n push 7"],"\n .034:"],"\n mov ah,4CH \n int 21H","\n pop bp \n ret  \n main endp"]]
      // console.log(JSON.stringify(codegen.AST))
      codegen.AST = codegen.expressionReturn()
      // console.log(JSON.stringify(codegen.AST))
      const code = codegen.heading(codegen.build())

      fs.writeFileSync(`${process.cwd()}\\bin.asm`, code)
      console.log('code built')
      break
    default:
      console.error('Stage not available')
  }
}
