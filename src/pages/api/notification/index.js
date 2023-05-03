import { handleRequest } from "@/shared/middlewares/request-handler";
import { getServerSession } from "next-auth";
import { createOptions } from "../auth/[...nextauth]";
import UserModel from "@/core/schemas/user.schema";

export default handleRequest({
  GET: async (req, res) => {
    try {
      const session = await getServerSession(req, res, createOptions(req));
      if(!session){
        return res.status(401).json({error:"you must be logged in to perform this action"})
      }
      const { type } = req.query;
      if (type === "message") {
        const { messageNotifications } = await UserModel.findById(
          session.user.id
        ).select({
          messageNotifications: 1,
        });
        return res.status(200).json(messageNotifications);
      }

      else return res.json([])
    } catch (error) {
      return res.status(404).send();
    }
  },
});
