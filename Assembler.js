class Assembler {
  /**
   * Assembler class, convertes BRASM code into brainfuck.
   * @param {string} code - Code block in BRASM to assemble into Brainfuck.
   * @param {Operators} operators ? (Optional)- Operator object, mnemonic of each operator.
   */
  constructor (body = ''){
    this.body = body
    this.lines = this.tokenize()
  }

  tokenize() {
    const lines = this.body.split('\n')
    for (let i = 0; i < lines.length; i++) {
      lines[i] = lines[i].split(' ')
    }
    return lines
  }
}
