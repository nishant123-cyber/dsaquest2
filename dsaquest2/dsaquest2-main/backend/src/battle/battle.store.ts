import { BattleRoom } from './battle.types';

const rooms = new Map<string, BattleRoom>();

export function getRoom(id: string): BattleRoom | undefined {
  return rooms.get(id);
}

export function setRoom(id: string, room: BattleRoom): void {
  rooms.set(id, room);
}

export function deleteRoom(id: string): void {
  rooms.delete(id);
}

export function getRoomBySocketId(socketId: string): BattleRoom | undefined {
  for (const room of rooms.values()) {
    if (room.playerA.socketId === socketId || room.playerB?.socketId === socketId) {
      return room;
    }
  }
  return undefined;
}

export function getAllRooms(): BattleRoom[] {
  return Array.from(rooms.values());
}
