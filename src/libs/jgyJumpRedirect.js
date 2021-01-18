import { gotoNativeStockPage } from './util';


const initJGYCallback = () => {
    if (typeof window.JGY === "object" && window.JGY !== null) {
        window.JGY.JumpHangqing = function (stockCode, market_code, domain, i) {
            gotoNativeStockPage(stockCode, market_code, domain)
        }
    }
};

export default initJGYCallback;
