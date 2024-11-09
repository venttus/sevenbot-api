import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const {
        version,
        id,
        name,
        variables,
        groups,
        events,
        edges,
        theme,
        selectedThemeTemplateId,
        settings,
        createdAt,
        updatedAt,
        icon,
        folderId,
        customDomain,
        resultsTablePreferences,
        isArchived,
        isClosed,
        whatsAppCredentialsId,
        riskLevel,
        workspaceId
    } = await request.json();

    // Verifique se os campos obrigatórios estão presentes
    if (!id || !name || !workspaceId) {
        return NextResponse.json(
            { error: "Campos 'id', 'name' e 'workspaceId' são obrigatórios." },
            { status: 400 }
        );
    }

    // Verifica se o usuário existe na tabela User
    const user = await prisma.user.findUnique({
        where: { email: workspaceId },
    });

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

    try {
        // Cria o registro na tabela typebot
        await prisma.typebot.create({
            data: {
                id,
                version,
                name,
                variables,
                groups,
                events,
                edges,
                theme,
                selectedThemeTemplateId,
                settings,
                createdAt: createdAt ? new Date(createdAt) : new Date(),
                updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
                icon,
                folderId,
                customDomain,
                resultsTablePreferences,
                isArchived,
                isClosed,
                whatsAppCredentialsId,
                riskLevel,
                workspaceId: member.workspaceId
            },
        });

        return NextResponse.json({ message: 'OK' }, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar sevenBot:", error);
        return NextResponse.json(
            { error: "Erro ao criar o registro na tabela sevenBot." },
            { status: 500 }
        );
    }
}
