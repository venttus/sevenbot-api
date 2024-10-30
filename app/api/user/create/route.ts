import { prisma } from "@/lib/prisma";

export const dynamic = 'force-static';

export async function POST(request: Request) {
  // Extrai os dados do corpo da requisição
  const { name, email } = await request.json();

  // Verifique se os dados obrigatórios foram fornecidos
  if (!name || !email) {
    return new Response(JSON.stringify({ error: "Campos 'name', e 'email' são obrigatórios." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Cria o usuário na tabela User
    const user = await prisma.user.create({
      data: {
        id: email,
        name,
        email,
        onboardingCategories: [],
      },
    });

    // Cria o workspace na tabela Workspace
    const workspace = await prisma.workspace.create({
      data: {
        id: email,
        name: `${name} Workspace`,
        icon: null,
        plan: "UNLIMITED",
        stripeId: null,
        additionalChatsIndex: 0,
        additionalStorageIndex: 0,
        chatsLimitFirstEmailSentAt: null,
        chatsLimitSecondEmailSentAt: null,
        storageLimitFirstEmailSentAt: null,
        storageLimitSecondEmailSentAt: null,
        customChatsLimit: null,
        customSeatsLimit: null,
        customStorageLimit: null,
        updatedAt: new Date(), // Define a data de atualização como a data atual
        isQuarantined: false,
        isSuspended: false,
        isPastDue: false,
        isVerified: null,
      },
    });

    // Cria o relacionamento na tabela MemberInWorkspace
    const memberInWorkspace = await prisma.memberInWorkspace.create({
      data: {
        userId: email,
        workspaceId: email,
        role: "ADMIN",
      },
    });

    // Retorna os dados criados como resposta
    return new Response(
      JSON.stringify({
        user,
        workspace,
        memberInWorkspace,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Erro ao criar dados:", error);
    return new Response(JSON.stringify({ error: "Erro ao criar dados." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
