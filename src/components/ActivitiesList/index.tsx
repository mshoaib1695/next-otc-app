import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import Activity from '../Activity';
import styles from './ActivitiesList.module.css';

const elapsedTime = (time: string) => {
    const diffTime = new Date(time).getTime() - new Date().getTime();
    const diffSeconds = Math.ceil(diffTime / 1000);
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (Math.abs(diffSeconds) < 60) return `${Math.abs(diffSeconds)} sec.`;
    if (Math.abs(diffMinutes) < 60) return `${Math.abs(diffMinutes)} min.`;
    if (Math.abs(diffHours) < 24) return `${Math.abs(diffHours)} hr.`;
    `${Math.abs(diffDays)} days`;
};

type ActivitiesListProps = { maxHeight?: number };

const ActivitiesList = ({ maxHeight }: ActivitiesListProps) => {
    const { t } = useTranslation();
    const activities = useSelector((state: RootState) => state.events.events);
    const avatars = useSelector((state: RootState) => state.avatars.wallets);

    return (
        <div className={styles.container} style={{ maxHeight: maxHeight }}>
            <h2 className={styles.header}>{t('airdrop.activities.header')}</h2>
            <div className={styles.scrollable}>
                <div className={styles.items}>
                    {activities.map((item, index) => (
                        <Activity
                            key={index}
                            walletAdress={item.wallet}
                            avatarUrl={avatars?.[item.wallet]?.url}
                            screenName={avatars?.[item.wallet]?.screenName}
                            time={elapsedTime(item.when)}
                            activity={t(`airdrop.activities.${item.eventType}`, {
                                value:
                                    item.eventType === 'otcSwapped'
                                        ? item.extras?.['amountInVitru'] || 0
                                        : item.grossValue,
                            })}
                        />
                    ))}
                </div>
            </div>
            <div className={styles.transp} />
        </div>
    );
};

export default ActivitiesList;
