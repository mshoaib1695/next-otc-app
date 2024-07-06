import pkg from '../../../package.json';
import Analytics from '../Analytics';
import SocialMedias from '../SocialMediasLinks';
import styles from './MainFooter.module.css';

const MainFooter = () => {
    return (
        <footer className={styles.container}>
            <div className={styles.analytics}>
                <Analytics />
            </div>
            <div className={styles.version}>
                <p>{`v.${pkg.version}`}</p>
            </div>
            <div className={styles.socialMedias}>
                <SocialMedias />
            </div>
        </footer>
    );
};

export default MainFooter;
