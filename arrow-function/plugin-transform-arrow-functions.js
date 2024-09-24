const t = require('@babel/types')

function ArrowFunctionExpression(path) {
    const node = path.node;
    hoistFunctionEnvironment(path);
    node.type = 'FunctionDeclaration';
}

/**
 *
 *
 * @param {*} nodePath 当前节点路径
 */
function hoistFunctionEnvironment(nodePath) {
    // 往上查找 直到找到最近顶部非箭头函数的this p.isFunction() && !p.isArrowFunctionExpression()
    // 或者找到跟节点 p.isProgram()
    const thisEnvFn = nodePath.findParent(p => {
        return (p.isFunction() && t.isArrowFunctionExpression(p)) || p.isProgram();
    })

    // 接下来查找当前作用域中那些地方用到了this的节点路径
    const thisPaths = getScopeInfoInformation(thisEnvFn)
    const thisBindingsName = generateBindName(thisEnvFn);
    // thisEnvFn中添加一个变量 变量名为 thisBindingsName 变量值为 this
    // 相当于 const _this = this
    thisEnvFn.scope.push({
        id: t.identifier(thisBindingsName),
        init: t.thisExpression()
    })


    thisPaths.forEach(thisPath => {
        // 将this替换称为_this
        const replaceNode = t.identifier(thisBindingsName)
        thisPath.replaceWith(replaceNode)
    })

}

/**
 * 判断之前是否存在 _this 这里简单处理下
 * 直接返回固定的值
 * @param {*} path 节点路径
 * @returns
 */

function generateBindName(path, name = '_this', n = 0) {
    if (path.scope.hasBinding(name)) {
        generateBindName(path, name, n + 1)
    }
    return name
}


/**
 *
 * 查找当前作用域内this使用的地方
 * @param {*} nodePath 节点路径
 */

function getScopeInfoInformation(nodePath) {
    const thisPaths = []
    // 调用nodePath中的traverse方法进行便利
    // 你可以在这里查阅到  https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md
    nodePath.traverse({
        // 深度遍历节点路径 找到内部this语句
        ThisExpression(thisPath) {
            thisPaths.push(thisPath)
        }
    })
    return thisPaths
}

module.exports = {
    hoistFunctionEnvironment,
    arrowFunctionPlugin: {
        visitor: {
            ArrowFunctionExpression,
            FunctionDeclaration(path) {
                // 向兄弟前后节点插入表达式
                /*
                t.variableDeclaration(kind, declarations);
                
                AST Node VariableDeclaration shape:
                kind: "var" | "let" | "const" | "using" | "await using" (required)
                declarations: Array<VariableDeclarator> (required)
                declare: boolean (default: null, excluded from builder function)
                */
                path.insertBefore(t.variableDeclaration('var', [t.variableDeclarator(t.identifier('_this'), t.thisExpression())]));
                // path.insertAfter(t.expressionStatement(t.stringLiteral("A little high, little low.")));
                path.insertAfter(t.variableDeclaration('var', [t.variableDeclarator(t.identifier('a'), t.stringLiteral("A little high, little low."))]));
            }
        },
    },
};
