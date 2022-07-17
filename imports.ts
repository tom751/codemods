import { API, FileInfo } from 'jscodeshift';

// Removes _pb from import names

export default function (fileInfo: FileInfo, api: API) {
  const j = api.jscodeshift;

  return j(fileInfo.source)
    .find(j.ImportDeclaration)
    .filter((path) => {
      return (path.node.source.value as string).endsWith('_pb');
    })
    .replaceWith((path) => {
      const specifiers = path.node.specifiers;
      const importName = path.node.source.value as string;
      const newImportName = importName.slice(0, -3);
      return j.importDeclaration(specifiers, j.stringLiteral(newImportName));
    })
    .toSource();
}

module.exports.parser = 'ts';
