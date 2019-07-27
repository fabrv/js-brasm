import { Lexer } from "./Compiler";
import * as fs from 'fs'

const path = `${process.cwd()}\\${this.args._[1]}`
const code = fs.readFileSync(path,'utf8')

const rules = JSON.parse(fs.readFileSync('tokensRegex.json', 'utf8'))
console.log(rules)

const Lex = new Lexer(rules[2], code)

console.log(Lex.tokenize())