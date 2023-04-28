import UserModel from "@/core/schemas/user.schema";

export async function createMessageNotification({userId,notificationSenderId}){
 try{
     await UserModel.updateOne({_id:userId},{$push:{messageNotifications:notificationSenderId}})            
     return true
  }catch(err){
     return false 
  }
}
