'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { siteConfig } from './site-config';

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
const COPYRIGHT_YEAR = 2026;

function WhatsAppIcon() { return <img src="/whatsapp.svg" alt="" width="22" height="22" />; }
function makeWhatsAppUrl(category?: string) {
  const labels: Record<string, string> = { Atraso: 'voo atrasado', Cancelamento: 'voo cancelado', Overbooking: 'overbooking', Bagagem: 'problemas com bagagem' };
  const message = category
    ? `Olá, Dra. Fernanda! Vim pelo seu site e gostaria de falar sobre um problema relacionado a ${labels[category] ?? category.toLowerCase()}.`
    : 'Olá, Dra. Fernanda! Vim pelo seu site e gostaria de falar sobre um problema relacionado ao meu voo.';
  return `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}

export default function Home() {
  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [category, setCategory] = useState('Atraso');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const whatsappUrl = useMemo(() => makeWhatsAppUrl(category), [category]);
  useLayoutEffect(() => {
    let active = true;
    let dispose = () => {};
    void (async () => {
    const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]);
    await document.fonts.ready;
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    if (!active) return;
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lastY = window.scrollY, ticking = false;
    const onHeaderScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY, delta = y - lastY;
        setScrolled(y > 80);
        if (headerRef.current && Math.abs(delta) > 6) gsap.to(headerRef.current, { yPercent: y > 220 && delta > 0 ? -110 : 0, duration: .55, ease: 'expo.out', overwrite: true });
        if (y < 100 && headerRef.current) gsap.to(headerRef.current, { yPercent: 0, duration: .35, overwrite: true });
        lastY = y; ticking = false;
      });
    };
    window.addEventListener('scroll', onHeaderScroll, { passive: true });
    const ctx = gsap.context(() => {
      const gate = ScrollTrigger.create({ trigger: '.hero-scroll', start: 'top top', end: 'bottom bottom' });
      gate.disable();
      gsap.set('.hero-line', { yPercent: 112 });
      gsap.set('.portrait-reveal', { autoAlpha: 0, scale: .96, y: 20, clipPath: 'inset(100% 0 0)' });
      gsap.set(['.hero-secondary', '.hero-meta'], { autoAlpha: 0, y: 14 });
      gsap.set(headerRef.current, { autoAlpha: 0 });
      gsap.timeline({ onComplete: () => { gate.enable(); ScrollTrigger.refresh(); window.dispatchEvent(new Event('fernanda:intro-complete')); } })
        .to('.hero-line-a', { yPercent: 0, duration: .72, ease: 'power4.out' })
        .to('.hero-line-b', { yPercent: 0, duration: .72, ease: 'power4.out' }, '-=.58')
        .to('.portrait-reveal', { autoAlpha: 1, scale: 1, y: 0, clipPath: 'inset(0% 0 0)', duration: .82, ease: 'power3.out' }, '-=.48')
        .to(['.hero-secondary', '.hero-meta'], { autoAlpha: 1, y: 0, duration: .5, stagger: .08, ease: 'power2.out' }, '-=.22')
        .to(headerRef.current, { autoAlpha: 1, duration: .42, ease: 'power2.out' }, '-=.28');
      if (!reduced) {
        const mm = gsap.matchMedia();
        mm.add({ desktop: '(min-width:1024px)', tablet: '(min-width:768px) and (max-width:1023px)', mobile: '(max-width:767px)' }, ({ conditions }) => {
          const c = conditions as { desktop?: boolean; tablet?: boolean }; const travel = c.desktop ? 68 : c.tablet ? 57 : 46; const blur = c.desktop ? 16 : c.tablet ? 13 : 10;
          gsap.timeline({ scrollTrigger: { trigger: '.hero-scroll', start: 'top top', end: 'bottom bottom', scrub: .9, invalidateOnRefresh: true, onToggle: s => { const img = document.querySelector<HTMLElement>('.hero-person'); if (img) img.style.willChange = s.isActive ? 'filter, transform, opacity' : ''; } } })
            .to('.hero-line-a', { x: `${travel}vw`, ease: 'none' }, 0).to('.hero-line-b', { x: `-${travel}vw`, ease: 'none' }, 0)
            .to('.hero-secondary, .hero-meta', { autoAlpha: 0, y: -16, ease: 'none', duration: .24 }, .08)
            .to('.hero-person', { filter: `blur(${blur}px)`, scale: 1.03, ease: 'none', duration: .72 }, .18)
            .to('.hero-person, .portrait-caption', { autoAlpha: 0, y: '-1.5vh', ease: 'none', duration: .16 }, .84);
        });
        gsap.utils.toArray<HTMLElement>('.reveal').forEach(el => gsap.fromTo(el, { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: .85, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 78%', once: true } }));
        gsap.fromTo('.practice-row', { autoAlpha: .22, scale: .97 }, { autoAlpha: 1, scale: 1, stagger: .07, scrollTrigger: { trigger: '.practice-list', start: 'top 72%', end: 'bottom 32%', scrub: .55 } });
        gsap.fromTo('.process', { clipPath: 'inset(100% 0 0)' }, { clipPath: 'inset(0% 0 0)', ease: 'none', scrollTrigger: { trigger: '.process', start: 'top bottom', end: 'top 55%', scrub: .5 } });
        const words = gsap.utils.toArray<HTMLElement>('.manifesto-word');
        gsap.to(words, { color: (i) => words[i].dataset.gold === 'true' ? '#e0c17b' : '#f5f1e9', stagger: .12, scrollTrigger: { trigger: '.manifesto', start: 'top 88%', end: 'bottom 58%', scrub: .7 } });
        return () => mm.revert();
      }
      gsap.set(['.reveal', '.practice-row', '.process', '.manifesto-word'], { clearProps: 'all' }); gate.kill();
    }, pageRef);
    const refresh = () => ScrollTrigger.refresh(); window.addEventListener('load', refresh, { once: true });
    const fallback = window.setTimeout(() => headerRef.current && gsap.set(headerRef.current, { autoAlpha: 1 }), 3200);
    dispose = () => { window.clearTimeout(fallback); window.removeEventListener('scroll', onHeaderScroll); window.removeEventListener('load', refresh); ctx.revert(); };
    })();
    return () => { active = false; dispose(); };
  }, []);
  useEffect(() => { document.body.style.overflow = menuOpen ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [menuOpen]);
  const closeMenu = () => setMenuOpen(false);

  return <div ref={pageRef}>
    <div className="grain" aria-hidden="true" />
    <header ref={headerRef} className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <a className="brand" href="#inicio" aria-label="Dra. Fernanda Leite — início"><img src="/logo-transparente.png" alt="Dra. Fernanda Leite — Direito Aéreo" width="2171" height="724" /></a>
      <nav className="desktop-nav" aria-label="Navegação principal"><a href="#inicio">Início</a><a href="#atuacao">Atuação</a><a href="#como-funciona">Como funciona</a><a href="#sobre">Sobre</a><a href="#duvidas">Dúvidas</a></nav>
      <a className="header-cta" href={makeWhatsAppUrl()} target="_blank" rel="noreferrer">Falar no WhatsApp <span>↗</span></a>
      <button className="menu-button" type="button" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
    </header>
    <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}><nav aria-label="Navegação móvel"><a onClick={closeMenu} href="#inicio">Início</a><a onClick={closeMenu} href="#atuacao">Atuação</a><a onClick={closeMenu} href="#como-funciona">Como funciona</a><a onClick={closeMenu} href="#sobre">Sobre</a><a onClick={closeMenu} href="#duvidas">Dúvidas</a></nav><a className="button button-gold" onClick={closeMenu} href={makeWhatsAppUrl()} target="_blank" rel="noreferrer">Falar no WhatsApp <span>↗</span></a></div>

    <main>
      <section className="hero-scroll" id="inicio"><div className="hero hero-sticky">
        <div className="route-signature" aria-hidden="true"><span className="route-plane">✦</span></div>
        <div className="hero-copy"><p className="eyebrow hero-secondary">Direito do passageiro aéreo</p><h1><span className="mask-line"><span className="hero-line hero-line-a">Seu voo saiu do plano.</span></span><span className="mask-line"><em className="hero-line hero-line-b">Seus direitos não.</em></span></h1><div className="hero-secondary"><p className="hero-intro">Atuação jurídica voltada a passageiros que enfrentaram atrasos, cancelamentos, overbooking ou problemas com bagagem.</p><div className="hero-actions"><a className="button button-gold" href={makeWhatsAppUrl()} target="_blank" rel="noreferrer">Conte o que aconteceu <span>↗</span></a><a className="text-link" href="#atuacao">Conheça a atuação <span>↓</span></a></div></div></div>
        <div className="hero-portrait"><div className="portrait-halo" /><div className="portrait-reveal"><img className="hero-person" src="/fernanda-recorte.png" alt="Retrato profissional da Dra. Fernanda Leite" width="1146" height="1372" /></div><div className="portrait-caption"><span>Fernanda Leite</span><small>Advogada do passageiro aéreo</small></div></div>
        <div className="hero-index" aria-hidden="true">FL · 01</div>
        <div className="hero-meta"><span>Atendimento em Direito do Passageiro Aéreo</span><a className="scroll-indicator" href="#atuacao"><span>Role para explorar</span><i /></a></div>
      </div></section>

      <div className="marquee" aria-hidden="true"><div>ATRASO <b>•</b> CANCELAMENTO <b>•</b> OVERBOOKING <b>•</b> BAGAGEM <b>•</b> DIREITO DO PASSAGEIRO <b>•</b> ATRASO <b>•</b> CANCELAMENTO <b>•</b> OVERBOOKING <b>•</b> BAGAGEM <b>•</b> DIREITO DO PASSAGEIRO <b>•</b></div></div>
      <section className="manifesto"><p>{['Cada','situação','merece','uma','análise','individual.'].map(word => <span className="manifesto-word" data-gold={word === 'análise'} key={word}>{word} </span>)}</p></section>

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

    <footer><div className="footer-main"><div className="footer-brand"><img src="/logo-transparente.png" alt="Dra. Fernanda Leite" /><p>{siteConfig.area}</p></div><div className="footer-contact"><a href={makeWhatsAppUrl()} target="_blank" rel="noreferrer"><small>WhatsApp</small>{siteConfig.contact.whatsappDisplay}</a><a href={`mailto:${siteConfig.contact.email}`}><small>E-mail</small>{siteConfig.contact.email}</a><a href={siteConfig.contact.instagramUrl} target="_blank" rel="noreferrer"><small>Instagram</small>{siteConfig.contact.instagram}</a></div><nav aria-label="Links do rodapé"><a href="#inicio">Início</a><a href="#atuacao">Atuação</a><a href="#sobre">Sobre</a><a href="#duvidas">Dúvidas</a></nav></div><div className="footer-bottom"><p>© {COPYRIGHT_YEAR} Dra. Fernanda Leite. Todos os direitos reservados.</p><p>Conteúdo institucional e informativo. Resultados dependem das circunstâncias de cada caso.</p></div></footer>
    <a className="floating-whatsapp" href={makeWhatsAppUrl()} target="_blank" rel="noreferrer" aria-label="Fale com a Dra. Fernanda pelo WhatsApp"><WhatsAppIcon /><span>Fale com a Dra. Fernanda</span></a>
  </div>;
}


