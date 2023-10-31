import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { AddWordToListValidator } from "@/lib/validators/add-word-to-list";
import { Session, User } from "next-auth";
import { ZodError } from "zod";

type NewSession = Session & {
  user: User & {
    id?: string;
  };
};

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const user = await db.user.findFirst({
      where: {
        email: session.user.email as string,
      },
    });

    if (!user) return new Response("User not found!", { status: 401 });

    const body = await req.json();
    const { customDescription, word, found } =
      AddWordToListValidator.parse(body);

    await db.word.create({
      data: {
        description: customDescription,
        found,
        word,
        userId: user.id,
      },
    });

    return new Response("Successfully added word to database.", {
      status: 200,
    });
  } catch (err) {
    if (err instanceof ZodError)
      return new Response(JSON.stringify(err), { status: 400 });
    console.error(err);
    return new Response("Something went wrong while adding word to list", {
      status: 500,
    });
  }
}

export async function GET(req: Request) {
  try {
    const session = (await getAuthSession()) as NewSession;

    if (!session.user) return new Response("Unauthorized", { status: 401 });

    const user = await db.user.findFirst({
      where: {
        email: session.user.email as string,
      },
    });

    if (!user) return new Response("User not found!", { status: 401 });

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const per_page = Number(searchParams.get("per_page")) || 200; // limit

    let limit = per_page;

    if (limit > 200) limit = 200;

    const skip = Math.max((page - 1) * limit, 0);

    const totalWords = await db.word.count({
      where: {
        userId: session.user.id,
      },
    });

    const totalPages = Math.ceil(totalWords / limit);

    const words = await db.word.findMany({
      skip,
      take: limit,
      where: {
        userId: user.id,
      },
      orderBy: {
        id: "desc",
      },
    });

    return new Response(
      JSON.stringify({
        words,
        totalWords,
        totalPages,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    if (err instanceof ZodError)
      return new Response(JSON.stringify(err), { status: 400 });
    console.error(err);
    return new Response("Something went wrong while adding word to list", {
      status: 500,
    });
  }
}
