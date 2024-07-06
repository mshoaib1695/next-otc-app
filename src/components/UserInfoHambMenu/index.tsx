import { Menu } from '@headlessui/react';
import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useDisconnect } from 'wagmi';
import { RootState } from '../../state/store';
import Avatar from '../_primitives/Avatar';
import LightningBoltSvgComponent from '../_primitives/LightningBolt';
import styles from './UserInfoHambMenu.module.css';

type UserInfoProps = PropsWithChildren;
const UserInfoHambMenu = ({ children }: UserInfoProps) => {
    const { t } = useTranslation();
    const { disconnect } = useDisconnect();
    const wallet = useSelector((state: RootState) => state.profile.wallet);
    const avatars = useSelector((state: RootState) => state.avatars.wallets);
    const score = useSelector((state: RootState) => state.score.score);

    const handleDisconnect = () => disconnect();

    if (!wallet) return null;

    return (
        <div className={styles.container}>
            <div className={styles.firstRow}>
                <LightningBoltSvgComponent fill="cyan" width={28} />
                <div className={styles.score}>
                    <h3>{t('airdrop.ranking.scoreValue', { value: score })}</h3>
                    <h4 className={styles.points}>
                        {t('airdrop.userinfo.points')}
                    </h4>
                </div>
            </div>
            <div className={styles.secondRow}>
                {children}
                <div className={styles.menuContainer}>
                    <Menu>
                        <Menu.Button className={styles.button}>
                            <div className={styles.avatar}>
                                <Avatar
                                    imageUrl={avatars?.[wallet]?.url}
                                    name={avatars?.[wallet]?.screenName}
                                    wallet={wallet}
                                />
                            </div>
                        </Menu.Button>
                        <Menu.Items className={styles.items}>
                            <Menu.Item>
                                <NavLink
                                    className={styles.item}
                                    to={'/dashboard'}
                                >
                                    {t('airdrop.userinfo.mydash')}
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item>
                                <NavLink
                                    className={styles.item}
                                    to={'#'}
                                    onClick={handleDisconnect}
                                >
                                    {t('airdrop.home.btnDisconnect')}
                                </NavLink>
                            </Menu.Item>
                        </Menu.Items>
                    </Menu>
                </div>
            </div>
        </div>
    );
};

export default UserInfoHambMenu;
