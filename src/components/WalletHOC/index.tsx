import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAccount } from 'wagmi';
import { actions } from '../../state/profile';
import { RootState } from '../../state/store';

const WalletHOC = (props: React.PropsWithChildren) => {
    const dispatch = useDispatch();
    const { address, isDisconnected } = useAccount();
    const token = useSelector((state: RootState) => state.profile.token || '');
    const currentAddress = useSelector((state: RootState) => state.profile.wallet);

    useEffect(() => {
        const hasClientId = localStorage.getItem('clientId');
        if (!hasClientId) {
            const clientId = Math.random().toString(36).substring(2);
            localStorage.setItem('clientId', clientId);
        }
    }, []);

    useEffect(() => {
        if (token.trim().length > 0 && address && !isDisconnected && address !== currentAddress) {
            // user switched wallet
            dispatch(actions.changedWalet(address.toString()));
            return;
        }

        if (isDisconnected && token.trim().length > 0) dispatch(actions.setDisconnect());
        if (address && !isDisconnected && token.trim().length === 0)
            dispatch(actions.requestLogin(address.toString()));
    }, [isDisconnected, address, dispatch]);

    return <>{props.children}</>;
};

export default WalletHOC;
