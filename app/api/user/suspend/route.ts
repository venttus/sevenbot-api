/* eslint-disable */
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const dynamic = 'force-static';

export async function PUT(request: NextRequest) {
  try {
    // Extrai o status de suspensão e o ID do corpo da requisição
    const { isSuspended, id } = await request.json();
    console.log("isSuspended", isSuspended);

    // Verifica se o ID foi fornecido
    if (!id) {
      return new Response(JSON.stringify({ error: "Parâmetro 'id' é obrigatório." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verifica se o campo isSuspended foi fornecido e é booleano
    if (typeof isSuspended !== "boolean") {
      return new Response(JSON.stringify({ error: "Campo 'isSuspended' deve ser booleano." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Tenta atualizar o campo isSuspended do workspace com o ID especificado
    const updatedWorkspace = await prisma.workspace.update({
      where: { id },
      data: { isSuspended },
    });

    // Retorna os dados atualizados como resposta
    return new Response(
      JSON.stringify({
        message: `Workspace ${isSuspended ? "suspenso" : "reativado"} com sucesso.`,
        workspace: updatedWorkspace,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error: unknown) {
    // Tratamento específico para o erro "Registro não encontrado" no Prisma
    if (error instanceof Error) {
      const prismaError = error as { code?: string }; // Definindo um tipo para o erro
      if (prismaError.code === 'P2025') {
        console.error("ID não encontrado:", error);
        return new Response(JSON.stringify({ error: "Workspace com o ID especificado não encontrado." }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    console.error("Erro ao atualizar o status de suspensão:", error);
    return new Response(JSON.stringify({ error: "Erro ao atualizar o status de suspensão do workspace." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
