import { Node, NodeType, NodeTypeMap, YulNode, YulNodeType, YulNodeTypeMap } from '../node';

export function findAll<T extends NodeType>(nodeType: T | readonly T[]): (node: Node) => Generator<NodeTypeMap[T]>;
export function findAll<T extends NodeType>(nodeType: T | readonly T[], node: Node, prune?: (node: Node) => boolean): Generator<NodeTypeMap[T]>;

export function findAll<T extends NodeType | YulNodeType>(nodeType: T | readonly T[]): (node: Node | YulNode) => Generator<(NodeTypeMap & YulNodeTypeMap)[T]>;
export function findAll<T extends NodeType | YulNodeType>(nodeType: T | readonly T[], node: Node | YulNode, prune?: (node: Node | YulNode) => boolean): Generator<(NodeTypeMap & YulNodeTypeMap)[T]>;

