// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EVoting {
    address[] public electoralAuthorities;
    uint public electionCount;
    enum ElectionStatus { PENDING, OPEN, CLOSED }

    struct Candidate {
        uint id;
        string name;
        string program;
        uint voteCount;
    }

    struct Voter {
        uint id;
        string name;
        string surname;
        string email;
        bool hasVoted;
    }

    struct ElectionDetails {
        uint id;
        string name;
        string description;
        uint startDate;
        uint endDate;
        bool isPrivate;
        bool votingSessionOpen;
        ElectionStatus status;
        Candidate[] candidates;
        Voter[] voters;
    }

    mapping(uint => ElectionDetails) public elections;
    event ElectionCreated(uint electionId, string name, bool isPrivate, uint startDate, uint endDate);
    event CandidateAdded(uint electionId, uint candidateId, string name, string program);
    event Voted(uint electionId, uint voterId, uint candidateId);

    modifier onlyElectoralAuthority() {
        require(isElectoralAuthority(msg.sender), "Seules les autorites electorales peuvent effectuer cette action.");
        _;
    }

    modifier electionExists(uint electionId) {
        require(electionId <= electionCount && electionId > 0, "L'election n'existe pas.");
        _;
    }

    constructor() {
        electoralAuthorities.push(msg.sender);
    }

    function isElectoralAuthority(address _address) internal view returns (bool) {
        for (uint i = 0; i < electoralAuthorities.length; i++) {
            if (electoralAuthorities[i] == _address) {
                return true;
            }
        }
        return false;
    }

    function addElectoralAuthority(address _newAuthority) public onlyElectoralAuthority {
        electoralAuthorities.push(_newAuthority);
    }

    function createElection(
        string memory _name,
        string memory _description,
        uint _startDate,
        uint _endDate,
        bool _isPrivate,
        Voter[] memory _voters  
    ) public onlyElectoralAuthority returns (uint) {
        require(_endDate > _startDate, "La date de fin doit etre superieure a la date de debut.");
        require(_startDate >= block.timestamp, "La date de debut doit etre dans le futur.");

        electionCount++;
        
        ElectionDetails storage newElection = elections[electionCount];
        newElection.id = electionCount;
        newElection.name = _name;
        newElection.description = _description;
        newElection.startDate = _startDate;
        newElection.endDate = _endDate;
        newElection.isPrivate = _isPrivate;
        newElection.status = ElectionStatus.PENDING;
        newElection.votingSessionOpen = false;

        if (_isPrivate) {
            for (uint i = 0; i < _voters.length; i++) {
                newElection.voters.push(_voters[i]);
            }
        }

        emit ElectionCreated(electionCount, _name, _isPrivate, _startDate, _endDate);
        return electionCount;
    }

    function addCandidate(
        uint _electionId, 
        string memory _name, 
        string memory _program
    ) public onlyElectoralAuthority electionExists(_electionId) {
        ElectionDetails storage election = elections[_electionId];
        election.candidates.push(Candidate(election.candidates.length + 1, _name, _program, 0));
        
        emit CandidateAdded(_electionId, election.candidates.length, _name, _program);
    }

    function vote(
        uint _electionId,
        uint _candidateId,
        uint _voterId,
        string memory _name,
        string memory _surname,
        string memory _email
    ) public electionExists(_electionId) {
        ElectionDetails storage election = elections[_electionId];

        require(election.votingSessionOpen, "La session de vote n'est pas ouverte.");
        require(_candidateId > 0 && _candidateId <= election.candidates.length, "Candidat invalide.");

        if (election.isPrivate) {
            bool isAuthorized = false;

            for (uint i = 0; i < election.voters.length; i++) {
                if (
                    election.voters[i].id == _voterId &&
                    keccak256(abi.encodePacked(election.voters[i].email)) == keccak256(abi.encodePacked(_email)) &&
                    keccak256(abi.encodePacked(election.voters[i].name)) == keccak256(abi.encodePacked(_name)) &&
                    keccak256(abi.encodePacked(election.voters[i].surname)) == keccak256(abi.encodePacked(_surname))
                ) {
                    require(!election.voters[i].hasVoted, "Le votant a deja vote.");
                    election.voters[i].hasVoted = true;
                    isAuthorized = true;
                    break;
                }
            }

            require(isAuthorized, "Non autorise a voter dans cette election privee.");
        } else {
            election.voters.push(Voter(election.voters.length + 1, _name, _surname, _email, true));
        }

        election.candidates[_candidateId - 1].voteCount++;

        emit Voted(_electionId, election.voters.length, _candidateId);
    }


    function openVotingSession(uint _electionId) public onlyElectoralAuthority electionExists(_electionId) {
        ElectionDetails storage election = elections[_electionId];
        require(election.status == ElectionStatus.PENDING, "L'election est deja ouverte ou terminee.");

        election.votingSessionOpen = true;
        election.status = ElectionStatus.OPEN;
    }

    function closeVotingSession(uint _electionId) public onlyElectoralAuthority electionExists(_electionId) {
        ElectionDetails storage election = elections[_electionId];
        require(election.status == ElectionStatus.OPEN, "L'election n'est pas ouverte.");

        election.votingSessionOpen = false;
        election.status = ElectionStatus.CLOSED;
    }

    function getElectionDetails(uint _electionId) public view electionExists(_electionId) returns (
        string memory name,
        string memory description,
        bool isPrivate,
        bool votingSessionOpen,
        uint startDate,
        uint endDate,
        Candidate[] memory candidates,
        Voter[] memory voters
    ) {
        ElectionDetails storage election = elections[_electionId];
        return (
            election.name,
            election.description,
            election.isPrivate,
            election.votingSessionOpen,
            election.startDate,
            election.endDate,
            election.candidates,
            election.voters
        );
    }

    function getOnGoingElections() public view returns (uint[] memory) {
        uint count = 0;
        for (uint i = 1; i <= electionCount; i++) {
            if (elections[i].votingSessionOpen) {
                count++;
            }
        }

        uint[] memory ongoingElections = new uint[](count);
        uint index = 0;
        for (uint i = 1; i <= electionCount; i++) {
            if (elections[i].votingSessionOpen) {
                ongoingElections[index] = i;
                index++;
            }
        }

        return ongoingElections;
    }

    function getCompletedElections() public view returns (uint[] memory) {
        uint count = 0;

        for (uint i = 1; i <= electionCount; i++) {
            if (elections[i].status == ElectionStatus.CLOSED) {
                count++;
            }
        }

        uint[] memory completedElections = new uint[](count);
        uint index = 0;

        for (uint i = 1; i <= electionCount; i++) {
            if (elections[i].status == ElectionStatus.CLOSED) {
                completedElections[index] = i;
                index++;
            }
        }

        return completedElections;
    }

    function getCurrentTime()public view returns(uint){
        return block.timestamp;
    }
    
}
