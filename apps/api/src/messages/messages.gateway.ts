import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';

interface AuthenticatedSocket extends Socket {
  data: { userId: string };
}

@WebSocketGateway({ cors: { origin: '*' } })
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly messagesService: MessagesService,
    private readonly jwtService: JwtService,
  ) {}

  // Vérifie le JWT envoyé dans le handshake lors de la connexion
  handleConnection(client: AuthenticatedSocket): void {
    try {
      const token = (client.handshake.auth.token as string)?.replace(
        'Bearer ',
        '',
      );

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify<{ sub: string; email: string }>(
        token,
        { secret: process.env.JWT_SECRET },
      );

      // On stocke le userId sur le socket
      client.data.userId = payload.sub;
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(): void {
    // Rien de spécial à faire
  }

  // Le client rejoint la room d'une session de mentorat
  @SubscribeMessage('join-session')
  handleJoinSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string },
  ): void {
    void client.join(`session:${data.sessionId}`);
    client.emit('joined', { sessionId: data.sessionId });
  }

  // Envoie un message : sauvegarde en DB puis broadcast à la room
  @SubscribeMessage('send-message')
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { sessionId: string; content: string },
  ): Promise<void> {
    const userId = client.data.userId;

    const message = await this.messagesService.send(data.sessionId, userId, {
      content: data.content,
    });

    // Broadcast à toute la room
    this.server.to(`session:${data.sessionId}`).emit('new-message', message);
  }
}
