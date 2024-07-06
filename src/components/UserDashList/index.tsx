import { useTranslation } from 'react-i18next';

import UserDashItem from '../UserDashItem';
import styles from './UserDashList.module.css';

export type UserDash = {
    label: string;
    value: string;
};

type UserDashListProps = {
    dashItems: UserDash[];
};
const UserDashList = ({ dashItems }: UserDashListProps) => {
    const { t } = useTranslation();
    return (
        <div className={styles.container}>
            {dashItems.map((item, index) => (
                <UserDashItem key={index} item={t(`${item.label}`)} value={t(`${item.value}`)} />
            ))}
        </div>
    );
};

export default UserDashList;
