import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

export type NetServerWithIo = NetServer & {
    io: SocketIOServer;
}

export type NextApiResponseServerIO = NextApiResponse & {
    socket: Socket & {
        server: NetServerWithIo;
    };
};
