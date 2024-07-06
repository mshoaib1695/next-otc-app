import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import GenericButton from '../GenericButton';
import CheckMark from '../_primitives/CheckMarkSVG';
import ChipReward from '../_primitives/ChipReward';
import styles from './TaskItem.module.css';

type TaskItemProps = {
    reward?: string;
    rewardInfo?: string;
    rewardSubInfo?: string;
    task: string | any;
    done?: boolean;
    showScore: boolean;
    actionLabel?: string;
    action?: () => void;
    enabled: boolean;
    hasPulsated?: boolean;
};
const TaskItem = ({
    reward,
    rewardInfo,
    rewardSubInfo,
    task,
    done,
    showScore,
    action,
    actionLabel = 'airdrop.tasks.letsgo',
    enabled,
    hasPulsated = false,
}: TaskItemProps) => {
    const { t } = useTranslation();
    const isSmallScreen = useMediaQuery('(max-width: 1280px)');

    const handleButtonClick = () => {
        if (action) action();
    };

    return (
        <div className={styles.container}>
            <div className={styles.reward}>
                <ChipReward pulse={hasPulsated} text={reward} />
            </div>

            <div className={styles.taskContainer}>
                <h4 className={styles.task}>{task}</h4>
                {showScore && <h4 className={styles.info}>{rewardInfo}</h4>}
                {rewardSubInfo && (
                    <h4 className={styles.reward} onClick={handleButtonClick}>
                        {rewardSubInfo}
                    </h4>
                )}
                {done && (
                    <CheckMark
                        fill="cyan"
                        width={isSmallScreen ? 24 : 40}
                        style={{ marginBottom: 5 }}
                    />
                )}
                {!done && (
                    <div className={styles.buttonLets}>
                        <GenericButton
                            disabled={!enabled}
                            fill="cyan"
                            textcolor="black"
                            onClick={handleButtonClick}
                        >
                            {t(actionLabel).toUpperCase()}
                        </GenericButton>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskItem;
