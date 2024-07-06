import { Link } from 'react-router-dom';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import DiscordIcon from '../_primitives/DiscordIconSVG';
import EplayIcon from '../_primitives/EplayIconSVG';
import VitruveoIcon from '../_primitives/VitruveoIconSVG';
import SwapIcon from '../_primitives/SwapSVG';
import ScanIcon from '../_primitives/ScanSVG';
import XIcon from '../_primitives/XIconSVG';
import styles from './SocialMedias.module.css';

const SocialMedias = () => {
    const isMobile = useMediaQuery('(max-width: 968px)');
    return (
        <div className={styles.container}>
            <div
                className={styles.vitruveo}
                style={isMobile ? {} : { marginRight: '2rem' }}
            >
                <Link
                    className={styles.item}
                    to="https://www.vitruveo.xyz/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <VitruveoIcon fill="white" height={isMobile ? 34 : 30} />
                </Link>

                <Link
                    className={styles.item}
                    target="_blank"
                    rel="noopener noreferrer"
                    to="https://explorer.vitruveo.xyz"
                >
                    <ScanIcon fill="white" height={isMobile ? 34 : 30} />
                </Link>
                <Link
                    className={styles.item}
                    target="_blank"
                    rel="noopener noreferrer"
                    to="https://swap.vitruveo.xyz"
                >
                    <SwapIcon fill="white" height={isMobile ? 34 : 30} />
                </Link>
            </div>

            <div className={styles.eplays}>
                <p className={styles.item}>Backed by</p>
                <Link
                    className={styles.item}
                    to="https://eplays.com.au/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <EplayIcon fill="white" height={24} />
                </Link>
            </div>

            <div className={styles.x}>
                <Link
                    className={styles.item}
                    to="https://twitter.com/vitruveochain"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <XIcon fill="white" height={24} />
                </Link>
            </div>
            <div className={styles.discord}>
                <Link
                    className={styles.item}
                    to="https://discord.com/invite/vitruveo"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <DiscordIcon fill="white" height={24} />
                </Link>
            </div>
        </div>
    );
};

export default SocialMedias;
