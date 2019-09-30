import { Lexer, Parser } from "./src/Compiler";
import * as fs from 'fs'

const path = `${process.cwd()}\\${process.argv[2]}`
const code = fs.readFileSync(path,'utf8')

const rules = JSON.parse(fs.readFileSync('./regex/tokensRegex.json', 'utf8'))
const grammar = JSON.parse(fs.readFileSync('./regex/grammar.json', 'utf8'))

const Lex = new Lexer(rules, code)
const tokens = Lex.tokenize()

const parse = new Parser(grammar, tokens)
console.log(tokens)
console.log('---')
console.log(JSON.stringify(parse.parse(), null, 2))