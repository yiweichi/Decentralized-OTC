pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;
interface judgeStandard{
    function dispute(uint id,uint8 requirePrecentSubjectToseller,uint8 requirePrecentDepositToseller) external payable returns(bool r);
    function getResult(uint id) external returns (uint8 precentSubjectToseller,uint8 precentDepositToseller,bool resultState);
    function getArbitrationFee(uint id) external returns(uint arbitrationFee);
}
contract judge{
    struct Case{
        uint8 precentSubjectToseller;
        uint8 precentDepositToseller;
        bool resultState;
        bool isDispute;
    }
     mapping(uint=>Case) public allCase;
     uint[] public judgingCase;
     address payable private owner;
     mapping(address => bool) public judger;
     string public constant url = "https://wwww.fff.com";
     string public constant name = "judge";
     constructor() public{
        owner=payable(msg.sender);
    }
     function toJudge(uint id,uint8 precentSubjectToseller,uint8 precentDepositToseller) public returns(bool){
         require(msg.sender==owner||judger[msg.sender],"you can not judge");
         allCase[id].precentDepositToseller=precentDepositToseller;
         allCase[id].precentSubjectToseller=precentSubjectToseller;
         allCase[id].resultState=true;
     }
     
     function dispute(uint id,uint8 requirePrecentSubjectToseller,uint8 requirePrecentDepositToseller) public  payable returns(bool r){
         require(msg.value==2 ether,"wrong msgvalue");
         require(msg.sender==0x1C5448A33eB289EFca71a9215f680981A062133d,"wrong smart contract address");//==contract address
         require(allCase[id].isDispute==false,"this case is accepted,you can not dispute it again.");
         judgingCase.push(id);
         allCase[id].isDispute=true;
         return true;
     }
     function getResult(uint id) public view returns (uint8 precentSubjectToseller,uint8 precentDepositToseller,bool resultState){
         precentSubjectToseller=allCase[id].precentSubjectToseller;
         precentDepositToseller=allCase[id].precentDepositToseller;
         resultState=allCase[id].resultState;
     }
     
     function getArbitrationFee(uint id) public view returns(uint arbitrationFee){
         arbitrationFee= 2 ether;
     }
     function getWaitingForJudgingCase(uint linenumber) public view returns(uint[] memory r){
         r=new uint[](linenumber);
         uint x=0;
         for(uint i=0;i<judgingCase.length&&x<linenumber;i++){
             if(allCase[judgingCase[i]].resultState==false){
                 r[x]=judgingCase[i];
                 x=x+1;
             }
         }
     }
     function withdraw(uint num) public returns(bool){
         require(msg.sender==owner,"you are not owner");
         owner.transfer(num);
     }
         
    
    function manageJudger(address judgerAddr,bool state) public returns(bool){
        require(msg.sender==owner,"you can not manage judger");
        judger[judgerAddr]=state;
        return true;
    }
}