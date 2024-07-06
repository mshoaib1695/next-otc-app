import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../state/notifications';
import { RootState } from '../../state/store';
import GenericButton from '../GenericButton';
import styles from './Notifications.module.css';

const Notifications = () => {
    const dispatch = useDispatch();
    const notifications = useSelector((state: RootState) => state.notifications);

    if (!notifications.isShowing) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.content} onClick={(e) => e.stopPropagation()}>
                <div className={styles.messageBox}>
                    <h2 className={styles.title}>{notifications.title}</h2>
                    <h3 className={styles.message}>{notifications.message}</h3>
                    <div className={styles.buttons}>
                        {notifications.buttons.map((button, index) => (
                            <GenericButton
                                key={index}
                                fill='white'
                                textcolor='black'
                                onClick={() => dispatch(actions.hide(button))}
                            >
                                {button}
                            </GenericButton>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
