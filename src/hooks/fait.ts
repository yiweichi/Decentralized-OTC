//  interface FIAT{
//     symbol:String;
//     logoURI:String;
//     describe:String;
//     sign:String;
// }
export declare class FIAT {
    readonly  symbol:string;
    readonly logoURI:string;
    readonly describe:string;
    readonly sign:string;
    protected constructor( symbol: string, logoURI:string, sign: string,describe:string);
}
 const ALLFIAT:FIAT[]=[
{  symbol:"CNY",
   logoURI:"/images/CNY.png",
    describe:"Chinese currency,人民币",
    sign:"￥"
},
{  symbol:"USDT(ETH)",
logoURI:"/images/USDT.png",
    describe:"USDT on Etherum,以太坊上的USDT",
    sign:"$"
},
{  symbol:"USDT(HECO)",
logoURI:"/images/USDT.png",
    describe:"在火币链上的USDT",
    sign:"$"
},
{  symbol:"USD",
logoURI:"/images/usd.png",
describe:"US Dollar,美元",
sign:"$"
},
{  symbol:"HKD",
logoURI:"/images/HKD.png",
describe:"HongKong Dollar,港币",
sign:"HK$"
},
{  symbol:"THB",
logoURI:"/images/THB.png",
    describe:"Thai baht,泰铢",
    sign:"฿"
},
{  symbol:"IRR",
logoURI:"/images/IRR.png",
    describe:"ریال ایران‎,",
    sign:"﷼"
},
{  
    symbol:"EUR",
    logoURI:"/images/EUR.png",
    describe:"EURO DOLLAR,欧元",
    sign:"€"
}
]
export function AllFait():FIAT[]  {
 return ALLFIAT;
}
export function getFait(symbol:string):(FIAT|undefined){
    let re:FIAT|undefined;
    ALLFIAT.forEach(element => {
     if(element.symbol===symbol) re=element;
    });
   return re

}

