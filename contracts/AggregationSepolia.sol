// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ChatSepolia.sol";

contract AggregationSepolia {
    ChatSepolia public chatContract;

    struct PublicStats {
        uint256 totalMessages;
        uint256 totalLikes;
        uint256 totalDislikes;
        uint256 totalInteresting;
        uint256 totalNotInteresting;
        uint256 averageToxicity;
    }

    event StatsUpdated(uint256 timestamp, PublicStats stats);

    constructor(address _chatContract) {
        chatContract = ChatSepolia(_chatContract);
    }

    function computePublicStats(uint256 _messageId) 
        public 
        view 
        returns (PublicStats memory) 
    {
        (
            uint32 likes,
            uint32 dislikes,
            uint32 interesting,
            uint32 notInteresting,
            uint32 toxicityScore
        ) = chatContract.getReaction(_messageId);

        return PublicStats({
            totalMessages: chatContract.getTotalMessages(),
            totalLikes: likes,
            totalDislikes: dislikes,
            totalInteresting: interesting,
            totalNotInteresting: notInteresting,
            averageToxicity: toxicityScore
        });
    }

    function getTopMessages(uint256[] memory _messageIds)
        public
        view
        returns (uint256[] memory topMessageIds, uint256[] memory scores)
    {
        uint256[] memory messageScores = new uint256[](_messageIds.length);
        
        for (uint256 i = 0; i < _messageIds.length; i++) {
            (
                uint32 likes,
                uint32 dislikes,
                ,
                ,
            ) = chatContract.getReaction(_messageIds[i]);
            
            // Calculate score: likes - dislikes
            int256 score = int256(uint256(likes)) - int256(uint256(dislikes));
            messageScores[i] = score > 0 ? uint256(score) : 0;
        }

        return (_messageIds, messageScores);
    }

    function getChatMood() public view returns (string memory) {
        uint256 totalMessages = chatContract.getTotalMessages();
        if (totalMessages == 0) return "Neutral";
        
        // Aggregate all reactions to determine mood
        uint256 totalPositive = 0;
        uint256 totalNegative = 0;
        
        for (uint256 i = 1; i <= totalMessages && i <= 100; i++) { // Limit to 100 for gas
            (
                uint32 likes,
                uint32 dislikes,
                ,
                ,
            ) = chatContract.getReaction(i);
            
            totalPositive += likes;
            totalNegative += dislikes;
        }
        
        if (totalPositive > totalNegative * 2) return "Very Positive";
        if (totalPositive > totalNegative) return "Positive";
        if (totalNegative > totalPositive * 2) return "Very Negative";
        if (totalNegative > totalPositive) return "Negative";
        return "Neutral";
    }
}


