import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  // Extrai os dados do corpo da requisição
  const { url, email } = await request.json();

  // Verifica se os dados obrigatórios foram fornecidos
  if (!url || !email) {
    return new Response(JSON.stringify({ error: "'url' e 'email' são obrigatórios." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Configura o transportador de e-mail com Nodemailer
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false, // true para 465, false para outras portas
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // HTML do e-mail
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Bem-vindo ao SevenBot</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          padding: 20px;
          background-color: #4caf50;
          text-align: center;
          color: #ffffff;
        }
        .content {
          padding: 20px;
          text-align: center;
        }
        .content h1 {
          font-size: 24px;
          color: #333333;
          margin: 0;
        }
        .content p {
          font-size: 16px;
          color: #666666;
          line-height: 1.5;
          margin: 20px 0;
        }
        .button {
          display: inline-block;
          background-color: #4caf50;
          color: #ffffff;
          font-size: 16px;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 10px;
        }
        .footer {
          padding: 20px;
          text-align: center;
          font-size: 14px;
          color: #666666;
        }
        .footer a {
          color: #4caf50;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Bem-vindo ao SevenBot!</h1>
        </div>
        <div class="content">
          <h1>Seu Acesso Seguro</h1>
          <p>Agradecemos por se juntar a nós! Aqui está seu link de acesso seguro. Clique no botão abaixo para entrar:</p>
          <a href="${url}" class="button">Clique aqui para acessar</a>
          <p>Se você não solicitou este link, ignore este e-mail. Este e-mail foi enviado para <strong>${email}</strong>.</p>
        </div>
        <div class="footer">
          <p>Atenciosamente,<br />Equipe SevenBot</p>
          <p>Você está recebendo este e-mail porque se inscreveu no SevenBot. Para mais informações, visite nosso <a href="https://www.sevenbot.com/termos-de-servico">Termos de Serviço</a> e nossa <a href="https://www.sevenbot.com/politica-de-privacidade">Política de Privacidade</a>.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    // Envia o e-mail
    await transporter.sendMail({
      from: process.env.SMTP_FROM, // remetente
      to: email,                   // destinatário
      subject: 'Link para acesso',
      html: htmlContent, // corpo do e-mail em HTML
    });

    return new Response(
      JSON.stringify({ message: 'E-mail enviado com sucesso!' }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return new Response(JSON.stringify({ error: 'Erro ao enviar e-mail.' }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
