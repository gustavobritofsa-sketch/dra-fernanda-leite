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
    let cleanupIntroListeners = () => {};
    const ctx = gsap.context(() => {
      document.documentElement.classList.add('intro-active');
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      gsap.set('.intro-line', { yPercent: 115 });
      gsap.set('.intro-photo', { autoAlpha: 0, scale: .94, y: 40, clipPath: 'inset(100% 0 0)', filter: 'blur(7px)' });
      gsap.set(['.intro-kicker', '.intro-scroll-cue'], { autoAlpha: 0, y: 10 });
      gsap.set('.hero-line', { yPercent: 112 });
      gsap.set('.portrait-reveal', { autoAlpha: 0, scale: .98, clipPath: 'inset(12% 0 0)' });
      gsap.set(['.hero-eyebrow', '.hero-support', '.hero-meta'], { autoAlpha: 0, y: 14 });
      gsap.set(headerRef.current, { autoAlpha: 0, y: -10 });
      let introExitStarted = false;
      let touchStartY = 0;
      const removeIntroListeners = () => {
        window.removeEventListener('wheel', onIntroWheel);
        window.removeEventListener('keydown', onIntroKeyDown);
        window.removeEventListener('touchstart', onIntroTouchStart);
        window.removeEventListener('touchmove', onIntroTouchMove);
      };
      cleanupIntroListeners = removeIntroListeners;
      const finishIntro = () => {
        window.scrollTo(0, 0);
        document.documentElement.classList.remove('intro-active');
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        ScrollTrigger.refresh();
        window.dispatchEvent(new Event('fernanda:intro-complete'));
      };
      const exitTl = gsap.timeline({ paused: true, onComplete: finishIntro })
        .to(['.intro-line', '.intro-kicker', '.intro-scroll-cue'], { y: reduced ? -6 : -18, autoAlpha: 0, duration: reduced ? .16 : .34, ease: 'power2.in' }, 0)
        .to('.intro-photo', { scale: reduced ? 1 : 1.025, y: reduced ? -4 : -10, autoAlpha: reduced ? 0 : .65, duration: reduced ? .2 : .42, ease: 'power2.inOut' }, 0)
        .to('.site-intro', { clipPath: 'inset(0 0 100% 0)', duration: reduced ? .28 : .62, ease: 'power4.inOut' }, reduced ? .08 : .1)
        .to('.hero-line-a', { yPercent: 0, duration: reduced ? .2 : .55, ease: 'power3.out' }, .16)
        .to('.hero-line-b', { yPercent: 0, duration: reduced ? .2 : .55, ease: 'power3.out' }, .22)
        .to('.portrait-reveal', { autoAlpha: 1, scale: 1, clipPath: 'inset(0)', duration: reduced ? .2 : .5, ease: 'power3.out' }, .18)
        .to(['.hero-eyebrow', '.hero-support', '.hero-meta'], { autoAlpha: 1, y: 0, duration: reduced ? .18 : .38, stagger: .04, ease: 'power2.out' }, .26)
        .to(headerRef.current, { autoAlpha: 1, y: 0, duration: reduced ? .18 : .36, ease: 'power2.out' }, .2)
        .set('.site-intro', { visibility: 'hidden' });
      const startIntroExit = () => {
        if (introExitStarted) return;
        introExitStarted = true;
        removeIntroListeners();
        window.scrollTo(0, 0);
        introIn.progress(1);
        exitTl.play(0);
      };
      function onIntroWheel(event: WheelEvent) { if (event.deltaY > 0) { event.preventDefault(); startIntroExit(); } }
      function onIntroKeyDown(event: KeyboardEvent) {
        const target = event.target as HTMLElement | null;
        if (target?.matches('input, textarea, select, [contenteditable="true"]')) return;
        if (event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' ') { event.preventDefault(); startIntroExit(); }
      }
      function onIntroTouchStart(event: TouchEvent) { touchStartY = event.touches[0]?.clientY ?? 0; }
      function onIntroTouchMove(event: TouchEvent) {
        const currentY = event.touches[0]?.clientY ?? touchStartY;
        if (touchStartY - currentY >= 38) { event.preventDefault(); startIntroExit(); }
      }
      window.addEventListener('wheel', onIntroWheel, { passive: false });
      window.addEventListener('keydown', onIntroKeyDown);
      window.addEventListener('touchstart', onIntroTouchStart, { passive: true });
      window.addEventListener('touchmove', onIntroTouchMove, { passive: false });
      const introIn = gsap.timeline();
      if (reduced) {
        introIn.to(['.intro-line', '.intro-photo', '.intro-kicker', '.intro-scroll-cue'], { autoAlpha: 1, yPercent: 0, y: 0, filter: 'blur(0px)', clipPath: 'inset(0)', duration: .25 });
      } else {
        introIn.to('.intro-line-a', { yPercent: 0, duration: .78, ease: 'power4.out' }, .08)
          .to('.intro-line-b', { yPercent: 0, duration: .78, ease: 'power4.out' }, .18)
          .to('.intro-photo', { autoAlpha: 1, scale: 1, y: 0, clipPath: 'inset(0% 0 0)', filter: 'blur(0px)', duration: .88, ease: 'power4.out' }, .28)
          .to(['.intro-kicker', '.intro-scroll-cue'], { autoAlpha: 1, y: 0, duration: .36, stagger: .06, ease: 'power2.out' }, .58);
      }
      if (!reduced) {
        const mm = gsap.matchMedia();
        mm.add('(max-width:767px)', () => gsap.set('.intro-photo', { transformOrigin: '50% 100%' }));
        mm.add({ desktop: '(min-width:1024px)', tablet: '(min-width:768px) and (max-width:1023px)', mobile: '(max-width:767px)' }, ({ conditions }) => {
          const c = conditions as { desktop?: boolean; tablet?: boolean };
          const mobile = !c.desktop && !c.tablet;
          const start = mobile ? 'top 90%' : 'top 88%';
          gsap.utils.toArray<HTMLElement>('.section-heading h2, .case-copy h2, .about-copy h2, .faq-heading h2, .final-cta h2').forEach((el, index) => {
            gsap.fromTo(el, { autoAlpha: 0, y: mobile ? 14 : 24, clipPath: mobile ? 'none' : 'inset(0 0 100% 0)' }, { autoAlpha: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: mobile ? .46 : .62, ease: 'power3.out', delay: index % 2 ? .03 : 0, scrollTrigger: { trigger: el, start, once: true } });
          });
          gsap.utils.toArray<HTMLElement>('.section-heading>p:last-child, .case-copy>p:last-child, .about-copy>p, .faq-heading>p:last-child, .final-cta>p:not(.eyebrow), .legal-note').forEach((el, index) => {
            gsap.fromTo(el, { autoAlpha: 0, y: mobile ? 10 : 18, x: !mobile && index % 3 === 1 ? 8 : 0 }, { autoAlpha: 1, y: 0, x: 0, duration: mobile ? .38 : .5, ease: 'power2.out', scrollTrigger: { trigger: el, start, once: true } });
          });
          const cardGroups = ['.practice-list', '.category-options', '.knowledge-grid', '.timeline', '.accordion'];
          const cardItems = ['.practice-row', 'button', '.feature-article, .briefs article', 'article', '.faq-item'];
          cardGroups.forEach((group, index) => {
            const container = document.querySelector(group);
            if (!container) return;
            const items = container.querySelectorAll<HTMLElement>(cardItems[index]);
            gsap.fromTo(items, { autoAlpha: 0, y: mobile ? 12 : 20, scale: mobile ? 1 : .98 }, { autoAlpha: 1, y: 0, scale: 1, duration: mobile ? .4 : .52, stagger: mobile ? .045 : .07, ease: 'power3.out', scrollTrigger: { trigger: container, start, once: true } });
          });
          gsap.utils.toArray<HTMLElement>('.eyebrow:not(.hero-eyebrow), .case-form, .about-copy .gold-rule, .about-copy .text-link, .final-cta .button').forEach((el, index) => {
            gsap.fromTo(el, { autoAlpha: 0, y: mobile ? 8 : 14, x: !mobile && index % 2 ? 8 : -8 }, { autoAlpha: 1, y: 0, x: 0, duration: mobile ? .36 : .46, ease: 'power2.out', scrollTrigger: { trigger: el, start, once: true } });
          });
          const aboutFrame = document.querySelector<HTMLElement>('.about-image .image-frame');
          const aboutPhoto = document.querySelector<HTMLElement>('.about-image img');
          if (aboutFrame && aboutPhoto) {
            gsap.fromTo(aboutFrame, { autoAlpha: 0, y: mobile ? 12 : 20, clipPath: mobile ? 'none' : 'inset(0 0 100% 0)' }, { autoAlpha: 1, y: 0, clipPath: 'inset(0)', duration: mobile ? .44 : .68, ease: 'power3.out', scrollTrigger: { trigger: aboutFrame, start, once: true } });
            gsap.fromTo(aboutPhoto, { scale: mobile ? 1.015 : 1.04, yPercent: mobile ? 0 : 1.5 }, { scale: 1, yPercent: 0, duration: mobile ? .48 : .75, ease: 'power3.out', scrollTrigger: { trigger: aboutFrame, start, once: true } });
          }
        });
        const words = gsap.utils.toArray<HTMLElement>('.manifesto-word');
        gsap.to(words, { color: (i) => words[i].dataset.gold === 'true' ? '#e0c17b' : '#f5f1e9', stagger: .12, scrollTrigger: { trigger: '.manifesto', start: 'top 88%', end: 'bottom 58%', scrub: .7 } });
        return () => mm.revert();
      }
      gsap.set(['.reveal', '.practice-row', '.process', '.manifesto-word'], { clearProps: 'all' });
    }, pageRef);
    const refresh = () => ScrollTrigger.refresh(); window.addEventListener('load', refresh, { once: true });
    dispose = () => { cleanupIntroListeners(); window.removeEventListener('scroll', onHeaderScroll); window.removeEventListener('load', refresh); document.documentElement.classList.remove('intro-active'); document.documentElement.style.overflow = ''; document.body.style.overflow = ''; ctx.revert(); };
    })();
    return () => { active = false; dispose(); };
  }, []);
  useEffect(() => { if (menuOpen) document.body.style.overflow = 'hidden'; else if (!document.documentElement.classList.contains('intro-active')) document.body.style.overflow = ''; return () => { if (!document.documentElement.classList.contains('intro-active')) document.body.style.overflow = ''; }; }, [menuOpen]);
  const closeMenu = () => setMenuOpen(false);

  return <div ref={pageRef}>
    <div className="grain" aria-hidden="true" />
    <div className="site-intro" aria-hidden="true">
      <div className="intro-glow" />
      <div className="intro-name intro-name-back"><span className="intro-mask"><span className="intro-line intro-line-a">Dra. Fernanda</span></span></div>
      <div className="intro-photo"><img src="/fernanda-recorte.png" alt="" width="1146" height="1372" /></div>
      <div className="intro-name intro-name-front"><span className="intro-mask"><span className="intro-line intro-line-b">Leite</span></span></div>
      <p className="intro-kicker">Direito do Passageiro Aéreo</p>
      <div className="intro-scroll-cue"><span>Role para continuar</span><i /></div>
    </div>
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
        <div className="hero-copy"><p className="eyebrow hero-eyebrow">Direito do passageiro aéreo</p><h1><span className="mask-line"><span className="hero-line hero-line-a">Seu voo saiu do plano.</span></span><span className="mask-line"><em className="hero-line hero-line-b">Seus direitos não.</em></span></h1><div className="hero-support"><p className="hero-intro">Atuação jurídica voltada a passageiros que enfrentaram atrasos, cancelamentos, overbooking ou problemas com bagagem.</p><div className="hero-actions"><a className="button button-gold" href={makeWhatsAppUrl()} target="_blank" rel="noreferrer">Conte o que aconteceu <span>↗</span></a><a className="text-link" href="#atuacao">Conheça a atuação <span>↓</span></a></div></div></div>
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

      <section className="about light-section" id="sobre"><div className="about-image reveal"><div className="image-frame"><img src="/fernanda.jpeg" alt="Dra. Fernanda Leite" width="640" height="640" loading="lazy" /></div><span className="vertical-label">Direito aéreo · Atendimento individual</span></div><div className="about-copy reveal"><p className="eyebrow dark">Sobre</p><h2>Dra. Fernanda Leite</h2><p className="about-role">Advogada do Passageiro Aéreo</p><div className="gold-rule" /><p>Minha atuação é direcionada a questões que envolvem passageiros e transporte aéreo. Dedico atenção às particularidades de cada ocorrência e mantenho uma comunicação clara durante todo o atendimento.</p><p>Meu trabalho começa pela escuta: busco compreender o que aconteceu, reunir as informações da viagem e orientar os próximos passos com clareza e responsabilidade.</p><a className="text-link dark-link" href={makeWhatsAppUrl()} target="_blank" rel="noreferrer">Iniciar uma conversa <span>↗</span></a></div></section>

      <section className="knowledge"><div className="section-heading reveal"><p className="eyebrow">Informação ao passageiro</p><h2>Entender também faz parte da <em>defesa dos seus direitos.</em></h2></div><div className="knowledge-grid reveal"><article className="feature-article"><span>Leitura essencial</span><h3>Atrasos e cancelamentos: informação e assistência importam</h3><p>Durante uma interrupção da viagem, registre os avisos recebidos e as alternativas oferecidas. O contexto completo ajuda a avaliar o atendimento prestado.</p></article><div className="briefs"><article><span>01</span><div><h3>Assistência ao passageiro</h3><p>O tempo de espera e a situação concreta influenciam as medidas esperadas da companhia.</p></div></article><article><span>02</span><div><h3>Bagagem</h3><p>Protocolos, etiquetas e comprovantes ajudam a documentar extravio, avaria ou atraso.</p></div></article><article><span>03</span><div><h3>Overbooking</h3><p>Registre o impedimento de embarque e as soluções oferecidas pela empresa aérea.</p></div></article></div></div><p className="legal-note inverse reveal">Conteúdo informativo. As circunstâncias de cada caso devem ser analisadas individualmente.</p></section>

      <section className="process light-section" id="como-funciona"><div className="section-heading reveal"><p className="eyebrow dark">Como funciona</p><h2>Um atendimento simples desde o <em>primeiro contato.</em></h2></div><div className="timeline reveal">{[['01','Conte o que aconteceu','Um relato breve ajuda a identificar a situação.'],['02','Envie as informações do voo','Bilhetes, protocolos e comprovantes organizam os fatos.'],['03','O caso é analisado','As circunstâncias são avaliadas individualmente.'],['04','Receba orientação','Os próximos passos são explicados com clareza.']].map(([n,t,p]) => <article key={n}><span>{n}</span><div className="timeline-dot" /><h3>{t}</h3><p>{p}</p></article>)}</div></section>

      <section className="faq" id="duvidas"><div className="faq-heading reveal"><p className="eyebrow">Dúvidas frequentes</p><h2>Informação clara para uma decisão mais tranquila.</h2><p>Algumas respostas iniciais para ajudar você a compreender melhor a sua situação.</p></div><div className="accordion reveal">{faqs.map(([question, answer], index) => <div className={`faq-item ${openFaq === index ? 'open' : ''}`} key={question}><button type="button" aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? null : index)}><span>{question}</span><i aria-hidden="true" /></button><div className="faq-answer"><div><p>{answer}</p></div></div></div>)}</div></section>

      <section className="final-cta"><div className="final-route" aria-hidden="true" /><p className="eyebrow reveal">Converse sobre o seu caso</p><h2 className="reveal">Seu voo teve<br /><em>um problema?</em></h2><p className="reveal">Conte o que aconteceu e dê o primeiro passo para entender a sua situação.</p><a className="button button-gold reveal" href={makeWhatsAppUrl()} target="_blank" rel="noreferrer">Falar com a Dra. Fernanda <span>↗</span></a></section>
    </main>

    <footer><div className="footer-main"><div className="footer-brand"><img src="/logo-transparente.png" alt="Dra. Fernanda Leite" /><p>{siteConfig.area}</p></div><div className="footer-contact"><a href={makeWhatsAppUrl()} target="_blank" rel="noreferrer"><small>WhatsApp</small>{siteConfig.contact.whatsappDisplay}</a><a href={`mailto:${siteConfig.contact.email}`}><small>E-mail</small>{siteConfig.contact.email}</a><a href={siteConfig.contact.instagramUrl} target="_blank" rel="noreferrer"><small>Instagram</small>{siteConfig.contact.instagram}</a></div><nav aria-label="Links do rodapé"><a href="#inicio">Início</a><a href="#atuacao">Atuação</a><a href="#sobre">Sobre</a><a href="#duvidas">Dúvidas</a></nav></div><div className="footer-bottom"><p>© {COPYRIGHT_YEAR} Dra. Fernanda Leite. Todos os direitos reservados.</p><p>Conteúdo institucional e informativo. Resultados dependem das circunstâncias de cada caso.</p></div></footer>
    <a className="floating-whatsapp" href={makeWhatsAppUrl()} target="_blank" rel="noreferrer" aria-label="Fale com a Dra. Fernanda pelo WhatsApp"><WhatsAppIcon /><span>Fale com a Dra. Fernanda</span></a>
  </div>;
}


