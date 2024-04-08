// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IAntisnipe {
	function beforeTokenTransfer(address from, address to, uint256 amount) external;
}

contract Blue is Ownable, ERC20 {
	address immutable antisnipe;
	bool isAntisnipeEnabled = true;
	bool isAntisnipeRenounced = false;

	error AntisnipeRenounced();

	constructor(address antisnipe_) ERC20("Blue", "BLUE") {
		antisnipe = antisnipe_;
		_mint(msg.sender, 1_000_000_000_000 * 10 ** decimals());
	}

	function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override {
		if (!isAntisnipeRenounced && isAntisnipeEnabled) {
			IAntisnipe(antisnipe).beforeTokenTransfer(from, to, amount);
		}
	}

	function setIsAntisnipeEnabled(bool isAntisnipeEnabled_) external onlyOwner {
		if (isAntisnipeRenounced) revert AntisnipeRenounced();
		isAntisnipeEnabled = isAntisnipeEnabled_;
	}

	function renounceAntisnipe() external onlyOwner {
		if (isAntisnipeRenounced) revert AntisnipeRenounced();
		isAntisnipeEnabled = false;
		isAntisnipeRenounced = true;
	}
}
