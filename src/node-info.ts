import { Node } from '../node';
import type { SolcOutput } from '../solc';

const util = require('util')

export interface NODEINFO {
    path: string;
    scopeNode: Node | undefined;
    node: Node;
}

export class NodeInfoResolver {
    private fastNodeLookup: Map<number, NODEINFO> = new Map<number, NODEINFO>();
    private finder = require('../finder.json');

    constructor(readonly output: SolcOutput) {

        for (const source in this.output.sources) {
            const sUnit = this.output.sources[source].ast;
            this.addProps(sUnit.absolutePath, undefined, sUnit);
        }
    }

    // grab a node id
    public getNodeInfo(id: number) : NODEINFO | undefined {
        return this.fastNodeLookup.get(id);
    }

    private addProps(path: string, scopeNode: Node | undefined, node: Node) {
        const nodeKeys: string[] = this.finder.ArrayTypeName[node.nodeType] ?? [];
        this.fastNodeLookup.set(node.id, {
            path: path,
            scopeNode: scopeNode,
            node: node,
        });

        // console.log(util.inspect(nodeKeys, { showHidden: false, depth: null, colors: true }));
        nodeKeys.forEach( ( key ) => {
            if (key in node) {
                const childNode = node[key as keyof Node];
                const member: Node[] = Array.isArray(childNode) ? childNode as Node[] : [childNode as unknown as Node];
                for (const item of member) {
                    if (item && ('id' in item) && ('src' in item)) {
                        this.addProps(path, node, item);
                    }
                }
            }
        });
    }
}
