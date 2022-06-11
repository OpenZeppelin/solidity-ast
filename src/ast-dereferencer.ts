import { findAll } from '../utils/find-all';
import type { ASTDereferencer } from '../utils';
import type { Node, NodeType, NodeTypeMap } from '../node';
import type { SolcOutput } from '../solc';

// An ASTDereferencer is a function that looks up an AST node given its id, in all of the source files involved in a
// solc run. It will generally be used together with the AST property `referencedDeclaration` (found in Identifier,
// UserDefinedTypeName, etc.) to look up a variable definition or type definition.

export function astDereferencer(solcOutput: SolcOutput): ASTDereferencer {
  const asts = Array.from(Object.values(solcOutput.sources), s => s.ast);
  const cache = new Map<number, Node>();

  function deref<T extends NodeType>(nodeType: T | readonly T[], id: number): NodeTypeMap[T] {
    if (!isArray(nodeType)) {
      nodeType = [nodeType];
    }

    const cached = cache.get(id);

    if (cached) {
      if ((nodeType as readonly NodeType[]).includes(cached.nodeType)) {
        return cached as NodeTypeMap[T];
      }
    }

    for (const ast of asts) {
      for (const node of findAll(nodeType, ast)) {
        if (node.id === id) {
          cache.set(id, node);
          return node;
        }
      }
    }

    throw new Error(`No node with id ${id} of type ${nodeType}`);
  }

  return curry2(deref);
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
