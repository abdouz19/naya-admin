import type { BlogArticle } from '@/types/blog';

export const mockBlogArticles: BlogArticle[] = [
  {
    id: 'premiers-pas-confiance',
    title: 'Les premiers pas pour avancer avec confiance',
    subtitle:
      'Comment dépasser la paralysie du doute et réenclencher une dynamique positive au quotidien.',
    category: 'Confiance',
    readTimeMinutes: 3,
    keyTakeaway:
      'La confiance ne précède pas l’action, elle en est la conséquence directe. Commencer par un micro-geste réalisable débloque l’élan.',
    exerciseTitle: 'Ton micro-geste du jour (2 min)',
    exercisePrompt:
      'Identifie une seule chose que tu repousses par manque d’assurance. Rends-la si petite qu’il est impossible d’échouer, et fais-la maintenant.',
    coachTrigger: 'Reprendre confiance',
    coachMessage:
      'J’ai lu l’article sur les premiers pas pour avancer avec confiance. Comment puis-je définir mon tout premier micro-geste cette semaine ?',
    sections: [
      {
        heading: 'Le mythe du courage préalable',
        content:
          'On attend souvent de "se sentir prêt" ou "d’avoir confiance" avant de postuler, de contacter une personne du réseau ou de poser les bases d’un projet. En réalité, le cerveau attend des preuves tangibles de succès avant de libérer le sentiment de sécurité intérieure.',
      },
      {
        heading: 'La règle de la micro-marche',
        content:
          'Plutôt que de viser un objectif monumental, découpe-le en une tâche de 5 minutes. Ouvrir un document et écrire 3 compétences suffit à relancer l’énergie.',
      },
      {
        heading: 'Accepter l’inconfort passager',
        content:
          'L’hésitation n’est pas un signe d’incompétence. C’est simplement le signe que tu t’aventures hors de ta zone de confort connue. Sois bienveillant avec ce ressenti et avance à ton rythme.',
      },
    ],
    isPublished: true,
    viewsCount: 342,
    createdAt: '2026-03-28T10:00:00.000Z',
    updatedAt: '2026-04-01T14:30:00.000Z',
  },
  {
    id: 'reconversion-valoriser-competences',
    title: 'Reconversion : valoriser ses compétences transférables',
    subtitle:
      'Tes années d’expérience passées ne sont jamais perdues. Apprends à les traduire pour ton nouveau projet.',
    category: 'Reconversion',
    readTimeMinutes: 4,
    keyTakeaway:
      'Les recruteurs n’achètent pas un intitulé de poste passé, ils recherchent des aptitudes d’adaptation et de résolution de problèmes réelles.',
    exerciseTitle: 'La matrice des compétences universelles',
    exercisePrompt:
      'Liste 3 compétences clés que tu as utilisées dans ton dernier métier (ex: gestion du stress, négociation, coordination) et écris comment elles s’appliquent directement à ton futur métier.',
    coachTrigger: 'Faire le point reconversion',
    coachMessage:
      'Je souhaite faire le point sur mes compétences transférables et trouver les bons mots pour valoriser mon parcours antérieur.',
    sections: [
      {
        heading: 'Changer de regard sur ton bagage',
        content:
          'Il est fréquent de ressentir le syndrome de l’imposteur en changeant de filière. Pourtant, une expérience en relation client apporte une écoute rare dans les métiers techniques, et une rigueur logistique fait des merveilles en gestion de projet.',
      },
      {
        heading: 'Raconter une trajectoire cohérente',
        content:
          'Plutôt que de masquer tes bifurcations, assume le fil conducteur : ta curiosité, ton envie d’impact ou ta quête d’utilité.',
      },
    ],
    isPublished: true,
    viewsCount: 289,
    createdAt: '2026-03-25T09:00:00.000Z',
    updatedAt: '2026-03-29T11:00:00.000Z',
  },
  {
    id: 'retour-emploi-apres-pause',
    title: 'Retour à l’emploi après une pause : reprendre sa place',
    subtitle:
      'Congé parental, arrêt, expatriation ou réflexion : comment aborder ce temps avec fierté et sérénité.',
    category: 'Retour à l’emploi',
    readTimeMinutes: 4,
    keyTakeaway:
      'Une pause de vie n’est pas un trou noir sur un CV : c’est une période riche en apprentissages humains et en maturation personnelle.',
    exerciseTitle: 'Le pitch sincère et percutant',
    exercisePrompt:
      'Rédige en 2 phrases simples l’explication de ta pause, en mettant l’accent sur ton énergie et ta motivation pour cette nouvelle étape.',
    coachTrigger: 'Préparer mon retour à l’emploi',
    coachMessage:
      'Je prépare mon retour sur le marché après une pause. Aide-moi à valoriser cette période sans gêne en entretien.',
    sections: [
      {
        heading: 'Normaliser les interruptions de parcours',
        content:
          'Les carrières linéaires sont devenues l’exception. Les recruteurs d’aujourd’hui valorisent la lucidité et la capacité à s’engager avec clarté.',
      },
      {
        heading: 'Se réancrer dans son écosystème',
        content:
          'Avant même d’envoyer des CV en masse, renoue le contact avec d’anciens collègues ou assiste à un événement sectoriel convivial.',
      },
    ],
    isPublished: true,
    viewsCount: 215,
    createdAt: '2026-03-20T08:30:00.000Z',
    updatedAt: '2026-03-20T08:30:00.000Z',
  },
  {
    id: 'lancer-son-activite-valider-idee',
    title: 'Créer son activité : valider son idée sans risque',
    subtitle:
      'Inutile de tout quitter du jour au lendemain. La méthode pas à pas pour tester l’appétence de tes futurs clients.',
    category: 'Création d’activité',
    readTimeMinutes: 5,
    keyTakeaway:
      'Ne crée pas d’abord l’offre parfaite dans ton coin : parle à 10 personnes concernées par le problème que tu souhaites résoudre.',
    exerciseTitle: 'Les 5 questions de découverte',
    exercisePrompt:
      'Contacte 2 personnes de ton réseau et demande-leur : "Quel est le plus grand casse-tête que tu rencontres aujourd’hui dans ce domaine ?" Note leurs mots exacts.',
    coachTrigger: 'Structurer mon projet d’entreprise',
    coachMessage:
      'J’ai une idée de création d’activité et je veux valider son marché avant d’engager trop de temps et d’argent.',
    sections: [
      {
        heading: 'L’écoute plutôt que la vente',
        content:
          'La phase de cadrage ne consiste pas à convaincre mais à comprendre les frustrations réelles de ton public cible.',
      },
      {
        heading: 'L’offre minimale viable',
        content:
          'Propose un premier service simple ou un prototype artisanal. Les retours directs valent des mois de réflexion théorique.',
      },
    ],
    isPublished: true,
    viewsCount: 410,
    createdAt: '2026-03-15T14:15:00.000Z',
    updatedAt: '2026-03-22T16:00:00.000Z',
  },
  {
    id: 'gerer-le-syndrome-de-limposteur',
    title: 'Surmonter le syndrome de l’imposteur en entretien',
    subtitle:
      'Comprendre pourquoi cette voix intérieure surgit et les techniques concrètes pour garder le cap.',
    category: 'Confiance',
    readTimeMinutes: 3,
    keyTakeaway:
      'Douter de soi prouve ton souci de bien faire et ton humilité. Transforme ce doute en rigueur de préparation.',
    exerciseTitle: 'Le carnet des victoires',
    exercisePrompt:
      'Écris 3 réalisations passées dont tu es fière (même petites). Relis-les 5 minutes avant ton prochain rendez-vous.',
    coachTrigger: 'Préparer un entretien sans stress',
    coachMessage:
      'Je ressens souvent le syndrome de l’imposteur avant un entretien important. Comment puis-je me calmer et convaincre ?',
    sections: [
      {
        heading: 'Identifier le critique intérieur',
        content:
          'Cette petite voix cherche à te protéger du danger. Remercie-la pour son intention mais rappelle-lui que tu as les compétences pour agir.',
      },
      {
        heading: 'S’appuyer sur des faits mesurables',
        content:
          'Remplace "J’ai eu de la chance" par "J’ai mobilisé telle ressource et telle persévérance pour obtenir ce résultat".',
      },
    ],
    isPublished: true,
    viewsCount: 198,
    createdAt: '2026-03-10T11:00:00.000Z',
    updatedAt: '2026-03-12T09:00:00.000Z',
  },
  {
    id: 'reseauter-avec-authenticite',
    title: 'Réseauter sans gêne : l’art des conversations sincères',
    subtitle:
      'Le networking n’est pas une démarche opportuniste, c’est tisser des liens humains bienveillants et durables.',
    category: 'Retour à l’emploi',
    readTimeMinutes: 4,
    keyTakeaway:
      'Le meilleur moyen d’obtenir de l’aide dans son réseau est d’abord de s’intéresser sincèrement au parcours des autres.',
    exerciseTitle: 'Le message de reprise de contact',
    exercisePrompt:
      'Envoie un message chaleureux à une personne avec qui tu as apprécié collaborer, simplement pour prendre de ses nouvelles, sans rien demander.',
    coachTrigger: 'Activer mon réseau',
    coachMessage:
      'Je veux réactiver mon réseau professionnel avec naturel et sans donner l’impression de ne contacter les gens que par intérêt.',
    sections: [
      {
        heading: 'Changer d’état d’esprit',
        content:
          'Considère chaque échange comme une découverte enrichissante plutôt que comme un entretien déguisé.',
      },
      {
        heading: 'La force des liens faibles',
        content:
          'Les opportunités les plus surprenantes viennent souvent de connaissances indirectes plutôt que du premier cercle restreint.',
      },
    ],
    isPublished: true,
    viewsCount: 165,
    createdAt: '2026-03-05T09:30:00.000Z',
    updatedAt: '2026-03-05T09:30:00.000Z',
  },
];
