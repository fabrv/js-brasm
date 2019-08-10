import { Regex } from './Regex'
export class Lexer {
  constructor(rules, input){
    this.rules = rules
    this.input = input
  }

  tokenize(){
    const stream = this.input
    let tokens = []
    for (let i = 0; i < stream.length; i++) {
      for (let o = 0; o < this.rules.length; o++) {
        let position = 0
        let back = 0
        const regex = new Regex(this.rules[o].regex).lex()

        let inRange = this.validateChar(stream[i], regex[position])
        let word = ''
        if (inRange) {
          while (inRange) {
            word += stream[i + position]
            position ++

            if (regex[position - back] == '+') back ++

            inRange = this.validateChar(stream[i + position], regex[position - back])
          }
          i = i + position
          tokens.push({'value': word, 'description': this.rules[o].description})
        }
      }
    }
    
    return tokens
  }

  validateChar (char, string) {
    let inRange = false
    for (let c in string) {
      let val = string[c]
      if (val == char) {
        inRange = true
      }
    }
    return inRange
  }
}