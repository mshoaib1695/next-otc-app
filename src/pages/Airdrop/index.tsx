import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';

import ModalDiscordCode from '../../components/ModalDiscordCode';
import ModalVAM from '../../components/ModalVAM';
import ModalVAMMobile from '../../components/ModalVAMMobile';
import TasksList, { Task } from '../../components/TasksList';
import LightningBoltSvgComponent from '../../components/_primitives/LightningBolt';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { actions } from '../../state/profile';
import { RootState, store } from '../../state/store';
import { hasDeviceiOS } from '../../utils/hasDeviceIOS';
import styles from './Airdrop.module.css';
import InviteCodeText from '../../components/InviteCodeText';
import XPostHidden from '../../components/XPostHidden';
import FinalTask from '../../components/FinalTask';
import { API_PROFILE_INTENT } from '../../constants';

const Airdrop = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { address } = useAccount();
    const wallet = useSelector((state: RootState) => state.profile.wallet);
    const points = useSelector((state: RootState) => state.score.points);
    const vamMultiplier = useSelector(
        (state: RootState) => state.otcInfo.vamMultiplier
    );
    const isRunning = useSelector(
        (state: RootState) => state.otcInfo.isRunning
    );
    const shortlink = useSelector(
        (state: RootState) => state.profile.shortlink.value
    );
    const [showModalVAM, setShowModalVAM] = useState(false);
    const [showModalDiscord, setShowModalDiscord] = useState(false);
    const isMobile = useMediaQuery('(max-width: 968px)');
    const VAM = isMobile ? ModalVAMMobile : ModalVAM;

    const [showModalXPost, setShowModalXPost] = useState(false);
    const postRef = useRef<HTMLDivElement>(null);
    const divRef = useRef<HTMLDivElement>(null);
    const [screenshot, setScreenshot] = useState<string | null>(null);

    useEffect(() => {
        if (showModalVAM && vamMultiplier === -1) setShowModalVAM(false);
    }, [vamMultiplier, showModalVAM]);

    useEffect(() => {
        if (showModalVAM) {
            document.body.classList.add(styles.avoidScroll);
        } else {
            document.body.classList.remove(styles.avoidScroll);
        }
    }, []);

    const requiredTasks: Task[] = [
        {
            enabled: true,
            requirements: [],
            reward: {
                label: 'airdrop.tasks.rewardPts',
                value: { value: 100 },
            },
            rewardInfo: {
                label: '',
                value: { value: 100 },
            },
            task: {
                label: 'airdrop.tasks.getInviteCode',
            },
            done: true,
            eventType: ['InviteAccepted', 'externalInviteAccepted'],
            removeOnComplete: false,
            removeOnNotComplete: true,
        },
        {
            enabled: true,
            requirements: [],
            reward: {
                label: 'airdrop.tasks.rewardPts',
                value: { value: 50 },
            },
            rewardInfo: {
                label: 'airdrop.tasks.followxDesktop',
                value: { value: null },
            },
            task: {
                label: 'airdrop.tasks.followx',
            },
            done: false,
            action: () => {
                dispatch(actions.askFollowTwitter());
            },
            eventType: 'socialXFollowed',
            removeOnComplete: false,
            removeOnNotComplete: false,
        },
        {
            enabled: false,
            hideButton: hasDeviceiOS(), // only iphone
            requirements: hasDeviceiOS() ? [] : ['socialXFollowed'],
            reward: {
                label: 'airdrop.tasks.rewardPts',
                value: { value: 50 },
            },
            rewardInfo: {
                label: 'airdrop.tasks.followxDesktop',
                value: { value: null },
            },
            task: {
                label: 'airdrop.tasks.joindiscord',
            },
            done: false,
            action: () => {
                setShowModalDiscord(true);
            },
            eventType: 'socialDiscordServerJoin',
            removeOnComplete: false,
            removeOnNotComplete: false,
        },
        {
            enabled: false,
            requirements: hasDeviceiOS()
                ? ['socialXFollowed']
                : ['socialXFollowed', 'socialDiscordServerJoin'],
            reward: {
                label: 'airdrop.tasks.rewardPts',
                value: { value: 50 },
            },
            rewardInfo: {
                label: '',
                value: { value: 155000.09 },
            },
            task: {
                label: 'airdrop.tasks.referral',
            },
            done: false,
            eventType: 'referralGenerated',
            removeOnComplete: false,
            removeOnNotComplete: false,
            action: () => {
                dispatch(actions.askGenerateShortlink());
            },
        },
        {
            enabled: false,
            hideButton: hasDeviceiOS(), // only iphone
            requirements: [
                'socialXFollowed',
                'socialDiscordServerJoin',
                'referralGenerated',
            ],
            reward: {
                label: 'airdrop.tasks.rewardPts',
                value: { value: 150 },
            },
            rewardInfo: {
                label: 'airdrop.tasks.followxDesktop',
                value: { value: null },
            },
            task: {
                label: 'airdrop.buttons.GoToFinalTask',
            },
            done: false,
            eventType: 'socialXInitialPost',
            removeOnComplete: false,
            removeOnNotComplete: false,
            action: () => {
                generate();
            },
        },
    ];
    const [reqTasks, setRequiredTasks] = useState<Task[]>(requiredTasks);
    const optionalTasks: Task[] = [
        {
            enabled: false,
            requirements: hasDeviceiOS()
                ? ['socialXFollowed', 'referralGenerated']
                : [
                      'socialXFollowed',
                      'socialDiscordServerJoin',
                      'referralGenerated',
                      'socialXInitialPost',
                  ],
            reward: {
                label: 'airdrop.tasks.rewardPts',
                value: { value: 150 },
            },
            rewardInfo: {
                label: 'airdrop.tasks.vamBonus',
                value: { value: vamMultiplier },
            },
            task: {
                label: 'airdrop.tasks.vam',
            },
            done: false,
            showScore: false,
            eventType: 'calculatedVAM',
            removeOnComplete: false,
            removeOnNotComplete: false,
            action: () => {
                setShowModalVAM(true);
            },
        },
        {
            enabled: false,
            requirements: hasDeviceiOS()
                ? ['socialXFollowed', 'referralGenerated', 'calculatedVAM']
                : [
                      'socialXFollowed',
                      'socialDiscordServerJoin',
                      'referralGenerated',
                      'socialXInitialPost',
                      'calculatedVAM',
                  ],
            reward: {
                label: 'airdrop.tasks.rewardVtru',
                value: { value: 10 },
            },
            hasPulsated: true,
            task: {
                label: 'airdrop.tasks.swap',
            },
            done: false,
            eventType: 'otcSwapped',
            removeOnComplete: false,
            removeOnNotComplete: false,
            action: () => {
                navigate('/otc/swap');
            },
        },
        {
            enabled: false,
            requirements: hasDeviceiOS()
                ? [
                      'socialXFollowed',
                      'referralGenerated',
                      'calculatedVAM',
                      'otcSwapped',
                  ]
                : [
                      'socialXFollowed',
                      'socialDiscordServerJoin',
                      'referralGenerated',
                      'socialXInitialPost',
                      'calculatedVAM',
                      'otcSwapped',
                  ],
            reward: {
                label: 'airdrop.tasks.rewardStake',
                value: { value: 8 },
            },
            // rewardInfo: ,
            hasPulsated: true,
            task: {
                label: 'airdrop.tasks.stake',
            },
            done: false,
            eventType: 'stakeOvernightUpdate',
            removeOnComplete: false,
            removeOnNotComplete: false,
            action: () => {
                navigate('/otc/stake');
            },
        },
        {
            enabled: false,
            requirements: hasDeviceiOS()
                ? [
                      'socialXFollowed',
                      'referralGenerated',
                      'calculatedVAM',
                      'otcSwapped',
                      'stakeOvernightUpdate',
                  ]
                : [
                      'socialXFollowed',
                      'socialDiscordServerJoin',
                      'referralGenerated',
                      'socialXInitialPost',
                      'calculatedVAM',
                      'otcSwapped',
                      'stakeOvernightUpdate',
                  ],
            reward: {
                label: 'airdrop.tasks.rewardPts',
                value: { value: 1_250 },
            },
            rewardInfo: {
                label: '',
                value: { value: 155000.09 },
            },
            task: {
                label: 'airdrop.buttons.GoToFinalTask',
            },
            done: false,
            eventType: 'socialXFinalPost',
            removeOnComplete: false,
            removeOnNotComplete: false,
            action: () => {
                generate();
            },
        },
    ];
    const [optTasks, setOptionalTasks] = useState<Task[]>(optionalTasks);

    useEffect(() => {
        setRequiredTasks(() => {
            const newRequiredTasks = requiredTasks
                .map((task) => {
                    if (task.eventType) {
                        const done = points.some((point) => {
                            if (typeof task.eventType === 'string') {
                                return point.eventType.includes(
                                    task.eventType as string
                                );
                            } else if (Array.isArray(task.eventType)) {
                                return task.eventType.some((eventType) =>
                                    point.eventType.includes(eventType)
                                );
                            }
                        });

                        const enabled = task.requirements.every((req) => {
                            return points.some((point) =>
                                point.eventType.includes(req)
                            );
                        });

                        if (task.eventType === 'referralGenerated' && done) {
                            task.task = {
                                label: 'airdrop.tasks.referralDone',
                                component: (
                                    <InviteCodeText
                                        url={`${window.location.origin}/${shortlink}`}
                                        style={isMobile ? { padding: 0 } : {}}
                                    />
                                ),
                            };
                        }

                        return { ...task, done, enabled };
                    }
                    return task;
                })
                .filter((task) => {
                    if (task.done && task.removeOnComplete) return false;
                    if (!task.done && task.removeOnNotComplete) return false;
                    return true;
                });

            return newRequiredTasks;
        });

        setOptionalTasks((prevOptionalTask) => {
            // check requirements for optional tasks to enable them
            const newOptionalTasks = prevOptionalTask.map((task) => {
                if (task.requirements.length === 0) return task;
                const done = task.requirements.every((req) => {
                    return points.some((point) =>
                        point.eventType.includes(req)
                    );
                });
                return { ...task, enabled: done };
            });

            // check done for optional tasks
            newOptionalTasks.forEach((task) => {
                const done = points.some((point) => {
                    return point.eventType.includes(task.eventType as string);
                });
                task.done = done;

                if (task.eventType === 'calculatedVAM' && done) {
                    if (vamMultiplier !== -1 && !isRunning)
                        task.showScore = true;
                }
                if (task.eventType === 'calculatedVAM' && !done) {
                    task.showScore = false;
                    task.done = false;
                    task.rewardInfo = {
                        label: '',
                        subLabel: '',
                        value: { value: null },
                    };
                }

                if (task.eventType === 'socialXFinalPost' && done) {
                    task.rewardInfo = {
                        label: '',
                        subLabel: 'airdrop.tasks.xAgain',
                        value: {
                            value: 0,
                        },
                    };
                }

                if (task.eventType === 'otcSwapped' && done) {
                    task.showScore = true;
                    task.rewardInfo = {
                        label: 'airdrop.tasks.otcSwapped',
                        subLabel: 'airdrop.tasks.otcSwappedAgain',
                        value: {
                            value: points
                                .filter(
                                    (point) => point.eventType === 'otcSwapped'
                                )
                                .reduce((acc, point) => acc + point.points, 0),
                        },
                    };
                }
                if (task.eventType === 'otcSwapped' && !done) {
                    task.showScore = false;
                    task.done = false;
                    task.rewardInfo = {
                        label: '',
                        subLabel: '',
                        value: { value: null },
                    };
                }

                if (task.eventType === 'stakeOvernightUpdate' && done) {
                    task.showScore = true;
                    task.rewardInfo = {
                        label: 'airdrop.tasks.stakeOvernightUpdate',
                        subLabel: 'airdrop.tasks.stakeOvernightUpdateAgain',
                        value: {
                            value: points
                                .filter(
                                    (point) =>
                                        point.eventType ===
                                        'stakeOvernightUpdate'
                                )
                                .reduce((acc, point) => acc + point.points, 0),
                        },
                    };
                }
                if (task.eventType === 'stakeOvernightUpdate' && !done) {
                    task.showScore = false;
                    task.done = false;
                    task.rewardInfo = {
                        label: '',
                        subLabel: '',
                        value: { value: null },
                    };
                }
            });

            return newOptionalTasks;
        });
    }, [points, vamMultiplier, isRunning, wallet, address, isMobile]);

    const generate = () => {
        if (postRef.current) {
            if (divRef.current) divRef.current.style.display = 'block';
            document.body.style.overflow = 'hidden';
            html2canvas(postRef.current).then((canvas) => {
                if (divRef.current) divRef.current.style.display = 'none';
                document.body.style.overflow = 'unset';
                setScreenshot(canvas.toDataURL());
                store.dispatch(actions.postToX(canvas.toDataURL() as string));
                setShowModalXPost(true);
            });
        }
    };

    if (!wallet) return <Navigate to="/" />;

    return (
        <div className={styles.container}>
            <ModalDiscordCode
                isOpen={showModalDiscord}
                onClose={() => setShowModalDiscord(false)}
            />
            <VAM
                isOpen={showModalVAM}
                onClose={() => {
                    if (isRunning) return;
                    setShowModalVAM(false);
                }}
            />
            <section className={styles.left}>
                <h1>{t('airdrop.become.become')}</h1>
                <h2>{t('airdrop.become.compulsory')}</h2>
                <h3>{t('airdrop.become.complete')}</h3>
                <div className={styles.tasks}>
                    <TasksList tasks={reqTasks} />
                </div>
            </section>
            <section className={styles.right}>
                <h1>
                    <span style={{ color: 'cyan' }}>
                        {t('airdrop.become.supercharge')}
                    </span>
                    <span
                        style={{
                            marginLeft: '10px',
                            verticalAlign: 'text-bottom',
                        }}
                    >
                        <LightningBoltSvgComponent
                            fill="cyan"
                            width={42}
                            height={42}
                        />
                    </span>
                    <br />
                    {t('airdrop.become.airdropoint')}
                </h1>
                <h2>{t('airdrop.become.optional')}</h2>
                <h3>{t('airdrop.become.sequence')}</h3>
                <div className={styles.tasks}>
                    <TasksList tasks={optTasks} />
                </div>
            </section>

            <div ref={divRef} className={styles.hiddenXpost}>
                <XPostHidden ref={postRef} />
            </div>
            <FinalTask
                isOpen={showModalXPost}
                setModalState={setShowModalXPost}
                executePost={() => {
                    const postURL = new URL('https://twitter.com/intent/tweet');
                    postURL.searchParams.append(
                        'url',
                        `${API_PROFILE_INTENT}/${wallet}/html?${Date.now()}`
                    );
                    postURL.searchParams.append(
                        'text',
                        `${t('airdrop.xpost.textMsg1')}\n\n${t('airdrop.xpost.textMsg2')}`
                    );
                    window.open(postURL.toString(), '_blank');
                }}
                screenshot={screenshot}
            />
        </div>
    );
};

export default Airdrop;
