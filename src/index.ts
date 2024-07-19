import { TopologyNode } from "@topology-foundation/node";
import { Chat, IChat } from "./objects/chat";
import { GSet } from "@topology-foundation/crdt";

const node = new TopologyNode();
// CRO = Conflict-free Replicated Object
let chatCRO: IChat;
let peers: string[] = [];
let discoveryPeers: string[] = [];
let objectPeers: string[] = [];

function sort(set: Set<string>): Set<string> {
    const entries: string[] = [];
    for (const member of set) {
        entries.push(member);
    }
    set.clear();
    for (const entry of entries.sort()) {
        set.add(entry);
    }
    return set;
};

const render = () => {
    const element_peers = <HTMLDivElement>document.getElementById("peers");
    element_peers.innerHTML = "[" + peers.join(", ") + "]";

    const element_discoveryPeers = <HTMLDivElement>document.getElementById("discoveryPeers");
    element_discoveryPeers.innerHTML = "[" + discoveryPeers.join(", ") + "]";

    const element_objectPeers = <HTMLDivElement>document.getElementById("objectPeers");
    element_objectPeers.innerHTML = "[" + objectPeers.join(", ") + "]";

    if(!chatCRO) return;
    const chat = chatCRO.chat;
    const element_chat = <HTMLDivElement>document.getElementById("chat");
    element_chat.innerHTML = "";

    chat.set.prototype.values().sort().forEach((message: string) => {
        const div = document.createElement("div");
        div.innerHTML = message;
        element_chat.appendChild(div);
    });

}

async function sendMessage(message: string) {
    let timestamp: number = Date.now();
    chatCRO.addMessage(timestamp, message, node.getPeerId());
    render();

    node.updateObject(chatCRO, `addMessage(${timestamp}, ${message}, ${node.getPeerId()})`);
}

async function main() {
    await node.start();

    node.addCustomGroupMessageHandler((e) => {
        
    })
}