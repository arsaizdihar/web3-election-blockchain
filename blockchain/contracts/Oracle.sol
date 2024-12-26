//SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract Oracle {
    //--------------------Variables--------------------
    address[] public oracles;
    Request[] public requests;
    uint256 public currentId = 0;
    uint256 public minQuorum = 1;
    address public owner;

    //--------------------Structs--------------------
    struct Request {
        uint256 id;
        string voter_id;
        uint64 tps_id;
        uint64 voting_id;
        bool isResolved;
        bool finalValue;
        mapping(bool => uint256) answers;
        mapping(address => uint) quorum;
    }

    //--------------------Constructor--------------------
    constructor(address _owner, address[] memory _oracles) {
        owner = _owner;

        for (uint256 i = 0; i < _oracles.length; i++) {
            oracles.push(_oracles[i]);
        }
    }

    //--------------------Events--------------------
    event OnNewRequest(
        uint256 id,
        string voter_id,
        uint64 tps_id,
        uint64 voting_id
    );
    event OnQuorumReached(uint256 id, bool result);

    //--------------------Modifiers--------------------
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    //--------------------Owner functions--------------------
    function addOracle(address oracleAddr) public onlyOwner {
        require(oracleAddr != address(0), "Invalid oracle address");
        for (uint256 i = 0; i < oracles.length; i++) {
            require(oracles[i] != oracleAddr, "Oracle already exists");
        }

        oracles.push(oracleAddr);
    }

    function removeOracle(address oracleAddr) public onlyOwner {
        require(oracleAddr != address(0), "Invalid oracle address");
        require(
            oracles.length > minQuorum,
            "Min quorum should be less than total oracle count"
        );

        for (uint256 i = 0; i < oracles.length; i++) {
            if (oracles[i] == oracleAddr) {
                oracles[i] = oracles[oracles.length - 1];
                oracles.pop();
                break;
            }
        }
    }

    function setMinQuorum(uint256 _minQuorum) public onlyOwner {
        require(_minQuorum > 0, "Min quorum should be greater than 0");
        require(
            _minQuorum <= oracles.length,
            "Min quorum should be less than or equal to total oracle count"
        );
        minQuorum = _minQuorum;
    }

    //--------------------User functions--------------------
    function getOracles() public view returns (address[] memory) {
        return oracles;
    }

    function getRequestAnswer(
        uint256 reqId,
        bool answerKey
    ) public view returns (uint256) {
        return requests[reqId].answers[answerKey];
    }

    function createRequest(
        string memory voter_id,
        uint64 tps_id,
        uint64 voting_id
    ) public returns (uint256) {
        Request storage newRequest = requests.push();
        newRequest.id = currentId;
        newRequest.voter_id = voter_id;
        newRequest.tps_id = tps_id;
        newRequest.voting_id = voting_id;
        newRequest.isResolved = false;
        newRequest.finalValue = false;

        for (uint256 index = 0; index < oracles.length; index++) {
            newRequest.quorum[oracles[index]] = 1;
        }

        emit OnNewRequest(currentId, voter_id, tps_id, voting_id);
        currentId++;

        return newRequest.id;
    }

    function updateRequest(uint256 _id, bool value) public {
        require(!requests[_id].isResolved, "Request is already resolved");
        require(requests[_id].quorum[msg.sender] == 1, "Not authorized oracle");

        requests[_id].quorum[msg.sender] = 2;
        requests[_id].answers[value]++;

        if (requests[_id].answers[value] >= minQuorum) {
            requests[_id].isResolved = true;
            requests[_id].finalValue = value;
            emit OnQuorumReached(_id, value);
        }
    }

    function getRequestResult(uint256 _id) public view returns (bool) {
        require(requests[_id].isResolved, "Request is not resolved yet");
        return requests[_id].finalValue;
    }
}
