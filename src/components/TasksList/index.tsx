import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import TaskItem from '../TaskItem';
import TaskItemMobile from '../TaskItemMobile';
import styles from './TasksList.module.css';

export type Task = {
    enabled: boolean;
    requirements: string[];
    reward: {
        label: string;
        value: { value: number };
        color?: string;
    };
    rewardInfo?: {
        label: string;
        subLabel?: string;
        value: { value: number | null };
    };
    hasPulsated?: boolean;
    task: {
        label: string;
        component?: ReactNode;
    };
    hideButton?: boolean;
    done: boolean;
    showScore?: boolean;
    actionLabel?: string;
    action?: () => void;
    eventType?: string | string[];
    removeOnComplete: boolean;
    removeOnNotComplete: boolean;
};

type TasksListProps = {
    tasks: Task[];
};
const TasksList = ({ tasks }: TasksListProps) => {
    const { t } = useTranslation();
    const isMobile = useMediaQuery('(max-width: 968px)');
    const Task = isMobile ? TaskItemMobile : TaskItem;

    return (
        <div className={styles.container}>
            {tasks.map((item, index) => (
                <Task
                    key={index}
                    reward={t(`${item.reward.label}`, item.reward.value)}
                    rewardColor={item.reward.color || 'black'}
                    rewardInfo={
                        item.rewardInfo && item.rewardInfo.value
                            ? t(
                                  `${item.rewardInfo.label}`,
                                  item.rewardInfo.value
                              )
                            : undefined
                    }
                    rewardSubInfo={
                        item.rewardInfo?.subLabel
                            ? t(`${item.rewardInfo.subLabel}`)
                            : undefined
                    }
                    hasPulsated={item.hasPulsated}
                    task={
                        item.task.label && item.task.component ? (
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: isMobile
                                        ? 'flex-start'
                                        : 'center',
                                    flexDirection: isMobile ? 'column' : 'row',
                                }}
                            >
                                {t(`${item.task.label}`)}
                                {item.task.component}
                            </div>
                        ) : (
                            t(`${item.task.label}`)
                        )
                    }
                    done={item.done}
                    action={item.action}
                    showScore={item.showScore || false}
                    actionLabel={item.actionLabel || 'airdrop.tasks.letsgo'}
                    enabled={item.enabled}
                    hideButton={item.hideButton}
                />
            ))}
        </div>
    );
};

export default TasksList;
