import { handleRequest } from "@/lib/middlewares/request-handler";
import { getServerSession } from "next-auth";
import { createOptions } from "../auth/[...nextauth]";
import { getAllConversationsByUser } from "@/lib/services/conversation/get-conversation.server";

export default handleRequest({
  async POST(req, res) {
      const { receiverID } = req.body;
      const { pageIndex,pageSize } = req.query;
      const session = await getServerSession(req,res,createOptions(req))
      const messages = await getAllConversationsByUser({
        userId:session.user?.id,
        receiverID,
        pageIndex:+pageIndex,
        pageSize:+pageSize
      });
      return res.status(200).json({success:true,error:null,data:messages});
  },
});
