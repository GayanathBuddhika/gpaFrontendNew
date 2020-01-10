
export class ClaimConverter{

     rewardTitile:string;
     claimStartDate:string;
     remainClaims: number;
     message:string;
     noOfClaims:number;
     claimLimits:number;
     alreadyClaimed:number;
     rewardId:string;
     totalClaim:number;

     constructor(rewardTitile:string,
                claimStartDate:string,
                remainClaims: number, 
                message:string,
                noOfClaims:number,
                claimLimits:number,
                alreadyClaimed:number,
                rewardId:string,  
                totalClaim:number){
              this.rewardTitile =rewardTitile;
              this.claimStartDate =claimStartDate;
              this.remainClaims =remainClaims;
              this.message =message;
              this.noOfClaims = noOfClaims;
              this.claimLimits = claimLimits;
              this.alreadyClaimed = alreadyClaimed;
              this.rewardId =rewardId;
              this.totalClaim =totalClaim;
          }
}