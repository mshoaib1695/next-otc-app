import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import GenericButton from '../GenericButton';
import UserInfo from '../UserInfo';
import UserInfoHambMenu from '../UserInfoHambMenu';
import WalletSVG from '../_primitives/WalletSVG';
import styles from './ButtonConnectWallet.module.css';

type ConnectWalletProps = {
    full?: boolean;
};
const ConnectWallet = ({ full = false }: ConnectWalletProps) => {
    const { t } = useTranslation();
    const isMobile = useMediaQuery('(max-width: 968px)');

    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openChainModal,
                openConnectModal,
                mounted,
                connectModalOpen,
            }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                    <div
                        {...(!ready && {
                            'aria-hidden': true,
                            style: {
                                opacity: 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                            },
                        })}
                    >
                        {(() => {
                            if (!connected) {
                                return (
                                    <div className={styles.buttonContainer}>
                                        {isMobile ? (
                                            <div
                                                className={
                                                    styles.walletContainer
                                                }
                                            >
                                                <button
                                                    className={styles.button}
                                                    onClick={openConnectModal}
                                                    style={
                                                        full
                                                            ? {
                                                                  marginLeft:
                                                                      '1rem',
                                                              }
                                                            : {}
                                                    }
                                                >
                                                    <WalletSVG
                                                        width={36}
                                                        height={full ? 30 : 36}
                                                        fill={'#fff'}
                                                    />
                                                </button>
                                            </div>
                                        ) : (
                                            <GenericButton
                                                onClick={openConnectModal}
                                                loading={connectModalOpen}
                                            >
                                                {t(
                                                    'airdrop.home.btnConnect'
                                                ).toUpperCase()}
                                            </GenericButton>
                                        )}
                                    </div>
                                );
                            }

                            if (chain.unsupported) {
                                return (
                                    <div className={styles.buttonContainer}>
                                        {isMobile ? (
                                            <div onClick={openChainModal}>
                                                {chain.hasIcon && (
                                                    <div
                                                        className={
                                                            styles.changeWallet
                                                        }
                                                    >
                                                        {chain.iconUrl && (
                                                            <img
                                                                alt={
                                                                    chain.name ??
                                                                    'Chain icon'
                                                                }
                                                                src={
                                                                    chain.iconUrl
                                                                }
                                                                style={{
                                                                    width: 26,
                                                                    height: 26,
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <GenericButton
                                                onClick={openChainModal}
                                            >
                                                {t(
                                                    'airdrop.home.btnConnect.wrongNetwork'
                                                ).toUpperCase()}
                                            </GenericButton>
                                        )}
                                    </div>
                                );
                            }
                            //
                            return (
                                <div className={styles.userInfoContainer}>
                                    {full ? (
                                        <UserInfoHambMenu>
                                            <div onClick={openChainModal}>
                                                {chain.hasIcon && (
                                                    <div
                                                        className={
                                                            styles.changeWallet
                                                        }
                                                    >
                                                        {chain.iconUrl && (
                                                            <img
                                                                alt={
                                                                    chain.name ??
                                                                    'Chain icon'
                                                                }
                                                                src={
                                                                    chain.iconUrl
                                                                }
                                                                style={{
                                                                    width: 26,
                                                                    height: 26,
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </UserInfoHambMenu>
                                    ) : (
                                        <UserInfo
                                            showAvatar={isMobile ? false : true}
                                        >
                                            <div onClick={openChainModal}>
                                                {chain.hasIcon && (
                                                    <div
                                                        className={
                                                            styles.changeWallet
                                                        }
                                                    >
                                                        {chain.iconUrl && (
                                                            <img
                                                                alt={
                                                                    chain.name ??
                                                                    'Chain icon'
                                                                }
                                                                src={
                                                                    chain.iconUrl
                                                                }
                                                                style={{
                                                                    width: 26,
                                                                    height: 26,
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </UserInfo>
                                    )}
                                </div>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
};

export default ConnectWallet;
