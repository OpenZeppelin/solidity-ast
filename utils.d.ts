import { SolcInput, SolcOutput } from './solc';
import { Node, NodeType, NodeTypeMap } from './node';

export { findAll } from './utils/find-all';

export function isNodeType<N extends Node, T extends NodeType>(nodeType: T | readonly T[]): (node: N) => node is N & NodeTypeMap[T];
export function isNodeType<N extends Node, T extends NodeType>(nodeType: T | readonly T[], node: N): node is N & NodeTypeMap[T];

export interface ASTDereferencer {
  <T extends NodeType>(nodeType: T | readonly T[]): (id: number) => NodeTypeMap[T];
  <T extends NodeType>(nodeType: T | readonly T[], id: number): NodeTypeMap[T];
}

export function astDereferencer(solcOutput: SolcOutput): ASTDereferencer;

export type SrcDecoder = (node: { src: string }) => string;

export function srcDecoder(solcInput: SolcInput, solcOutput: SolcOutput): SrcDecoder;
