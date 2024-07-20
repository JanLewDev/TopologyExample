import { TopologyNode } from "@topology-foundation/node";
import { Chat, IChat } from "./objects/chat";
import { GSet } from "@topology-foundation/crdt";
import { handleChatMessages } from "./handlers";

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
    const element_peerId = <HTMLDivElement>document.getElementById("peerId");
    element_peerId.innerHTML = node.getPeerId();

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
    let timestamp: string = Date.now().toString();
    chatCRO.addMessage(timestamp, message, node.getPeerId());
    render();

    node.updateObject(chatCRO, `addMessage(${timestamp}, ${message}, ${node.getPeerId()})`);
}

async function main() {
    await node.start();
    render();
    
    node.addCustomGroupMessageHandler((e) => {
        handleChatMessages(chatCRO, e);
        peers = node.getPeers();
        discoveryPeers = node.getPeersPerGroup("topology::discovery");
        if(chatCRO) objectPeers = node.getPeersPerGroup(chatCRO.getObjectId());
        render();
    })

    let button_create = <HTMLButtonElement>document.getElementById("create");
    button_create.addEventListener("click", () => {
        chatCRO = new Chat(node.getPeerId());
        node.createObject(chatCRO);
        (<HTMLButtonElement>document.getElementById("chatId")).innerHTML = chatCRO.getObjectId();
        render();
    });

    let button_connect = <HTMLButtonElement>document.getElementById("joinRoom");
    button_connect.addEventListener("click", async () => {
        let objectId = (<HTMLInputElement>document.getElementById("roomInput")).value;
        try {
            await node.subscribeObject(objectId, true);

            let object: any = node.getObject(objectId);
            
            chatCRO = Object.assign(new Chat(node.getPeerId()), object);
            (<HTMLButtonElement>document.getElementById("chatId")).innerHTML = objectId;
            render();
        } catch (e) {
            console.error("Error while connecting to the CRO ", objectId, e);
        }
    });

    let button_send = <HTMLButtonElement>document.getElementById("sendMessage");
    button_send.addEventListener("click", () => {
        let message = (<HTMLInputElement>document.getElementById("messageInput")).value;
        sendMessage(message);
    });
}

main();