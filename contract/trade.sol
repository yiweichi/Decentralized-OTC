pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

interface IERC20{

    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}
interface judgeStandard{
    function dispute(uint id,uint8 requirePrecentSubjectToseller,uint8 requirePrecentDepositToseller) external payable returns(bool r);
    function getResult(uint id) external returns (uint8 precentSubjectToseller,uint8 precentDepositToseller,bool resultState);
    function getArbitrationFee(uint id) external returns(uint arbitrationFee);
}
contract trading{
    struct Order{
       uint salenumber;
       uint price;
       string describe;
       string sellerContactInfo;
       string buyerContactInfo;
       uint lockedblocknumber;
       string Currency;
       address payable seller;
       address payable buyer;
       uint8 state;   //0 put 1 lock 2 complete 3 judge
       address arbitration;
       address erc20address;
       uint sellerLiquidataedDamages;
       uint buyerLiquidataedDamages;
    }
    struct Order2{
       uint id;
       uint salenumber;
       uint price;
       string describe;
       string Currency;
       address seller;
       address buyer;
       uint8 state;
       address arbitration;
       address erc20address;
       uint sellerLiquidataedDamages;
       uint buyerLiquidataedDamages;
       uint lockedblocknumber;
       string sellerContactInfo;
       string buyerContactInfo;
    }

    IERC20 public ERC20Basic;
    address private owner;
    address private vipfeeReceiver;
    Order[] public allOrder;
    mapping(address => uint[]) public mySaleOrder;
    mapping(address => uint[]) public myBuyOrder;
    mapping(address => uint8) public vip;
    uint256 tradeLimit;
    uint256 public buyerdisputeblocknum;
    uint256 public sellerdisputeblocknum;
    constructor(uint256 Buyerdisputeblocknum,uint256 Sellerdisputeblocknum,address VipfeeReceiver) public{
        owner=msg.sender;
        buyerdisputeblocknum=Buyerdisputeblocknum;
        sellerdisputeblocknum=Sellerdisputeblocknum;
        vipfeeReceiver=VipfeeReceiver;
    }
    function setvipfeeReceiver(address x) public returns(bool){
        require(msg.sender==owner,"you are not owner");
        vipfeeReceiver = x;
        return true;
    }
    function setbuyerdisputeblocknum(uint256 x) public returns(bool){
        require(msg.sender==owner,"you are not owner");
        buyerdisputeblocknum = x;
        return true;
    }
    function setsellerdisputeblocknum(uint256 x) public returns(bool){
        require(msg.sender==owner,"you are not owner");
        sellerdisputeblocknum = x;
        return true;
    }
    function setVip(address x,uint8 y) public returns(bool){
        require(msg.sender==owner,"you are not owner");
        vip[x] = y;
        return true;
    }
    function adjustTradeLimit(uint256 x) public returns(bool){
        require(msg.sender==owner,"you are not owner");
        tradeLimit = x;
        return true;
    }
    function isContract(address _addr) private view returns (bool iscontract){
        uint32 size;
        assembly {
        size := extcodesize(_addr)
        }
        return (size > 0);
    }

    function putSaleOrder(uint salenumber,uint price,string memory describe,string memory sellerContactInfo,string memory curency,address arbitration,address erc20address,uint buyerLiquidataedDamages) public payable returns(bool){
       require(IERC20(erc20address).balanceOf(msg.sender)>=salenumber,"Out of balance");
       require(IERC20(erc20address).allowance(msg.sender,address(this))>=salenumber,"Out of allowance,approve first please");
       require(isContract(erc20address),'wrong parameter erc20address');
       require(!isContract(msg.sender),'seller can not be a contract');
       bool r=IERC20(erc20address).transferFrom(msg.sender,address(this),salenumber);
       string memory buyerContactInfo;
       Order memory temporder = Order(salenumber,price,describe,sellerContactInfo,buyerContactInfo,0,curency,payable(msg.sender),payable(address(0)),0,arbitration,erc20address,msg.value,buyerLiquidataedDamages);
       allOrder.push(temporder);
       mySaleOrder[msg.sender].push(allOrder.length -1);
       return r;
    }
    
    function cancelSaleOrder(uint index) public returns(bool rr){
        require(allOrder[index].seller==msg.sender,"That is not your order.");
        require(allOrder[index].state==0,"Can not cancel this case right now.");
        allOrder[index].state=2;
        allOrder[index].seller.transfer(allOrder[index].sellerLiquidataedDamages);
        rr=IERC20(allOrder[index].erc20address).transfer(msg.sender,allOrder[index].salenumber);
    }

    function lockSaleOrder(uint index, string memory buyerContactInfo) public payable returns (bool){
        if(allOrder[index].salenumber>=tradeLimit){
            require(vip[msg.sender]>0,"The salenumber of this order is higher than tradeLimit, contact us to be a VIP.");
        }
        require(allOrder[index].state==0,"you can not lock this order.");
        require(allOrder[index].buyerLiquidataedDamages==msg.value,"wrong deposit");
        require(!isContract(msg.sender),'buyer can not be a contract');
        allOrder[index].state=1;
        allOrder[index].buyer=payable(msg.sender);
        allOrder[index].buyerContactInfo=buyerContactInfo;
        allOrder[index].lockedblocknumber=block.number;
        myBuyOrder[msg.sender].push(index);
        return true;
    }

    function comfirmTransaction(uint index) public returns(bool r){
        require((allOrder[index].seller == msg.sender )||(allOrder[index].state == 3),"you are not the seller of this transaction,can not comfirm");
        require((allOrder[index].state == 1 ),"state fault");
        allOrder[index].state=2;
        if(allOrder[index].salenumber>=tradeLimit){
            IERC20(allOrder[index].erc20address).transfer(vipfeeReceiver,(allOrder[index].salenumber*vip[allOrder[index].buyer])/100  );
            IERC20(allOrder[index].erc20address).transfer(allOrder[index].buyer,allOrder[index].salenumber-(allOrder[index].salenumber*vip[allOrder[index].buyer])/100 );
        }else{
            IERC20(allOrder[index].erc20address).transfer(allOrder[index].buyer,allOrder[index].salenumber);
        }
        allOrder[index].seller.transfer(allOrder[index].sellerLiquidataedDamages);
        allOrder[index].buyer.transfer(allOrder[index].buyerLiquidataedDamages);
        return true;
    }
    
    function buyerDispute(uint index,uint8 x,uint8 y) public payable returns(bool){
        require(allOrder[index].buyer == msg.sender,"You are not the buyer");
        require(allOrder[index].state == 1 || allOrder[index].state==3,"This order is not locked or completed");
        require(block.number>=allOrder[index].lockedblocknumber+buyerdisputeblocknum,"please wait more block");
        if(allOrder[index].state == 1){
        allOrder[index].state=3;
        }
        uint fee=judgeStandard(allOrder[index].arbitration).getArbitrationFee(index);
        require(msg.value==fee,"wrong arbitration fee");
        bool r=judgeStandard(allOrder[index].arbitration).dispute{value:fee}(index,x,y);
        require(r,"dispute is refused by judgeContract");
        return true;
    }
    
    function sellerDispute(uint index,uint8 x,uint8 y) public payable returns(bool){
        require(allOrder[index].seller == msg.sender,"You are not the seller");
        require(allOrder[index].state == 1 || allOrder[index].state==3,"This order is not locked or completed");
        require(block.number>=allOrder[index].lockedblocknumber+sellerdisputeblocknum,"please wait more block");
        if(allOrder[index].state == 1){
        allOrder[index].state=3;
        }
        uint fee=judgeStandard(allOrder[index].arbitration).getArbitrationFee(index);
        require(msg.value==fee,"wrong arbitration fee");
        bool r=judgeStandard(allOrder[index].arbitration).dispute{value:fee}(index,x,y);
        require(r,"dispute is refused by judgeContract");
        return true;
    }
    
    function execute(uint index) public returns(bool){
        require(msg.sender==allOrder[index].seller||msg.sender==allOrder[index].buyer,"you are not buyer or seller.");
        require(allOrder[index].state==3,"this case is not judging");
        allOrder[index].state=2;
        uint8 x;
        uint8 y;
        bool z;
        (x,y,z)=judgeStandard(allOrder[index].arbitration).getResult(index);
        require(z&&x<=100&&y<=100,"wrong return from judge");
        if((allOrder[index].salenumber*x)/100!=0){
            IERC20(allOrder[index].erc20address).transfer(allOrder[index].seller,(allOrder[index].salenumber*x)/100);
        }
        if((allOrder[index].salenumber*(100-x))/100!=0){
             if((allOrder[index].salenumber*(100-x))/100>=tradeLimit){
                // waste gas
               IERC20(allOrder[index].erc20address).transfer(vipfeeReceiver,(((allOrder[index].salenumber*(100-x))/100)*vip[allOrder[index].buyer])/100  );
               IERC20(allOrder[index].erc20address).transfer(allOrder[index].buyer,(allOrder[index].salenumber*(100-x))/100 -((allOrder[index].salenumber*(100-x))/100*vip[allOrder[index].buyer])/100 );
            }else{
                IERC20(allOrder[index].erc20address).transfer(allOrder[index].buyer,(allOrder[index].salenumber*(100-x))/100);
            }
        }
        if(((allOrder[index].buyerLiquidataedDamages+allOrder[index].sellerLiquidataedDamages)*y)/100!=0){
        allOrder[index].seller.transfer(((allOrder[index].buyerLiquidataedDamages+allOrder[index].sellerLiquidataedDamages)*y)/100);
        }
        if(((allOrder[index].buyerLiquidataedDamages+allOrder[index].sellerLiquidataedDamages)*(100-y))/100!=0){
        allOrder[index].buyer.transfer(((allOrder[index].buyerLiquidataedDamages+allOrder[index].sellerLiquidataedDamages)*(100-y))/100);
        }
    }
    
        function getMyBuyOrder(uint lineNumber) public view returns(Order2[] memory){
       Order2[] memory s=new Order2[](lineNumber);
       Order memory d;
       uint x;
         for (uint i=0;i<myBuyOrder[msg.sender].length&&x<lineNumber; i++) {
          d = allOrder[myBuyOrder[msg.sender][i]];
          if(d.buyer==msg.sender&&(d.state==1 || d.state==3)&&x<lineNumber){
              s[x].salenumber=d.salenumber;
              s[x].id=myBuyOrder[msg.sender][i];
              s[x].price=d.price;
              s[x].describe=d.describe;
              s[x].Currency=d.Currency;
              s[x].seller=d.seller;
              s[x].buyer=d.buyer;
              s[x].state=d.state;
              s[x].salenumber=d.salenumber;
              s[x].arbitration=d.arbitration;
              s[x].erc20address=d.erc20address;
              s[x].sellerLiquidataedDamages=d.sellerLiquidataedDamages;
              s[x].buyerLiquidataedDamages=d.buyerLiquidataedDamages;
              s[x].lockedblocknumber=d.lockedblocknumber;
              x = x+1;
         }
       }
      return (s);
    }
    
        function getMySaleOrderLocked(uint lineNumber) public view returns(Order2[] memory ){
          Order2[] memory s=new Order2[](lineNumber);
          Order memory d;
          uint x=0;
          for (uint i=0;i<mySaleOrder[msg.sender].length&&x<lineNumber; i++) {
          d = allOrder[mySaleOrder[msg.sender][i]];
          if(d.seller==msg.sender && (d.state==1 || d.state==3) && x<lineNumber){
              s[x].salenumber=d.salenumber;
              s[x].id=mySaleOrder[msg.sender][i];
              s[x].price=d.price;
              s[x].describe=d.describe;
              s[x].Currency=d.Currency;
              s[x].seller=d.seller;
              s[x].buyer=d.buyer;
              s[x].state=d.state;
              s[x].salenumber=d.salenumber;
              s[x].arbitration=d.arbitration;
              s[x].erc20address=d.erc20address;
              s[x].sellerLiquidataedDamages=d.sellerLiquidataedDamages;
              s[x].buyerLiquidataedDamages=d.buyerLiquidataedDamages;
              s[x].lockedblocknumber=d.lockedblocknumber;
              x = x+1;
         }
     }
      return (s);
    }
    function getMySaleOrderUnlocked(uint lineNumber) public view returns(Order2[] memory ){
          Order2[] memory s=new Order2[](lineNumber);
          Order memory d;
          uint x=0;
          for (uint i=0;i<mySaleOrder[msg.sender].length&&x<lineNumber; i++) {
          d = allOrder[mySaleOrder[msg.sender][i]];
          if(d.seller==msg.sender && d.state==0){
              s[x].salenumber=d.salenumber;
              s[x].id=mySaleOrder[msg.sender][i];
              s[x].price=d.price;
              s[x].describe=d.describe;
              s[x].Currency=d.Currency;
              s[x].seller=d.seller;
              s[x].buyer=d.buyer;
              s[x].salenumber=d.salenumber;
              s[x].arbitration=d.arbitration;
              s[x].erc20address=d.erc20address;
              s[x].sellerLiquidataedDamages=d.sellerLiquidataedDamages;
              s[x].buyerLiquidataedDamages=d.buyerLiquidataedDamages;
              x = x+1;
         }
     }
      return (s);
    }
    
    function getAllMyOrder(uint lineNumber) public view returns(Order2[] memory ){
          Order2[] memory s=new Order2[](lineNumber);
          Order memory d;
          uint length = allOrder.length;
          uint x=0;
          for (uint i=0; i<length &&x<lineNumber; i++) {
              d = allOrder[length-i-1];
          if(d.seller==msg.sender || d.buyer==msg.sender){
              if(d.seller==msg.sender){
                  s[x].id=mySaleOrder[msg.sender][i];
              }else{
                  s[x].id=myBuyOrder[msg.sender][i];
              }
              s[x].salenumber=d.salenumber;
              s[x].price=d.price;
              s[x].describe=d.describe;
              s[x].Currency=d.Currency;
              s[x].seller=d.seller;
              s[x].buyer=d.buyer;
              s[x].state=d.state;
              s[x].salenumber=d.salenumber;
              s[x].arbitration=d.arbitration;
              s[x].erc20address=d.erc20address;
              s[x].sellerLiquidataedDamages=d.sellerLiquidataedDamages;
              s[x].buyerLiquidataedDamages=d.buyerLiquidataedDamages;
              x = x+1;
         }
     }
      return (s);
    }
    
    function queryOrder(uint quantity_min,uint quanity_max,uint price_min,uint  price_max,string memory currency,uint linenumber,address erc20address) view public returns(Order2[] memory r){
      uint length = allOrder.length;
      Order2[] memory s=new Order2[](linenumber);
      Order memory d;
      uint x=0;
          for (uint i=0; i<length &&x<linenumber; i++) {
          d = allOrder[length-i-1];
          if(d.erc20address==erc20address && d.state == 0 && d.price<=price_max && d.price>= price_min && d.salenumber>=quantity_min && d.salenumber<=quanity_max &&keccak256(bytes(d.Currency) ) == keccak256(bytes(currency))){
              s[x].salenumber=d.salenumber;
              s[x].id=length-i-1;
              s[x].price=d.price;
              s[x].describe=d.describe;
              s[x].Currency=d.Currency;
              s[x].seller=d.seller;
              s[x].buyer=d.buyer;
              s[x].salenumber=d.salenumber;
              s[x].arbitration=d.arbitration;
              s[x].erc20address=d.erc20address;
              s[x].sellerLiquidataedDamages=d.sellerLiquidataedDamages;
              s[x].buyerLiquidataedDamages=d.buyerLiquidataedDamages;
              x = x+1;
         }
     }
        return (s);
    }

    function allOrderLength() view public returns(uint){
        return allOrder.length;
    }
    
}



