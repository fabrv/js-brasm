import { Lexer } from "./Compiler";
import * as fs from 'fs'

const path = `${process.cwd()}\\${this.args._[1]}`
const code = fs.readFileSync(path,'utf8')
const Lex = new Lexer({}, code)

console.log(Lex.tokenize())