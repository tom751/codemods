import { API, FileInfo, Identifier, MemberExpression, StringLiteral } from 'jscodeshift';

// a.setField('a') => a.field = 'a'

export default function (fileInfo: FileInfo, api: API) {
  const j = api.jscodeshift;
  return j(fileInfo.source)
    .find(j.CallExpression)
    .filter((path) => {
      return (
        j(path)
          .find(j.MemberExpression)
          .filter((p) => (p.value.property as Identifier).name.startsWith('set')).length === 1
      );
    })
    .replaceWith((path) => {
      const args = path.node.arguments;
      const value = (args[0] as StringLiteral).value;
      const callee = path.node.callee as MemberExpression;
      const varName = (callee.object as Identifier).name;
      const setterName = (callee.property as Identifier).name;
      const newIdentifierName = setterName.slice(3);
      const camelCased = newIdentifierName.charAt(0).toLowerCase() + newIdentifierName.slice(1);

      return j.expressionStatement(
        j.assignmentExpression(
          '=',
          j.memberExpression(j.identifier(varName), j.identifier(camelCased)),
          j.stringLiteral(value)
        )
      );
    })
    .toSource();
}

module.exports.parser = 'ts';
