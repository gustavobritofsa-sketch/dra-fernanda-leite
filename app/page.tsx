'use client';

import { useEffect, useMemo, useState } from 'react';

const WHATSAPP_NUMBER = '';
const INSTAGRAM_URL = '';

const situations = [
  { number: '01', title: 'Voo atrasado', text: 'A duração do atraso, as informações prestadas e a assistência oferecida fazem parte da análise de cada situação.' },
  { number: '02', title: 'Voo cancelado', text: 'As alternativas apresentadas pela companhia e os impactos da interrupção devem ser avaliados individualmente.' },
  { number: '03', title: 'Overbooking', text: 'Quando há impedimento de embarque, os fatos e os registros da viagem ajudam a compreender quais medidas podem ser cabíveis.' },
  { number: '04', title: 'Problemas com bagagem', text: 'Extravio, avaria ou atraso na entrega exigem atenção aos comprovantes e às providências tomadas ainda no aeroporto.' },
];
const faqs = [
  ['Meu voo atrasou. O que devo fazer?', 'Guarde cartões de embarque, comprovantes, registros do painel e comunicações da companhia. Solicite informações e assistência no aeroporto. A análise considera o tempo de atraso, o suporte oferecido e os efeitos concretos da ocorrência.'],
  ['O que acontece quando um voo é cancelado?', 'A companhia deve informar o passageiro e apresentar alternativas aplicáveis à situação. A adequação do atendimento e os impactos do cancelamento precisam ser avaliados caso a caso.'],
  ['O que é overbooking?', 'É a situação em que há mais passageiros confirmados do que lugares disponíveis. Se o embarque for impedido, registre a ocorrência e preserve toda a documentação da viagem.'],
  ['O que devo fazer se minha bagagem for extraviada?', 'Comunique o problema imediatamente à companhia, ainda na área de desembarque, e guarde o protocolo. Notas de despesas essenciais e demais comprovantes também podem ser relevantes.'],
  ['Todo problema com voo gera indenização?', 'Não. A existência de um problema, por si só, não determina uma indenização. As circunstâncias, a conduta da companhia e os prejuízos efetivamente experimentados devem ser analisados individualmente.'],
  ['Como posso enviar meu caso para análise?', 'Inicie o contato pelo WhatsApp e relate brevemente o ocorrido. Depois, poderão ser solicitados documentos e informações do voo para uma avaliação individual.'],
];

function WhatsAppIcon() { return <img src="/whatsapp.svg" alt="" width="22" height="22" />; }
function makeWhatsAppUrl(category?: string) {
  const subject = category ? `um problema relacionado a ${category.toLowerCase()}` : 'um problema com meu voo';
  const message = encodeURIComponent(`Olá, Dra. Fernanda. Vim pelo site e gostaria de falar sobre ${subject}.`);
  return WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}?text=${message}` : `https://wa.me/?text=${message}`;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [category, setCategory] = useState('Atraso');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const whatsappUrl = useMemo(() => makeWhatsAppUrl(category), [category]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')), { threshold: 0.13 });
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => { window.removeEventListener('scroll', onScroll); observer.disconnect(); };
  }, []);
  useEffect(() => { document.body.style.overflow = menuOpen ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [menuOpen]);
  const closeMenu = () => setMenuOpen(false);

  return <>
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <a className="brand" href="#inicio" aria-label="Dra. Fernanda Leite — início"><img src="/logo.jpeg" alt="Dra. Fernanda Leite — Direito Aéreo" /></a>
      <nav className="desktop-nav" aria-label="Navegação principal"><a href="#inicio">Início</a><a href="#atuacao">Atuação</a><a href="#como-funciona">Como funciona</a><a href="#sobre">Sobre</a><a href="#duvidas">Dúvidas</a></nav>
      <a className="header-cta" href={makeWhatsAppUrl()} target="_blank" rel="noreferrer">Falar no WhatsApp <span>↗</span></a>
      <button className="menu-button" type="button" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
    </header>
    <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}><nav aria-label="Navegação móvel"><a onClick={closeMenu} href="#inicio">Início</a><a onClick={closeMenu} href="#atuacao">Atuação</a><a onClick={closeMenu} href="#como-funciona">Como funciona</a><a onClick={closeMenu} href="#sobre">Sobre</a><a onClick={closeMenu} href="#duvidas">Dúvidas</a></nav><a className="button button-gold" onClick={closeMenu} href={makeWhatsAppUrl()} target="_blank" rel="noreferrer">Falar no WhatsApp <span>↗</span></a></div>

    <main>
      <section className="hero" id="inicio">
        <div className="route-signature" aria-hidden="true"><span className="route-plane">✦</span></div>
        <div className="hero-copy reveal is-visible"><p className="eyebrow">Direito do passageiro aéreo</p><h1>Seu voo saiu do plano.<br /><em>Seus direitos não.</em></h1><p className="hero-intro">Atuação jurídica voltada a passageiros que enfrentaram atrasos, cancelamentos, overbooking ou problemas com bagagem.</p><div className="hero-actions"><a className="button button-gold" href={makeWhatsAppUrl()} target="_blank" rel="noreferrer">Conte o que aconteceu <span>↗</span></a><a className="text-link" href="#atuacao">Conheça a atuação <span>↓</span></a></div><p className="whatsapp-note"><span /> Atendimento pelo WhatsApp</p></div>
        <div className="hero-portrait reveal is-visible"><div className="portrait-halo" /><img src="/fernanda.jpeg" alt="Retrato profissional da Dra. Fernanda Leite" width="640" height="640" /><div className="portrait-caption"><span>Fernanda Leite</span><small>Advogada do passageiro aéreo</small></div></div>
        <div className="hero-index" aria-hidden="true">FL · 01</div>
      </section>

      <section className="practice light-section" id="atuacao">
        <div className="section-heading reveal"><p className="eyebrow dark">Como posso ajudar</p><h2>Quando a viagem não acontece <em>como deveria.</em></h2><p>Entenda situações recorrentes e saiba quais informações podem ser importantes para uma análise responsável.</p></div>
        <div className="practice-list reveal">{situations.map((item) => <article className="practice-row" key={item.number}><span className="practice-number">{item.number}</span><h3>{item.title}</h3><p>{item.text}</p><span className="row-arrow" aria-hidden="true">↗</span></article>)}</div><p className="legal-note reveal">Cada situação deve ser analisada individualmente.</p>
      </section>

      <section className="case-selector"><div className="case-copy reveal"><p className="eyebrow">Primeiro contato</p><h2>Teve um problema com seu voo?</h2><p>Conte brevemente o que aconteceu para que seu caso possa ser analisado individualmente.</p></div><div className="case-form reveal" role="group" aria-labelledby="case-options-title"><p id="case-options-title">Qual foi a situação?</p><div className="category-options">{['Atraso', 'Cancelamento', 'Overbooking', 'Bagagem'].map((item) => <button type="button" key={item} className={category === item ? 'selected' : ''} aria-pressed={category === item} onClick={() => setCategory(item)}><span />{item}</button>)}</div><a className="button button-gold full-button" href={whatsappUrl} target="_blank" rel="noreferrer">Falar sobre meu caso <span>↗</span></a></div></section>

      <section className="about light-section" id="sobre"><div className="about-image reveal"><div className="image-frame"><img src="/fernanda.jpeg" alt="Dra. Fernanda Leite" width="640" height="640" loading="lazy" /></div><span className="vertical-label">Direito aéreo · Atendimento individual</span></div><div className="about-copy reveal"><p className="eyebrow dark">Sobre</p><h2>Dra. Fernanda Leite</h2><p className="about-role">Advogada do Passageiro Aéreo</p><div className="gold-rule" /><p>Sua atuação é direcionada a questões que envolvem passageiros e transporte aéreo, com atenção às particularidades de cada ocorrência e comunicação clara durante o atendimento.</p><p>O trabalho começa pela escuta: compreender o que aconteceu, reunir as informações da viagem e orientar os próximos passos com responsabilidade.</p><a className="text-link dark-link" href={makeWhatsAppUrl()} target="_blank" rel="noreferrer">Iniciar uma conversa <span>↗</span></a></div></section>

      <section className="knowledge"><div className="section-heading reveal"><p className="eyebrow">Informação ao passageiro</p><h2>Entender também faz parte da <em>defesa dos seus direitos.</em></h2></div><div className="knowledge-grid reveal"><article className="feature-article"><span>Leitura essencial</span><h3>Atrasos e cancelamentos: informação e assistência importam</h3><p>Durante uma interrupção da viagem, registre os avisos recebidos e as alternativas oferecidas. O contexto completo ajuda a avaliar o atendimento prestado.</p></article><div className="briefs"><article><span>01</span><div><h3>Assistência ao passageiro</h3><p>O tempo de espera e a situação concreta influenciam as medidas esperadas da companhia.</p></div></article><article><span>02</span><div><h3>Bagagem</h3><p>Protocolos, etiquetas e comprovantes ajudam a documentar extravio, avaria ou atraso.</p></div></article><article><span>03</span><div><h3>Overbooking</h3><p>Registre o impedimento de embarque e as soluções oferecidas pela empresa aérea.</p></div></article></div></div><p className="legal-note inverse reveal">Conteúdo informativo. As circunstâncias de cada caso devem ser analisadas individualmente.</p></section>

      <section className="process light-section" id="como-funciona"><div className="section-heading reveal"><p className="eyebrow dark">Como funciona</p><h2>Um atendimento simples desde o <em>primeiro contato.</em></h2></div><div className="timeline reveal">{[['01','Conte o que aconteceu','Um relato breve ajuda a identificar a situação.'],['02','Envie as informações do voo','Bilhetes, protocolos e comprovantes organizam os fatos.'],['03','O caso é analisado','As circunstâncias são avaliadas individualmente.'],['04','Receba orientação','Os próximos passos são explicados com clareza.']].map(([n,t,p]) => <article key={n}><span>{n}</span><div className="timeline-dot" /><h3>{t}</h3><p>{p}</p></article>)}</div></section>

      <section className="faq" id="duvidas"><div className="faq-heading reveal"><p className="eyebrow">Dúvidas frequentes</p><h2>Informação clara para uma decisão mais tranquila.</h2><p>Algumas respostas iniciais para ajudar você a compreender melhor a sua situação.</p></div><div className="accordion reveal">{faqs.map(([question, answer], index) => <div className={`faq-item ${openFaq === index ? 'open' : ''}`} key={question}><button type="button" aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? null : index)}><span>{question}</span><i aria-hidden="true" /></button><div className="faq-answer"><div><p>{answer}</p></div></div></div>)}</div></section>

      <section className="final-cta"><div className="final-route" aria-hidden="true" /><p className="eyebrow reveal">Converse sobre o seu caso</p><h2 className="reveal">Seu voo teve<br /><em>um problema?</em></h2><p className="reveal">Conte o que aconteceu e dê o primeiro passo para entender a sua situação.</p><a className="button button-gold reveal" href={makeWhatsAppUrl()} target="_blank" rel="noreferrer">Falar com a Dra. Fernanda <span>↗</span></a></section>
    </main>

    <footer><div className="footer-main"><img src="/logo.jpeg" alt="Dra. Fernanda Leite" /><nav aria-label="Links do rodapé"><a href="#inicio">Início</a><a href="#atuacao">Atuação</a><a href="#sobre">Sobre</a><a href="#duvidas">Dúvidas</a><a href={makeWhatsAppUrl()} target="_blank" rel="noreferrer">WhatsApp</a>{INSTAGRAM_URL && <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">Instagram</a>}</nav></div><div className="footer-bottom"><p>© {new Date().getFullYear()} Dra. Fernanda Leite. Todos os direitos reservados.</p><p>Conteúdo institucional e informativo. Resultados dependem das circunstâncias de cada caso.</p></div></footer>
    <a className="floating-whatsapp" href={makeWhatsAppUrl()} target="_blank" rel="noreferrer" aria-label="Fale com a Dra. Fernanda pelo WhatsApp"><WhatsAppIcon /><span>Fale com a Dra. Fernanda</span></a>
  </>;
}
