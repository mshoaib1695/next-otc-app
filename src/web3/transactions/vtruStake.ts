import { readContract, writeContract, waitForTransaction, getAccount } from '@wagmi/core';
import { config } from '../../main';
import vtruStake from '../config/vtruStake.json';
import { toast } from 'react-hot-toast';
import { parseEther } from 'viem';
import { confetti } from '@tsparticles/confetti';
import { API_STAKE_POST } from '../../constants/api';
import { decodeAbiParameters } from 'viem';

export const isActive = async (contractAddress: `0x${string}`, abi: any): Promise<boolean> => {
    const isPublicSale = await readContract(config, {
        address: contractAddress,
        abi,
        functionName: 'isActive',
        args: [],
    });
    return !!isPublicSale;
};

export const calculateReward = async (
    chainId: string,
    daysStaked: number,
    amountStaked: number,
): Promise<number> => {
    let vtruContract: any = vtruStake;
    vtruContract = vtruContract[chainId];
    const reward = await readContract(config, {
        address: vtruContract.contractAddress,
        abi: vtruContract.abi,
        functionName: 'calculateReward',
        args: [daysStaked, amountStaked],
    });
    return Number(reward);
};

export const getAccountStakes = async (wallet: string, chainId: string): Promise<any> => {
    let vtruContract: any = vtruStake;
    vtruContract = vtruContract[chainId];
    const accountStakes = await readContract(config, {
        address: vtruContract.contractAddress,
        abi: vtruContract.abi,
        functionName: 'getAccountStakes',
        args: [wallet],
    });
    return accountStakes;
};

export const getStakeById = async (id: number, chainId: string): Promise<any> => {
    let vtruContract: any = vtruStake;
    vtruContract = vtruContract[chainId];
    const accountStakes = await readContract(config, {
        address: vtruContract.contractAddress,
        abi: vtruContract.abi,
        functionName: 'getStake',
        args: [id],
    });
    return accountStakes;
};

export const getStakeIdByAccount = async (wallet: string, chainId: string): Promise<any> => {
    let vtruContract: any = vtruStake;
    vtruContract = vtruContract[chainId];
    const accountStakes = await readContract(config, {
        address: vtruContract.contractAddress,
        abi: vtruContract.abi,
        functionName: 'getStakeIdByAccount',
        args: [wallet],
    });
    return accountStakes;
};

export async function processVTRUStake(
    chainId: string,
    daysStaked: number,
    amountStaked: number,
    wallet: string,
    token: string | null,
    aprBP: number,
    dailyPoints: number,
    estEarnings: number,
): Promise<any> {
    const { connector } = getAccount(config);

    const vtruContract: any = vtruStake;
    const vtruContractAddress: any = vtruContract[chainId].contractAddress;
    const vtruContractAbi: any = vtruContract[chainId].abi;

    const isPublicSale = await isActive(vtruContractAddress, vtruContractAbi);
    if (isPublicSale) {
        const stakeToast = await toast.loading('Sign Stake transaction');
        try {
            const response = await writeContract(config, {
                address: vtruContractAddress,
                abi: vtruContractAbi,
                functionName: 'stake',
                args: [daysStaked],
                connector,
                value: parseEther(amountStaked.toFixed(2)),
            });
            toast.dismiss(stakeToast);
            const data = await toast.promise(waitForTransaction(config, { hash: response }), {
                loading: 'Transaction is pending...',
                success: 'Transaction successful 👌',
                error: 'Transaction failed 🤯',
            });

            const topic = data.logs[0]?.topics[1];

            if (topic !== undefined) {
                if (typeof topic === 'string') {
                    const decoded = await decodeAbiParameters(
                        [{ name: 'x', type: 'uint256' }],
                        topic,
                    );
                    const stakeId = Number(decoded[0].toString());
                    const pointsPerDay = Math.round((amountStaked / 10) * dailyPoints);
                    // const stakeDetails = await getStakeById(stakeId, chainId.toString());

                    const body = {
                        stakeId: stakeId,
                        wallet: wallet,
                        amountStaked: amountStaked,
                        daysStaked: daysStaked,
                        apr: aprBP,
                        pointsPerDay: pointsPerDay,
                        estEarnings: estEarnings,
                        txHash: response,
                        startBlock: 0,
                        endBlock: 0,
                    };

                    await fetch(API_STAKE_POST, {
                        method: 'POST',
                        body: JSON.stringify(body),
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    confetti({
                        particleCount: 250,
                        spread: 90,
                        origin: { x: 0.77, y: 0.55 },
                    });

                    return response;
                } else {
                    toast.dismiss(stakeToast);
                    throw 'Invalid type for topic.';
                }
            } else {
                toast.dismiss(stakeToast);
                throw 'Topic is undefined.';
            }
        } catch (error) {
            toast.dismiss(stakeToast);
            throw error;
        }
    } else {
        toast.error('Stake not active');
        throw 'Stake not active';
    }
}
