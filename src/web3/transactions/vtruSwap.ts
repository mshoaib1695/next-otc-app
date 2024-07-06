import { ethers } from 'ethers';
import {
    readContract,
    writeContract,
    waitForTransaction,
    getAccount,
} from '@wagmi/core';
import { config } from '../../main';
import vtruSwapTestnet from '../config/vtruSwapTestnet.json';
import vtruSwapMainnet from '../config/vtruSwapMainnet.json';
import busdToken from '../config/busdToken.json';
import usdcToken from '../config/usdcToken.json';
import usdtToken from '../config/usdtToken.json';
import vtruFulfillment from '../config/vtruFulfillment.json';
import { toast } from 'react-hot-toast';
import { confetti } from '@tsparticles/confetti';
import { decodeAbiParameters } from 'viem';
import { API_SWAP_POST } from '../../constants/api';

interface ContractConfig {
    contractAddress: `0x${string}`;
    abi: any;
}

interface Config {
    [key: string]: ContractConfig;
}

const vtruSwapContract: any = { ...vtruSwapTestnet, ...vtruSwapMainnet };

const vtruDistContract: any = { ...vtruFulfillment };

export const getVTRUBalance = async (
    accountAddress: string
): Promise<string> => {
    const provider = new ethers.JsonRpcProvider(
        import.meta.env.VITE_PUBLIC_RPC
    );
    const balanceWei = await provider.getBalance(accountAddress);
    const balanceEther = ethers.formatEther(balanceWei);
    return balanceEther;
};

export const getPendingTx = async (
    accountAddress: string
): Promise<boolean> => {
    const provider = new ethers.JsonRpcProvider(
        import.meta.env.VITE_PUBLIC_RPC
    );
    const chainId: number =
        import.meta.env.VITE_PUBLIC_ENV === 'mainnet' ? 1490 : 14333;
    const vtruDistContractAddress: `0x${string}` =
        vtruDistContract[chainId]?.contractAddress;
    const vtruDistContractAbi: any = vtruDistContract[chainId]?.abi;
    const contract = new ethers.Contract(
        vtruDistContractAddress,
        vtruDistContractAbi,
        provider
    );
    try {
        const pending = await contract.getPendingCount(accountAddress);
        if (Number(pending) > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
};

export const isPublicSaleActive = async (
    contractAddress: `0x${string}`,
    abi: any
): Promise<boolean> => {
    const isPublicSale = await readContract(config, {
        address: contractAddress,
        abi,
        functionName: 'isSaleActive',
        args: [],
    });
    return !!isPublicSale;
};

export const getTokenDecimals = async (
    contractAddress: `0x${string}`,
    abi: any,
    currencySymbol: string
): Promise<number> => {
    const tokenDecimals = await readContract(config, {
        address: contractAddress,
        abi,
        functionName: 'TokenDecimals',
        args: [currencySymbol],
    });
    return Number(tokenDecimals);
};

export const getERC20BalanceOf = async (
    contractAddress: `0x${string}`,
    abi: any,
    userAddress: string,
    tokenDecimal: number
): Promise<any> => {
    const balanceOf: any = await readContract(config, {
        address: contractAddress,
        abi,
        functionName: 'balanceOf',
        args: [userAddress],
    });

    const balanceOfModified = ethers.formatUnits(balanceOf, tokenDecimal);
    return balanceOfModified;
};

export const getAllowance = async (
    tokenContractAddress: `0x${string}`,
    tokenContractAbi: any,
    wallet: string,
    vtruContractAddress: string
): Promise<any> => {
    const allowance = await readContract(config, {
        address: tokenContractAddress,
        abi: tokenContractAbi,
        functionName: 'allowance',
        args: [wallet, vtruContractAddress],
    });
    return allowance;
};

export const getTokenConfig = async (
    currencySymbol: string
): Promise<Config> => {
    let tokenData: any;
    switch (currencySymbol) {
        case 'BUSD':
            tokenData = busdToken;
            break;
        case 'USDC':
            tokenData = usdcToken;
            break;
        case 'USDT':
            tokenData = usdtToken;
            break;
        default:
            throw new Error(
                `Token with currencySymbol ${currencySymbol} is not supported.`
            );
    }
    return tokenData;
};

export const approve = async (
    tokenContractAddress: `0x${string}`,
    tokenContractAbi: any,
    vtruContractAddress: string,
    amount: number | bigint,
    toastMessage: string
): Promise<any> => {
    const { connector } = getAccount(config);
    const approveToast = await toast.loading(toastMessage);
    try {
        const resp = await writeContract(config, {
            address: tokenContractAddress,
            abi: tokenContractAbi,
            functionName: 'approve',
            args: [vtruContractAddress, amount],
            connector,
        });
        toast.dismiss(approveToast);
        await toast.promise(waitForTransaction(config, { hash: resp }), {
            loading: 'Approval is pending...',
            success: 'Approval successful 👌',
            error: 'Approval failed 🤯',
        });
        return resp;
    } catch (error) {
        toast.dismiss(approveToast);
        throw error;
    }
};

async function waitThreeSeconds(): Promise<void> {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, 3000);
    });
}

export async function processVTRUSwap(
    currencySymbol: string,
    amountInUSD: number,
    quantity: number,
    price: number,
    wallet: string,
    chainId: any,
    vamMultiplier: number,
    bonus: number,
    token: string | null
): Promise<any> {
    const { connector } = getAccount(config);

    const vtruContractAddress: `0x${string}` =
        vtruSwapContract[chainId]?.contractAddress;
    const vtruContractAbi: any = vtruSwapContract[chainId]?.abi;

    const tokenConfig = await getTokenConfig(currencySymbol);
    if (tokenConfig[chainId]?.contractAddress === undefined) {
        toast.error('Token not supported');
    }
    const tokenContractAddress: `0x${string}` =
        tokenConfig[chainId]?.contractAddress;
    const tokenContractAbi: any = tokenConfig[chainId].abi;
    const isPublicSale = await isPublicSaleActive(
        vtruContractAddress,
        vtruContractAbi
    );

    if (isPublicSale) {
        const tokenDecimal = await getTokenDecimals(
            vtruContractAddress,
            vtruContractAbi,
            currencySymbol
        );

        const qtyToWei = ethers.parseUnits(quantity.toString(), 18);
        const bonusToWei = ethers.parseUnits(bonus.toString(), 18);
        const totalAmount = ethers.parseUnits(
            amountInUSD.toString(),
            Number(tokenDecimal)
        );
        const balanceOf = await getERC20BalanceOf(
            tokenContractAddress,
            tokenContractAbi,
            wallet,
            tokenDecimal
        );

        if (Number(balanceOf) < amountInUSD) {
            toast.error(`Insufficient $${currencySymbol} Balance`);
            throw 'Insufficient Balance';
        }

        const allowance = await getAllowance(
            tokenContractAddress,
            tokenContractAbi,
            wallet,
            vtruContractAddress
        );

        if (Number(allowance.toString()) < totalAmount) {
            if (
                currencySymbol === 'USDT' &&
                chainId == '1' &&
                Number(allowance.toString()) != 0
            ) {
                // Resetting USDT Approval
                const resetToastMessage = `Resetting $${currencySymbol} approval`;
                await approve(
                    tokenContractAddress,
                    tokenContractAbi,
                    vtruContractAddress,
                    0,
                    resetToastMessage
                );
                await waitThreeSeconds();
            }

            // Approve ERC20 Allowance
            const approveToastMessage = `Approve $${currencySymbol} transaction`;
            await approve(
                tokenContractAddress,
                tokenContractAbi,
                vtruContractAddress,
                totalAmount,
                approveToastMessage
            );
            await waitThreeSeconds();
        }

        const swapToast = await toast.loading('Sign Swap transaction');
        try {
            const response = await writeContract(config, {
                address: vtruContractAddress,
                abi: vtruContractAbi,
                functionName: 'buyVTRUViaOTC',
                args: [
                    currencySymbol,
                    qtyToWei,
                    totalAmount,
                    vamMultiplier,
                    bonusToWei,
                ],
                connector,
            });
            toast.dismiss(swapToast);
            const data: any = await toast.promise(
                waitForTransaction(config, { hash: response }),
                {
                    loading: 'Transaction is pending...',
                    success: 'Transaction successful 👌',
                    error: 'Transaction failed 🤯',
                }
            );
            const decoded = await decodeAbiParameters(
                [{ name: 'x', type: 'uint256' }],
                data.logs[2].topics[1]
            );
            const otcId = Number(decoded[0].toString());

            const body = {
                swapId: otcId,
                wallet: wallet,
                chainId: chainId,
                currency: currencySymbol,
                amountInUSD,
                txHash: data.transactionHash,
                // amount: tokenAmount,
                qty: quantity,
                vam: vamMultiplier,
                vamBonus: bonus,
                price: price,
                // token: quantity,
            };
            await fetch(API_SWAP_POST, {
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
                origin: { y: 0.55 },
            });

            return data;
        } catch (error) {
            toast.dismiss(swapToast);
            throw error;
        }
    } else {
        toast.error('Swap not active');
        throw 'Swap not active';
    }
}
