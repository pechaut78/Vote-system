// contracts/Voting
// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
import "./Admin.sol";



    
contract Voting is Admin {

    struct Voter {
    bool hasVoted;
    uint votedProposalId;
    }
    
    struct Proposal {
    string description;
    uint voteCount;
    }
    
    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }
    

    //Status of the contract
    WorkflowStatus _Status;
    modifier onlySatus(WorkflowStatus status)
    {
        require(_Status==status,"Function call forbidden now");
        _;
    }

    uint  winningProposalId;  // Store the winner Id
    
    //DB for VoterRegistered & Proposals
    mapping(address=>Voter) _Voters;    // Mapping of voter's addresses    
    Proposal[]  _Proposals;           // List of Proposals
    
    
    
    //------------------ Events 
    event VoterRegistered(address voterAddress);
    event VoterRegistrationStarting();
    event ProposalsRegistrationStarted();
    event ProposalsRegistrationEnded();
    event ProposalRegistered(uint proposalId);
    event VotingSessionStarted();
    event VotingSessionEnded();
    event Voted (address voter, uint proposalId);
    event VotesTallied();
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus
    newStatus);
    
     
    
    
    constructor() Admin()
    {
        // We start the state machine
        _Status=WorkflowStatus.RegisteringVoters;
        emit VoterRegistrationStarting();
    }    
    
    
    //-------------------- Admin functions

    function getStatus()  external view returns(uint)
    {
        return uint(_Status);
    }
    function registerVoter(address addr) public onlyOwner() onlySatus(WorkflowStatus.RegisteringVoters)
    {
        whitelist(addr);
        // No need to initial voter structure, the default values are fine
        emit VoterRegistered(addr);
    }
    
    function startProposalRegistration() public onlyOwner() onlySatus(WorkflowStatus.RegisteringVoters)
    {
        _Status = WorkflowStatus.ProposalsRegistrationStarted;
        emit ProposalsRegistrationStarted();
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters,_Status);
    }
    
    function endProposalRegistration() public onlyOwner() onlySatus(WorkflowStatus.ProposalsRegistrationStarted)
    {
        _Status = WorkflowStatus.ProposalsRegistrationEnded;
        emit ProposalsRegistrationEnded();
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted,_Status);
    }
    function startVotingSession() public onlyOwner() onlySatus(WorkflowStatus.ProposalsRegistrationEnded)
    {
        _Status = WorkflowStatus.VotingSessionStarted;
        emit VotingSessionStarted();
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded,_Status);
    }
    function endVotingSession() public onlyOwner() onlySatus(WorkflowStatus.VotingSessionStarted)
    {
        _Status = WorkflowStatus.VotingSessionEnded;
        emit VotingSessionEnded();
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted,_Status);
    }
    function endVotingCount() public onlyOwner() onlySatus(WorkflowStatus.VotingSessionEnded)
    {
        _Status = WorkflowStatus.VotesTallied;
        emit VotesTallied();
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded,_Status);
    }
    
    
    //------------------- Tools 
    function memcmp(bytes memory a, bytes memory b) internal pure returns(bool){
        return (a.length == b.length) && (keccak256(a) == keccak256(b));
    }
    
    
    // Generic functions
    
    //------------------- Proposal Utilities
    function submitProposal(string memory desc) public  onlySatus(WorkflowStatus.ProposalsRegistrationStarted)
    {
        for(uint16 i =0; i<_Proposals.length;i++)
            assert(!memcmp(bytes(_Proposals[i].description),bytes(desc)));  // check if proposal is already in
        
        Proposal memory prop = Proposal({description:desc,voteCount:0});        
        _Proposals.push(prop); // add the proposal
        emit ProposalRegistered(_Proposals.length-1);
    }
    
    function getProposal(uint16 indx) public view returns(string memory) {
        return _Proposals[indx].description;
    }
    function getProposalNb() public view returns(uint16) {
        return uint16(_Proposals.length);
    }
      


    //------------------- Vote Utilities
    function voteFor(uint16 proposition) public onlySatus(WorkflowStatus.VotingSessionStarted) {
        assert(isWhiteListed(msg.sender)); // Make sure the sender is WhiteListed
        assert( !_Voters[msg.sender].hasVoted); // Make sure the sender has not already voted
        assert(proposition<uint16(_Proposals.length)); // Make sure the index is VotesTallied
                
        _Voters[msg.sender].hasVoted = true;
        _Voters[msg.sender].votedProposalId = proposition;
        _Proposals[proposition].voteCount++;
        if(_Proposals[proposition].voteCount>_Proposals[winningProposalId].voteCount)
        {
            winningProposalId = proposition;
        }
        emit Voted(msg.sender, proposition);
    }
    
    function countVotes() public onlySatus(WorkflowStatus.VotingSessionEnded) onlyOwner()
    {
        endVotingCount();
    }
    
    function getWinningProposition() onlySatus(WorkflowStatus.VotesTallied) public view returns(string memory)
    {
        return _Proposals[winningProposalId].description;
    }    
}