import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { RootState } from '../../state/store';
import RankItem from '../RankItem';
import styles from './RankItemList.module.css';

const RankItemList = () => {
    const { t } = useTranslation();
    const isMobile = useMediaQuery('(max-width: 968px)');
    const leaderboard = useSelector(
        (state: RootState) => state.leaderBoard.leaderboard
    );
    const avatars = useSelector((state: RootState) => state.avatars.wallets);
    const wallet = useSelector((state: RootState) => state.profile.wallet);

    const data = wallet ? leaderboard : leaderboard.slice(1);

    return (
        <div className={styles.container}>
            {isMobile ? (
                <div className={styles.header}>
                    <h4 className={styles.position}>
                        {t('airdrop.ranking.rankHeader')}
                    </h4>
                    <h4 className={styles.avatar}>
                        {t('airdrop.ranking.userHeader')}
                    </h4>
                    <h4 className={styles.invited}>
                        {t('airdrop.ranking.invitedByHeader')}
                    </h4>
                    <h4 className={styles.score}>
                        {t('airdrop.ranking.scoreHeader')}
                    </h4>
                </div>
            ) : (
                <div className={styles.header}>
                    <h2 className={styles.position}>
                        {t('airdrop.ranking.rankHeader')}
                    </h2>
                    <h2 className={styles.avatar}>
                        {t('airdrop.ranking.userHeader')}
                    </h2>
                    <h2 className={styles.invited}>
                        {t('airdrop.ranking.invitedByHeader')}
                    </h2>
                    <h2 className={styles.score}>
                        {t('airdrop.ranking.scoreHeader')}
                    </h2>
                </div>
            )}
            {!isMobile ? (
                <div className={styles.scrollable}>
                    <div className={styles.items}>
                        {data.map((item, index) => {
                            let backColor = '#3B2F46';
                            if (index === 0 && item.self) backColor = 'cyan';

                            return (
                                <RankItem
                                    key={index}
                                    avatarUrl={avatars?.[item.wallet]?.url}
                                    screenName={
                                        avatars?.[item.wallet]?.screenName
                                    }
                                    position={item.rank ?? ''}
                                    invitedByURL={
                                        item?.invitedBy?.wallet
                                            ? avatars?.[item?.invitedBy?.wallet]
                                                  ?.url
                                            : undefined
                                    }
                                    invitedByScreenName={
                                        item?.invitedBy?.wallet
                                            ? avatars?.[item?.invitedBy?.wallet]
                                                  ?.screenName
                                            : item?.invitedBy?.thirdParty
                                    }
                                    score={item.points ?? 0}
                                    self={item.self}
                                    backColor={backColor}
                                    wallet={item.wallet}
                                />
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className={styles.items}>
                    {leaderboard.map((item, index) => {
                        let backColor = '#3B2F46';
                        if (index === 0 && item.self) backColor = 'cyan';

                        return (
                            <RankItem
                                key={index}
                                avatarUrl={avatars?.[item.wallet]?.url}
                                screenName={avatars?.[item.wallet]?.screenName}
                                position={item.rank ?? ''}
                                invitedByURL={
                                    item?.invitedBy?.wallet
                                        ? avatars?.[item?.invitedBy?.wallet]
                                              ?.url
                                        : undefined
                                }
                                invitedByScreenName={
                                    item?.invitedBy?.wallet
                                        ? avatars?.[item?.invitedBy?.wallet]
                                              ?.screenName
                                        : item?.invitedBy?.thirdParty
                                }
                                score={item.points ?? 0}
                                self={item.self}
                                backColor={backColor}
                                wallet={item.wallet}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default RankItemList;
