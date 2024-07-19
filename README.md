# Topology Protocol Example

I want to create a chat system where a user can create or connect to a chat room and see all the messages sent in the group chat.

## Specifics

I will create a Message class which extends TopologyObject, which will include a timestamp, the message content and the senderId. Then, a Chat class which also extends TopologyObject and having Gset\<Message> as an attribute to store the list of messages.
