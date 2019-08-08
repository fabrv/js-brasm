import { Lexer } from "./Compiler";
import * as fs from 'fs'

const path = `${process.cwd()}\\${process.argv[2]}`
const code = fs.readFileSync(path,'utf8')

const rules = JSON.parse(fs.readFileSync('tokensRegex.json', 'utf8'))

const Lex = new Lexer(rules, code)
console.log(Lex.tokenize())