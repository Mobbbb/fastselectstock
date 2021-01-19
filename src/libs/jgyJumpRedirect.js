import { gotoNativeStockPage } from './util';
import { recordTrackPoint } from './trackPoint';


const initJGYCallback = () => {
    if (typeof window.JGY === "object" && window.JGY !== null) {
        window.JGY.JumpHangqing = function (stockCode, market_code, domain, i) {
            recordTrackPoint({ id: 'free_iwencai_kuaisu.cl.gegu' });
            gotoNativeStockPage(stockCode, market_code, domain);
        }
    }
};

export default initJGYCallback;
