import styles from './StakeHistoryItem.module.css';

type StakeHistoryItemProps = {
    epochs?: number;
    amount?: number;
    apr?: number;
    earned?: number;
    points?: number;
};
const StakeHistoryItem = ({ amount, apr, points, earned }: StakeHistoryItemProps) => {
    return (
        <div className={styles.container}>
            <h4 className={styles.colItem}>{amount}</h4>
            <h4 className={styles.colItem}>{`${apr}%`}</h4>
            <h4 className={styles.colItem}>{earned}</h4>
            <h4 className={styles.colItem}>{points}</h4>
        </div>
    );
};

export default StakeHistoryItem;
