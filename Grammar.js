export class Grammar {
  constructor (pattern) {
    this.pattern = pattern
  }

  lex () {
    let tokens = []
    let token = ''
    for (let i = 0; i < this.pattern.length; i ++) {
      const char = this.pattern[i]
      token += char
      if (token != '' && (char == '<' || char == ' ' || i == this.pattern.length - 1)) {
        if (char == '<' || char == ' ') {
          token = token.substring(0, token.length - 1)
        }
        tokens.push({'value': token, 'terminal': true})
        token = ''
      }
      if (char == '<') {
        i ++
        while (this.pattern[i] !== '>') {
          token += this.pattern[i]
          i++
        }
        tokens.push({'value': token, 'terminal': false})
        token = ''
      }
    }    
    return tokens
  }
}