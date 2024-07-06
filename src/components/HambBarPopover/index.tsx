import { Popover } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
// import { useMediaQuery } from '../../hooks/useMediaQuery';
import { Statistics } from '../../state/statistics/types';
import { RootState } from '../../state/store';
import ConnectWallet from '../ButtonConnectWallet';
import DiscordIcon from '../_primitives/DiscordIconSVG';
import EplayIcon from '../_primitives/EplayIconSVG';
import ExternalURLSVG from '../_primitives/ExternalURLSVG';
import HambClose from '../_primitives/HambClose';
import HambSVG from '../_primitives/HambSVG';
import VitruveoIcon from '../_primitives/VitruveoIconSVG';
import XIcon from '../_primitives/XIconSVG';
import styles from './HambBarPopover.module.css';

const analyticsItems = ['tvl', 'users', 'wallets'];

type NavbarItem = {
    'i18n-label'?: string;
    url: string;
    label?: string;
    target?: string;
    tooltip?: string;
};

const HambBarPopover = () => {
    const { t } = useTranslation();
    // const isMobile = useMediaQuery('(max-width: 968px)');
    const [navbarItems, setNavbarItems] = useState<NavbarItem[]>([]);
    const statistics = useSelector(
        (state: RootState) => state.statistics.statistics
    );
    const wallet = useSelector((state: RootState) => state.profile.wallet);
    const price = useSelector((state: RootState) => state.otcInfo.price);

    useEffect(() => {
        fetch('/mobile-navbar.json')
            .then((res) => res.json())
            .then((data) => {
                if (!wallet) {
                    data = data.filter(
                        (item: NavbarItem) => item.url !== '/dashboard'
                    );
                }
                setNavbarItems(
                    data.map((item: any) => {
                        return item;
                    })
                );
            });
    }, [wallet]);

    return (
        <Popover className={styles.container}>
            {({ open }) => {
                if (open) {
                    document.body.classList.add(styles.avoidScroll);
                } else {
                    document.body.classList.remove(styles.avoidScroll);
                }
                return (
                    <>
                        <Popover.Button className={styles.button}>
                            <HambSVG fill="black" width={24} height={28} />
                        </Popover.Button>
                        <Popover.Overlay className={styles.overlay} />

                        <Popover.Panel className={styles.panel}>
                            <div className={styles.header}>
                                <Popover.Button
                                    as={HambClose}
                                    fill="white"
                                    width={20}
                                    height={30}
                                />
                                <ConnectWallet />
                            </div>
                            <div className={styles.nav}>
                                {navbarItems.map((item, index) => {
                                    if (item.target && item.url) {
                                        return (
                                            <Popover.Button
                                                as={Link}
                                                key={index}
                                                className={styles.item}
                                                to={item.url}
                                                target={item.target}
                                                rel="noopener noreferrer"
                                            >
                                                <ExternalURLSVG
                                                    className={styles.icon}
                                                    fill="cyan"
                                                    width={20}
                                                />
                                                {item['i18n-label']
                                                    ? t(`${item['i18n-label']}`)
                                                    : item.label}
                                            </Popover.Button>
                                        );
                                    } else if (item.url) {
                                        return (
                                            <Popover.Button
                                                as={NavLink}
                                                key={index}
                                                className={styles.item}
                                                to={item.url}
                                            >
                                                {item['i18n-label']
                                                    ? t(`${item['i18n-label']}`)
                                                    : item.label}
                                            </Popover.Button>
                                        );
                                    }
                                })}
                            </div>
                            <div className={styles.footer}>
                                <div className={styles.vitruveo}>
                                    <div className={styles.analytics}>
                                        {analyticsItems.map((item, index) => {
                                            if (
                                                statistics?.[
                                                    item as keyof Statistics
                                                ] === null
                                            )
                                                return null;
                                            return (
                                                <p
                                                    className={
                                                        styles.analyticsItem
                                                    }
                                                    key={index}
                                                >
                                                    {t(
                                                        `airdrop.analytics.${item}`,
                                                        {
                                                            value:
                                                                item === 'tvl'
                                                                    ? Number(
                                                                          statistics?.[
                                                                              item as keyof Statistics
                                                                          ] ?? 0
                                                                      ) * price
                                                                    : Number(
                                                                          statistics?.[
                                                                              item as keyof Statistics
                                                                          ] ?? 0
                                                                      ),
                                                        }
                                                    )}
                                                </p>
                                            );
                                        })}
                                    </div>

                                    <div className={styles.socials}>
                                        <Popover.Button
                                            as={Link}
                                            className={styles.item}
                                            to="https://twitter.com/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <XIcon fill="white" height={24} />
                                        </Popover.Button>
                                        <Popover.Button
                                            as={Link}
                                            className={styles.item}
                                            to="https://discord.com/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <DiscordIcon
                                                fill="white"
                                                height={24}
                                            />
                                        </Popover.Button>
                                    </div>

                                    <div className={styles.eplays}>
                                        <Popover.Button
                                            as={Link}
                                            className={styles.item}
                                            style={{ marginRight: '0.5rem' }}
                                            to="https://www.vitruveo.xyz/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <VitruveoIcon
                                                fill="white"
                                                height={20}
                                            />
                                        </Popover.Button>

                                        <p className={styles.item}>Backed by</p>
                                        <Popover.Button
                                            as={Link}
                                            className={styles.item}
                                            to="https://twitter.com/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <EplayIcon
                                                fill="white"
                                                height={20}
                                            />
                                        </Popover.Button>
                                    </div>
                                </div>
                            </div>
                        </Popover.Panel>
                    </>
                );
            }}
        </Popover>
    );
};

export default HambBarPopover;
