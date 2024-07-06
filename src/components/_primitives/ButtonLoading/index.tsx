import { useEffect, useState } from 'react';
import LogoSvg from '../LogoSVG';
import styles from './ButtonLoading.module.css';

const ButtonLoading = () => {
    const [logosOpacity, setLogosOpacity] = useState([0.1, 0.3, 0.5, 1, 0.5, 0.3]);

    useEffect(() => {
        const interval = setInterval(() => {
            setLogosOpacity((prev) => {
                const newOpacity = [...prev];
                newOpacity.unshift(newOpacity.pop()!);
                return newOpacity;
            });
        }, 200);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.container}>
            <LogoSvg
                className={styles.logo01}
                style={{ opacity: logosOpacity[0] }}
                fill='#CB34FF'
                width={20}
            />
            <LogoSvg
                className={styles.logo02}
                style={{ opacity: logosOpacity[1] }}
                fill='#B54AFF'
                width={20}
            />
            <LogoSvg
                className={styles.logo03}
                style={{ opacity: logosOpacity[2] }}
                fill='#A05FFF'
                width={20}
            />
            <LogoSvg
                className={styles.logo04}
                style={{ opacity: logosOpacity[3] }}
                fill='#827DFF'
                width={20}
            />
            <LogoSvg
                className={styles.logo05}
                style={{ opacity: logosOpacity[4] }}
                fill='#6D92FF'
                width={20}
            />
            <LogoSvg
                className={styles.logo06}
                style={{ opacity: logosOpacity[5] }}
                fill='#4CB3FF'
                width={20}
            />
        </div>
    );
};

export default ButtonLoading;
