import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
  messageId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { messageId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return NextResponse.json(null);
    }
    const existingMessage = await prisma.message.findUnique({
      where: {
        id: messageId
      }
    });

    if (!existingMessage) {
      return new NextResponse('Invalid', { status: 400 });
    }

    const deletedMessage = await prisma.message.delete({
      where: {
        id: messageId
      },
    });

    existingMessage.sender.forEach((user: {name: string}) => {
      if (user.name) {
        pusherServer.trigger(user.name, 'message:remove', existingMessage);
      }
    });

    return NextResponse.json(deletedMessage)
  } catch (error) {
    return NextResponse.json(null);
  }
}