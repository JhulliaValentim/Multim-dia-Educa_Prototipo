import React, { useMemo, useState } from "react";
import { BookOpen, Music2, Mic2, Image, Video, Sparkles, Brain, Menu, X, Play, Pause, Volume2, Trophy, ChevronRight, RotateCcw, CheckCircle2, Headphones, AudioLines } from "lucide-react";
import { Midi } from "@tonejs/midi";
import * as Tone from "tone";

const questions = [
    { q: "O que é áudio digital?", o: ["Som convertido em dados digitais", "Som produzido apenas por instrumentos acústicos", "Uma imagem em movimento"], a: 0, e: "Áudio digital representa o som por meio de amostras numéricas." },
    { q: "Qual característica descreve a frequência do som?", o: ["A duração do arquivo", "A quantidade de ciclos por segundo, medida em hertz", "O tamanho da tela"], a: 1, e: "A frequência, medida em hertz (Hz), está relacionada à percepção de grave e agudo." },
    { q: "O que é síntese sonora?", o: ["A edição de fotografias", "A criação de sons por processos eletrônicos ou computacionais", "A compressão de vídeos"], a: 1, e: "Síntese sonora é a produção de sons por circuitos ou algoritmos." },
    { q: "O que significa MIDI?", o: ["Musical Instrument Digital Interface", "Media Image Data Internet", "Multiple Input Digital Information"], a: 0, e: "MIDI é um padrão de comunicação de informações musicais entre dispositivos e softwares." },
    { q: "Um arquivo MIDI normalmente armazena:", o: ["O áudio gravado em forma de onda", "Instruções musicais como notas, duração e intensidade", "Fotografias da apresentação"], a: 1, e: "MIDI registra eventos musicais, não uma gravação direta do som." },
    { q: "Qual é a função de um sintetizador?", o: ["Criar ou modificar sons eletronicamente", "Aumentar a resolução de imagens", "Editar textos"], a: 0, e: "Sintetizadores produzem sons a partir de osciladores, amostras e outros processos." },
    { q: "O que é uma amostra (sample) de áudio?", o: ["Uma medição do sinal sonoro em um instante", "Uma cena de vídeo", "Uma nota escrita em partitura"], a: 0, e: "A digitalização mede a amplitude do sinal em intervalos regulares." },
    { q: "A taxa de amostragem indica:", o: ["Quantas amostras são registradas por segundo", "O número de caixas de som", "A duração total da música"], a: 0, e: "Ela é expressa em hertz; por exemplo, 44.100 amostras por segundo." },
    { q: "Qual unidade costuma representar a intensidade digital do áudio?", o: ["Pixel", "Decibel (dB)", "Metro"], a: 1, e: "O decibel é usado para expressar níveis de intensidade sonora." },
    { q: "A voz sintetizada é:", o: ["Uma voz gerada artificialmente por software ou hardware", "Uma voz capturada apenas por câmera", "Um formato de imagem"], a: 0, e: "Sistemas de síntese de voz geram fala artificial a partir de texto ou parâmetros." },
    { q: "Qual recurso do navegador pode ler texto em voz alta?", o: ["Canvas API", "SpeechSynthesis API", "Geolocation API"], a: 1, e: "A Web Speech API oferece SpeechSynthesis em navegadores compatíveis." },
    { q: "Qual é uma aplicação educacional da voz sintetizada?", o: ["Narrar conteúdos e apoiar acessibilidade", "Aumentar a velocidade da internet", "Substituir todos os textos por imagens"], a: 0, e: "A narração pode apoiar a aprendizagem e a acessibilidade." },
    { q: "Qual formato é apropriado para guardar áudio digital?", o: ["WAV", "SVG", "HTML"], a: 0, e: "WAV é um contêiner comum para áudio digital, frequentemente sem compressão." },
    { q: "O MIDI é igual a um arquivo MP3?", o: ["Sim, ambos guardam exatamente o mesmo tipo de áudio", "Não; MIDI guarda eventos musicais e MP3 guarda áudio codificado", "Sim, MIDI é sempre um vídeo"], a: 1, e: "MIDI descreve eventos; MP3 contém áudio comprimido." },
    { q: "Qual cuidado é importante ao usar áudio em um material multimídia?", o: ["Ignorar o volume", "Oferecer controles de reprodução e considerar direitos autorais", "Reproduzir sons automaticamente sem opção de parar"], a: 1, e: "Controles, volume adequado e respeito aos direitos autorais melhoram a experiência." }
];

const sections = [
    { id: "inicio", label: "Início", icon: BookOpen },
    { id: "conceitos", label: "Conceitos", icon: Music2 },
    { id: "audio", label: "Áudio digital", icon: AudioLines },
    { id: "midi", label: "Música MIDI", icon: Music2 },
    { id: "voz", label: "Voz sintetizada", icon: Mic2 },
    { id: "midias", label: "Galeria multimídia", icon: Image },
    { id: "quiz", label: "Quiz", icon: Brain }
];

function App() {
    const [page, setPage] = useState("inicio"), [mobile, setMobile] = useState(false);
    const [quiz, setQuiz] = useState(null), [answers, setAnswers] = useState({}), [done, setDone] = useState(false);
    const [playing, setPlaying] = useState(false), [speech, setSpeech] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);

    const startQuiz = () => { const chosen = [...questions].sort(() => Math.random() - .5).slice(0, 5); setQuiz(chosen); setAnswers({}); setDone(false); setPage("quiz"); };
    const score = quiz ? quiz.reduce((n, q, i) => n + (answers[i] === q.a ? 1 : 0), 0) : 0;
    const speak = (text) => { if (!("speechSynthesis" in window)) { alert("Seu navegador não oferece síntese de voz."); return; } window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = "pt-BR"; u.rate = 0.92; u.onstart = () => setSpeech(true); u.onend = () => setSpeech(false); window.speechSynthesis.speak(u); };
    const playMidi = async () => { try { await Tone.start(); const bytes = await fetch("/assets/escala-original.mid").then(r => r.arrayBuffer()); const midi = new Midi(bytes); const synth = new Tone.PolySynth(Tone.Synth).toDestination(); midi.tracks.forEach(t => t.notes.forEach(n => synth.triggerAttackRelease(n.name, n.duration, n.time, n.velocity))); setPlaying(true); setTimeout(() => { synth.dispose(); setPlaying(false); }, 5000); } catch (e) { alert("Não foi possível reproduzir o MIDI. Verifique a conexão e tente novamente."); } };
    const Nav = () => <><div className="brand"><div className="brandIcon"><AudioLines /></div><div><b>Multimídia Educa</b><small>Laboratório de aprendizagem</small></div></div><nav>{sections.map(s => <button key={s.id} className={page === s.id ? "nav active" : "nav"} onClick={() => { setPage(s.id); setMobile(false) }}><s.icon size={18} />{s.label}<ChevronRight className="navArrow" size={15} /></button>)}</nav><div className="sideNote"><Headphones size={20} /><b>Aprenda ouvindo</b><span>Explore som, música e tecnologia em seu ritmo.</span></div></>;
    return <div className="app">
        <aside className="sidebar"><Nav /></aside>
        {mobile && <div className="mobileMenu"><button className="close" onClick={() => setMobile(false)}><X /></button><Nav /></div>}
        <main className="main">
            <header><button className="hamb" onClick={() => setMobile(true)}><Menu /></button><div><span className="eyebrow">SISTEMAS MULTIMÍDIA</span><h1>{sections.find(s => s.id === page)?.label}</h1></div><div className="headerTag"><span className="dot" /> Curso interativo</div></header>
            {page === "inicio" && <div className="content">
                <section className="hero"><div><span className="pill">PROTÓTIPO EDUCACIONAL</span><h2>Música e voz<br /><em>sintetizadas</em></h2><p>Descubra como computadores transformam dados em sons, melodias e vozes artificiais.</p><button className="primary" onClick={() => setPage("conceitos")}>Começar a aprender <ChevronRight size={18} /></button></div><img src="/assets/capa-original.png" alt="Ilustração original de ondas sonoras" /></section>
                <div className="sectionHead"><div><span className="eyebrow">TRILHA DE APRENDIZAGEM</span><h2>Explore os módulos</h2></div><span className="muted"></span></div>
                <div className="moduleGrid">
                    {sections.slice(1).map((s, i) => (
                        <button
                            className="module"
                            key={s.id}
                            onClick={() => (s.id === "quiz" ? startQuiz() : setPage(s.id))}
                        >
                            <div className="moduleIcon">
                                <s.icon size={18} />
                            </div>
                            <b>{s.label}</b>
                            <span>
                                {
                                    [
                                        "Fundamentos e aplicações",
                                        "Como o som vira informação",
                                        "Notas, eventos e reprodução",
                                        "Como o software produz fala",
                                        "Conheça os recursos do protótipo",
                                        "Teste o que aprendeu",
                                    ][i]
                                }
                            </span>
                            <small>
                                ACESSAR <ChevronRight size={13} />
                            </small>
                        </button>
                    ))}
                </div>
                <section className="callout"><Sparkles /><div><b>Aprenda no seu ritmo</b><p>Escolha qualquer módulo, experimente os recursos e retorne aos conteúdos quando quiser.</p></div></section>
            </div>}
            {page === "conceitos" && <div className="content twoCol"><article className="lesson"><span className="eyebrow">MÓDULO 01 · FUNDAMENTOS</span><h2>O que são música e voz sintetizadas?</h2><p>Em sistemas multimídia, sons podem ser produzidos ou modificados por recursos eletrônicos e computacionais. A <b>síntese musical</b> cria timbres e melodias; a <b>síntese de voz</b> gera fala artificial a partir de texto ou parâmetros.</p><div className="infoBox"><Music2 /><div><b>Síntese musical</b><p>O sistema gera notas, ritmos e timbres por meio de instrumentos virtuais ou sintetizadores.</p></div></div><div className="infoBox"><Mic2 /><div><b>Síntese de voz</b><p>Um mecanismo transforma texto em fala, permitindo narrar conteúdos e apoiar a acessibilidade.</p></div></div><h3>Onde encontramos essas tecnologias?</h3><ul><li>Aplicativos de navegação que falam instruções.</li><li>Assistentes virtuais e leitores de tela.</li><li>Instrumentos musicais digitais e jogos.</li><li>Materiais didáticos com narração e trilhas sonoras.</li></ul><button className="primary" onClick={() => speak("Olá! Esta é uma demonstração de voz sintetizada. A tecnologia transforma texto em fala e pode apoiar a aprendizagem e a acessibilidade.")}><Volume2 size={18} /> Ouvir exemplo de voz</button></article><aside className="sideCard"><img src="/assets/nota-vetorial.svg" alt="Ilustração vetorial de nota musical" /><b>Multimídia combina linguagens</b><p>Texto, imagem, som, vídeo e animação podem trabalhar juntos para facilitar a compreensão.</p><button className="textBtn" onClick={() => setPage("midias")}>Ver galeria de mídias →</button></aside></div>}
            {page === "audio" && <div className="content"><section className="lesson wide"><span className="eyebrow">MÓDULO 02 · SOM DIGITAL</span><h2>Áudio digital</h2><p>O áudio digital representa o som por valores numéricos. Durante a digitalização, o sinal é medido em intervalos regulares, processo chamado amostragem. A taxa de amostragem indica quantas medições são realizadas por segundo.</p><div className="conceptGrid"><div><strong>44,1 kHz</strong><span>Exemplo de taxa de amostragem</span></div><div><strong>WAV</strong><span>Formato comum de áudio digital</span></div><div><strong>Hz</strong><span>Unidade de frequência</span></div></div><h3>Experimente um áudio original</h3><p>O arquivo abaixo foi criado para este protótipo com uma sequência curta de notas sintetizadas.</p><div className="player"><div className="playIcon"><Music2 /></div><div className="playerInfo"><b>Escala sintetizada</b><span>Áudio digital original · WAV</span><audio controls src="/assets/escala-sintetizada.wav" /></div></div><div className="infoBox"><AudioLines /><div><b>Observe</b><p>Ao reproduzir o arquivo, você está ouvindo um sinal de áudio digital. Compare a percepção das notas e o tempo entre elas.</p></div></div></section></div>}
            {page === "midi" && <div className="content twoCol"><article className="lesson"><span className="eyebrow">MÓDULO 03 · INFORMAÇÃO MUSICAL</span><h2>Como funciona o MIDI?</h2><p>MIDI significa <b>Musical Instrument Digital Interface</b>. É um padrão que registra e transmite eventos musicais, como nota, duração, intensidade e canal. Diferentemente de WAV ou MP3, um arquivo MIDI não é, por si só, uma gravação da onda sonora: ele contém instruções que um sintetizador interpreta.</p><div className="midiDemo"><div className="keys">{["Dó", "Ré", "Mi", "Fá", "Sol", "Lá", "Si"].map((n, i) => <div key={n} className={i === 0 || i === 2 || i === 4 ? "key dark" : "key"}>{n}</div>)}</div><button className="primary" onClick={playMidi}><Play size={17} /> Reproduzir sequência MIDI</button><span className="muted">Arquivo MIDI original incluído nos materiais do projeto.</span></div><h3>O que o MIDI descreve?</h3><ul><li>Qual nota deve ser tocada.</li><li>Quando a nota começa e termina.</li><li>Qual a intensidade (velocity).</li><li>Qual instrumento ou canal será utilizado.</li></ul></article><aside className="sideCard"><div className="bigNote">♫</div><b>Experimente a sequência</b><p>Use o botão para ouvir quatro notas tocadas por um instrumento virtual no navegador.</p><a href="/assets/escala-original.mid" download className="download">Baixar arquivo MIDI</a></aside></div>}
            {page === "voz" && <div className="content"><section className="lesson wide"><span className="eyebrow">MÓDULO 04 · FALA ARTIFICIAL</span><h2>Voz sintetizada</h2><p>A síntese de voz é a geração artificial da fala por um sistema computacional. Uma aplicação comum é a conversão de texto em fala (Text-to-Speech, ou TTS), usada em leitores de tela, assistentes virtuais e conteúdos educativos.</p><div className="voiceBox"><div className="voiceAvatar"><Mic2 size={32} /></div><div className="voiceText"><b>Demonstração de Text-to-Speech</b><span>Edite o texto e peça ao navegador para pronunciá-lo.</span></div></div><textarea id="speechText" defaultValue="Olá! Você está conhecendo o Multimídia Educa. A voz sintetizada transforma texto em fala e pode tornar o conteúdo digital mais acessível." /><div className="buttonRow"><button className="primary" onClick={() => speak(document.getElementById("speechText").value)}><Play size={17} /> Ouvir texto</button><button className="secondary" onClick={() => { window.speechSynthesis?.cancel(); setSpeech(false) }}><Pause size={17} /> Parar</button><span className="muted">{speech ? "Reproduzindo…" : "Recurso depende das vozes disponíveis no navegador."}</span></div><div className="infoBox"><CheckCircle2 /><div><b>Acessibilidade</b><p>Oferecer narração pode ajudar pessoas que preferem ouvir o conteúdo ou que utilizam recursos de apoio à leitura.</p></div></div></section></div>}
            {page === "midias" && <div className="content"><div className="sectionHead"><div><span className="eyebrow">RECURSOS DO PROTÓTIPO</span><h2>Galeria multimídia</h2></div><span className="muted">6 tipos de mídia</span></div><div className="mediaGrid">
                <div className="mediaCard"><img src="/assets/capa-original.png" /><div><b>1. Imagem matricial</b><p>Ilustração PNG criada para a capa do sistema.</p></div></div>
                <div className="mediaCard"><img className="vector" src="/assets/nota-vetorial.svg" /><div><b>2. Imagem vetorial</b><p>Desenho SVG de uma nota musical.</p></div></div>
                <div className="mediaCard"><div className="mediaIcon"><AudioLines /></div><div><b>3. Áudio digital</b><p>Arquivo WAV original com notas sintetizadas.</p><audio controls src="/assets/escala-sintetizada.wav" /></div></div>
                <div className="mediaCard"><div className="mediaIcon"><Music2 /></div><div><b>4. Música MIDI</b><p>Sequência musical em arquivo MIDI.</p><a href="/assets/escala-original.mid" download className="textBtn">Baixar MIDI ↓</a></div></div>
                <div className="mediaCard"><video controls poster="/assets/capa-original.png" src="/assets/aula-introducao.mp4" /><div><b>5. Vídeo</b><p>Vídeo curto de apresentação produzido para o protótipo.</p></div></div>
                <div className="mediaCard"><div className="animationStage"><div className="pulseNote">♫</div><div className="soundWave"><i /><i /><i /><i /><i /><i /><i /></div></div><div><b>6. Animação</b><p>Animação vetorial/CSS de onda sonora.</p><button className="textBtn" onClick={() => setShowAnimation(!showAnimation)}>{showAnimation ? "Pausar animação" : "Reproduzir animação"}</button></div></div>
            </div>{showAnimation && <div className="callout"><Sparkles /><div><b>Animação ativada</b><p>Observe o movimento da nota musical e das ondas sonoras no cartão acima.</p></div></div>}</div>}
            {page === "quiz" && <div className="content"><section className="quizIntro"><span className="eyebrow">AVALIAÇÃO DE APRENDIZAGEM</span><h2>Hora de testar seus conhecimentos!</h2><p>O sistema possui um banco de 15 perguntas. Cada tentativa sorteia 5 questões diferentes.</p><button className="primary" onClick={startQuiz}><RotateCcw size={17} /> {quiz ? "Sortear novo quiz" : "Iniciar quiz"}</button></section>
                {quiz && !done && <div className="quizList">{quiz.map((q, i) => <div className="question" key={i}><div className="qMeta">PERGUNTA {i + 1} DE 5</div><h3>{q.q}</h3><div className="options">{q.o.map((op, j) => <button key={j} className={answers[i] === j ? "option chosen" : "option"} onClick={() => setAnswers({ ...answers, [i]: j })}><span>{String.fromCharCode(65 + j)}</span>{op}</button>)}</div></div>)}<button className="primary" disabled={Object.keys(answers).length !== 5} onClick={() => setDone(true)}>Finalizar e ver resultado <ChevronRight size={18} /></button></div>}
                {quiz && done && <div className="result"><Trophy size={42} /><span className="eyebrow">RESULTADO DO QUIZ</span><strong>{Math.round(score / 5 * 100)}%</strong><h3>{score} de 5 respostas corretas</h3><p>{score >= 4 ? "Excelente! Você demonstrou ótimo domínio do conteúdo." : score >= 3 ? "Bom trabalho! Revise os módulos para avançar ainda mais." : "Continue estudando! Retorne aos módulos e tente novamente."}</p>{quiz.map((q, i) => <div className="feedback" key={i}><b>{i + 1}. {q.q}</b><span className={answers[i] === q.a ? "correct" : "incorrect"}>{answers[i] === q.a ? "Resposta correta" : "Resposta incorreta"} · {q.o[q.a]}</span><small>{q.e}</small></div>)}<button className="primary" onClick={startQuiz}>Tentar novamente</button></div>}
            </div>}
            <footer><span>Multimídia Educa · Protótipo acadêmico</span></footer>
        </main>
    </div>
}
export default App;
