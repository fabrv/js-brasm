export class AST {
  constructor (AST) {
    this.AST = AST
  }

  cleanTree (node = this.AST) {
    const extras = ['{', '}', '[', ']', '(', ')', ';', ',']
    for (let children = 0; children < node.value.length; children ++) {

      switch (node.value[children].description) {
        case 'paren_expr':
          node.value[children].description = 'expr'
          break;
        case 'location_comma':
          node.value[children].value = node.value[children].value[0].value
          break;
        case 'literal':
          node.value[children] = node.value[children].value[0];
          break;
        case 'method_decl':
          if (node.value[children].value[3].description === 'param_decl') {
            const l = node.value[children].value.length
            node.value[children].value[l - 4].value = [
              Object.assign({}, node.value[children].value[l - 4]),
              Object.assign({}, node.value[children].value[l - 3])
            ]
            node.value[children].value[l - 4].description = 'param_decl'
            node.value[children].value.splice(l - 3, 1)
          }
          break;
        case 'var_decl':
          if (node.value[children].value[0].description === 'param_decl') {
            const type = node.value[children].value[0].value[0].value
            //node.value[children].value[0].description = 'var_decl'
            node.value.push({
              description: 'var_decl',
              value: [
                Object.assign({}, node.value[children].value[0].value[0]),
                Object.assign({}, node.value[children].value[0].value[1])
              ]
            })
            for (let i = 1; i < node.value[children].value.length; i ++) {
              if (node.value[children].value[i].value == ';') break;
              const obj = {
                description: 'var_decl',
                value: [
                  { 'value': type, 'description': 'type'},
                  Object.assign({}, node.value[children].value[i])
                ]
              }
              node.value.push(obj)
            }

            node.value.splice(children, 1)
          }
          break;
      }

      node.value[children].description = node.value[children].description.replace('_comma', '')

      if (Array.isArray(node.value[children].value)) {
        node.value[children] = this.cleanTree(node.value[children])
      } else {
        for (let extra in extras) {
          if (node.value[children].value === extras[extra]) {
            node.value.splice(children, 1)
            children -= 1
            break;
          }
        }
      }
    }

    return node
  }

  unicity(node = this.AST) {
    const declarations = ['var_decl', 'method_decl', 'param_decl']
    const recursive = ['method_decl', 'block']
    let varDecl = []
    for (let children = 0; children < node.value.length; children ++) {
      for (let declaration in declarations) {
        if (node.value[children].description === declarations[declaration]) {
          if (varDecl.includes(node.value[children].value[1].value[0].value)) {
            throw new Error(`Identifier '${node.value[children].value[1].value[0].value}' has already been declared`)
          } else {
            varDecl.push(node.value[children].value[1].value[0].value)
          }
        }
      }

      for (let recurse in recursive) {
        if (node.value[children].description === recursive[recurse]) {
          this.unicity(node.value[children])
        }
      }
    }
    console.log(varDecl)
  }
}