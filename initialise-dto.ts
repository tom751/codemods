import { API, FileInfo, Identifier } from 'jscodeshift';

// const test = new WorkflowDto() => const test = {} as WorkflowDto

export default function (fileInfo: FileInfo, api: API) {
  const j = api.jscodeshift;

  return j(fileInfo.source)
    .find(j.NewExpression)
    .replaceWith((path) => {
      const dtoName = (path.node.callee as Identifier).name;
      return j.tsAsExpression(j.objectExpression([]), j.tsTypeReference(j.identifier(dtoName)));
    })
    .toSource();
}

module.exports.parser = 'ts';
