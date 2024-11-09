import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // Extrai o email do corpo da requisição
        const { email } = await request.json();

        if (!email) {
            return new Response(JSON.stringify({ error: "Campo 'email' é obrigatório." }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }



        // Verifica se o usuário existe na tabela User
        const user = await prisma.user.findUnique({
            where: { email },
        });

        console.log(user)

        // Se o usuário não existe, retorna isExisting como false
        if (!user) {
            return new Response(
                JSON.stringify({ isExisting: false }),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Procura o registro no memberInWorkspace usando o userId e workspaceId
        const member = await prisma.memberInWorkspace.findFirst({
            where: { userId: user.id },
        });

        // Se o registro de membro não for encontrado, retorna isExisting como false
        if (!member) {
            return new Response(
                JSON.stringify({ isExisting: false }),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Usa o workspaceId para verificar o estado de isSuspended no workspace
        const workspace = await prisma.workspace.findUnique({
            where: { id: member.workspaceId },
        });

        console.log(workspace)

        // Define isExisting como false se o workspace estiver suspenso, caso contrário, true
        const isExisting = workspace?.isSuspended ? false : true;

        return new Response(
            JSON.stringify({ isExisting }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Erro ao verificar se o usuário existe:", error);
        return new Response(JSON.stringify({ error: "Erro ao verificar usuário." }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
