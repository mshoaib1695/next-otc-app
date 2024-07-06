import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import LightningBoltSvgComponent from '../_primitives/LightningBolt';
import styles from './LBSubNavBar.module.css';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';

const navbarItems = [
    {
        label: 'airdrop.leaderboard.subnav.referral',
        path: '/refer',
    },
    {
        label: 'airdrop.leaderboard.subnav.acquire',
        path: '/otc/swap',
    },
];

const LBSubNavBar = () => {
    const { t } = useTranslation();
    const isMobile = useMediaQuery('(max-width: 968px)');
    const score = useSelector((state: RootState) => state.score);

    const hasReferralGenerated = useMemo(
        () => score.points.some((p) => p.eventType === 'referralGenerated'),
        [score.points]
    );

    const navbarItemsFiltered = useMemo(
        () =>
            hasReferralGenerated
                ? navbarItems
                : navbarItems.filter((item) => item.path !== '/refer'),
        [hasReferralGenerated]
    );

    return (
        <div className={styles.container}>
            {isMobile && <h1>Leaderboard</h1>}
            <div className={styles.header}>
                <LightningBoltSvgComponent
                    fill={isMobile ? 'cyan' : 'white'}
                    width={isMobile ? 40 : 25}
                />
                <p>
                    {t(
                        isMobile
                            ? 'airdrop.leaderboard.subnav.earnMobile'
                            : 'airdrop.leaderboard.subnav.earn'
                    )}
                </p>
            </div>
            <div className={styles.items}>
                {navbarItemsFiltered.map((item, index) => (
                    <Link className={styles.item} key={index} to={item.path}>
                        <h4>{t(`${item.label}`)}</h4>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default LBSubNavBar;
