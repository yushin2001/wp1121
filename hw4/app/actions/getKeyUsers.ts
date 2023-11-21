import prisma from "@/app/libs/prismadb";
import getSession from "./getSession";

const getKeyUsers = async (key: string) => {
  const session = await getSession();

  if (!session?.user?.name) {
    return [];
  }

  try {
    const user = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      where: {
        name: key,
        NOT: {
          name: session.user.name
        }
      }
    });

    return user;
  } catch (error) {
    return [];
  }
};

export default getKeyUsers;