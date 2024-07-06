import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Statistics } from '../../state/statistics/types';
import { RootState } from '../../state/store';
import styles from './Analytics.module.css';

const analysticsItems = ['tvl', 'users', 'wallets'];

const Analytics = () => {
    const { t } = useTranslation();
    const statistics = useSelector((state: RootState) => state.statistics.statistics);
    const price = useSelector((state: RootState) => state.otcInfo.price);

    return (
        <div className={styles.container}>
            {analysticsItems.map((item, index) => {
                if (statistics?.[item as keyof Statistics] === null) return null;
                return (
                    <h4 className={styles.item} key={index}>
                        {t(`airdrop.analytics.${item}`, {
                            value:
                                item === 'tvl'
                                    ? Number(statistics?.[item as keyof Statistics] ?? 0) * price
                                    : Number(statistics?.[item as keyof Statistics] ?? 0),
                        })}
                    </h4>
                );
            })}
        </div>
    );
};

export default Analytics;
