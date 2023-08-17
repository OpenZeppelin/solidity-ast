import { SolcInput, SolcOutput } from './solc';
import { Node, NodeType, NodeTypeMap } from './node';
import { SourceUnit } from './types';

import { findAll, ExtendedNodeType, ExtendedNodeTypeMap } from './utils/find-all';
export { findAll, ExtendedNodeType, ExtendedNodeTypeMap };

export function isNodeType<N extends Node, T extends NodeType>(nodeType: T | readonly T[]): (node: N) => node is N & NodeTypeMap[T];
export function isNodeType<N extends Node, T extends NodeType>(nodeType: T | readonly T[], node: N): node is N & NodeTypeMap[T];

export interface NodeWithSourceUnit<N extends Node = Node> {
  node: N;
  sourceUnit: SourceUnit;
}

export interface ASTDereferencer {
  <T extends ExtendedNodeType>(nodeType: T | readonly T[]): (id: number) => ExtendedNodeTypeMap[T];
  <T extends ExtendedNodeType>(nodeType: T | readonly T[], id: number): ExtendedNodeTypeMap[T];
  withSourceUnit<T extends ExtendedNodeType>(nodeType: T | readonly T[], id: number): NodeWithSourceUnit<ExtendedNodeTypeMap[T]>;
}

export function astDereferencer(solcOutput: SolcOutput): ASTDereferencer;

export class ASTDereferencerError extends Error {
  readonly id: number;
  readonly nodeType: readonly ExtendedNodeType[];
}

export type SrcDecoder = (node: { src: string }) => string;

export function srcDecoder(solcInput: SolcInput, solcOutput: SolcOutput): SrcDecoder;
