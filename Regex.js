export class Regex {
  constructor (pattern) {
    this.pattern = pattern
  }

  lex() {
    if (this.pattern == '[') {
      tokens.push('[')
      return tokens
    }
    let tokens = []
    for (let c = 0; c < this.pattern.length; c++) {
      if (this.pattern[c] == '[') {
        c++
        let word = ''
        while (this.pattern[c] != ']') {
          if (this.pattern[c + 1] == '-' && this.pattern[c + 2] != ']') {
            word += this.range(this.pattern[c], this.pattern[c + 2])
            c += 3
          } else {
            word += this.pattern[c]
            c++
          }

          if (c == this.pattern.length) {
            throw new Error('No closing bracket.')
          }
        }
        tokens.push(word)
        c++
      }
      tokens.push(this.pattern[c])
    }
    
    return tokens
  }

  range(a = '', b = '') {
    let value = ''
    const valA = a.charCodeAt(0)
    const valB = b.charCodeAt(0)
    for (let i = valA; i <= valB; i++) {
      value += String.fromCharCode(i)
    }
    return value
  }
}