import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import InviteCode from '../../components/InviteCode';
import UserDashList from '../../components/UserDashList';
import Avatar from '../../components/_primitives/Avatar';
import Wallets from '../../components/_primitives/Wallets';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import type { Event } from '../../state/events/types';
import { RootState } from '../../state/store';
import styles from './Dashboard.module.css';

type PopulateDashboardInput = {
    vamMultiplier: number;
    points: Event[];
};

const populateDashboard = ({
    vamMultiplier,
    points,
}: PopulateDashboardInput) => {
    const vamX = vamMultiplier.toFixed(2) + ' X';
    const xProfile = points.find((p) => p.eventType === 'socialXFollowed');
    const discord = points.find(
        (p) => p.eventType === 'socialDiscordServerJoin'
    );
    const invites = points.filter(
        (p) => p.eventType === 'referralAccepted'
    ).length;
    const inviteRewards = points
        .filter((p) => p.eventType === 'referralAccepted')
        .reduce((acc, p) => acc + p.points, 0);
    const swapAmount = points
        .filter((p) => p.eventType === 'otcSwapped')
        .reduce((acc, p) => acc + p.grossValue, 0);
    const stakeAmount = points
        .filter((p) => p.eventType === 'stakeOvernightUpdate')
        .reduce((acc, p) => acc + p.grossValue, 0);
    const swapRewards = points
        .filter((p) => p.eventType === 'otcSwapped')
        .reduce((acc, p) => acc + p.points, 0);
    const stakeRewards = points
        .filter((p) => p.eventType === 'stakeOvernightUpdate')
        .reduce((acc, p) => acc + p.points, 0);

    return {
        wallet: 'airdrop.dashboard.connected',
        xprofile: xProfile
            ? 'airdrop.dashboard.connected'
            : 'airdrop.dashboard.notConnected',
        discord: discord
            ? 'airdrop.dashboard.connected'
            : 'airdrop.dashboard.notConnected',
        vamX,
        invites,
        inviteRewards,
        swapAmount,
        swapRewards,
        stakeAmount,
        stakeRewards,
    };
};

const Dashboard = () => {
    const { t } = useTranslation();
    const score = useSelector((state: RootState) => state.score);
    const shortlink = useSelector(
        (state: RootState) => state.profile.shortlink.value
    );
    const vamMultiplier = useSelector(
        (state: RootState) => state.otcInfo.vamMultiplier
    );
    const wallet = useSelector((state: RootState) => state.profile.wallet);
    const avatars = useSelector((state: RootState) => state.avatars.wallets);
    const associatedWallets = useSelector(
        (state: RootState) =>
            state.leaderBoard.leaderboard.slice(0, 1)[0].associatedWallets
                .length
    );
    const [{ points }] = useSelector((state: RootState) =>
        state.leaderBoard.leaderboard.slice(0, 1)
    );

    const isMobile = useMediaQuery('(max-width: 768px)');

    const dashData = useMemo(
        () => populateDashboard({ vamMultiplier, points: score.points }),
        [vamMultiplier, score.points]
    );

    const hasReferralGenerated = useMemo(
        () => score.points.some((p) => p.eventType === 'referralGenerated'),
        [score.points]
    );

    if (!wallet) return <Navigate to="/" />;

    return (
        <div className={styles.container}>
            <div className={styles.dashBoard}>
                <div className={styles.dashHeader}>
                    <h1>{t('airdrop.dashboard.title')}</h1>
                    <div className={styles.dashAvatar}>
                        <Avatar
                            imageUrl={avatars?.[wallet]?.url}
                            name={avatars?.[wallet]?.screenName}
                            as="h3"
                            wallet={wallet}
                        />
                    </div>
                </div>

                <div className={styles.dashList01}>
                    <UserDashList
                        dashItems={[
                            {
                                label: 'airdrop.dashboard.wallet',
                                value: wallet,
                            },
                            {
                                label: 'airdrop.dashboard.xprofile',
                                value: dashData.xprofile,
                            },
                            {
                                label: 'airdrop.dashboard.discord',
                                value: dashData.discord,
                            },
                            {
                                label: 'airdrop.dashboard.vamX',
                                value: dashData.vamX,
                            },
                        ]}
                    />
                </div>
            </div>

            <div className={styles.referrals}>
                <h2>{t('airdrop.dashboard.subtitle')}</h2>
                {hasReferralGenerated && (
                    <div className={styles.invite}>
                        <InviteCode
                            url={`${window.location.origin}/${shortlink}`}
                        />
                    </div>
                )}
                <div className={styles.dashList02}>
                    <UserDashList
                        dashItems={[
                            {
                                label: 'airdrop.dashboard.invites',
                                value: t('airdrop.dashboard.totalInvites', {
                                    value: dashData.invites,
                                }),
                            },
                            {
                                label: 'airdrop.dashboard.inviteRewards',
                                value: t('airdrop.tasks.rewardPts', {
                                    value: dashData.inviteRewards,
                                }),
                            },
                        ]}
                    />
                </div>
            </div>

            <div className={styles.dashPoints}>
                <h1>
                    <span style={{ color: 'cyan' }}>
                        {t(
                            isMobile
                                ? 'airdrop.refer.rightTitle1Mobile'
                                : 'airdrop.refer.rightTitle1'
                        )}
                    </span>
                    <br style={isMobile ? { display: 'none' } : {}} />
                    {t('airdrop.refer.rightTitle2')}
                    <br style={isMobile ? { display: 'none' } : {}} />
                    <span style={{ color: 'cyan' }}>
                        {t('airdrop.refer.rightTitle3', { value: points })}
                    </span>
                    {associatedWallets > 1 && (
                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'baseline',
                                columnGap: '0.3rem',
                            }}
                        >
                            <Wallets fill="black" width={16} height={18} />
                            <h4
                                style={{
                                    color: 'black',
                                    // fontWeight: '800',
                                    marginBottom: '-0.3rem',
                                }}
                            >{`x ${associatedWallets}`}</h4>
                        </div>
                    )}
                </h1>
                <h3>{t('airdrop.dashboard.rightParagraph')}</h3>
            </div>

            <div className={styles.dashLive}>
                <h2>{t('airdrop.dashboard.mylive')}</h2>

                <div className={styles.dashList02}>
                    <UserDashList
                        dashItems={[
                            {
                                label: 'airdrop.dashboard.swap',
                                value: t('airdrop.dashboard.money', {
                                    value: dashData.swapAmount,
                                }),
                            },
                            {
                                label: 'airdrop.dashboard.totalswaprewards',
                                value: t('airdrop.tasks.rewardPts', {
                                    value: dashData.swapRewards,
                                }),
                            },
                            {
                                label: 'airdrop.dashboard.stake',
                                value: t('airdrop.dashboard.vtru', {
                                    value: dashData.stakeAmount,
                                }),
                            },
                            {
                                label: 'airdrop.dashboard.stakerewards',
                                value: t('airdrop.tasks.rewardPts', {
                                    value: dashData.stakeRewards,
                                }),
                            },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
