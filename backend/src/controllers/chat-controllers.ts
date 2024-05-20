import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";

import axios from "axios";
export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;

  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user)
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });
    
    user.chats.push({ content: message, role: "user" });
    
    const data = {
      conversation_id: "123", //replace with a real conversation_id
      bot_id: "7340922429356933138", //replace with a real bot_id
      user: "29032201862555", //replace with a real user_id
      query: message, //sending the new user message
      stream: false,
    };
    
    const response = await axios.post(
      "https://api.coze.com/open_api/v2/chat",
      data,
      {
        headers: {
          Authorization: "Bearer pat_evnOFaze4lP1fCXCU68AsTlaHkhXP0orOVWQVRG7uU4JLXH2GRdnKGeM7eT6KB39", //replace with a real token
          "Content-Type": "application/json",
          Accept: "*/*",
          Host: "api.coze.com",
          Connection: "keep-alive",
        },
      }
    );
    
    user.chats.push({ content: response.data.messages[0].content, role: "bot" }); // assuming that the bot's reply is located under response_text    
    await user.save();

    return res.status(200).json({ chats: user.chats });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const sendChatsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    return res.status(200).json({ message: "OK", chats: user.chats });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

export const deleteChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    //@ts-ignore
    user.chats = [];
    await user.save();
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};
