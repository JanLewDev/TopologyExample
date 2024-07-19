import { TopologyObject } from "@topology-foundation/object";
import { GSet } from "@topology-foundation/crdt";

export interface IChat extends TopologyObject {
    chat: GSet<string>;
    addMessage(timestamp: number, message: string, node_id: string): void;
    merge(other: Chat): void;
}

export class Chat extends TopologyObject implements IChat {
    // store messages as strings
    chat: GSet<string>;

    constructor(peerId: string) {
        super(peerId);
        this.chat = new GSet<string>(new Set());
    }

    addMessage(timestamp: number, message: string, node_id: string): void {
        this.chat.add(`(${timestamp}, ${message}, ${node_id})`);
    }

    merge(other: Chat): void {
        this.chat.merge(other.chat);
    }

}
