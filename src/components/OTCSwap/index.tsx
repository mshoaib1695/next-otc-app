import { getConnections, switchChain } from '@wagmi/core';
import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useChainId } from 'wagmi';
import { config } from '../../main';
import { actions as notificationActions } from '../../state/notifications';
import { RootState } from '../../state/store';
import {
    getPendingTx,
    getVTRUBalance,
    processVTRUSwap,
} from '../../web3/transactions/vtruSwap';
import GenericButton from '../GenericButton';
import { InputOrText } from '../InputOrText';
import NetworkSwitch from '../NetworkSwitch';
import ChipReward from '../_primitives/ChipReward';
import styles from './OTCSwap.module.css';
import { valuesByRange } from './valuesByRange';

const requiredChains = [
    {
        name: 'ETHEREUM',
        chainId: import.meta.env.VITE_PUBLIC_ENV === 'mainnet' ? 1 : 5,
    },
    {
        name: 'BSC',
        chainId: import.meta.env.VITE_PUBLIC_ENV === 'mainnet' ? 56 : 97,
    },
];

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

const OTCSwap = () => {
    const { t } = useTranslation();
    const [swapAmount, setSwapAmount] = useState(500);
    const [slider, setSlider] = useState(1);
    const [loading, setLoading] = useState(false);
    const [secondaryCoin, setSecondaryCoin] = useState('BUSD');
    const [swapCoin, setSwapCoin] = useState('USDT');
    const [vtruBalance, setVtruBalance] = useState('0.00');
    const [pendingTx, setPendingTx] = useState<boolean>(false);
    const [showNetworkSwitch, setShowNetworkSwitch] = useState(false);
    const token = useSelector((state: RootState) => state.profile.token);
    const VAM_DEFAULT = useSelector(
        (state: RootState) => state.otcInfo.vamMultiplier
    );
    const price = useSelector((state: RootState) => state.otcInfo.price);
    const wallet = useSelector((state: RootState) => state.profile.wallet);
    const chainId = useChainId();
    const dispatch = useDispatch();

    const changeSwapAmount = (event: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        setSwapAmount(value);

        const indexSlider = valuesByRange.findIndex((item) => item >= value);
        if (indexSlider !== -1) {
            setSlider(indexSlider);
        } else if (indexSlider === -1 && value > 10_000) {
            setSlider(valuesByRange.length);
        }
    };

    useEffect(() => {
        if (chainId == 56 || chainId == 97) {
            setSecondaryCoin('BUSD');
            setSwapCoin('BUSD');
        }
        if (chainId == 1 || chainId == 5) {
            setSecondaryCoin('USDC');
            setSwapCoin('USDC');
        }
    }, [chainId]);

    useEffect(() => {
        getVTRUBalanceHandler();
    }, [wallet]);

    useEffect(() => {
        const timerId = setInterval(() => {
            getVTRUBalanceHandler();
            getPendingTxHandler();
        }, 5000);
        return () => clearInterval(timerId);
    }, []);

    const getPendingTxHandler = async () => {
        if (wallet) {
            try {
                const status = await getPendingTx(wallet);
                setPendingTx(status);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('Failed to fetch VTRU balance:', error);
            }
        }
    };

    const getVTRUBalanceHandler = async () => {
        if (wallet) {
            try {
                const balance = await getVTRUBalance(wallet);
                setVtruBalance(balance.toString());
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('Failed to fetch VTRU balance:', error);
            }
        }
    };

    const AMOUNT_MIN = 50;
    const AMOUNT_MAX = 10_000;
    const VAM_MAX = VAM_DEFAULT + 0.5;
    const vamGross =
        (VAM_MAX - VAM_DEFAULT) *
            ((swapAmount - AMOUNT_MIN) / (AMOUNT_MAX - AMOUNT_MIN)) +
        VAM_DEFAULT;
    const vamMultiplier = vamGross > VAM_MAX ? VAM_MAX : vamGross;

    const quantity = Math.ceil(swapAmount / price);
    const bonus = Math.ceil((vamMultiplier - 1) * quantity);
    const calc = Math.ceil((swapAmount / price) * vamMultiplier);
    const vamMulBP = Math.round(vamMultiplier * 100);

    const priceVitruPerCoin = swapAmount / calc;

    const processVTRUSwapHandler = async (chain: number) => {
        if (!wallet || !chain) return;

        const requiredChainIds =
            import.meta.env.VITE_PUBLIC_ENV === 'mainnet' ? [1, 56] : [5, 97];
        if (!requiredChainIds.includes(chain)) {
            setLoading(true);
            setShowNetworkSwitch(true);
            return;
        }

        try {
            setLoading(true);
            await processVTRUSwap(
                swapCoin,
                swapAmount,
                quantity,
                price,
                wallet,
                chain,
                vamMulBP,
                bonus,
                token
            );
            setLoading(false);
            setPendingTx(true);
            dispatch(
                notificationActions.show({
                    type: 'info',
                    title: 'VTRU Swap Successful',
                    message:
                        'Your transaction was successful. The $VTRU you purchased will be delivered to your wallet in a few minutes.',
                    buttons: ['OK'],
                })
            );
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Process VTRU Swap Error:', error);
            setLoading(false);
        }
    };

    const networkSwitchHandler = async (chain: number) => {
        const networkToast = await toast.loading(
            'Switch Network to ' + networkDetails[chain]?.name
        );
        const connections = getConnections(config);
        try {
            await switchChain(config, {
                chainId: chain,
                connector: connections[0]?.connector,
            });
            toast.dismiss(networkToast);
            setShowNetworkSwitch(false);
            processVTRUSwapHandler(chain);
        } catch (error) {
            toast.dismiss(networkToast);
            toast.error('Failed to switch network');
        }
    };

    const modalCloseHandler = () => {
        setLoading(false);
        setShowNetworkSwitch(false);
    };

    return (
        <div className={styles.box}>
            <h3 className={styles.title}>{t('airdrop.otc.swapBox.title')}</h3>
            <h4 className={styles.caption}>
                {t('airdrop.otc.swapBox.rate', { value: price })}
            </h4>
            <div className={styles.inputOrText}>
                <InputOrText
                    setSlider={setSlider}
                    swapAmount={swapAmount}
                    changeSwapAmount={changeSwapAmount}
                />
            </div>
            <div style={{ width: '100%' }}>
                <div className={styles.sliderticks}>
                    {Array.from({ length: 12 }).map((_, index) => (
                        <span key={index} />
                    ))}
                </div>
                <input
                    className={styles.inputRange}
                    type="range"
                    name="swapAmount"
                    value={slider}
                    onChange={(event) => {
                        setSlider(event.target.valueAsNumber);
                        setSwapAmount(
                            valuesByRange[event.target.valueAsNumber]
                        );
                    }}
                    min={0}
                    max={11}
                    step="1"
                />
            </div>
            {/* <p className={styles.regularText}>{t('airdrop.otc.swapBox.applyVAM')}</p> */}
            <h2 className={styles.mediumValue}>
                {t('airdrop.otc.swapBox.vamValue', { value: vamMultiplier })}
            </h2>

            <h4 className={styles.caption} style={{ marginBlock: '0.7rem' }}>
                {t('airdrop.otc.swapBox.totalReceive')}
                {': '}
                <span>{`(${t('airdrop.otc.swapBox.balanceValue', { value: quantity })}`}</span>
                <span
                    style={{ color: 'cyan' }}
                >{` + ${t('airdrop.otc.swapBox.balanceValue', { value: bonus })})`}</span>
            </h4>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <h1 className={styles.bigValue} style={{ color: 'cyan' }}>
                    {t('airdrop.otc.swapBox.balanceValue', { value: calc })}
                </h1>
                <h4 className={styles.coin}>
                    <span style={{ color: 'cyan' }}>
                        {t('airdrop.otc.swapBox.balancePerVtruCoin', {
                            value: priceVitruPerCoin,
                        })}
                    </span>{' '}
                    {t('airdrop.otc.swapBox.balancePerVtru')}
                </h4>
            </div>
            <div className={styles.coinChoice}>
                <button
                    className={styles.btnCoinChoice}
                    onClick={() => setSwapCoin(secondaryCoin)}
                >
                    <ChipReward
                        fill={swapCoin === secondaryCoin ? 'white' : '#595959'}
                        text={secondaryCoin}
                    />
                </button>
                <button
                    className={styles.btnCoinChoice}
                    onClick={() => setSwapCoin('USDT')}
                >
                    <ChipReward
                        fill={swapCoin === 'USDT' ? 'white' : '#595959'}
                        text={'USDT'}
                    />
                </button>
            </div>
            <div className={styles.verifyButton}>
                <GenericButton
                    fill="cyan"
                    textcolor="black"
                    onClick={() => processVTRUSwapHandler(chainId)}
                    loading={loading}
                >
                    {t('airdrop.otc.swapBox.btnVerify')}
                </GenericButton>
            </div>
            <h4 className={styles.caption}>
                {t('airdrop.otc.swapBox.balance')}
            </h4>
            <div className={styles.container}>
                <h2 className={styles.mediumValue} style={{ color: 'white' }}>
                    {t('airdrop.otc.swapBox.balanceValue', {
                        value: vtruBalance,
                    })}
                </h2>
                {pendingTx && (
                    <span className={styles.loading}>
                        <div></div>
                        <div></div>
                    </span>
                )}
            </div>
            <p className={styles.regularText}>
                {t('airdrop.otc.swapBox.warning')}
            </p>
            <NetworkSwitch
                title="Switch Network"
                message="Please switch to one of the following chains"
                buttons={requiredChains}
                isShowing={showNetworkSwitch}
                networkSwitchHandler={networkSwitchHandler}
                close={modalCloseHandler}
            />
        </div>
    );
};

export default OTCSwap;
