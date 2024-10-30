export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col items-center text-center gap-8">
        <h1 className="text-2xl font-bold">Bem-vindo à API do SevenBot</h1>
        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
          A API do SevenBot permite a integração com diversas funcionalidades da
          plataforma de maneira rápida e eficiente.
        </p>
        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
          Para mais informações, acesse a documentação oficial da API no link
          abaixo:
        </p>
        <a
          href="https://typebot.io/api"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        >
          Visitar a Documentação da API
        </a>
      </main>
    </div>
  );
}
