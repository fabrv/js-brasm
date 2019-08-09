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

        if (stream[i] == this.rules[o].regex[position]) {
          let word = stream[i]
          
          let back = 0
          position ++
          if (this.rules[o].regex[position] == '+') back ++
          console.log(stream[i + position], this.rules[o].regex[position - back])
          while(stream[i + position] == this.rules[o].regex[position - back] && position - back <= this.rules[o].regex.length && i + position - back < stream.length) {
            word += stream[i + position]
            position ++

            if (this.rules[o].regex[position] == '+') back ++
            console.log(position, back, position - back)
          }
          if (position == this.rules[o].regex.length) {
            i += position
            tokens.push({'value': word, 'type': this.rules[o].description})
          }
        }
      }
    }
    
    return tokens
  }
}