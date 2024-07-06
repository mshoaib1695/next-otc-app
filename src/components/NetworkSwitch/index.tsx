import GenericButton from '../GenericButton';
import styles from './NetworkSwitch.module.css';
type RequiredChain = {
    name: string;
    chainId: number;
};

type Notifications = {
    title: string;
    message: string;
    buttons: RequiredChain[];
    isShowing: boolean;
    networkSwitchHandler: (chainId: number) => void;
    close: () => void;
};

const NetworkSwitch = (notifications: Notifications) => {
    if (!notifications.isShowing) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.content} onClick={(e) => e.stopPropagation()}>
                <div className={styles.messageBox}>
                    <h2 className={styles.title}>{notifications.title}</h2>
                    <h3 className={styles.message}>{notifications.message}</h3>
                    <div className={styles.buttons}>
                        {notifications.buttons.map((button: any, index: number) => (
                            <GenericButton
                                key={index}
                                fill='white'
                                textcolor='black'
                                onClick={() => notifications.networkSwitchHandler(button.chainId)}
                            >
                                {button.name}
                            </GenericButton>
                        ))}
                    </div>
                </div>
                <p className={styles.close} onClick={() => notifications.close()}>
                    close
                </p>
            </div>
        </div>
    );
};

export default NetworkSwitch;
