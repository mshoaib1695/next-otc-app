import { Menu } from '@headlessui/react';
import { TFunction } from 'i18next';
import { PropsWithChildren, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useDisconnect } from 'wagmi';
import { RootState } from '../../state/store';
import Avatar from '../_primitives/Avatar';
import LightningBoltSvgComponent from '../_primitives/LightningBolt';
import styles from './UserInfo.module.css';

type MenuAuxProps = {
    t: TFunction<'translation', undefined>;
    handleDisconnect: () => void;
    onMouseLeave?: any;
};
const MenuAux = ({ t, handleDisconnect, onMouseLeave }: MenuAuxProps) => {
    return (
        <Menu.Items className={styles.items} onMouseLeave={onMouseLeave}>
            <Menu.Item>
                <NavLink className={styles.item} to={'/dashboard'}>
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
    );
};

type UserInfoProps = PropsWithChildren & {
    showAvatar?: boolean;
};
const UserInfo = ({ showAvatar = true, children }: UserInfoProps) => {
    const { t } = useTranslation();
    const { disconnect } = useDisconnect();
    const wallet = useSelector((state: RootState) => state.profile.wallet);
    const avatars = useSelector((state: RootState) => state.avatars.wallets);
    const score = useSelector((state: RootState) => state.score.score);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleDisconnect = () => disconnect();

    if (!wallet) return null;

    return (
        <div className={styles.container}>
            <Menu>
                <Menu.Button className={styles.button}>
                    <LightningBoltSvgComponent fill="cyan" width={28} />
                    <div className={styles.score}>
                        <h3>
                            {t('airdrop.ranking.scoreValue', { value: score })}
                        </h3>
                        {showAvatar && (
                            <h4 className={styles.points}>
                                {t('airdrop.userinfo.points')}
                            </h4>
                        )}
                    </div>
                </Menu.Button>
                <MenuAux t={t} handleDisconnect={handleDisconnect} />
            </Menu>

            <div>{children}</div>

            {showAvatar && (
                <div className={styles.menuContainer}>
                    <Menu>
                        {({ open }) => (
                            <div>
                                <Menu.Button
                                    ref={buttonRef}
                                    className={styles.button}
                                    onMouseEnter={({ target }: any) =>
                                        open ? '' : target.click()
                                    }
                                >
                                    <div className={styles.avatar}>
                                        <Avatar
                                            imageUrl={avatars?.[wallet]?.url}
                                            name={avatars?.[wallet]?.screenName}
                                            wallet={wallet}
                                        />
                                    </div>
                                </Menu.Button>
                                <MenuAux
                                    t={t}
                                    handleDisconnect={handleDisconnect}
                                    onMouseLeave={() =>
                                        open && buttonRef.current?.click()
                                    }
                                />
                            </div>
                        )}
                    </Menu>
                </div>
            )}
        </div>
    );
};

export default UserInfo;
