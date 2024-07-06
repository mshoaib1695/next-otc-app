import { useEffect, useState } from 'react';
import styles from './Avatar.module.css';
import { VITE_DEFAULT_AVATAR, VITE_API_AVATAR } from '../../../constants';

type AvatarProps = {
    imageUrl: string;
    name?: string;
    wallet?: string;
    color?: string;
    as?: string;
};
const Avatar = ({
    imageUrl,
    name,
    as = 'h4',
    wallet = '',
    color = 'white',
}: AvatarProps) => {
    const [imageSrc, setImageSrc] = useState(imageUrl);

    useEffect(() => {
        if (imageUrl) setImageSrc(imageUrl);
    }, [imageUrl]);

    const handleError = () => {
        wallet
            ? setImageSrc(`${VITE_API_AVATAR}/${wallet}`)
            : setImageSrc(VITE_DEFAULT_AVATAR);
    };

    return (
        <div className={styles.avatarContainer}>
            <div className={styles.avatar}>
                {imageSrc && (
                    <img
                        src={imageSrc}
                        alt="Avatar"
                        className={styles.avatarImage}
                        onError={handleError}
                    />
                )}
            </div>
            {as === 'h4' && (
                <h4 className={styles.avatarName} style={{ color }}>
                    {name}
                </h4>
            )}
            {as === 'h3' && (
                <h3 className={styles.avatarName} style={{ color }}>
                    {name}
                </h3>
            )}
        </div>
    );
};

export default Avatar;
