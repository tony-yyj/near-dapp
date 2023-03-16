interface TokenInterface{
    token: string;
    tokenAccountId: string;
    decimals: number;

}
export const TokenConst: {[key: string]: TokenInterface} = {
    NEAR: {
       token: 'NEAR',
       tokenAccountId: 'near',
        decimals: 24,
    },
    USDC: {
        token: 'USDC',
        tokenAccountId: 'usdc.orderly.testnet',
        decimals: 6,
    }
}