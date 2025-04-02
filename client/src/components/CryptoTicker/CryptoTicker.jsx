import { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';

const CryptoTicker = () => {
  const [coins, setCoins] = useState([]);

  // Lấy dữ liệu từ CoinGecko API (bao gồm thông tin về icon)
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,cardano,litecoin,xrp,polkadot,shiba-inu,ftx,near,chainlink,avalanche,solana,dogecoin,binancecoin,uniswap,terraluna-classic,vechain,tron,monero,cosmos,stellar,algorand,polygon,chainlink,vechain,tezos,tron,dash,hedera,lisk,elrond,sushi,compound,monero,yearn-finance,steem,icon,hedera,theta,terra-luna'
        );
        const coinData = response.data;
        const formattedCoins = coinData.map(coin => ({
          symbol: coin.name,
          price: `$${coin.current_price.toFixed(2)}`,
          change: coin.price_change_percentage_24h.toFixed(2), // Lấy tỷ lệ thay đổi trong 24h
          icon: coin.image, // Lấy URL icon
        }));

        setCoins(formattedCoins);
      } catch (error) {
        console.error('Error fetching data from CoinGecko:', error);
      }
    };

    fetchCoins();
  }, []);

  // Chia coins thành hai dòng
  const midIndex = Math.ceil(coins.length / 2);
  const firstRow = coins.slice(0, midIndex);
  const secondRow = coins.slice(midIndex);

  return (
    <div className="crypto-ticker">
      <div className="ticker-container">
        <div className="ticker-row">
          {firstRow.map((coin, index) => (
            <div key={index} className="coin-item">
              <img src={coin.icon} alt={coin.symbol} className="coin-icon" />
              <span className={`coin-symbol ${coin.change < 0 ? 'down' : 'up'}`}>
                {coin.symbol}
              </span>
              <span className={`coin-price ${coin.change < 0 ? 'down' : 'up'}`}>
                {coin.price}
              </span>
              <span className={`coin-change ${coin.change < 0 ? 'down' : 'up'}`}>
                {coin.change}%
              </span>
            </div>
          ))}
        </div>

        <div className="ticker-row">
          {secondRow.map((coin, index) => (
            <div key={index} className="coin-item">
              <img src={coin.icon} alt={coin.symbol} className="coin-icon" />
              <span className={`coin-symbol ${coin.change < 0 ? 'down' : 'up'}`}>
                {coin.symbol}
              </span>
              <span className={`coin-price ${coin.change < 0 ? 'down' : 'up'}`}>
                {coin.price}
              </span>
              <span className={`coin-change ${coin.change < 0 ? 'down' : 'up'}`}>
                {coin.change}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CryptoTicker;
