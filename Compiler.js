import { Regex } from './Regex'
import { Grammar } from './Grammar'
export class Lexer {
  constructor(rules, input){
    this.rules = rules
    this.input = input
  }

  tokenize () {
    const stream = this.input
    let tokens = []
    for (let i = 0; i < stream.length; i++) {
      let added = false
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
          if (position - back >= regex.length) {
            i = i + position - 1
            tokens.push({'value': word, 'description': this.rules[o].description})
            added = true
            break;
          }
        }
      }
      if (!added) {
        throw new Error(`Uncaught syntax error: Invalid or unexpected token in position ${i} - ${stream[i - 2]}${stream[i - 1]}${stream[i]}${stream[i + 1]}${stream[i + 2]}`)
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

export class Parser {
  constructor (grammar, tokens) {
    this.grammar = grammar
    this.tokens = tokens
  }
  
  walk () {
    let stack = []

    for (let token in this.tokens) {
      if (!(this.tokens[token].description == 'whitespace' || this.tokens[token].description == 'comment')) {
        stack.push(this.tokens[token])

        let current = 0
        let val = false
        let evalStack

        while (current < stack.length) {
          current ++
          evalStack = stack.slice(stack.length - current, stack.length)
                  
          for (let i = 0; i < this.grammar.length; i++) {
            const rule = new Grammar(this.grammar[i].grammar).lex()
            val = this.compareStacks(evalStack, rule)
            if (val) {
              evalStack = {'value': evalStack, 'description': this.grammar[i].description}
              
              stack.splice(stack.length - current, current, evalStack)
              current = 0
              break
            }
          }
        }
      }
    }
    if (stack.length > 1) {
      throw new Error(`Uncaught syntax error: Invalid or unexpected token.`)
    }
    return stack
  }

  compareStacks (tokenStack, grammarRule) {
    if (tokenStack.length == grammarRule.length) {
      for (let i = 0; i < grammarRule.length; i++) {
        if (tokenStack[i].description != grammarRule[i]) {
          return false
        }
      }
      return true
    }
    return false
  }
} 