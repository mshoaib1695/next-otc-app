import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import pg01_bg from '../assets/pg01_bg_airdrop.jpg';
import pg02_bg from '../assets/pg02_bg_airdrop.png';
import pg09_bg from '../assets/pg09_bg_airdrop.png';
import AnimtaionFooter from '../components/AnimationFooter';
import MainFooter from '../components/MainFooter';
import MainHeader from '../components/MainHeader';
import Notifications from '../components/Notifications';
import { useMediaQuery } from '../hooks/useMediaQuery';

const MainLayout = () => {
    const location = useLocation();
    const removeBackground = useMediaQuery('(max-width: 1280px)');
    const isMobile = useMediaQuery('(max-width: 968px)');

    let logoTheme = 'black';
    if (
        (location.pathname === '/leaderboard' ||
            location.pathname === '/finalTask' ||
            location.pathname === '/refer' ||
            location.pathname === '/dashboard' ||
            location.pathname === '/otc/swap' ||
            location.pathname === '/otc/stake' ||
            location.pathname === '/otc/stakeHistory') &&
        !isMobile
    ) {
        logoTheme = 'cyan';
    }

    // defining background style for each page
    let pageStyle = {
        background: `#9666FF url(${pg01_bg}) no-repeat left top / 100vw 100vh`,
    };
    if (location.pathname === '/') {
        pageStyle = {
            background: `#9666FF url(${pg01_bg}) no-repeat left top / cover`,
        };
    } else if (
        location.pathname === '/leaderboard' ||
        location.pathname === '/finalTask' ||
        location.pathname === '/refer' ||
        location.pathname === '/dashboard' ||
        location.pathname === '/otc/swap' ||
        location.pathname === '/otc/stake' ||
        location.pathname === '/otc/stakeAction' ||
        location.pathname === '/otc/stakeHistory'
    ) {
        pageStyle = {
            background: `#9666FF url(${pg09_bg}) no-repeat left top / cover`,
        };
    } else if (location.pathname === '/early') {
        pageStyle = {
            background: `#9666FF url(${pg02_bg}) no-repeat left top / cover`,
        };
    } else if (location.pathname === '/airdrop') {
        if (removeBackground) {
            pageStyle = {
                background: '#9666FF', // #C955FE
            };
        } else {
            pageStyle = {
                background:
                    'linear-gradient(90deg,#9666FF 0%,#9666FF 50%, #271F46 50%, #271F46 80%, #0A3B46 100%)',
            };
        }
    }

    return (
        <div className="main-container" style={pageStyle}>
            <Notifications />
            <MainHeader logoFill={logoTheme} />
            <main className="main-content">
                <Outlet />
            </main>
            <AnimtaionFooter />
            <MainFooter />
            <ScrollRestoration />
        </div>
    );
};

export default MainLayout;
