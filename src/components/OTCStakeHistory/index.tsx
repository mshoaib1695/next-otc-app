import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useChainId } from 'wagmi';
import { RootState } from '../../state/store';
import {
    getStakeById,
    // getAccountStakes,
    getStakeIdByAccount,
} from '../../web3/transactions/vtruStake';
import GenericButton from '../GenericButton';
import StakeHistoryList from '../StakeHistoryList';
import LightningBoltSvgComponent from '../_primitives/LightningBolt';
import styles from './OTCStakeHistory.module.css';

type History = {
    id: number;
    epochs: number;
    account: string;
    amount: number;
    earned: number;
    // apr: number;
    points: number;
    startBlock: number;
    endBlock: number;
    claimed: boolean;
};

const earns: any = {
    60: {
        apr: 0.18,
        aprBP: 1800,
        dailyPoints: 1,
    },
    90: {
        apr: 0.23,
        aprBP: 2300,
        dailyPoints: 2,
    },
    120: {
        apr: 0.3,
        aprBP: 3000,
        dailyPoints: 4,
    },
    150: {
        apr: 0.39,
        aprBP: 3900,
        dailyPoints: 6,
    },
    180: {
        apr: 0.5,
        aprBP: 5000,
        dailyPoints: 8,
    },
};

const OTCStakeHistory = () => {
    const { t } = useTranslation();
    const wallet = useSelector((state: RootState) => state.profile.wallet);
    const chainId = useChainId();
    const [history, setHistory] = useState<History[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        getAccountStakesHandler();
    }, [wallet, chainId]);

    const getAccountStakesHandler = async () => {
        if (wallet) {
            try {
                const stakeIds = await getStakeIdByAccount(wallet, chainId.toString());
                const tmpStakes = [];
                for (let i = 0; i < stakeIds.length; i++) {
                    const stake = await getStakeById(stakeIds[i], chainId.toString());
                    const displayAmount = Number(stake.amount) / 1e18;
                    const displayEarned = Number(stake.earned) / 1e18 - displayAmount;
                    const dailyPoints = earns[stake.epochs]?.dailyPoints;
                    const displayPoints = (displayAmount / 10) * dailyPoints * stake.epochs;
                    tmpStakes.unshift({
                        ...stake,
                        amount: displayAmount.toFixed(2),
                        earned: displayEarned.toFixed(2),
                        points: Math.round(displayPoints).toLocaleString(),
                    });
                }
                setHistory(tmpStakes);
            } catch (error) {
                // console.log(error);
            }
        }
    };

    return (
        <div className={styles.box}>
            <h3 className={styles.title}>{t('airdrop.otc.stakeHistoryBox.title')}</h3>
            <div className={styles.history}>
                <StakeHistoryList stakeData={history} />
            </div>
            <div className={styles.withLightining}>
                <span className={styles.title}>{t('airdrop.otc.stakeHistoryBox.again')}</span>
                <LightningBoltSvgComponent fill='cyan' width={20} height={20} />
            </div>

            <div className={styles.verifyButton}>
                <GenericButton
                    fill='cyan'
                    textcolor='black'
                    onClick={() => navigate('/otc/stakeAction')}
                >
                    {t('airdrop.otc.stakeHistoryBox.btnStake').toUpperCase()}
                </GenericButton>
            </div>
        </div>
    );
};

export default OTCStakeHistory;
