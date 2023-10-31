import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

interface Props {
  params: {
    id: string;
  };
}

export async function DELETE(req: Request, { params }: Props) {
  try {
    const session = await getAuthSession();

    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const user = await db.user.findFirst({
      where: {
        email: session.user.email as string,
      },
    });

    if (!user) return new Response("User not found!", { status: 401 });

    await db.word.delete({
      where: {
        id: params.id,
      },
    });

    return new Response("Successfully removed word from the database.", {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response("Something went wrong while removing word from list", {
      status: 500,
    });
  }
}
