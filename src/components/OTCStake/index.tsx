import { getConnections, switchChain } from '@wagmi/core';
import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useChainId } from 'wagmi';
import { config } from '../../main';
import { RootState } from '../../state/store';
import { processVTRUStake } from '../../web3/transactions/vtruStake';
import { getVTRUBalance } from '../../web3/transactions/vtruSwap';
import GenericButton from '../GenericButton';
import LightningBoltSvgComponent from '../_primitives/LightningBolt';
import styles from './OTCStake.module.css';

const earns: any = {
    60: {
        apr: 0.18,
        aprBP: 1800,
        dailyPoints: 1,
        rewardsMul: 1030023634,
    },
    90: {
        apr: 0.23,
        aprBP: 2300,
        dailyPoints: 2,
        rewardsMul: 1058332407,
    },
    120: {
        apr: 0.3,
        aprBP: 3000,
        dailyPoints: 4,
        rewardsMul: 1103613313,
    },
    150: {
        apr: 0.39,
        aprBP: 3900,
        dailyPoints: 6,
        rewardsMul: 1173731990,
    },
    180: {
        apr: 0.5,
        aprBP: 5000,
        dailyPoints: 8,
        rewardsMul: 1279419692,
    },
};

const networkDetails: any = {
    1: {
        name: 'Ethereum',
    },
    5: {
        name: 'Goerli',
    },
    56: {
        name: 'BSC Mainnet',
    },
    97: {
        name: 'BSC Testnet',
    },
    1490: {
        name: 'VTRU Mainnet',
    },
    14333: {
        name: 'VTRU Testnet',
    },
};

const OTCStake = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [daysAmount, setDaysAmount] = useState(60);
    const [inputAmount, setInputAmount] = useState<number | undefined>(undefined);
    const wallet = useSelector((state: RootState) => state.profile.wallet);
    const [vtruBalance, setVtruBalance] = useState(0.0);
    const [loading, setLoading] = useState(false);
    const [calculateRewardAmount, setCalculateRewardAmount] = useState(0);
    const token = useSelector((state: RootState) => state.profile.token);
    const chainId = useChainId();

    useEffect(() => {
        getVTRUBalanceHandler();
    }, [wallet]);

    useEffect(() => {
        typeof inputAmount !== 'undefined' && calcEstimatedBalance(daysAmount, inputAmount);
        return () => {
            setCalculateRewardAmount(0);
        };
    }, [inputAmount, daysAmount, chainId]);

    const getVTRUBalanceHandler = async () => {
        if (wallet) {
            const balance = await getVTRUBalance(wallet);
            setVtruBalance(Number(parseFloat(balance).toFixed(4)));
        }
    };

    const changeSwapAmount = (event: ChangeEvent<HTMLInputElement>) => {
        setDaysAmount(parseInt(event.target.value));
    };

    const changeInputAmount = (event: ChangeEvent<HTMLInputElement>) => {
        if (parseFloat(event.target.value) > Number(vtruBalance - 0.3)) {
            const reducedAmount = Number(vtruBalance - 0.3).toFixed(4);
            setInputAmount(Number(reducedAmount));
            return;
        }
        setInputAmount(parseFloat(event.target.value));
    };

    const calcEstimatedBalance = async (daysStaked: number, amountStaked: number) => {
        const rewardDisplay = (amountStaked * earns[daysStaked].rewardsMul) / 1000000000;
        // const reward = await calculateReward(chainId.toString(), daysStaked, amountStaked);
        setCalculateRewardAmount(rewardDisplay);
    };

    const processVTRUStakeHandler = async () => {
        if (wallet) {
            try {
                setLoading(true);
                const requiredChainId = import.meta.env.VITE_PUBLIC_ENV == 'mainnet' ? 1490 : 14333;
                if (chainId != requiredChainId) {
                    const networkToast = await toast.loading(
                        'Switch Network to ' + networkDetails[requiredChainId]?.name,
                    );
                    const connections = getConnections(config);
                    try {
                        await switchChain(config, {
                            chainId: requiredChainId,
                            connector: connections[0]?.connector,
                        });
                        toast.dismiss(networkToast);
                    } catch (error) {
                        toast.dismiss(networkToast);
                        toast.error('Failed to switch network');
                    }
                }
                if (typeof inputAmount !== 'undefined') {
                    setLoading(true);
                    const aprBP = earns[daysAmount]?.aprBP;
                    const dailyPoints = earns[daysAmount]?.dailyPoints;
                    await processVTRUStake(
                        requiredChainId.toString(),
                        daysAmount,
                        inputAmount,
                        wallet,
                        token,
                        aprBP,
                        dailyPoints,
                        calculateRewardAmount,
                    );
                    setLoading(false);
                    navigate('/otc/stakeHistory');
                }
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('Process VTRU Stake Error: ', error);
                setLoading(false);
            }
        }
    };

    return (
        <div className={styles.box}>
            <h3 className={styles.title}>{t('airdrop.otc.stakeBox.title')}</h3>
            <h4 className={styles.caption}>{t('airdrop.otc.stakeBox.balance')}</h4>
            <h2 className={styles.mediumValue}>
                {t('airdrop.otc.swapBox.balanceValue', { value: vtruBalance })}
            </h2>
            <div className={styles.inputAmount}>
                <input
                    type='number'
                    value={inputAmount}
                    onChange={changeInputAmount}
                    placeholder='Enter Amount to Stake'
                    pattern='^\d*(\.\d{0,2})?$'
                    style={{ width: '100%' }}
                />
                <button onClick={() => setInputAmount(Number((vtruBalance - 0.3).toFixed(4)))}>MAX</button>
            </div>

            <h2 className={styles.bigValue}>{`${daysAmount} Days`} </h2>

            <input
                className={styles.inputRange}
                type='range'
                name='swapAmount'
                value={daysAmount}
                onChange={changeSwapAmount}
                min='60'
                max='180'
                step='30'
            />

            <div className={styles.apr}>
                <h4 className={styles.caption}>{'APR'}</h4>
                <h2 className={styles.mediumValue} style={{ color: 'cyan' }}>
                    {`${earns[daysAmount as keyof typeof earns].apr * 100}%`}
                </h2>
                <h4 className={styles.caption}>{' and '}</h4>
                <h2 className={styles.mediumValue} style={{ color: 'cyan' }}>
                    {earns[daysAmount as keyof typeof earns].dailyPoints}
                </h2>
                <LightningBoltSvgComponent fill='cyan' width={22} />
                <h4 className={styles.caption}>{' points per 10 $VTRU/day'}</h4>
            </div>

            <h4 className={styles.caption}>
                {t('airdrop.otc.stakeBox.estimatedBalance', { value: daysAmount })}
            </h4>
            <h1 className={styles.mediumValue} style={{ color: 'cyan' }}>
                {t('airdrop.otc.swapBox.balanceValue', {
                    value: calculateRewardAmount,
                })}
            </h1>

            <div className={styles.verifyButton}>
                <GenericButton
                    fill='cyan'
                    textcolor='black'
                    disabled={!inputAmount}
                    loading={loading}
                    onClick={processVTRUStakeHandler}
                >
                    {t('airdrop.otc.stakeBox.btnStake')}
                </GenericButton>
            </div>
            <p className={styles.regularText}>{t('airdrop.otc.stakeBox.warning')}</p>
        </div>
    );
};

export default OTCStake;
