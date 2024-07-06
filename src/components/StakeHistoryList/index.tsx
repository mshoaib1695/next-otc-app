import { useTranslation } from 'react-i18next';
import StakeHistoryItem from '../StakeHistoryItem';
import styles from './StakeHistoryList.module.css';

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
        dailyPoints: 1,
    },
    90: {
        apr: 0.23,
        dailyPoints: 2,
    },
    120: {
        apr: 0.3,
        dailyPoints: 4,
    },
    150: {
        apr: 0.39,
        dailyPoints: 6,
    },
    180: {
        apr: 0.5,
        dailyPoints: 8,
    },
};

interface StakeHistoryListProps {
    stakeData: History[];
}

const StakeHistoryList = ({ stakeData }: StakeHistoryListProps) => {
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h4 className={styles.colItem}>{t('airdrop.otc.stakeHistoryBox.staked')}</h4>
                <h4 className={styles.colItem}>{t('airdrop.otc.stakeHistoryBox.apr')}</h4>
                <h4 className={styles.colItem}>{t('airdrop.otc.stakeHistoryBox.earned')}</h4>
                <h4 className={styles.colItem}>{t('airdrop.otc.stakeHistoryBox.points')}</h4>
            </div>
            <div className={styles.scrollable}>
                <div className={styles.items}>
                    {stakeData.map((item, index) => {
                        const apr: number = earns[item.epochs]?.apr * 100;
                        return (
                            <StakeHistoryItem
                                key={index}
                                epochs={item.epochs ?? 0}
                                amount={item.amount ?? 0}
                                earned={item.earned}
                                apr={apr}
                                points={item.points}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default StakeHistoryList;
