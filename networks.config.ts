import { node_url } from './helper-tools/utils/network';
import { env } from "process";

export const defaultNetworks = {
	hardhat: {
		initialBaseFeePerGas: 0, // to fix : https://github.com/sc-forks/solidity-coverage/issues/652, see https://github.com/sc-forks/solidity-coverage/issues/652#issuecomment-896330136
		tags: ["local"],
		chainId: 1,
		allowUnlimitedContractSize: true
	},
	localhost: {
		url: "127.0.0.1",
		tags: ["local"]
	},
	bsc_testnet: {
		tags: ["testnet"],
		url: node_url("bsc_testnet"),
		chainId: 97,
		verify: {
			etherscan: {
				apiKey: env.BSCSCAN_API_KEY,
			},
		},
	},
	polygon_testnet: {
		tags: ["testnet"],
		url: node_url("polygon_testnet"),
		chainId: 80001,
		verify: {
			etherscan: {
				apiKey: env.POLYGONSCAN_API_KEY,
			},
		},
	},
	bsc_mainnet: {
		tags: ["mainnet"],
		url: node_url("bsc_mainnet"),
		chainId: 56,
		verify: {
			etherscan: {
				apiKey: env.BSCSCAN_API_KEY,
			},
		},
	},
	eth_mainnet: {
		tags: ["mainnet"],
		url: node_url('eth'),
		chainId: 1,
		verify: {
			etherscan: {
				apiKey: env.ETHSCAN_API_KEY
			},
		},
	},
	polygon_mainnet: {
		tags: ["mainnet"],
		url: node_url("polygon_mainnet"),
		chainId: 137,
		verify: {
			etherscan: {
				apiKey: env.POLYGONSCAN_API_KEY,
			},
		},
	},
}
