import React from 'react'
import { AutoColumn } from '../../components/Column';
import SaleOrderUnlockedCard from './saleOrderUnlockCard'
import SaleOrderLockedCard from './saleOrderLockedCard'
import ExecuteCard from './executeCard'
import { useGetMySaleOrderDataCallBack, useGetSellerDisputeBlockNumberCallBack } from '../../hooks/useApproveCallback'
import { LinkStyledButton } from '../../components/DescribeInputPanel';
import { useConditionOfOrders } from '../../state/conditionOfOrders/hooks';
import { Card } from 'rebass';
import Loader from '../../components/Loader';


export default function MySaleOrder() {

    let Orders = useGetMySaleOrderDataCallBack();
    let SellerDisputableBlockNumber = useGetSellerDisputeBlockNumberCallBack()
    const [conditionOfOrders, setconditionOfOrders] = useConditionOfOrders()
    const handleMore = () => {
        let a = {
            quantity_min: conditionOfOrders.quantity_min,
            quanity_max: conditionOfOrders.quanity_max,
            price_min: conditionOfOrders.price_min,
            price_max: conditionOfOrders.price_max,
            currency: conditionOfOrders.currency,
            erc20: conditionOfOrders.erc20,
            sellerDeposit: conditionOfOrders.sellerDeposit,
            buyerDeposit: conditionOfOrders.buyerDeposit,
            linenumber: conditionOfOrders.linenumber,
            mySellOrderLineNumber: conditionOfOrders.mySellOrderLineNumber + 100,
            myBuyOrderLineNumber: conditionOfOrders.myBuyOrderLineNumber
        }
        setconditionOfOrders(a);
    }

    return (
        <div>
            <AutoColumn gap="lg" justify="center">
                <AutoColumn gap="6px" style={{ width: '100%' }}>
                    {Orders ? Orders.map((k) => {
                        console.log("fffff", k.seller)
                        if (k.seller != "0x0000000000000000000000000000000000000000" && k.state == 3) {
                            return (
                                <ExecuteCard key={k.id} pair={k} isSeller={true} />
                            )
                        } else { return }
                    }
                    ) : <Card >
                        <AutoColumn gap="12px">
                            <div style={{ textAlign: "center" }}>
                                <Loader></Loader>
                            </div>
                        </AutoColumn>
                    </Card >
                    }

                    {Orders?.map((k) => {
                        console.log("fffff", k.seller)
                        if (k.seller != "0x0000000000000000000000000000000000000000" && k.state == 1) {
                            return (
                                <SaleOrderLockedCard key={k.id} pair={k} SellerDisputableBlockNumber={SellerDisputableBlockNumber} />
                            )
                        } else { return }
                    }
                    )}

                    {Orders?.map((k) => {
                        console.log("fffff", k.seller)
                        if (k.seller != "0x0000000000000000000000000000000000000000" && k.state == 0) {
                            return (
                                <SaleOrderUnlockedCard key={k.id} pair={k} />
                            )
                        } else { return }
                    }
                    )}
                    <div style={{ textAlign: "center" }}>
                        <LinkStyledButton onClick={handleMore} >More</LinkStyledButton>
                    </div>
                </AutoColumn>
            </AutoColumn>


        </div>
    )
}