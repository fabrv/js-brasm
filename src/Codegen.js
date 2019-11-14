export class Codegen {
  constructor (AST) {
    this.blocks = 0
    this.AST = this.setBlockID(AST)
    this.variables = ['']
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
    }

    return node
  }

  setBlockID (node, block = '0') {
    for (let i = 0; i < node.value.length; i++) {
      node.value[i].scope = block
      if (node.value[i].description === 'block') {
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

  location (node) {
    for (const i in node.scope) {
      if (this.variables.includes(node.value[0] + node.scope[i])) {
        return `word ptr [bp - ${this.variables.indexOf(node.value[0] + node.scope[i]) * 2}]`
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
          return operate[node.value[1]](node.value[0], node.value[2]).toString()
        } else {
          let code = `\n mov ax, ${node.value[0]} \n mov cx, ${node.value[2]}`
          const asm = {
            '+': '\n add ax, cx',
            '-': '\n sub ax, cx',
            '*': '\n mul cx',
            '/': '\n mov dx, 0 \n div cx',
            '%': '\n mov dx, 0 \n div cx'
          }

          code += asm[node.value[1]]

          code += `\n mov ${node.value[0]}, ax`

          return { code: code, return: node.value[0] }
        }
      } else {
        let code = `\n mov ax, ${node.value[0]} \n mov cx, ${node.value[2]} \n cmp ax, cx`
        const asm = {
          '>': '\n jle',
          '<': '\n jge',
          '>=': '\n jl',
          '<=': '\n jg'
        }

        code += `${asm[node.value[1]]} .${node.scope + (parseInt(node.scope[node.scope.length - 1]) + 1).toString()}`
        return code
      }
    }
  }

  binOp (node) {
    return node.value[0]
  }
}
