import ActivitiesList from '../../components/ActivitiesList';
import LBSubNavBar from '../../components/LBSubNavBar';
import RankItemList from '../../components/RankItemList';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import styles from './LeaderBoard.module.css';

const LeaderBoard = () => {
    const isMobile = useMediaQuery('(max-width: 968px)');
    return (
        <div>
            <div className={styles.container}>
                <div className={styles.navbar}>
                    <LBSubNavBar />
                </div>
                {!isMobile && (
                    <section className={styles.left}>
                        <ActivitiesList />
                    </section>
                )}
                <section className={styles.right}>
                    <RankItemList />
                </section>
            </div>
        </div>
    );
};

export default LeaderBoard;
