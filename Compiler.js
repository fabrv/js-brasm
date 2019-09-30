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
      console.error(stack)
      throw new Error(`Uncaught syntax error: Invalid or unexpected token.`)
    }
    return stack
  }

  compareStacks (tokenStack, grammarRule) {
    if (!grammarRule.includes(tokenStack[0].description)) {
      return false
    }
    if (tokenStack.length != grammarRule.length && !(grammarRule.includes('+') || grammarRule.includes('?') || grammarRule.includes(',+'))) {
      return false
    }
    let stackPosition = 0
    let rulePosition = 0
    while (rulePosition < grammarRule.length) {
      /*
      console.log('RULE')
      console.log(rulePosition, grammarRule)
      console.log('STACK')
      console.log(stackPosition, tokenStack)
      console.log('----')
      */
     
      if (tokenStack[stackPosition].description == grammarRule[rulePosition]) {
        stackPosition += 1
        rulePosition += 1
        if (stackPosition >= tokenStack.length && rulePosition < grammarRule.length) {
          if (grammarRule[rulePosition + 1] == '?' || grammarRule[rulePosition + 1] == '+') {
            if (rulePosition + 2 == grammarRule.length && grammarRule[rulePosition + 1] == '?') {
              return true
            }
          }
          return false
        }
      } else {
        switch (grammarRule[rulePosition]) {
          case "+":
            rulePosition -= 1
            //stackPosition += 1
            break;
          case "?":
            //stackPosition += 1
            rulePosition += 1
            break;
          default:
            switch (grammarRule[rulePosition + 1]) {
              case "?":
              case "+":
                if (rulePosition + 2 > grammarRule.length) {
                  return false
                }
                rulePosition += 2
                break;
              default:
                return false
            }
        }
      }
    }
    
    return true
  }
}