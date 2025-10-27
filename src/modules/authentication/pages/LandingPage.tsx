import { Button } from "#/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Youtube, Instagram, Linkedin } from "lucide-react";


import LogoImg from "#/modules/authentication/assets/1 -Logo.png";
import PhonesImg from "#/modules/authentication/assets/2 - Celulares.png";
import BackpackImg from "#/modules/authentication/assets/3 - Mochila.png";
import WaveImg from "#/modules/authentication/assets/4 - Ondas.png";


import LearnImg from "#/modules/authentication/assets/5 - Aprender Brincando.png";
import ExploreImg from "#/modules/authentication/assets/6 - Explore o Brasil.png";
import ProgressImg from "#/modules/authentication/assets/7 - Progresso Visivel.png";
import WhyImg from "#/modules/authentication/assets/8 - Por que aprender Geografia com o Mochileiro.png";


import SunImg from "#/modules/authentication/assets/9 - Sol.png";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#9db668] to-[#7a9456]">
      
      <header className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <img src={LogoImg} alt="Mochileiro - logo" className="h-10 w-10 rounded-full" />
          <span className="text-xl font-bold text-white">mochileiro</span>
        </div>
      <Button
        onClick={() => navigate("/login")}
        className="rounded-full bg-[#3d4a2c] px-6 text-white hover:bg-[#2d3a1c]"
      >
          Entrar
        </Button>
      </header>

      
      <main className="flex flex-1 items-center">
        <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
          
          <div className="relative flex flex-col gap-6">
            <h1 className="text-balance text-5xl font-extrabold leading-tight text-white lg:text-6xl">
              Pegue sua
              <br />
              mochila
              <br />
              e vamos
              <br />
              explorar!
            </h1>

            
            <img
              src={BackpackImg}
              alt="Mochila"
              className="
                pointer-events-none
                absolute left-[calc(30%+12px)]
                w-[60%] h-[90%]
                hidden h-24 w-auto lg:block
              "
            />


            <Button className="w-fit rounded-full bg-[#5a6d47] px-8 py-4 text-lg text-white hover:bg-[#4a5d37]">
              Vamos lá!
            </Button>
          </div>

          
          <div className="relative flex min-h-[420px] items-end justify-end">
            
            <img
              src={WaveImg}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 right-0 w-[90%] max-w-[720px] select-none"
            />
            
            <img
              src={PhonesImg}
              alt="Mockups com o jaguar e telas do app"
              className="z-10 mr-[40px] mb-[90px] w-[540px] max-w-full"
            />
          </div>
        </div>
      </main>

      
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="mb-20 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="flex justify-center">
              <img
                src={LearnImg}
                alt="Aprenda brincando"
                className="h-auto w-full max-w-[420px] object-contain"
              />
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="text-balance text-4xl font-bold text-[#9db668] lg:text-5xl">
                Aprenda
                <br />
                Brincando
              </h2>
              <p className="text-pretty text-lg leading-relaxed text-gray-600">
                Descubra a Geografia de forma divertida, explorando mapas,
                <br />
                quizzes e desafios que tornam o aprendizado leve e envolvente.
              </p>
            </div>
          </div>

          
          <div className="grid grid-cols-1 items-center ml-[150px] gap-12 lg:grid-cols-2">
            <div className="flex flex-col gap-4 lg:order-1">
              <h2 className="text-balance text-4xl font-bold text-[#9db668] lg:text-5xl">
                Explore o
                <br />
                Brasil
              </h2>
              <p className="text-pretty text-lg leading-relaxed text-gray-600">
                Cada estado é um novo destino: conheça culturas, rios, climas,
                <br />
                biomas e curiosidades enquanto avança na sua jornada.
              </p>
            </div>
            <div className="flex justify-center lg:order-2">
              <img
                src={ExploreImg}
                alt="Explore o Brasil"
                className="h-auto w-full max-w-[420px] object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      
      <section className="relative overflow-hidden bg-gradient-to-b from-[#9db668] to-[#7a9456] py-20">
        

        <img
          src={SunImg}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 z-0 w-[800px] max-w-none select-none opacity-90"
        />

        <div className="container relative z-10 mx-auto px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            
            <div className="relative flex justify-center">

              <img
                src={WhyImg}
                alt="Por que aprender Geografia com o Mochileiro"
                className="relative z-10 h-auto w-[400px] max-w-[520px] mr-[100px] object-contain"
              />
            </div>

            
            <div className="flex flex-col gap-6">
              <h2 className="text-balance text-center text-3xl font-bold text-white lg:text-left lg:text-4xl">
                Por que aprender Geografia
                <br />
                com o Mochileiro?
              </h2>

              
              <div className="flex flex-col gap-4">
                {[
                  {
                    title: "Conteúdo feito para você",
                    desc:
                      "Atividades interativas que tornam a Geografia mais próxima e divertida.",
                  },
                  {
                    title: "Confiança para explorar",
                    desc:
                      "Descubra estados, rios e culturas com desafios que treinam o aprendizado.",
                  },
                  {
                    title: "Acompanhe sua jornada",
                    desc:
                      "Veja seu progresso em cada fase desbloqueada e melhore suas conquistas.",
                  },
                  {
                    title: "Explore no seu ritmo",
                    desc:
                      "Estude Geografia de forma flexível, no tempo que for melhor para você.",
                  },
                ].map(({ title, desc }) => (
                  <div
                    key={title}
                    className="
        group rounded-3xl bg-white p-6
        transition-colors duration-200
        hover:bg-[#5a6d47] focus-visible:bg-[#5a6d47] outline-none
      "
                    tabIndex={0}
                  >
                    <h3
                      className="
          mb-2 text-center text-xl font-bold
          text-[#5a6d47] transition-colors duration-200
          group-hover:text-white group-focus-visible:text-white
        "
                    >
                      {title}
                    </h3>
                    <p
                      className="
          text-center text-sm leading-relaxed
          text-[#5a6d47]/90 transition-colors duration-200
          group-hover:text-white/90 group-focus-visible:text-white/90
        "
                    >
                      {desc}
                    </p>
                  </div>
                ))}
              </div>


              <div className="flex justify-center">
                <Button className="rounded-full bg-[#3d4a2c] px-8 py-6 text-lg text-white hover:bg-[#2d3a1c]">
                  Pegar Mochila
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>


      
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="flex justify-center">
              <img
                src={ProgressImg}
                alt="Progresso visível"
                className="h-auto w-full max-w-[420px] object-contain"
              />
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-balance text-4xl font-bold text-[#9db668] lg:text-5xl">
                Progresso
                <br />
                visível
              </h2>
              <p className="text-pretty text-lg leading-relaxed text-gray-600">
                Acompanhe sua evolução como mochileiro do conhecimento,
                <br />
                desbloqueando fases e recebendo recompensas a cada conquista.
              </p>
            </div>
          </div>
        </div>
      </section>

      
      <footer className="bg-[#5a6d47] py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white/80">Aprenda Geografia Online</h3>
              <ul className="flex flex-col gap-2 text-sm text-white">
                <li>Aprenda região norte</li>
                <li>Aprenda região nordeste</li>
                <li>Aprenda região centro-oeste</li>
                <li>Aprenda região sudeste</li>
                <li>Aprenda região sul</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold text-white/80">Descubra o Mochileiro</h3>
              <ul className="flex flex-col gap-2 text-sm text-white">
                <li>Como o Mochileiro Funciona</li>
                <li>Quem somos nós</li>
                <li>Fale conosco</li>
              </ul>
            </div>

            <div className="flex flex-col items-start gap-4 md:items-end">
              <div className="flex flex-col gap-3">
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#5a6d47] transition-colors hover:bg-gray-100"
                >
                  <Youtube className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#5a6d47] transition-colors hover:bg-gray-100"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/thinkted_lab/"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#5a6d47] transition-colors hover:bg-gray-100"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#5a6d47] transition-colors hover:bg-gray-100"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>

              <img
                src={LogoImg}
                alt="Mascote"
                className="mt-4 h-20 w-20 rounded-full bg-[#f5e6d3] object-contain p-2"
              />
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 border-t border-white/20 pt-8 text-sm text-white md:flex-row">
            <span>©2025 Mochileiro</span>
            <div className="flex gap-4">
              <a href="#" className="hover:underline">
                Termos
              </a>
              <a href="#" className="hover:underline">
                Privacidade
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
