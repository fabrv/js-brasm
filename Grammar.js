export class Grammar {
  constructor (pattern) {
    this.pattern = pattern
  }

  lex () {
    let tokens = []
    let token = ''
    for (let i = 0; i < tokens.length; i ++) {
      const char = tokens[i]
      if (char = '<') {
        i ++
        while (tokens[i] !== '>') {
          token += tokens[i]
          i++
        }
        tokens.push({'value': token, 'terminal': false})
      }
    }
    return tokens
  }
}