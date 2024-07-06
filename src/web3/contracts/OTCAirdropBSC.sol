// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/*
 *   @author   0xtp
 *   @title    Vitruveo OTC Airdrop BSC
 *
 *   ██╗   ██╗    ██╗    ████████╗    ██████╗     ██╗   ██╗    ██╗   ██╗    ███████╗     ██████╗
 *   ██║   ██║    ██║    ╚══██╔══╝    ██╔══██╗    ██║   ██║    ██║   ██║    ██╔════╝    ██╔═══██╗
 *   ██║   ██║    ██║       ██║       ██████╔╝    ██║   ██║    ██║   ██║    █████╗      ██║   ██║
 *   ╚██╗ ██╔╝    ██║       ██║       ██╔══██╗    ██║   ██║    ╚██╗ ██╔╝    ██╔══╝      ██║   ██║
 *    ╚████╔╝     ██║       ██║       ██║  ██║    ╚██████╔╝     ╚████╔╝     ███████╗    ╚██████╔╝
 *     ╚═══╝      ╚═╝       ╚═╝       ╚═╝  ╚═╝     ╚═════╝       ╚═══╝      ╚══════╝     ╚═════╝
 *
 */

import '@openzeppelin/contracts/utils/Counters.sol';
import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.3/contracts/token/ERC20/IERC20.sol';
import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.3/contracts/access/AccessControl.sol';
import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.3/contracts/security/ReentrancyGuard.sol';

contract VitruveoOTCSale is AccessControl, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter public nextSaleId;

    /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ S T A T E @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

    bool public isSaleActive;
    uint256 public vtruOTCPrice;
    uint256 public totalSaleCounter;
    uint256 public minPerTx;
    uint256 public maxPerTx;

    address public vtruWallet1;
    address public vtruWallet2;
    address public vtruWallet3;
    address public vtruWallet4;
    address public vtruWallet5;
    address public vtruWallet6;
    address public vtruWallet7;
    address public vtruWallet8;

    struct otcDetails {
        uint256 id;
        string tokenSymbol;
        uint256 qty;
        uint256 tokenAmount;
        uint256 vam;
        uint256 vamBonus;
        uint256 price;
        address accountAddress;
        uint256 timestamp;
        string status;
    }

    mapping(uint256 => string) public OTCStatus;
    mapping(uint256 => otcDetails) public OTCDetails;
    mapping(string => address) public AllowedTokens;
    mapping(string => uint256) public TokenDecimals;
    mapping(string => uint256) public TotalTokenSaleCounter;

    mapping(address => mapping(address => uint256)) public ERC20Deposit;
    mapping(address => mapping(string => uint256[])) private AccountDeposits;

    bytes32 public constant ADMIN_ROLE = keccak256('ADMIN_ROLE');

    /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ E V E N T S @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

    event ERC20Deposited(
        uint256 indexed otcDetailsId,
        string indexed tokenSymbol,
        address indexed accountAddress,
        uint256 qty,
        uint256 tokenAmount
    );

    constructor() {
        _init();
    }

    function _init() internal {
        isSaleActive = true;

        minPerTx = 10 * 1e18;
        maxPerTx = 100000 * 1e18;

        vtruOTCPrice = 250;

        TokenDecimals['USDT'] = 18;
        TokenDecimals['BUSD'] = 18;

        OTCStatus[1] = 'pending';
        OTCStatus[2] = 'completed';
        OTCStatus[3] = 'cancelled';

        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);

        //Vitruveo Multisig - BSC
        vtruWallet1 = 0x725A4b6be3dC89f1C503977FA2E414E6243eAb8d;
        vtruWallet2 = 0xd9FcA2461c80342c18ad77446c1badcD87f4Fe9d;
        vtruWallet3 = 0xFA931ccfe2274c8c4253A11F3c5561611531A070;
        vtruWallet4 = 0x6672AaFc4f1EA7339115cECc1B960F93be1F9925;
        vtruWallet5 = 0x7876De40001513f0f9318BBac1949D7879447e2e;
        vtruWallet6 = 0x4dD2F5965c4daEf71794f92EcDAceBFb8C4C5eEF;
        vtruWallet7 = 0x113CE0e883a54Fc875626E195f053498F37B9E74;
        vtruWallet8 = 0x54052055f3656Fb40efdbB998e99403ec6f1E4EE;

        setAllowedTokens('BUSD', 0x6038a559c91734430225d88Faf10c4e460f9B9f7);
        setAllowedTokens('USDT', 0xfAcB9ADE2cC99a65B725e5901CAD839347f25475);
    }

    function buyVTRUViaOTC(
        string memory symbol,
        uint256 qty,
        uint256 amount,
        uint256 vam,
        uint256 vamBonus
    ) external nonReentrant returns (otcDetails memory) {
        uint256 totalQuantity = qty + vamBonus;

        require(isSaleActive == true, 'Sale not active');
        require(
            qty >= minPerTx && qty <= maxPerTx,
            'Qty must be greater than minPerTx & less than maxPerTx'
        );
        require(AllowedTokens[symbol] != address(0), 'Address not part of allowed token list');

        nextSaleId.increment();
        address tokenAddress = AllowedTokens[symbol];
        ERC20Deposit[msg.sender][tokenAddress] += amount;
        AccountDeposits[msg.sender][symbol].push(nextSaleId.current());

        totalSaleCounter = totalSaleCounter + amount;
        TotalTokenSaleCounter[symbol] = TotalTokenSaleCounter[symbol] + amount;

        otcDetails memory newOTCSale = _createNewOTCSale(
            symbol,
            totalQuantity,
            amount,
            msg.sender,
            vam,
            vamBonus,
            block.timestamp,
            OTCStatus[2]
        );

        _splitPayment(tokenAddress, amount);

        emit ERC20Deposited(newOTCSale.id, symbol, msg.sender, totalQuantity, amount);

        return newOTCSale;
    }

    function _splitPayment(address tokenAddress, uint256 amount) internal {
        IERC20 token = IERC20(tokenAddress);

        // Calculate the amounts for each wallet
        uint256 amountWallet1 = (amount * 125) / 10000; // 1.25%
        uint256 amountWallet2 = (amount * 125) / 10000; // 1.25%
        uint256 amountWallet3 = (amount * 5) / 100; // 5%
        uint256 amountWallet4 = (amount * 5) / 100; // 5%
        uint256 amountWallet5 = (amount * 10) / 100; // 10%
        uint256 amountWallet6 = (amount * 175) / 1000; // 17.5%
        uint256 amountWallet7 = (amount * 30) / 100; // 30%
        uint256 amountWallet8 = (amount * 30) / 100; // 30%

        // Transfer tokens to each wallet
        token.transferFrom(msg.sender, vtruWallet1, amountWallet1);
        token.transferFrom(msg.sender, vtruWallet2, amountWallet2);
        token.transferFrom(msg.sender, vtruWallet3, amountWallet3);
        token.transferFrom(msg.sender, vtruWallet4, amountWallet4);
        token.transferFrom(msg.sender, vtruWallet5, amountWallet5);
        token.transferFrom(msg.sender, vtruWallet6, amountWallet6);
        token.transferFrom(msg.sender, vtruWallet7, amountWallet7);
        token.transferFrom(msg.sender, vtruWallet8, amountWallet8);
    }

    function _createNewOTCSale(
        string memory _symbol,
        uint256 _qty,
        uint256 _amount,
        address _account,
        uint256 _vam,
        uint256 _vamBonus,
        uint256 _timestamp,
        string memory _status
    ) internal returns (otcDetails memory) {
        otcDetails storage newOTCSale = OTCDetails[nextSaleId.current()];
        newOTCSale.id = nextSaleId.current();
        newOTCSale.tokenSymbol = _symbol;
        newOTCSale.qty = _qty;
        newOTCSale.tokenAmount = _amount;
        newOTCSale.accountAddress = _account;
        newOTCSale.vam = _vam;
        newOTCSale.vamBonus = _vamBonus;
        newOTCSale.price = vtruOTCPrice;
        newOTCSale.timestamp = _timestamp;
        newOTCSale.status = _status;

        return newOTCSale;
    }

    function setAllowedTokens(
        string memory _symbol,
        address _tokenAddress
    ) public onlyRole(ADMIN_ROLE) {
        AllowedTokens[_symbol] = _tokenAddress;
    }

    function setTokenDecimals(
        string memory _symbol,
        uint256 _decimals
    ) public onlyRole(ADMIN_ROLE) {
        TokenDecimals[_symbol] = _decimals;
    }

    function setSaleStatus(bool _isActive) external onlyRole(ADMIN_ROLE) {
        isSaleActive = _isActive;
    }

    function setVTRUWallet(
        address _vtruWallet1,
        address _vtruWallet2,
        address _vtruWallet3,
        address _vtruWallet4,
        address _vtruWallet5,
        address _vtruWallet6,
        address _vtruWallet7,
        address _vtruWallet8
    ) external onlyRole(ADMIN_ROLE) {
        vtruWallet1 = _vtruWallet1;
        vtruWallet2 = _vtruWallet2;
        vtruWallet3 = _vtruWallet3;
        vtruWallet4 = _vtruWallet4;
        vtruWallet5 = _vtruWallet5;
        vtruWallet6 = _vtruWallet6;
        vtruWallet7 = _vtruWallet7;
        vtruWallet8 = _vtruWallet8;
    }

    function setMinPerTx(uint256 _minPerTx) external onlyRole(ADMIN_ROLE) {
        minPerTx = _minPerTx;
    }

    function setMaxPerTx(uint256 _maxPerTx) external onlyRole(ADMIN_ROLE) {
        maxPerTx = _maxPerTx;
    }

    function setPrice(uint256 _vtruOTCPrice) external onlyRole(ADMIN_ROLE) {
        vtruOTCPrice = _vtruOTCPrice;
    }

    function withdraw() external onlyRole(ADMIN_ROLE) {
        require(payable(msg.sender).send(address(this).balance));
    }

    function recoverERC20(IERC20 tokenContract, address to) external onlyRole(ADMIN_ROLE) {
        tokenContract.transfer(to, tokenContract.balanceOf(address(this)));
    }

    function getCurrentOTCId() external view returns (uint256) {
        return nextSaleId.current();
    }

    function getAccountDeposits(
        address _account,
        string memory _symbol
    ) public view returns (uint256[] memory) {
        return AccountDeposits[_account][_symbol];
    }
}
