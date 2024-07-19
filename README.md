# Topology Protocol Example

I want to create a chat system where a user can create or connect to a chat room and see all the messages sent in the group chat.

## Specifics

Messages will be represented as a string in the format (timestamp, content, senderId). I will create a Chat class which extends TopologyObject and has Gset\<string> as an attribute to store the list of messages.
