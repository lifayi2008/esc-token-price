const schedule = require('node-schedule');
const {JsonRpcProvider} = require("@ethersproject/providers");
const config = require('./config');
const {Fetcher, Route, Token} = require("@uniswap/sdk");
const dbService = require("./dbService");


module.exports = {
    run: function() {
        logger.info("========= Price Service start =============")

        let now = new Date();
        const chainId = 20;
        let provider = new JsonRpcProvider(config.escNode);

        const USDC = new Token(chainId, "0xA06be0F5950781cE28D965E5EFc6996e88a8C141", 6, 'USDC');
        const GLIDE = new Token(chainId, "0xd39eC832FF1CaaFAb2729c76dDeac967ABcA8F27", 18, 'GLIDE');
        const WELA = new Token(chainId, "0x517E9e5d46C1EA8aB6f78677d6114Ef47F71f6c4", 18, 'WELA');
        const DIA = new Token(chainId, "0x2C8010Ae4121212F836032973919E8AeC9AEaEE5", 18, 'DIA');
        const ETH = new Token(chainId, "0x802c3e839E4fDb10aF583E3E759239ec7703501e", 18, 'ETH');
        const BNB = new Token(chainId, "0x51B85F3889c7EA8f6d5EdEBFBadaDA0fDcE236c9", 18, 'BNB');
        const GOLD = new Token(chainId, "0xaA9691BcE68ee83De7B518DfCBBfb62C04B1C0BA", 18, 'GOLD');
        const ELK = new Token(chainId, "0xE1C110E1B1b4A1deD0cAf3E42BfBdbB7b5d7cE1C", 18, 'ELK');
        const HT = new Token(chainId, "0xeceefC50f9aAcF0795586Ed90a8b9E24f55Ce3F3", 18, 'HT');
        const Material = new Token(chainId, "0xe2390b8B08a9Ab68e6f1aaA150B2ddD03900CE25", 18, 'Material');

        let USDCBasedCoin = [GLIDE, WELA];
        let GLIDEBasedCoin = [DIA, GOLD, ELK];
        let WELABasedCoin = [ETH, BNB, HT, Material];

        async function getPrice(coin, baseCoin) {
            let pair = await Fetcher.fetchPairData(coin, baseCoin, provider);
            let route = new Route([pair], coin);
            return route.midPrice.toSignificant(6);
        }

        async function getBasedCoinPrices(coinList, baseCoin) {
            let promises = coinList.map(coin => getPrice(coin, baseCoin));
            return await Promise.all(promises);
        }

        function formatNumber(number) {
            return number >= 10 ? number : '' + '0' + number; 
        }

        schedule.scheduleJob({start: new Date(now + 5 * 1000), rule: '*/1 * * * *'}, async () => {
            let now = new Date();
            let date = '' + now.getFullYear() 
                        + formatNumber(now.getMonth() + 1) 
                        + formatNumber(now.getDate())
                        + formatNumber(now.getHours())
                        + formatNumber(now.getMinutes());

            let price = {date};

            let USDCBasedCoinPrice = await getBasedCoinPrices(USDCBasedCoin, USDC);

            for(let x = 0; x < USDCBasedCoinPrice.length; x++) {
                price[USDCBasedCoin[x].symbol] = parseFloat(USDCBasedCoinPrice[x]);
            }

            let GLIDEBasedCoinPrice = await getBasedCoinPrices(GLIDEBasedCoin, GLIDE);
            for(let x = 0; x < GLIDEBasedCoinPrice.length; x++) {
                price[GLIDEBasedCoin[x].symbol] = GLIDEBasedCoinPrice[x] * price['GLIDE'];
            }

            let WELABasedCoinPrice = await getBasedCoinPrices(WELABasedCoin, WELA);
            for(let x = 0; x < WELABasedCoinPrice.length; x++) {
                price[WELABasedCoin[x].symbol] = WELABasedCoinPrice[x] * price['WELA'];
            }

            logger.info(JSON.stringify(price));

            await dbService.insertRecord(price)
        });
    }
}
