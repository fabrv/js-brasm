export class AST {
  constructor (AST) {
    this.AST = AST
    // this.allVars = ['Program']
    console.log('Checking semantic errors')
  }

  cleanTree (node = this.AST) {
    const extras = ['{', '}', '[', ']', '(', ')', ';', ',']
    for (let children = 0; children < node.value.length; children++) {
      switch (node.value[children].description) {
        case 'paren_expr':
          node.value[children].description = 'expr'
          break
        case 'location_comma':
          node.value[children].value = node.value[children].value[0].value
          break
        case 'literal':
          node.value[children] = node.value[children].value[0]
          break
        case 'method_decl':
          if (node.value[children].value[1].description === 'method') {
            node.value[children].value.splice(1, 1, node.value[children].value[1].value[0])
          } else if (node.value[children].value[3].description === 'param_decl') {
            const l = node.value[children].value.length
            node.value[children].value[l - 4].value = [
              Object.assign({}, node.value[children].value[l - 4]),
              Object.assign({}, node.value[children].value[l - 3])
            ]
            node.value[children].value[l - 4].description = 'param_decl'
            node.value[children].value.splice(l - 3, 1)
          }
          break
        case 'var_decl':
          if (node.value[children].value[0].description === 'param_decl') {
            const type = node.value[children].value[0].value[0].value
            // node.value[children].value[0].description = 'var_decl'
            node.value.splice(children + 1, 0, {
              description: 'var_decl',
              value: [
                Object.assign({}, node.value[children].value[0].value[0]),
                Object.assign({}, node.value[children].value[0].value[1])
              ]
            })
            for (let i = 1; i < node.value[children].value.length; i++) {
              if (node.value[children].value[i].value === ';') break
              const obj = {
                description: 'var_decl',
                value: [
                  { value: type, description: 'type' },
                  Object.assign({}, node.value[children].value[i])
                ]
              }
              node.value.splice(children + 1 + i, 0, obj)
            }

            node.value.splice(children, 1)
          }
          break
      }

      node.value[children].description = node.value[children].description.replace('_comma', '')

      if (Array.isArray(node.value[children].value)) {
        node.value[children] = this.cleanTree(node.value[children])
      } else {
        for (const extra in extras) {
          if (node.value[children].value === extras[extra]) {
            node.value.splice(children, 1)
            children -= 1
            break
          }
        }
      }
    }

    return node
  }

  semCheck (node = this.AST, parentVars = ['Program']) {
    const declarations = ['var_decl', 'method_decl', 'param_decl']
    const recursive = ['method_decl', 'block', 'statement', 'method_call', 'expr']
    const varDecl = []

    if (node.description === 'class_decl') {
      if (!this.mainParams(node)) {
        throw new Error('Main must not have any parameters')
      }
    }

    for (let children = 0; children < node.value.length; children++) {
      if (node.value[children].description === 'var_decl') {
        if (node.value[children].value[1].value.length > 1) {
          if (!this.arrayDecl(node.value[children])) {
            throw new Error('Array declaration length must be greater than 0')
          }
        }
      }

      // Declaration checker, adds declarations to varDecl Array.
      for (const declaration in declarations) {
        if (node.value[children].description === declarations[declaration]) {
          if (varDecl.includes(node.value[children].value[1].value[0].value)) {
            throw new Error(`Identifier '${node.value[children].value[1].value[0].value}' has already been declared.`)
          } else {
            varDecl.push(node.value[children].value[1].value[0].value)
            parentVars.push(node.value[children].value[1].value[0].value)
          }
        }
      }

      if (node.value[children].description === 'location') {
        if (!parentVars.includes(node.value[children].value[0].value)) {
          throw new Error(`Identifier '${node.value[children].value[0].value}' has not been declared before call.`)
        }
      }

      // Enter new scope
      for (const recurse in recursive) {
        if (node.value[children].description === recursive[recurse]) {
          this.semCheck(node.value[children], parentVars.slice())
        }
      }
    }
  }

  mainParams (node) {
    for (let i = 0; i < node.value.length; i++) {
      if (node.value[i].description === 'method_decl') {
        const method = node.value[i]
        if (method.value.length > 3) {
          return false
        } else {
          if ((method.value[0].value === 'void ') && (method.value[1].value[0].value === 'main') && (method.value[2].description === 'block')) {
            return true
          }
        }
      }
    }
    return false
  }

  arrayDecl (node) {
    if ((node.value[1].value[1].description === 'int_lit') && (node.value[1].value[1].value > 0)) {
      return true
    } else {
      return false
    }
  }
}
