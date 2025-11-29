// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ChatSepolia {
    struct Message {
        uint256 id;
        address author;
        string content;
        uint256 timestamp;
        bool exists;
    }

    struct Reaction {
        uint32 likes;
        uint32 dislikes;
        uint32 interesting;
        uint32 notInteresting;
        uint32 toxicityScore;
    }

    mapping(uint256 => Message) public messages;
    mapping(uint256 => Reaction) public reactions;
    mapping(address => mapping(uint256 => bool)) public hasReacted;
    
    uint256 public messageCount;
    uint256 public constant MAX_MESSAGE_LENGTH = 500;

    event MessagePosted(uint256 indexed messageId, address indexed author, string content, uint256 timestamp);
    event ReactionAdded(uint256 indexed messageId, address indexed user);

    function postMessage(string memory _content) public {
        require(bytes(_content).length > 0 && bytes(_content).length <= MAX_MESSAGE_LENGTH, "Invalid message length");
        
        messageCount++;
        messages[messageCount] = Message({
            id: messageCount,
            author: msg.sender,
            content: _content,
            timestamp: block.timestamp,
            exists: true
        });

        // Initialize reactions for the new message
        reactions[messageCount] = Reaction({
            likes: 0,
            dislikes: 0,
            interesting: 0,
            notInteresting: 0,
            toxicityScore: 0
        });

        emit MessagePosted(messageCount, msg.sender, _content, block.timestamp);
    }

    function addReaction(
        uint256 _messageId,
        uint32 _likeValue,
        uint32 _dislikeValue,
        uint32 _interestingValue,
        uint32 _notInterestingValue,
        uint32 _toxicityValue
    ) public {
        require(messages[_messageId].exists, "Message does not exist");
        require(!hasReacted[msg.sender][_messageId], "Already reacted");

        Reaction storage reaction = reactions[_messageId];
        
        // Add reaction values
        reaction.likes += _likeValue;
        reaction.dislikes += _dislikeValue;
        reaction.interesting += _interestingValue;
        reaction.notInteresting += _notInterestingValue;
        reaction.toxicityScore += _toxicityValue;

        hasReacted[msg.sender][_messageId] = true;
        emit ReactionAdded(_messageId, msg.sender);
    }

    function getMessage(uint256 _messageId) public view returns (
        uint256 id,
        address author,
        string memory content,
        uint256 timestamp
    ) {
        require(messages[_messageId].exists, "Message does not exist");
        Message memory msgData = messages[_messageId];
        return (msgData.id, msgData.author, msgData.content, msgData.timestamp);
    }

    function getReaction(uint256 _messageId) public view returns (
        uint32 likes,
        uint32 dislikes,
        uint32 interesting,
        uint32 notInteresting,
        uint32 toxicityScore
    ) {
        require(messages[_messageId].exists, "Message does not exist");
        Reaction memory reaction = reactions[_messageId];
        return (
            reaction.likes,
            reaction.dislikes,
            reaction.interesting,
            reaction.notInteresting,
            reaction.toxicityScore
        );
    }

    function getTotalMessages() public view returns (uint256) {
        return messageCount;
    }
}


