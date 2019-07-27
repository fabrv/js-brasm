import { Lexer } from "./Compiler";
import * as fs from 'fs'

const path = `${process.cwd()}\\${process.argv[2]}`
const code = fs.readFileSync(path,'utf8')

const rules = JSON.parse(fs.readFileSync('tokensRegex.json', 'utf8'))

for (let i = 0; i < rules.length; i++) {
  console.log(`${i}) Rules:`, rules[i])
  const Lex = new Lexer(rules[i], code)
  console.log(Lex.tokenize().length == rules[i].length)
}