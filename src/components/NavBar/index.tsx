import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';
import ExternalURLSVG from '../_primitives/ExternalURLSVG';
import styles from './NavBar.module.css';

type NavbarItem = {
    'i18n-label'?: string;
    url: string;
    label?: string;
    target?: string;
};

const NavBar = () => {
    const { t } = useTranslation();
    const [navbarItems, setNavbarItems] = useState<NavbarItem[]>([]);

    useEffect(() => {
        fetch('/navbar-config.json')
            .then((res) => res.json())
            .then((data) => {
                setNavbarItems(data);
            });
    }, []);

    return (
        <div className={styles.container}>
            {navbarItems.map((item, index) => {
                if (item.target && item.url) {
                    return (
                        <div key={index} className={styles.externalLink}>
                            <Link
                                className={styles.item}
                                to={item.url}
                                target={item.target}
                                rel='noopener noreferrer'
                            >
                                <h4>
                                    {item['i18n-label'] ? t(`${item['i18n-label']}`) : item.label}
                                </h4>
                            </Link>
                            <ExternalURLSVG className={styles.icon} fill='white' width={14} />
                        </div>
                    );
                } else if (item.url) {
                    return (
                        <NavLink
                            className={({ isActive }) =>
                                [styles.item, isActive ? styles.activeItem : ''].join(' ')
                            }
                            key={index}
                            to={item.url}
                        >
                            <h4>{item['i18n-label'] ? t(`${item['i18n-label']}`) : item.label}</h4>
                        </NavLink>
                    );
                }
            })}
        </div>
    );
};

export default NavBar;
