//SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract Oracle {
    //--------------------Variables--------------------
    address[] internal oracles;
    Request[] public requests;
    uint256 public currentId = 0;
    uint256 public minQuorum = 0;
    address public owner;

    //--------------------Structs--------------------
    struct Request {
        uint256 id;
        string url;
        string attr;
        string value;
        mapping(uint256 => string) answers;
        mapping(address => uint) quorum;
    }

    //--------------------Events--------------------
    event OnNewRequest(uint256 id, string url, string attr);
    event OnRequestUpdate(uint256 id, string url, string attr, string value);

    //--------------------Modifiers--------------------
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    //--------------------Owner functions--------------------
    function addOracle(address oracleAddr) public onlyOwner {
        require(oracleAddr != address(0), "Invalid oracle address");

        oracles.push(oracleAddr);
    }

    function removeOracle(address oracleAddr) public onlyOwner {
        require(oracleAddr != address(0), "Invalid oracle address");

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

    function createRequest(string memory _url, string memory _attr) public {
        Request storage newRequest = requests.push();
        newRequest.id = currentId;
        newRequest.url = _url;
        newRequest.attr = _attr;
        newRequest.value = "";

        for (uint256 index = 0; index < oracles.length; index++) {
            newRequest.quorum[oracles[index]] = 1;
        }

        emit OnNewRequest(currentId, _url, _attr);
        currentId++;
    }

    function updateRequest(uint256 _id, string memory _value) public {
        Request storage currentRequest = requests[_id];

        if (currentRequest.quorum[address(msg.sender)] == 1) {
            currentRequest.quorum[msg.sender] = 2;

            uint256 iter = 0;
            bool found = false;
            while (!found) {
                if (bytes(currentRequest.answers[iter]).length == 0) {
                    found = true;
                    currentRequest.answers[iter] = _value;
                }
                iter++;
            }

            uint256 currentQuorum = 0;

            for (uint256 i = 0; i < oracles.length; i++) {
                bytes memory a = bytes(currentRequest.answers[i]);
                bytes memory b = bytes(_value);

                if (keccak256(a) == keccak256(b)) {
                    currentQuorum++;
                    if (currentQuorum >= minQuorum) {
                        currentRequest.value = _value;

                        emit OnRequestUpdate(
                            currentRequest.id,
                            currentRequest.url,
                            currentRequest.attr,
                            currentRequest.value
                        );
                    }
                }
            }
        }
    }
}
