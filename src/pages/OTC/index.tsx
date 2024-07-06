import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import OTCBox from '../../components/OTCBox';
import LightningBoltSvgComponent from '../../components/_primitives/LightningBolt';
import { RootState } from '../../state/store';
import { getStakeIdByAccount } from '../../web3/transactions/vtruStake';
import styles from './OTC.module.css';
import { BUSINESS_MINIMUM_AMOUNT_SWAP } from '../../constants/business';

type DEXAirdrops = {
    avatarUrl: string;
    url?: string;
};

const OTC = () => {
    const { t } = useTranslation();
    const otcStart = useParams<{ option: string }>().option ?? 'swap';
    // const score = useSelector((state: RootState) => state.score);
    const tvl = useSelector((state: RootState) => state.statistics.statistics.tvl);
    const price = useSelector((state: RootState) => state.otcInfo.price);
    const wallet = useSelector((state: RootState) => state.profile.wallet);
    const chainId: number = import.meta.env.VITE_PUBLIC_ENV === 'mainnet' ? 1490 : 14333;
    const [hasHistory, setHasHistory] = useState(false);
    const [airdrops, setAirdrops] = useState<DEXAirdrops[]>([]);

    useEffect(() => {
        fetch('/dex-airdrops/dex-airdrops.json')
            .then((res) => res.json())
            .then((data) => {
                setAirdrops(data);
            });
    }, []);

    const getAccountStakesHandler = async () => {
        if (wallet) {
            try {
                const stakeIds = await getStakeIdByAccount(wallet, chainId.toString());
                setHasHistory(stakeIds.length > 0);
            } catch (error) {
                // console.log(error);
            }
        }
    };

    useEffect(() => {
        getAccountStakesHandler();
    }, [wallet, chainId]);

    let otcOption = otcStart;
    if (otcStart === 'stake' && hasHistory) {
        otcOption = 'stakeHistory';
    } else if (otcStart === 'stake' && !hasHistory) {
        otcOption = 'stakeAction';
    }

    return (
        <div className={styles.container}>
            {otcStart === 'swap' && (
                <>
                    <section className={styles.header}>
                        <h1>
                            {t('airdrop.otc.swap.title01')}
                            <span style={{ color: 'cyan' }}>{t('airdrop.otc.swap.title02')}</span>
                            {t('airdrop.otc.swap.title03')}
                        </h1>
                    </section>
                    <section className={styles.right}>
                        <OTCBox otcOption={otcOption} />
                    </section>
                    <section className={styles.left}>
                        <h2>{t('airdrop.otc.swap.subtitle')}</h2>
                        <div className={styles.items}>
                            <div className={styles.item}>
                                <LightningBoltSvgComponent fill='cyan' width={42} />
                                <h3>
                                    {t('airdrop.otc.swap.listitem1', { value: (tvl ?? 0) * price })}
                                </h3>
                            </div>
                            <div className={styles.item}>
                                <LightningBoltSvgComponent fill='cyan' width={42} />
                                <h3>
                                    {t('airdrop.otc.swap.listitem2', {
                                        value: BUSINESS_MINIMUM_AMOUNT_SWAP,
                                    })}
                                </h3>
                            </div>
                            <div className={styles.item}>
                                <LightningBoltSvgComponent fill='cyan' width={42} />
                                <h3>{t('airdrop.otc.swap.listitem3')}</h3>
                            </div>
                        </div>
                    </section>
                </>
            )}
            {(otcStart === 'stake' ||
                otcStart === 'stakeAction' ||
                otcStart === 'stakeHistory') && (
                <>
                    <section className={styles.header}>
                        <h1>
                            <span>{t('airdrop.otc.stake.title01')}</span>
                            <span style={{ color: 'cyan' }}>{t('airdrop.otc.stake.title02')}</span>
                            <span>{t('airdrop.otc.stake.title03')}</span>
                        </h1>
                    </section>
                    <section className={styles.right}>
                        <OTCBox otcOption={otcOption} />
                    </section>
                    <section className={styles.left}>
                        <div className={styles.items}>
                            <div className={styles.item}>
                                <LightningBoltSvgComponent fill='cyan' width={42} />
                                <h3>{t('airdrop.otc.stake.listitem1')}</h3>
                            </div>
                            <div className={styles.item}>
                                <LightningBoltSvgComponent fill='cyan' width={42} />
                                <h3>{t('airdrop.otc.stake.listitem2')}</h3>
                            </div>
                            <div className={styles.item}>
                                <LightningBoltSvgComponent fill='cyan' width={42} />
                                <h3>{t('airdrop.otc.stake.listitem3')}</h3>
                            </div>
                        </div>
                        <h2>{t('airdrop.otc.stake.subtitle')}</h2>
                        <div className={styles.airdrops}>
                            {airdrops.map((item, index) => (
                                <div key={index} className={styles.dex}>
                                    {item.url ? (
                                        <Link
                                            className={styles.item}
                                            to={item.url ?? '#'}
                                            target={'_blank'}
                                            rel='noopener noreferrer'
                                        >
                                            <img
                                                src={item.avatarUrl}
                                                alt='Avatar'
                                                className={styles.dexImage}
                                            />
                                        </Link>
                                    ) : (
                                        <img
                                            src={item.avatarUrl}
                                            alt='Avatar'
                                            className={styles.dexImage}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};

export default OTC;
