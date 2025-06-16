import { disconnect } from "mongoose";
import { Server as  SockerIOServer } from "socket.io";
import Message from "../Models/MessageSchema.js";


const setupSocket=(server)=>{

    const io=new SockerIOServer(server,{
        cors:{
            origin:process.env.ORIGIN,
            methods:["GET","POST"],
            credentials:true,
        }
    });

    const userSocketMap=new Map();

    const disconnect=(socket)=>{
        console.log(`Client Disconnect with : ${socket.id}`);
        for(const [userId,socketId] of userSocketMap.entries())
        {
            if(socketId === socket.id)
            {
                userSocketMap.delete(userId);
                break;
            }
        }
    };


    const sendMessage= async(message)=>{
        const senderSocketId=userSocketMap.get(message.sender);
        const receiverSocketId=userSocketMap.get(message.receiver);

        const createMessage=await Message.create(message);

        const messageData=await Message.findById(createMessage._id)
        .populate("sender", "id email userName  ")
        .populate("receiver", "id email userName");

        if(receiverSocketId)
        {
            io.to(receiverSocketId).emit("recieveMessage",messageData);
        }

        if(senderSocketId)
        {
            io.to(senderSocketId).emit("recieveMessage",messageData);
        }
    };

    io.on("connection",(socket)=>{
        const userId=socket.handshake.query.userId;
     
        if(userId)
        {
            userSocketMap.set(userId,socket.id);
            console.log(`User Connected: ${userId} with socket Id : ${socket.id}`);
        }
        else{
            console.log("User Id Not provided during connection....");
        }
       
       socket.on('sendMessage',sendMessage);
       socket.on('disconnect',()=>disconnect(socket));

    })


};


export default setupSocket;