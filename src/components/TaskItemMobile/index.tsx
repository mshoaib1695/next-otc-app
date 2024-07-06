import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import CheckMark from '../_primitives/CheckMarkSVG';
import DoubleRightArrow from '../_primitives/DoubleRightArrow';
import styles from './TaskItemMobile.module.css';

type TaskItemProps = {
    reward?: string;
    rewardColor?: string;
    rewardInfo?: string;
    rewardSubInfo?: string;
    task: string | any;
    done?: boolean;
    showScore: boolean;
    actionLabel?: string;
    action?: () => void;
    enabled: boolean;
    hideButton?: boolean;
};
const TaskItemMobile = ({
    reward,
    rewardColor = 'black',
    rewardInfo,
    rewardSubInfo,
    task,
    done,
    showScore,
    hideButton = false,
    action,
    actionLabel = 'airdrop.tasks.letsgo',
    enabled,
}: TaskItemProps) => {
    const { t } = useTranslation();

    const handleButtonClick = () => {
        if (action) action();
    };

    if (hideButton) {
        return (
            <div className={styles.container}>
                <p className={styles.reward} style={{ color: rewardColor, opacity: 0.3 }}>
                    {reward}
                </p>
                <div className={styles.taskContainer}>
                    <div className={styles.task} style={{ opacity: 0.3 }}>
                        {task}
                    </div>
                    <div className={styles.info} style={{ marginRight: 0, opacity: 0.3 }}>
                        {rewardInfo?.toUpperCase()}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <p className={styles.reward} style={{ color: rewardColor }}>
                {reward}
            </p>
            {rewardSubInfo ? (
                <div className={styles.taskContainer}>
                    <div className={styles.task}>{task}</div>
                    <div>
                        <div>
                            {rewardSubInfo && (
                                <div
                                    className={styles.info}
                                    style={{ color: 'cyan', marginRight: 0, cursor: 'pointer' }}
                                    onClick={handleButtonClick}
                                >
                                    {rewardSubInfo.toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: 5 }}>
                            {showScore && (
                                <div className={styles.info} style={{ marginRight: 0 }}>
                                    {rewardInfo}
                                </div>
                            )}
                            {done && <CheckMark fill='cyan' width={18} />}
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles.taskContainer}>
                    <div className={styles.task}>{task}</div>
                    {showScore && <div className={styles.info}>{rewardInfo}</div>}
                    {done && <CheckMark fill='cyan' width={18} />}
                    {!done && (
                        <button
                            className={clsx(
                                styles.buttonAction,
                                !enabled && styles.buttonActionDisabled,
                            )}
                            onClick={handleButtonClick}
                            disabled={!enabled}
                        >
                            {t(actionLabel).toUpperCase()}
                            <DoubleRightArrow fill={enabled ? 'cyan' : 'white'} width={10} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default TaskItemMobile;
