import styles from './UserDashItem.module.css';

type UserDashItemProps = {
    item: string;
    value: string;
};
const UserDashItem = ({ item, value }: UserDashItemProps) => {
    return (
        <div className={styles.container}>
            <h4 className={styles.item}>{item}</h4>
            <h4 className={styles.value}>{value}</h4>
        </div>
    );
};

export default UserDashItem;
