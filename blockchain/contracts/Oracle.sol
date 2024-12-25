//SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract Oracle {
    Request[] requests;
    uint currentId = 0;
    uint minQuorum = 2;
    uint totalOracleCount = 3;

    struct Request {
        uint id;
        string url;
        string attr;
        string value;
        mapping(uint => string) answers;
        mapping(address => uint) quorum;
    }

    event OnNewRequest(uint id, string url, string attr);
    event OnRequestUpdate(uint id, string url, string attr, string value);

    function createRequest(string memory _url, string memory _attr) public {
        Request storage newRequest = requests.push();
        newRequest.id = currentId;
        newRequest.url = _url;
        newRequest.attr = _attr;
        newRequest.value = "";

        newRequest.quorum[address(0x1)] = 1;
        newRequest.quorum[address(0x2)] = 1;
        newRequest.quorum[address(0x3)] = 1;

        emit OnNewRequest(currentId, _url, _attr);

        currentId++;
    }

    function updateRequest(uint _id, string memory _value) public {
        Request storage currentRequest = requests[_id];

        if (currentRequest.quorum[address(msg.sender)] == 1) {
            currentRequest.quorum[msg.sender] = 2;

            uint iter = 0;
            bool found = false;
            while (!found) {
                if (bytes(currentRequest.answers[iter]).length == 0) {
                    found = true;
                    currentRequest.answers[iter] = _value;
                }
                iter++;
            }

            uint currentQuorum = 0;

            for (uint i = 0; i < totalOracleCount; i++) {
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
