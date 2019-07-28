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
        let re = new RegExp(this.rules[o].regex)
        if (re.test(word)) {
          while (re.test(word + stream[i + 1]) && i < stream.length - 1) {
            i += 1
            word += stream[i]
          }
          tokens.push(word)
          word = ''
        }
      }
    }
    console.log(tokens)
    return tokens
  }
}