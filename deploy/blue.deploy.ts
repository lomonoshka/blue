import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const { deployments, getNamedAccounts } = hre;
	const { deploy } = deployments;

	const { deployer } = await getNamedAccounts();

	const antisnipe = "0xfc6373c332e7d419c1ef914fd010c1b8562b0fde"

	await deploy('Blue', {
		contract: 'Blue',
		from: deployer,
		skipIfAlreadyDeployed: true,
		args: [antisnipe],
		log: true
	});
};
export default func;
func.tags = ['Blue'];
func.dependencies = ['Antisnipe']
