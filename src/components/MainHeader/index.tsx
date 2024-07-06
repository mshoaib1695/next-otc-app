import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import ConnectWallet from '../ButtonConnectWallet';
import HambBarPopover from '../HambBarPopover';
import LanguageSelector from '../LanguageSelector';
import NavBar from '../NavBar';
import VTRUSVG from '../_primitives/VTRUSVG';
import styles from './MainHeader.module.css';

type MainHeaderProps = {
    logoFill?: string;
};
const MainHeader = ({ logoFill }: MainHeaderProps) => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 968px)');

    return (
        <header className={styles.container}>
            <div id='logo' className={styles.logo} onClick={() => navigate('/')}>
                <VTRUSVG fill={logoFill} width={isMobile ? 140 : 200} />
            </div>

            <div id='nav' className={styles.navbar}>
                <NavBar />
            </div>

            <div id='hamb' className={styles.hambBarContainer}>
                {!isMobile && (
                    <div className={styles.btnConnect}>
                        <ConnectWallet />
                    </div>
                )}
                <div className={styles.hambBar}>
                    <HambBarPopover />
                </div>
            </div>

            <div id='extra' className={styles.extras}>
                <ConnectWallet />
            </div>
            <LanguageSelector />
        </header>
    );
};

export default MainHeader;
