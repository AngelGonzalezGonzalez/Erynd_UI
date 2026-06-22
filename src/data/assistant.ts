// ERYND Intelligence — assistant intent routing (scripted for the prototype).
// Matches plain language to the capability that should materialize inline,
// and replies in ERYND's editorial voice. The assistant is nameless.

import type { Artifact, AutonomyLevel, ChatMessage, Locale, SurfaceKind } from '../lib/types';

let n = 0;
const aid = () => `a-${Date.now().toString(36)}-${n++}`;

type Reply = Pick<ChatMessage, 'text' | 'textKey' | 'artifact' | 'proposal'>;
type Bi = { en: string; es: string };

const pick = (b: Bi, l: Locale) => b[l];

interface Rule {
  test: RegExp;
  kind: SurfaceKind;
  title: string;
  say: Bi;
  // when autonomy is 0 (Ask), outbound-ish work is offered as a proposal first
  proposeWhenAsk?: { label: Bi; action: Bi; outbound?: boolean };
}

const rules: Rule[] = [
  {
    test: /(brief|happening|today|what'?s new|qué pasa|hoy|resumen|al día)/i,
    kind: 'briefing',
    title: 'brief.title',
    say: {
      en: 'Here’s where things stand. One thing genuinely needs you; the rest is calm.',
      es: 'Esto es lo que hay. Una cosa te necesita de verdad; lo demás está en calma.',
    },
  },
  {
    test: /(sentiment|why|drop|fell|decline|chart|analy|share of voice|sentimiento|por qué|cayó|baj)/i,
    kind: 'analytics',
    title: 'an.title',
    say: {
      en: 'Sentiment dipped Thursday–Friday as the battery thread spread, then steadied as the fix narrative formed. Click any point to read the mentions behind it.',
      es: 'El sentimiento cayó jueves–viernes al difundirse el hilo de la batería, y se estabilizó al formarse la narrativa de la solución. Haz clic en cualquier punto para leer las menciones.',
    },
  },
  {
    test: /(respond|reply|draft|statement|message|counter|responde|redacta|borrador|mensaje)/i,
    kind: 'response',
    title: 'resp.title',
    say: {
      en: 'I’ve drafted three angles in your brand voice, scored for clarity and tone. Nothing leaves without your approval.',
      es: 'He redactado tres enfoques en tu voz de marca, con puntaje de claridad y tono. Nada sale sin tu aprobación.',
    },
    proposeWhenAsk: {
      label: {
        en: 'I can draft a response to the battery complaints for you to review.',
        es: 'Puedo redactar una respuesta a las quejas de batería para que la revises.',
      },
      action: { en: 'Draft it', es: 'Redáctala' },
    },
  },
  {
    test: /(journalist|reporter|pitch|media relation|press|periodista|prensa|propuesta)/i,
    kind: 'crm',
    title: 'crm.title',
    say: {
      en: 'I matched five journalists to this story by beat, history, and fit. Amara wrote today’s piece — worth a concrete fix timeline.',
      es: 'Emparejé cinco periodistas con esta historia por tema, historial y afinidad. Amara escribió la nota de hoy — vale darle una fecha concreta de corrección.',
    },
    proposeWhenAsk: {
      label: {
        en: 'I can prepare a pitch to Amara at The Signal.',
        es: 'Puedo preparar una propuesta para Amara en The Signal.',
      },
      action: { en: 'Prepare pitch', es: 'Preparar propuesta' },
      outbound: true,
    },
  },
  {
    test: /(action|team|working|kanban|track|board|acción|equipo|tablero|seguimiento)/i,
    kind: 'kanban',
    title: 'kan.title',
    say: {
      en: 'Here’s the board. Two items are mine to propose; the measured column already shows the support thread paying off.',
      es: 'Aquí está el tablero. Dos elementos los propongo yo; la columna de medidos ya muestra que el hilo de soporte rinde frutos.',
    },
  },
  {
    test: /(roi|return|attribution|impact|board report|retorno|atribución|impacto|informe)/i,
    kind: 'roi',
    title: 'roi.title',
    say: {
      en: 'Last quarter’s response work returned an estimated 3.4× — most of it earned, not paid. I traced it down to the actions that drove it.',
      es: 'El trabajo de respuesta del trimestre pasado rindió un estimado de 3,4× — en su mayoría ganado, no pagado. Lo rastreé hasta las acciones que lo impulsaron.',
    },
  },
  {
    test: /(publish|post|schedule|social|tweet|publica|programa|publicación)/i,
    kind: 'publisher',
    title: 'pub.title',
    say: {
      en: 'Composer’s ready — write once and I’ll adapt it per platform, with a best-time suggestion. It’ll need your approval before it queues.',
      es: 'El compositor está listo — escribe una vez y lo adapto por plataforma, con sugerencia de mejor hora. Necesitará tu aprobación antes de encolar.',
    },
    proposeWhenAsk: {
      label: {
        en: 'I can schedule a post about the firmware fix.',
        es: 'Puedo programar una publicación sobre la solución de firmware.',
      },
      action: { en: 'Compose it', es: 'Componla' },
      outbound: true,
    },
  },
  {
    test: /(search|track|monitor|query|build|boolean|rastrea|monitorea|consulta|búsqueda)/i,
    kind: 'search',
    title: 'srch.title',
    say: {
      en: 'Tell me what to watch in plain language and I’ll write the query — no Boolean gymnastics unless you want them.',
      es: 'Dime qué observar en lenguaje natural y yo escribo la consulta — sin gimnasia booleana, salvo que la quieras.',
    },
  },
];

const fallback: Bi = {
  en: 'I can pull a briefing, dig into analytics, draft a response, find a journalist, track actions, or build a search. What would help?',
  es: 'Puedo traer un briefing, analizar métricas, redactar una respuesta, encontrar un periodista, seguir acciones o crear una búsqueda. ¿Qué te ayuda?',
};

export function routeIntent(text: string, autonomy: AutonomyLevel, locale: Locale = 'en'): Reply {
  const rule = rules.find((r) => r.test.test(text));
  if (!rule) return { text: pick(fallback, locale) };

  // At "Ask" autonomy, outbound/creative work is offered as a proposal first.
  if (autonomy === 0 && rule.proposeWhenAsk) {
    return {
      text: pick(rule.proposeWhenAsk.label, locale),
      proposal: {
        label: pick(rule.proposeWhenAsk.action, locale),
        actionLabel: pick(rule.proposeWhenAsk.action, locale),
        kind: rule.kind,
        title: rule.title,
        outbound: rule.proposeWhenAsk.outbound,
      },
    };
  }

  const artifact: Artifact = { id: aid(), kind: rule.kind, title: rule.title };
  return { text: pick(rule.say, locale), artifact };
}

/** Build the artifact a proposal resolves into once approved. */
export function artifactForKind(kind: SurfaceKind, title: string): Artifact {
  return { id: aid(), kind, title };
}
