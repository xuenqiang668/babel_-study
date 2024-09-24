const t = require('@babel/types')

function babelPluginImport(options) {
    const { libraryName } = options



    // 生成导出语句 将每一个引入更换为一个新的单独路径默认导出的语句
    function generateImportStatement(moduleName, localIdentifer) {
        return t.importDeclaration(
            [t.importDefaultSpecifier(localIdentifer)],
            t.stringLiteral(`${libraryName}/${moduleName}`)
        )
    }

    // 检查导入是否是固定匹配库
    function checkedLibraryName(nodePath) {
        const { node } = nodePath
        return node.source.value !== libraryName
    }
    // 检查语句是否存在默认导入
    function checkedDefaultImport(nodePath) {
        const { node } = nodePath
        const { specifiers } = node;
        return specifiers.some(specifier => {
            console.log(t.isImportDefaultSpecifier(specifier));
            t.isImportDefaultSpecifier(specifier)
        })
    }

    return {
        visitor: {
            // 匹配ImportDeclaration时进入
            ImportDeclaration(nodePath) {
                if (checkedLibraryName(nodePath) || checkedDefaultImport(nodePath)) return

                // console.log(nodePath.node);
                // 获取声明说明符
                const node = nodePath.node;

                const { specifiers } = node



                // 遍历对应的声明符
                const importDesclarations = []
                specifiers.forEach((specifier, index) => {
                    // 获得原本导入的模块
                    const moduleName = specifier.imported.name
                    // 获得导入时的重新命名
                    const localIdentifer = specifier.local

                    // console.log(nodePath.scope.getBinding('sum'));
                    const binding = nodePath.scope.getBinding(moduleName)
                    if (binding && binding.referenced) {
                        const gen = generateImportStatement(moduleName, localIdentifer)
                        importDesclarations.push(gen)
                    }
                })

                if (importDesclarations.length === 1) {
                    // 如果仅仅只有一个语句时
                    nodePath.replaceWith(importDesclarations[0])
                } else {
                    // 多个声明替换
                    nodePath.replaceWithMultiple(importDesclarations)
                }
            },
            VariableDeclarator(nodePath) {
                // 如果变量没有被引用过，那么删除也没关系
                //   此处不能用有无修改过进行判断，因为没有被修改过并不意味着没用
                const name = nodePath.node.id.name
                const binding = nodePath.scope.getBinding(name)
                if (binding && !binding.referenced) {
                    nodePath.remove()
                }
            }
        }
    }
}






module.exports = babelPluginImport