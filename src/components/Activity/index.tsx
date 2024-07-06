import Avatar from '../_primitives/Avatar';
import styles from './Activity.module.css';

type ActivityProps = {
    walletAdress: string;
    avatarUrl: string;
    screenName?: string;
    activity?: string;
    time?: string;
};
const Activity = ({
    avatarUrl,
    screenName,
    time,
    activity,
    walletAdress,
}: ActivityProps) => {
    return (
        <div className={styles.container}>
            <div className={styles.avatar}>
                <Avatar
                    imageUrl={avatarUrl}
                    name={screenName}
                    wallet={walletAdress}
                />
            </div>
            <p className={styles.time}>{time}</p>
            <p className={styles.activity}>{activity}</p>
        </div>
    );
};

export default Activity;
