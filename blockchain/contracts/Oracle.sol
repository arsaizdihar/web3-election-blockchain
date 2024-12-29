//SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract Oracle {
    //--------------------Variables--------------------
    address[] public oracles;
    uint256 public minQuorum;
    address public owner;

    //bytes32 in this case should be keccak hash of voter_id, tps_id, voting_id
    mapping(bytes32 => RequestAnswers) public requests;

    //--------------------Structs--------------------
    struct Request {
        string voter_id;
        uint64 tps_id;
        uint64 voting_id;
    }
    struct RequestAnswers {
        bool isResolved;
        bool finalValue;
        uint64 yes;
        uint64 no;
        mapping(address => uint) quorum;
    }

    //--------------------Constructor--------------------
    constructor(address _owner, address[] memory _oracles, uint256 _minQuorum) {
        for (uint256 i = 0; i < _oracles.length; i++) {
            oracles.push(_oracles[i]);
        }

        require(
            oracles.length >= _minQuorum,
            "Min quorum should be less than or equal to total oracle count"
        );
        owner = _owner;
        minQuorum = _minQuorum;
    }

    //--------------------Events--------------------
    event OnNewRequest(string voter_id, uint64 tps_id, uint64 voting_id);
    event OnQuorumReached(
        string voter_id,
        uint64 tps_id,
        uint64 voting_id,
        bool result
    );

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

    function createRequest(
        string memory voter_id,
        uint64 tps_id,
        uint64 voting_id
    ) public {
        bytes32 requestHash = keccak256(
            abi.encodePacked(voter_id, tps_id, voting_id)
        );
        require(
            requests[requestHash].isResolved == false &&
                requests[requestHash].yes == 0 &&
                requests[requestHash].no == 0,
            "Request has already been created."
        );

        requests[requestHash].isResolved = false;
        requests[requestHash].finalValue = false;
        requests[requestHash].yes = 0;
        requests[requestHash].no = 0;

        for (uint256 index = 0; index < oracles.length; index++) {
            requests[requestHash].quorum[oracles[index]] = 1;
        }

        emit OnNewRequest(voter_id, tps_id, voting_id);
    }

    function updateRequest(
        string memory voter_id,
        uint64 tps_id,
        uint64 voting_id,
        bool value
    ) public {
        bytes32 requestHash = keccak256(
            abi.encodePacked(voter_id, tps_id, voting_id)
        );

        require(
            !requests[requestHash].isResolved,
            "Request is already resolved"
        );
        require(
            requests[requestHash].quorum[msg.sender] == 1,
            "Not authorized oracle"
        );

        requests[requestHash].quorum[msg.sender] = 2;
        value ? requests[requestHash].yes++ : requests[requestHash].no++;
        uint64 total = value
            ? requests[requestHash].yes
            : requests[requestHash].no;

        if (total >= minQuorum) {
            requests[requestHash].isResolved = true;
            requests[requestHash].finalValue = value;
            emit OnQuorumReached(
                voter_id,
                tps_id,
                voting_id,
                value);
        }
    }

    function getRequestResult(
        string memory voter_id,
        uint64 tps_id,
        uint64 voting_id
    ) public view returns (bool) {
        bytes32 requestHash = keccak256(
            abi.encodePacked(voter_id, tps_id, voting_id)
        );

        require(
            requests[requestHash].isResolved,
            "Request is not resolved yet"
        );
        return requests[requestHash].finalValue;
    }
}
