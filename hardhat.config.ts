import 'dotenv/config';
import { HardhatUserConfig } from 'hardhat/types';
import 'hardhat-deploy';
import '@nomicfoundation/hardhat-ethers';
import '@nomicfoundation/hardhat-verify';
import "@nomicfoundation/hardhat-chai-matchers"
import 'hardhat-deploy-ethers';
import 'hardhat-gas-reporter';
import '@typechain/hardhat';
import 'solidity-coverage';
import 'hardhat-deploy-tenderly';
import 'hardhat-contract-sizer';

import { addForkConfiguration } from './helper-tools/utils/network';
import { defaultNetworks } from './networks.config';
import { task } from 'hardhat/config';

const UNISWAP_V3_COMPILER = {
	version: '0.7.6',
	settings: {
		evmVersion: 'istanbul',
		optimizer: {
			enabled: true,
			runs: 200,
		},
	}
}

const UNISWAP_V2_COMPILER_4 = {
	version: '0.4.12',
	settings: {
		optimizer: {
			enabled: true,
			runs: 200,
		},
	}
}

const UNISWAP_V2_COMPILER_5 = {
	version: '0.5.0',
	settings: {
		optimizer: {
			enabled: true,
			runs: 200,
		},
	}
}

const config: HardhatUserConfig = {
	solidity: {
		compilers: [
			{
				version: '0.7.6',
				settings: {
					evmVersion: 'istanbul',
					optimizer: {
						enabled: true,
						runs: 200,
					},
				},
			},
			{
				version: '0.8.4',
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					},
				},
			},
			{
				version: '0.6.6',
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					},
				},
			},
			{
				version: '0.8.15',
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					},
				},
			},
		],
		//Error in compiling v3-periphery without these overrides
		overrides: {
			"@uniswap/lib/contracts/libraries/AddressStringUtil.sol": UNISWAP_V3_COMPILER,
			"@uniswap/v3-core/contracts/libraries/FullMath.sol": UNISWAP_V3_COMPILER,
			"@uniswap/v3-core/contracts/libraries/Oracle.sol": UNISWAP_V3_COMPILER,
			"@uniswap/v3-core/contracts/libraries/TickMath.sol": UNISWAP_V3_COMPILER,
			"@uniswap/v3-core/contracts/libraries/TickBitmap.sol": UNISWAP_V3_COMPILER,
			"@uniswap/lib/contracts/libraries/SafeERC20Namer.sol": UNISWAP_V3_COMPILER,
			"@uniswap/v3-core/contracts/libraries/Tick.sol": UNISWAP_V3_COMPILER,
			// "@uniswap/lib/contracts/libraries/BitMath.sol": UNISWAP_V2_COMPILER_5,
			// "@uniswap/lib/contracts/libraries/FullMath.sol": UNISWAP_V2_COMPILER_4,
			// "@uniswap/lib/contracts/libraries/FixedPoint.sol": UNISWAP_V2_COMPILER_5,
		},
	},
	namedAccounts: {
		deployer: {
			hardhat: 0,
		},
		owner: {
			hardhat: 0,
		},
	},
	networks: addForkConfiguration(defaultNetworks),
	gasReporter: {
		currency: 'USD',
		gasPrice: 100,
		enabled: process.env.REPORT_GAS ? true : false,
		coinmarketcap: process.env.COINMARKETCAP_API_KEY,
		maxMethodDiff: 10,
	},
	typechain: {
		outDir: 'typechain',
	},
	mocha: {
		timeout: 0,
	},
	external: process.env.HARDHAT_FORK
		? {
			deployments: {
				// process.env.HARDHAT_FORK will specify the network that the fork is made from.
				// these lines allow it to fetch the deployments from the network being forked from both for node and deploy task
				hardhat: ['deployments/' + process.env.HARDHAT_FORK],
				localhost: ['deployments/' + process.env.HARDHAT_FORK],
			},
		}
		: undefined,
	tenderly: {
		project: 'orion-exchange',
		username: 'oionprotocol',
	},
	etherscan: {
		apiKey: {
			mainnet: process.env.ETHSCAN_API_KEY!,
			bsc: process.env.BSCSCAN_API_KEY!,
			bscTestnet: process.env.BSCSCAN_API_KEY!,
			polygon: process.env.POLYGONSCAN_API_KEY!,
			polygonMumbai: process.env.POLYGONSCAN_API_KEY!,
		},
	},
};
task("deployments", "List all deployed contract addresses")
	.setAction(async (_, hre) => {
		const deployments = await hre.deployments.all()
		for (const contractName in deployments) {
			console.log(`${contractName} \`${deployments[contractName].address}\``)
		}
	})

	task("verify-etherscan", "Verify all deployments using etherscan-verify")
	.addOptionalParam("pattern", "Filter deployments to only those which name includes {{pattern}}")
	.addOptionalParam("contract", "The name of contract that should be verified")
	.setAction(async (taskArgs, hre) => {
		const deployments = await hre.deployments.all()
		for (const deploymentName in deployments) {
			if (taskArgs.pattern && !deploymentName.includes(taskArgs.pattern)) continue

			const metadataString = deployments[deploymentName].metadata
			if (metadataString === undefined) continue
			const metadata = JSON.parse(metadataString)
			const [path, contractName]: any = Object.entries(metadata.settings.compilationTarget)[0]
			if (contractName === "AggregationExecutorSimple") continue
			console.log('\x1b[33m%s\x1b[0m', `Verifying ${deploymentName} at address: ${deployments[deploymentName].address}`);

			if (taskArgs.contract && contractName != taskArgs.contract) continue
			try {
				await hre.run("verify:verify", {
					contract: `${path}:${contractName}`,
					address: deployments[deploymentName].address,
					constructorArguments: deployments[deploymentName].args,
					libs: {
					}
				});
			} catch (error) {
				console.error(error)
			} finally {
				console.log()
			}
		}
	})
export default config;
