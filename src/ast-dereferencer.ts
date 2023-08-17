import { findAll, ExtendedNodeType, ExtendedNodeTypeMap } from '../utils/find-all';
import type { ASTDereferencer, NodeWithSourceUnit } from '../utils';
import type { Node, NodeType, NodeTypeMap } from '../node';
import type { SolcOutput } from '../solc';
import { SourceUnit } from '../types';

// An ASTDereferencer is a function that looks up an AST node given its id, in all of the source files involved in a
// solc run. It will generally be used together with the AST property `referencedDeclaration` (found in Identifier,
// UserDefinedTypeName, etc.) to look up a variable definition or type definition.

export function astDereferencer(solcOutput: SolcOutput): ASTDereferencer {
  const cache = new Map<number, NodeWithSourceUnit>();

  const asts = Array.from(
    Object.values(solcOutput.sources),
    s => s.ast,
  ).sort((a, b) => a.id - b.id);

  // To look for a given node we iterate over all nodes in all ASTs. As an optimization, we try to find the ideal first
  // candidate based on the observation that node ids are assigned in postorder, therefore a SourceUnit's own id is always
  // larger than that of the nodes in it. As a fallback mechanism in case this assumption breaks, if the node is not found
  // in the first one we proceed to check all ASTs.
  function* astCandidates(id: number) {
    const first = asts.find(a => (id <= a.id));
    if (first) {
      yield first;
    }
    for (const ast of asts) {
      if (ast !== first) {
        yield ast;
      }
    }
  }

  function deref<T extends ExtendedNodeType>(nodeType: T | readonly T[], id: number): NodeWithSourceUnit<ExtendedNodeTypeMap[T]>;
  function deref(nodeType: ExtendedNodeType | readonly ExtendedNodeType[], id: number): NodeWithSourceUnit {
    const cached = cache.get(id);

    if (cached) {
      if (
        nodeType === cached.node.nodeType ||
        nodeType === "*" ||
        (Array.isArray(nodeType) && nodeType.includes(cached.node.nodeType))
      ) {
        return cached;
      }
    } else {
      for (const ast of astCandidates(id)) {
        for (const node of findAll(nodeType, ast)) {
          if (node.id === id) {
            const nodeWithSourceUnit = { node, sourceUnit: ast };
            cache.set(id, nodeWithSourceUnit);
            return nodeWithSourceUnit;
          }
        }
      }

    }

    nodeType = Array.isArray(nodeType) ? nodeType : [nodeType];
    throw new ASTDereferencerError(id, nodeType);
  }

  function derefNode(nodeType: NodeType | readonly NodeType[], id: number) {
    return deref(nodeType, id).node;
  }

  return Object.assign(
    curry2(derefNode),
    { withSourceUnit: deref }
  );
}

export interface Curried<A, B, T> {
  (a: A): (b: B) => T;
  (a: A, b: B): T;
}

export function curry2<A, B, T>(fn: (a: A, b: B) => T): Curried<A, B, T> {
  function curried(a: A): (b: B) => T;
  function curried(a: A, b: B): T;
  function curried(a: A, ...b: [] | [B]): T | ((b: B) => T) {
    if (b.length === 0) {
      return b => fn(a, b);
    } else {
      return fn(a, ...b);
    }
  }
  return curried;
}

const isArray: (arg: any) => arg is any[] | readonly any[]  = Array.isArray;

export class ASTDereferencerError extends Error {
  constructor(readonly id: number, readonly nodeType: readonly ExtendedNodeType[]) {
    super(`No node with id ${id} of type ${nodeType}`);
  }
}
