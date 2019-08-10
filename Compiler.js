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
        let lastPos = 0
        if (inRange) {
          while (inRange) {
            word += stream[i + position]
            position ++

            if (regex[position - back] == '+') {
              back ++
              if (lastPos == 0) {
                lastPos = position
              }
            }

            inRange = this.validateChar(stream[i + position], regex[position - back])

            if (!inRange && regex[position - back + 1] == '+') {
              back -= 2
              inRange = this.validateChar(stream[i + position], regex[position - back])
            }
          }
          //console.log(word, regex[position - back], regex.length)
          if (regex[position - back + 1] === undefined) {
            i = i + position - 1
            tokens.push({'value': word, 'description': this.rules[o].description})
            break;
          }
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