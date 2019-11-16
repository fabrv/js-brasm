export class Codegen {
  constructor (AST) {
    this.blocks = 0
    this.AST = this.setBlockID(AST)
    this.variables = ['']
    this.params = ['', '']
    this.strings = []
  }

  heading (code) {
    let stringsCode = ''
    for (const str in this.strings) {
      stringsCode += `\n string${str} db '${this.strings[str].substring(1, this.strings[str].length - 1)}', '$'`
    }
    return `.model small \n.stack 200 \n.data \n ri db ? ${stringsCode} \n.code \n mov ax, @data \n mov ds, ax \n call main \r\n ${code}`
  }

  returnText (rtn) {
    if (typeof rtn !== 'string') {
      rtn = this.returnText(rtn.return)
    }
    return rtn
  }

  build (node = this.AST) {
    for (let i = 0; i < node.length; i++) {
      if (Array.isArray(node[i])) {
        node[i] = this.build(node[i])
      }
    }

    node = node.join('')

    return node
  }

  expressionReturn (node = this.AST) {
    const expressions = []
    let adder = 0
    for (let i = 0; i < node.length; i++) {
      if (Array.isArray(node[i])) {
        node[i] = this.expressionReturn(node[i])
      } else if (typeof node[i] === 'object') {
        expressions.push(i)
      }
    }

    for (const exp in expressions) {
      const tempNode = node[expressions[exp] + adder].code.concat(node)
      adder += node[expressions[exp] + adder].code.length
      tempNode[expressions[exp] + adder] = tempNode[expressions[exp] + adder].return
      node = tempNode
    }

    return node
  }

  traverse (node = this.AST) {
    for (let i = 0; i < node.value.length; i++) {
      if (Array.isArray(node.value[i].value)) {
        node.value[i] = this.traverse(node.value[i])
      }
    }

    switch (node.description) {
      case 'var_decl':
        return this.varDeclaration(node)
      case 'location':
        return this.location(node)
      case 'bin_op':
        return this.binOp(node)
      case 'expr':
        return this.expression(node)
      case 'statement':
        return this.statement(node)
      case 'block':
        return this.block(node)
      case 'method_decl':
        return this.methodDeclaration(node)
      case 'param_decl':
        return this.paramDeclaration(node)
      case 'method_call':
        return this.methodCall(node)
      case 'class_decl':
        return this.classDeclaration(node)
    }

    return node
  }

  setBlockID (node, block = '0') {
    for (let i = 0; i < node.value.length; i++) {
      node.value[i].scope = block
      if (node.value[i].description === 'block' || node.value[i].description === 'method_decl') {
        this.blocks += 1
        node.value[i] = this.setBlockID(node.value[i], `${block}${this.blocks}`)
      } else {
        if (Array.isArray(node.value[i].value)) {
          node.value[i] = this.setBlockID(node.value[i], block)
        } else {
          node.value[i] = node.value[i].value
        }
      }
    }
    return node
  }

  varDeclaration (node) {
    this.variables.push(node.value[1].value[0] + node.scope[node.scope.length - 1])
    return ''
  }

  paramDeclaration (node) {
    this.params.push(node.value[1].value[0] + node.scope[node.scope.length - 1])
    return ''
  }

  location (node) {
    for (const i in node.scope) {
      if (this.variables.includes(node.value[0] + node.scope[i])) {
        return `word ptr [bx - ${this.variables.indexOf(node.value[0] + node.scope[i]) * 2}]`
      } else if (this.params.includes(node.value[0] + node.scope[i])) {
        return `word ptr [bp + ${this.params.indexOf(node.value[0] + node.scope[i]) * 2}]`
      }
    }
    return node
  }

  expression (node) {
    if (node.value.length === 1) {
      return node.value[0]
    } else {
      const arith = ['+', '-', '*', '/', '%']
      if (arith.includes(node.value[1])) {
        if (!isNaN(node.value[0]) && !isNaN(node.value[2])) {
          const operate = {
            '+': function (x, y) { return x + y },
            '-': function (x, y) { return x - y },
            '*': function (x, y) { return x * y },
            '/': function (x, y) { return x / y },
            '%': function (x, y) { return x % y }
          }
          return operate[node.value[1]](parseInt(node.value[0]), parseInt(node.value[2])).toString()
        } else {
          const code = ['\n mov ax, ', node.value[0], '\n mov cx, ', node.value[2]]
          const asm = {
            '+': '\n add ax, cx',
            '-': '\n sub ax, cx',
            '*': '\n mul cx',
            '/': '\n mov dx, 0 \n div cx',
            '%': '\n mov dx, 0 \n div cx \n mov ax, dx'
          }

          code.push(asm[node.value[1]])
          code.push('\n mov cx, ax')

          return { code: this.expressionReturn(code), return: 'cx' }
        }
      } else {
        let code = ['\n mov ax, ', node.value[0], '\n mov cx, ', node.value[2], '\n cmp ax, cx']
        const asm = {
          '>': '\n jle',
          '<': '\n jge',
          '>=': '\n jl',
          '<=': '\n jg',
          '==': '\n jne'
        }

        code = code.concat([asm[node.value[1]], ' ', '.' + node.scope + (parseInt(node.scope[node.scope.length - 1]) + 1).toString()])
        return code
      }
    }
  }

  binOp (node) {
    return node.value[0]
  }

  statement (node) {
    if (node.value[1] === '=') {
      return ['\n mov ax, ', node.value[0], '\n mov cx, ', node.value[2], '\n mov ax, cx \n mov ', node.value[0], ', ax']
    } else if (node.value[0] === 'for') {
      node.value[0] = ['\n mov ax, ', node.value[1], '\n mov cx, ', node.value[3], '\n mov ax, cx \n mov ', node.value[1], ', ax']
      node.value[1] = '\n .' + node.scope + (parseInt(node.scope[node.scope.length - 1]) + 1).toString() + 'ret:'

      node.value.splice(2, 2)

      node.value[3].splice(node.value[3].length - 1, 0, '\n jmp .' + node.scope + (parseInt(node.scope[node.scope.length - 1]) + 1).toString() + 'ret')

      return node.value
    } else if (node.value[0] === 'if') {
      node.value.splice(0, 1)
      return node.value
    } else if (node.value[0] === 'return') {
      const code = ['\n mov cx, ', node.value[1], `\n jmp .${node.scope}`]
      return code
    } else if (node.value[0] === 'break') {
      return `\n jmp .${node.scope}`
    } else if (node.value[0] === 'continue') {
      return `\n jmp .${node.scope}ret`
    } else {
      return node.value
    }
  }

  block (node) {
    node.value.push('\n .' + node.scope + (parseInt(node.scope[node.scope.length - 1]) + 1).toString() + ':')
    return node.value
  }

  methodDeclaration (node) {
    let params = 0
    let mainShift = 0
    for (const i in node.value) {
      if (node.value[i] === '') {
        params++
      }
    }

    const ret = (num) =>{
      if (num > 0) {
        return num * 2
      } else {
        return ''
      }
    }

    node.value.push(`\n pop bp \n ret ${ret(params)} \n ${node.value[1].value[0]} endp`)
    if (node.value[1].value[0] === 'main') {
      node.value.splice(node.value.length - 1, 0, '\n mov ah,4CH \n int 21H')
      node.value.unshift('\n mov bx, 3000')
      mainShift++
    }
    node.value.unshift(`\n ${node.value[1 + mainShift].value[0]} proc \n push bp \n mov bp, sp`)

    node.value.splice(1 + mainShift, 2 + params)
    return node.value
  }

  methodCall (node) {
    if (node.value[0] === 'callout') {
      let printCode = ''
      if (node.value[1][0] === '"') {
        printCode = `\n lea dx, string${this.strings.length} \n mov ah, 9 \n int 21h`
        this.strings.push(node.value[1])
      } else {
        printCode = `\n mov ri, '0' \n mov al, byte ptr ${node.value[1]} \n add ri, al \n mov dl, ri \n mov ah, 2 \n int 21h`
      }
      return printCode
    } else {
      const call = `\n call ${node.value[0].value[0]}`
      let callCode = ''
      node.value.splice(0, 1)
      for (let i = 0; i < node.value.length; i++) {
        callCode += `\n push ${node.value[i]}`
      }

      callCode += call

      return { code: [callCode], return: 'cx' }
    }
  }

  classDeclaration (node) {
    node.value.splice(0, 2)
    return node.value
  }
}
