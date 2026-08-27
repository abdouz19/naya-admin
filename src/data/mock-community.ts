import type { CommunityPost, CommunityReport } from '@/types/community';

export const mockPosts: CommunityPost[] = [
  {
    id: 'p1', user_id: 'u1', auteur: 'Fatima B.', initiale: 'F',
    contenu: 'Je viens de decrocher mon premier entretien depuis 6 mois ! J\'ai applique les conseils de l\'atelier sur les 3 premieres minutes et je me sens beaucoup plus confiante. Merci a toute la communaute pour le soutien.',
    type: 'victoire', reactions_count: 24, is_moderated: false, created_at: '2026-08-25T14:30:00Z', reports_count: 0,
  },
  {
    id: 'p2', user_id: 'u2', auteur: 'Amira K.', initiale: 'A',
    contenu: 'Quelqu\'un a-t-il des retours sur la methode de relance par email proposee par l\'IA ? J\'hesite a relancer une entreprise apres 2 semaines sans reponse.',
    type: 'question', reactions_count: 8, is_moderated: false, created_at: '2026-08-25T10:15:00Z', reports_count: 0,
  },
  {
    id: 'p3', user_id: 'u3', auteur: 'Leila M.', initiale: 'L',
    contenu: 'Apres 4 mois de recherche intense, j\'ai signe mon CDI chez LVMH ! Le parcours Nayha m\'a vraiment aidee a structurer ma demarche et a reprendre confiance en moi. Ne lachons rien les filles !',
    type: 'victoire', reactions_count: 42, is_moderated: false, created_at: '2026-08-24T16:00:00Z', reports_count: 0,
  },
  {
    id: 'p4', user_id: 'u5', auteur: 'Samira E.', initiale: 'S',
    contenu: 'Je partage mon experience de reconversion dans le dev web. Il y a un an, je n\'avais aucune competence technique. Aujourd\'hui, j\'ai deux offres d\'emploi. La cle : la perseverance et un bon accompagnement.',
    type: 'temoignage', reactions_count: 35, is_moderated: false, created_at: '2026-08-24T11:20:00Z', reports_count: 0,
  },
  {
    id: 'p5', user_id: 'u7', auteur: 'Marie D.', initiale: 'M',
    contenu: 'Petite victoire du jour : j\'ai ose appeler directement une RH au lieu d\'envoyer un mail. Elle m\'a donne des informations precieuses sur le poste. Parfois il faut juste oser !',
    type: 'normal', reactions_count: 18, is_moderated: false, created_at: '2026-08-23T15:45:00Z', reports_count: 0,
  },
  {
    id: 'p6', user_id: 'u9', auteur: 'Camille R.', initiale: 'C',
    contenu: 'Comment gerez-vous le stress avant un entretien ? J\'en ai un demain matin et je suis tres nerveuse. Des conseils ?',
    type: 'question', reactions_count: 12, is_moderated: false, created_at: '2026-08-23T20:00:00Z', reports_count: 0,
  },
  {
    id: 'p7', user_id: 'u4', auteur: 'Nadia B.', initiale: 'N',
    contenu: 'J\'ai fait ma premiere simulation d\'entretien avec l\'IA et c\'etait bluffant. Les questions etaient tres realistes et le feedback m\'a permis d\'identifier mes points faibles. Je recommande !',
    type: 'normal', reactions_count: 15, is_moderated: false, created_at: '2026-08-22T09:30:00Z', reports_count: 0,
  },
  {
    id: 'p8', user_id: 'u11', auteur: 'Aurelie B.', initiale: 'A',
    contenu: 'Jour 30 de ma recherche d\'emploi. 6 candidatures envoyees, 1 entretien obtenu. C\'est lent mais je reste motivee. Le bilan mensuel de l\'IA m\'aide a garder le cap.',
    type: 'normal', reactions_count: 20, is_moderated: false, created_at: '2026-08-22T14:15:00Z', reports_count: 0,
  },
  {
    id: 'p9', user_id: 'u13', auteur: 'Claire P.', initiale: 'C',
    contenu: 'Je voulais remercier la communaute. Quand j\'ai commence sur Nayha il y a 5 semaines, je ne croyais plus en moi. Aujourd\'hui j\'ai une offre en CDI comme chef de projet. Votre soutien a fait la difference.',
    type: 'victoire', reactions_count: 38, is_moderated: false, created_at: '2026-08-21T17:00:00Z', reports_count: 0,
  },
  {
    id: 'p10', user_id: 'u14', auteur: 'Khadija A.', initiale: 'K',
    contenu: 'Est-ce normal de se sentir decouragee apres une semaine sans reponse ? J\'ai l\'impression de ne rien faire de bien.',
    type: 'question', reactions_count: 14, is_moderated: false, created_at: '2026-08-21T10:30:00Z', reports_count: 0,
  },
  {
    id: 'p11', user_id: 'u15', auteur: 'Julie M.', initiale: 'J',
    contenu: 'Astuce LinkedIn qui a marche pour moi : au lieu de juste postuler, j\'ai contacte directement la personne qui a poste l\'offre avec un message personnalise. Resultat : entretien dans la semaine !',
    type: 'normal', reactions_count: 27, is_moderated: false, created_at: '2026-08-20T13:00:00Z', reports_count: 0,
  },
  {
    id: 'p12', user_id: 'u6', auteur: 'Sophie M.', initiale: 'S',
    contenu: 'J\'ai utilise le generateur de CV adapte pour postuler chez Airbus. Le resultat est vraiment professionnel. Ca change completement de ce que je faisais avant.',
    type: 'normal', reactions_count: 11, is_moderated: false, created_at: '2026-08-20T09:45:00Z', reports_count: 0,
  },
  {
    id: 'p13', user_id: 'u8', auteur: 'Yasmine H.', initiale: 'Y',
    contenu: 'En tant que graphiste freelance, je me demande si le parcours creation d\'activite est fait pour moi. Quelqu\'un l\'a teste ? Est-ce que ca aide aussi pour le freelance ?',
    type: 'question', reactions_count: 6, is_moderated: false, created_at: '2026-08-19T16:20:00Z', reports_count: 0,
  },
  {
    id: 'p14', user_id: 'u1', auteur: 'Fatima B.', initiale: 'F',
    contenu: 'Conseil du jour : preparez une liste de 5 questions a poser en entretien. Ca montre votre interet et ca detourne l\'attention de votre stress. Ca a marche pour moi chez BNP !',
    type: 'normal', reactions_count: 22, is_moderated: false, created_at: '2026-08-19T11:00:00Z', reports_count: 0,
  },
  {
    id: 'p15', user_id: 'u10', auteur: 'Ines C.', initiale: 'I',
    contenu: 'Mon parcours de reconversion vers le social avance doucement. Le diagnostic pro m\'a beaucoup aidee a comprendre que mes competences de communication etaient transferables.',
    type: 'temoignage', reactions_count: 9, is_moderated: false, created_at: '2026-08-18T14:30:00Z', reports_count: 0,
  },
  {
    id: 'p16', user_id: 'u2', auteur: 'Amira K.', initiale: 'A',
    contenu: 'Update : j\'ai finalement relance l\'entreprise et ils m\'ont repondu dans l\'heure ! L\'email genere par l\'IA etait parfait, poli mais assertif. Entretien la semaine prochaine !',
    type: 'normal', reactions_count: 19, is_moderated: false, created_at: '2026-08-18T10:00:00Z', reports_count: 0,
  },
  {
    id: 'p17', user_id: 'u7', auteur: 'Marie D.', initiale: 'M',
    contenu: 'Quelqu\'un connait les tests de paie en entretien ? On m\'a dit que certains cabinets en font passer. Je veux me preparer.',
    type: 'question', reactions_count: 5, is_moderated: false, created_at: '2026-08-17T15:30:00Z', reports_count: 0,
  },
  {
    id: 'p18', user_id: 'u9', auteur: 'Camille R.', initiale: 'C',
    contenu: 'CDI signe a La Banque Postale ! Je n\'y croyais plus apres le refus de la Maif. Morale : chaque refus est un pas vers la bonne opportunite.',
    type: 'victoire', reactions_count: 31, is_moderated: false, created_at: '2026-08-17T12:00:00Z', reports_count: 0,
  },
  {
    id: 'p19', user_id: 'u4', auteur: 'Nadia B.', initiale: 'N',
    contenu: 'Le plan d\'action de la semaine m\'a permis de rester organisee. 3 candidatures envoyees et 1 relance faite. Petit a petit, on avance.',
    type: 'normal', reactions_count: 13, is_moderated: false, created_at: '2026-08-16T09:00:00Z', reports_count: 0,
  },
  {
    id: 'p20', user_id: 'u11', auteur: 'Aurelie B.', initiale: 'A',
    contenu: 'J\'ai decouvert l\'atelier sur la negociation salariale et ca a completement change ma vision. Je ne savais pas qu\'on pouvait negocier meme en debut de carriere !',
    type: 'normal', reactions_count: 16, is_moderated: false, created_at: '2026-08-15T14:20:00Z', reports_count: 0,
  },
  {
    id: 'p21', user_id: 'u13', auteur: 'Claire P.', initiale: 'C',
    contenu: 'Pour celles qui hesitent a faire le diagnostic de vie : foncez. Ca m\'a permis de comprendre pourquoi je bloquais sur certaines candidatures. C\'est pas facile mais ca vaut le coup.',
    type: 'temoignage', reactions_count: 17, is_moderated: false, created_at: '2026-08-15T10:45:00Z', reports_count: 0,
  },
  {
    id: 'p22', user_id: 'u5', auteur: 'Samira E.', initiale: 'S',
    contenu: 'J\'ai fait deux entretiens techniques cette semaine. Le premier etait difficile, mais le feedback de l\'IA m\'a aidee a mieux preparer le second. Progression constante !',
    type: 'normal', reactions_count: 14, is_moderated: false, created_at: '2026-08-14T16:30:00Z', reports_count: 0,
  },
  {
    id: 'p23', user_id: 'u14', auteur: 'Khadija A.', initiale: 'K',
    contenu: 'Merci pour vos messages de soutien la semaine derniere. Ca m\'a remotivee et j\'ai envoye 3 nouvelles candidatures. On lache rien !',
    type: 'normal', reactions_count: 21, is_moderated: false, created_at: '2026-08-14T11:00:00Z', reports_count: 0,
  },
  {
    id: 'p24', user_id: 'u15', auteur: 'Julie M.', initiale: 'J',
    contenu: 'Acceptee chez Sezane en CDI ! Je suis community manager ! Merci Nayha, merci la communaute. Ce parcours a change ma vie.',
    type: 'victoire', reactions_count: 45, is_moderated: false, created_at: '2026-08-13T17:30:00Z', reports_count: 0,
  },
  {
    id: 'p25', user_id: 'u6', auteur: 'Sophie M.', initiale: 'S',
    contenu: 'Comment choisir entre deux offres d\'emploi ? C\'est un probleme de luxe mais je suis perdue. L\'une est mieux payee, l\'autre est plus proche de chez moi.',
    type: 'question', reactions_count: 7, is_moderated: false, created_at: '2026-08-13T09:15:00Z', reports_count: 0,
  },
  {
    id: 'p26', user_id: 'u3', auteur: 'Leila M.', initiale: 'L',
    contenu: 'L\'analyse des offres par l\'IA m\'a fait gagner un temps fou. Au lieu de postuler partout, je cible les offres qui correspondent vraiment a mon profil. Qualite > quantite.',
    type: 'normal', reactions_count: 19, is_moderated: false, created_at: '2026-08-12T14:00:00Z', reports_count: 0,
  },
  {
    id: 'p27', user_id: 'u7', auteur: 'Marie D.', initiale: 'M',
    contenu: 'Mon deuxieme entretien chez Groupe Crit s\'est tres bien passe. Reponse la semaine prochaine. Les doigts croises !',
    type: 'normal', reactions_count: 10, is_moderated: false, created_at: '2026-08-12T10:30:00Z', reports_count: 0,
  },
  {
    id: 'p28', user_id: 'u12', auteur: 'Salima O.', initiale: 'S',
    contenu: 'Je suis formatrice FLE et je cherche a creer mon activite. Le parcours creation d\'activite est-il adapte a l\'enseignement ? Merci pour vos retours.',
    type: 'question', reactions_count: 4, is_moderated: false, created_at: '2026-08-11T16:45:00Z', reports_count: 0,
  },
  {
    id: 'p29', user_id: 'u1', auteur: 'Fatima B.', initiale: 'F',
    contenu: 'Weekend productif : j\'ai optimise mon profil LinkedIn grace a l\'atelier et j\'ai deja recu 2 messages de recruteurs. Le contenu de l\'atelier est vraiment pertinent.',
    type: 'normal', reactions_count: 23, is_moderated: false, created_at: '2026-08-11T09:30:00Z', reports_count: 0,
  },
  {
    id: 'p30', user_id: 'u4', auteur: 'Nadia B.', initiale: 'N',
    contenu: 'Premier mois sur Nayha : 5 candidatures, 1 entretien, beaucoup d\'apprentissages. Le plus important : j\'ai arrete de me comparer aux autres et je me concentre sur mon propre chemin.',
    type: 'temoignage', reactions_count: 26, is_moderated: false, created_at: '2026-08-10T13:00:00Z', reports_count: 0,
  },
  {
    id: 'p31', user_id: 'u2', auteur: 'Amira K.', initiale: 'A',
    contenu: 'L\'atelier sur le reseau professionnel m\'a ouvert les yeux. J\'ai contacte 3 anciennes collegues et l\'une d\'elles m\'a parle d\'un poste ouvert dans sa boite !',
    type: 'normal', reactions_count: 17, is_moderated: false, created_at: '2026-08-10T08:45:00Z', reports_count: 0,
  },
  {
    id: 'p32', user_id: 'u9', auteur: 'Camille R.', initiale: 'C',
    contenu: 'Retour d\'experience : la lettre de motivation generee par l\'IA est une bonne base, mais il faut toujours la personnaliser. J\'ajoute toujours une anecdote personnelle et ca fait la difference.',
    type: 'normal', reactions_count: 15, is_moderated: false, created_at: '2026-08-09T15:20:00Z', reports_count: 0,
  },
  {
    id: 'p33', user_id: 'u11', auteur: 'Aurelie B.', initiale: 'A',
    contenu: 'Est-ce que vous envoyez vos candidatures le lundi matin ou le vendredi soir ? J\'ai lu des avis contradictoires sur le meilleur timing.',
    type: 'question', reactions_count: 8, is_moderated: false, created_at: '2026-08-09T09:00:00Z', reports_count: 0,
  },
  {
    id: 'p34', user_id: 'u5', auteur: 'Samira E.', initiale: 'S',
    contenu: 'CDI signe chez Doctolib ! Je commence en septembre comme developpeure React. De femme au foyer a developpeuse en 14 mois. Tout est possible.',
    type: 'victoire', reactions_count: 48, is_moderated: false, created_at: '2026-08-08T18:00:00Z', reports_count: 0,
  },
  {
    id: 'p35', user_id: 'u13', auteur: 'Claire P.', initiale: 'C',
    contenu: 'Mon conseil pour l\'entretien : ecoutez vraiment la question avant de repondre. La simulation d\'entretien m\'a appris a prendre 3 secondes de reflexion au lieu de me precipiter.',
    type: 'normal', reactions_count: 12, is_moderated: false, created_at: '2026-08-08T10:30:00Z', reports_count: 0,
  },
  {
    id: 'p36', user_id: 'u8', auteur: 'Yasmine H.', initiale: 'Y',
    contenu: 'J\'ai mis a jour mon portfolio grace aux conseils de l\'atelier posture pro. Ca m\'a aidee a mieux presenter mon travail et a avoir confiance en mes creations.',
    type: 'normal', reactions_count: 9, is_moderated: false, created_at: '2026-08-07T14:00:00Z', reports_count: 0,
  },
  {
    id: 'p37', user_id: 'u14', auteur: 'Khadija A.', initiale: 'K',
    contenu: 'Entretien chez Zara demain. La mise en situation en magasin me stresse un peu. Des conseils pour les entretiens dans la vente ?',
    type: 'question', reactions_count: 6, is_moderated: false, created_at: '2026-08-07T20:15:00Z', reports_count: 0,
  },
  {
    id: 'p38', user_id: 'u3', auteur: 'Leila M.', initiale: 'L',
    contenu: 'Le bilan mensuel de l\'IA est un outil genial. Il m\'a montre que j\'avais envoye 3 fois plus de candidatures ce mois-ci que le precedent. La regularite paie.',
    type: 'normal', reactions_count: 14, is_moderated: false, created_at: '2026-08-06T11:30:00Z', reports_count: 0,
  },
  {
    id: 'p39', user_id: 'u7', auteur: 'Marie D.', initiale: 'M',
    contenu: 'Ca y est, j\'ai mon premier entretien pour un poste de gestionnaire de paie. L\'IA m\'a aidee a preparer un pitch parfait. Souhaitez-moi bonne chance !',
    type: 'normal', reactions_count: 20, is_moderated: false, created_at: '2026-08-05T16:00:00Z', reports_count: 0,
  },
  // Posts with reports
  {
    id: 'p40', user_id: 'u22', auteur: 'Myriam T.', initiale: 'M',
    contenu: 'Je vends des formations en ligne pour trouver un emploi rapidement. Contactez-moi en prive pour plus d\'infos. Resultats garantis en 2 semaines.',
    type: 'normal', reactions_count: 1, is_moderated: true, created_at: '2026-08-04T10:00:00Z', reports_count: 3,
  },
  {
    id: 'p41', user_id: 'u24', auteur: 'Djamila F.', initiale: 'D',
    contenu: 'Franchement cette appli sert a rien, les conseils sont nuls et l\'IA raconte n\'importe quoi. Vous perdez votre temps ici.',
    type: 'normal', reactions_count: 2, is_moderated: false, created_at: '2026-08-03T14:30:00Z', reports_count: 2,
  },
  {
    id: 'p42', user_id: 'u21', auteur: 'Laura G.', initiale: 'L',
    contenu: 'Mon numero de telephone est le 06 XX XX XX XX, appelez-moi si vous voulez discuter emploi. Je peux aussi vous donner des contacts dans plusieurs entreprises.',
    type: 'normal', reactions_count: 0, is_moderated: true, created_at: '2026-08-02T16:45:00Z', reports_count: 2,
  },
  {
    id: 'p43', user_id: 'u23', auteur: 'Charlotte L.', initiale: 'C',
    contenu: 'Les recruteurs sont tous des menteurs, ils vous disent qu\'ils vont rappeler et jamais rien. Ce systeme est pourri et corrompu.',
    type: 'normal', reactions_count: 3, is_moderated: false, created_at: '2026-08-01T11:20:00Z', reports_count: 1,
  },
  {
    id: 'p44', user_id: 'u15', auteur: 'Julie M.', initiale: 'J',
    contenu: 'Pour celles qui debutent : le diagnostic de vie peut sembler long mais il est essentiel. Prenez le temps de bien y repondre, ca change tout pour la suite du parcours.',
    type: 'normal', reactions_count: 11, is_moderated: false, created_at: '2026-07-31T09:00:00Z', reports_count: 0,
  },
  {
    id: 'p45', user_id: 'u10', auteur: 'Ines C.', initiale: 'I',
    contenu: 'Vous pensez que je devrais ajouter mes experiences de benevole sur mon CV ? L\'IA me dit que oui mais je ne suis pas sure que les recruteurs apprecient.',
    type: 'question', reactions_count: 7, is_moderated: false, created_at: '2026-07-30T15:30:00Z', reports_count: 0,
  },
];

export const mockReports: CommunityReport[] = [
  { id: 'r1', post_id: 'p40', user_id: 'u1', reason: 'Spam et promotion commerciale non autorisee', created_at: '2026-08-04T10:30:00Z' },
  { id: 'r2', post_id: 'p40', user_id: 'u5', reason: 'Contenu commercial, pas sa place ici', created_at: '2026-08-04T11:00:00Z' },
  { id: 'r3', post_id: 'p40', user_id: 'u9', reason: 'Publicite deguisee pour une formation payante', created_at: '2026-08-04T12:15:00Z' },
  { id: 'r4', post_id: 'p41', user_id: 'u2', reason: 'Contenu negatif et demoralisant pour les autres', created_at: '2026-08-03T15:00:00Z' },
  { id: 'r5', post_id: 'p41', user_id: 'u13', reason: 'Propos deplacees et manque de respect envers la communaute', created_at: '2026-08-03T16:30:00Z' },
  { id: 'r6', post_id: 'p42', user_id: 'u3', reason: 'Partage de donnees personnelles (numero de telephone)', created_at: '2026-08-02T17:00:00Z' },
  { id: 'r7', post_id: 'p42', user_id: 'u7', reason: 'Informations personnelles sensibles partagees publiquement', created_at: '2026-08-02T18:30:00Z' },
  { id: 'r8', post_id: 'p43', user_id: 'u4', reason: 'Propos generalisant et agressif', created_at: '2026-08-01T12:00:00Z' },
  { id: 'r9', post_id: 'p41', user_id: 'u11', reason: 'Message toxique qui peut decourager les autres', created_at: '2026-08-04T08:00:00Z' },
  { id: 'r10', post_id: 'p42', user_id: 'u15', reason: 'Numero de telephone visible, risque de securite', created_at: '2026-08-03T09:00:00Z' },
  { id: 'r11', post_id: 'p40', user_id: 'u14', reason: 'Spam publicitaire', created_at: '2026-08-04T14:00:00Z' },
  { id: 'r12', post_id: 'p43', user_id: 'u6', reason: 'Langage inapproprie et generalisation abusive', created_at: '2026-08-01T14:30:00Z' },
];
