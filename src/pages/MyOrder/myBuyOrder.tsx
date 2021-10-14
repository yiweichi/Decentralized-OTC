import React from 'react'
import { AutoColumn } from '../../components/Column';
import BuyOrderCard from './buyOrderCard';
import ExecuteCard from './executeCard';
import { useGetBuyerDisputeBlockNumberCallBack, useGetMyBuyOrderDataCallBack } from '../../hooks/useApproveCallback'
import { LinkStyledButton } from '../../components/DescribeInputPanel';
import { useConditionOfOrders } from '../../state/conditionOfOrders/hooks';
import Loader from '../../components/Loader';
import { Card } from 'rebass';

export default function MyBuyOrder() {

    let orders = useGetMyBuyOrderDataCallBack()
    let BuyerDisputableBlockNumber = useGetBuyerDisputeBlockNumberCallBack()
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
            mySellOrderLineNumber: conditionOfOrders.mySellOrderLineNumber,
            myBuyOrderLineNumber: conditionOfOrders.myBuyOrderLineNumber + 100
        }
        setconditionOfOrders(a);
    }
    return (
        <div>
            <AutoColumn gap="lg" justify="center">
                <AutoColumn gap="6px" style={{ width: '100%' }}>
                    {orders ? orders.map((k) => {
                        if (k.seller != "0x0000000000000000000000000000000000000000" && k.state == 3) {
                            return (
                                <ExecuteCard key={k.id} pair={k} isSeller={false} />
                            )
                        } else { return }
                    }
                    ) :
                        <Card >
                            <AutoColumn gap="12px">
                                <div style={{ textAlign: "center" }}>
                                    <Loader></Loader>
                                </div>
                            </AutoColumn>
                        </Card >}


                    {orders?.map((k) => {
                        console.log("fffff", k.seller)
                        if (k.seller != "0x0000000000000000000000000000000000000000" && k.state == 1) {
                            return (
                                <BuyOrderCard key={k.id} pair={k} BuyerDisputableBlockNumber={BuyerDisputableBlockNumber}
                                />
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