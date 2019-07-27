export class Lexer {
  constructor(rules, input){
    this.rules = rules
    this.input = input
  }

  tokenize(){
    const stream = this.input
    let tokens = []
    let word = ''
    for (let i = 0; i < stream.length; i++) {
      word += stream[i]
      for (let o = 0; o < this.rules.length; o++) {
        if (word == rule[o]) {
          tokens.push(word)
          word = ''
        }
      }
    }

    return tokens
  }
}