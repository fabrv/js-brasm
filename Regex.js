export class Regex {
  constructor (regex) {
    this.regex = regex
    this.tokens = [
      {
        'key': '*',
        'value': 0
      },
      {
        'key': '+',
        'value': 1
      },
      {
        'key': '[',
        'value': 2
      },
      {
        'key': ']',
        'value': 3
      },
    ]
  }  

  test(pattern) {
  }

  lexPattern(pattern) {
    let tokens = []
    for (let c = 0; c < pattern.length; c ++) {
      for (let i = 0; i < this.tokens.length; i ++) {
        if (pattern[c] == this.tokens[i]) {
          tokens.push(this.tokens[i])
        }
      }
    }
  }
  
  rangeMaker(a, b) {
    string = ''
    for (let i = a; i < b; i++) {
      string += String.fromCharCode(i);
    }
    return string
  }
}