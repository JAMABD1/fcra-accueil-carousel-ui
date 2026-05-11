# Rapport d’orthographe et de grammaire (français)

Audit des chaînes françaises présentes dans l’interface du dépôt `fcra-accueil-carousel-ui` (principalement `src/pages`, `src/components`). Ce document liste les **écarts** par rapport au français standard : accord, conjugaison, typographie, cohérence et anglicismes.

---

## Synthèse rapide

| Priorité | Type de problème | Exemples |
|----------|------------------|----------|
| Élevée | Accord / conjugaison | « se concrétise » (sujet pluriel), « domaines éducatif » |
| Élevée | Titres répétés incorrects | « Derniers Actualités », « Notre Missions » |
| Moyenne | Phrases incomplètes / doublons | Paragraphe répété sur l’histoire (page d’accueil) |
| Moyenne | Construction syntaxique | Phrase RVS (relatif « qui » mal rattaché) |
| Basse | Typographie / cohérence | Espace avant virgule, mélange français / anglais |

---

## 1. Page d’accueil — `src/pages/Index.tsx`

### 1.1 Titre de carte : « Notre Missions »

- **Texte actuel :** `Notre Missions`
- **Problème :** accord (singulier + pluriel mélangés).
- **Corrections possibles :**
  - « **Notre mission** » (au singulier, si une seule mission est décrite) ;
  - ou « **Nos missions** » (au pluriel, cohérent avec la liste à puces en dessous).

### 1.2 Accord des adjectifs après « domaines »

- **Texte actuel :** « dans les domaines éducatif, social, spirituel et communautaire »
- **Problème :** avec « domaines » au pluriel, les épithètes se mettent au pluriel.
- **Correction recommandée :** « dans les domaines **éducatifs, sociaux, spirituels** et **communautaires** ».

*(Alternative acceptable : mettre « domaine » au singulier et garder les adjectifs au singulier : « dans le domaine éducatif, social… ».)*

### 1.3 Section « Notre Histoire » — paragraphe dupliqué / fragment

- **Texte problématique :** après la liste à puces, un paragraphe répète une partie du dernier tiret (« Les projets communautaires durables, visant à renforcer… ») comme phrase isolée, ce qui **n’est pas une phrase complète** dans ce contexte et **redouble** le contenu du dernier item de liste.
- **Action :** supprimer ce paragraphe ou le reformuler en complétant la syntaxe (par ex. en l’intégrant à la phrase précédente).

### 1.4 Bloc actualités — genre et accord

- **Titre actuel :** « **Derniers** Actualités »
- **Problème :** « actualités » est féminin pluriel ; « dernier » doit s’accorder.
- **Correction :** « **Dernières actualités** ».

- **Lien actuel :** « Voir **tous** les actualités »
- **Problème :** « actualité / actualités » est féminin ; « tous » ne s’accorde pas.
- **Correction :** « Voir **toutes** les actualités » (ou « **Tout** l’actualité » si vous préférez le singulier collectif).

---

## 2. En-tête / pied de page — `src/components/Layout.tsx`

### 2.1 Adresse (typographie)

- **Texte actuel :** `Antaniavo , Antohomadinika`
- **Problème :** en français, **pas d’espace avant la virgule** (contrairement aux deux-points et au point-virgule où une espace fine est usuelle).
- **Correction :** « Antaniavo**,** Antohomadinika ».

### 2.2 Cohérence de la langue affichée

- **Desktop :** libellé « **fr** » sur le bouton langue.
- **Mobile :** « **Français** ».
- **Remarque :** ce n’est pas une erreur grammaticale, mais une **incohérence d’UI** ; à harmoniser pour l’expérience utilisateur.

---

## 3. Section Radio RVS — `src/components/RVSSection.tsx`

### 3.1 Titre de coopération

- **Texte actuel :** « COOPÉRATION **DE** LA RVS **ET** L'ORTM »
- **Problème :** construction maladroite ; on attend plutôt une relation **entre** deux entités.
- **Correction suggérée :** « COOPÉRATION **ENTRE** LA RVS **ET** L'ORTM ».

### 3.2 Conjugaison du verbe « se concrétiser »

- **Texte actuel :** « La RVS et l'ORTM **se concrétise** »
- **Problème :** sujet **pluriel** (deux entités reliées par « et ») → verbe au pluriel.
- **Correction :** « La RVS et l'ORTM **se concrétisent** ».

### 3.3 Phrase sur l’émission (relatif et accord)

- **Texte actuel (extrait) :** « … des sujets importants **qui est produite** par Mme Asma. »
- **Problème :** le relatif « qui » ne peut pas rattacher correctement « sujets » (masculin pluriel) à « est produite » (féminin singulier). La **proposition relative est défectueuse**.
- **Corrections possibles :**
  - mettre l’information sur la production **sur l’émission** : « Cette émission, produite par Mme Asma, vise à… » ;
  - ou corriger l’accord si « qui » renvoie bien aux sujets : « … sujets importants **qui sont** traités / **produits** par… » (selon le sens voulu).

### 3.4 Accent et lexique

- **Objets :** « **Eduquer** » → « **Éduquer** » (accent aigu).

### 3.5 Nombre de stations

- **Texte :** « **09** stations »
- **Remarque :** en texte courant, on écrit plutôt « **9** » ou « **neuf** » ; le zéro initial est surtout administratif. À normaliser selon la charte éditoriale.

---

## 4. Liste des sections — `src/pages/Sections.tsx`

### 4.1 Accord avec « tous »

- **Texte actuel :** « Découvrez **tous** nos domaines d'activité **et** programmes dédiés à… »
- **Problème :** « tous » s’accorde avec « domaines » mais pas avec « programmes » ; la phrase prête à confusion.
- **Corrections possibles :**
  - « Découvrez **tous** nos domaines d'activité **et tous** nos programmes dédiés à… » ;
  - ou : « Découvrez nos domaines d'activité **ainsi que** nos programmes dédiés à… » (sans « tous »).

---

## 5. Détail de section — `src/pages/SectionDetail.tsx`

### 5.1 Répétition du titre erroné

- **Texte actuel :** « **Derniers** Actualités » (même erreur que sur la page d’accueil).
- **Correction :** « **Dernières actualités** ».

### 5.2 Pléonasme (style)

- **Texte :** « Les **dernières nouvelles** et **actualités** liées à cette section »
- **Remarque :** « nouvelles » et « actualités » se recoupent ; on peut alléger : « Les **dernières actualités** liées à cette section ».

---

## 6. Enseignement supérieur — `src/components/UniversitesSection.tsx`

### 6.1 Majuscule à l’adjectif de nationalité

- **Texte actuel :** « sept jeunes **Malgaches** »
- **Règle usuelle :** l’adjectif de nationalité se met en **minuscule** : « sept jeunes **malgaches** ».

### 6.2 Verbe « intégrer » et complément

- **Texte actuel :** « ont intégré Parul University **dans** des formations telles que »
- **Problème :** on **intègre** une **organisation** (une université, un cycle), pas « dans des formations » de cette manière.
- **Correction suggérée :** « ont **rejoint** Parul University **pour y suivre** des formations telles que » ou « ont **été admis à** Parul University **et ont suivi** des formations telles que ».

### 6.3 Lexique

- **« autonomisation »** — calque possible de l’anglais *empowerment* ; en français institutionnel on peut préférer « **renforcement de l’autonomie** » ou « **promotion de l’autonomie** » selon le registre.

---

## 7. Carrousel / administration — `src/components/TaggedHeroCarousel.tsx`, `src/components/HeroCarousel.tsx`

### 7.1 Anglicismes dans l’interface française

- **Exemples :** « **image hero** », « **Aucun hero trouvé** », « **Gestion des Heroes** » (`HeroManager.tsx`).
- **Remarque :** pour un site entièrement en français, préférer des libellés du type « **bannière d’accueil** », « **diaporama** », « **Aucune bannière disponible** », « **Gestion des bannières** » (ou « **visuels d’accueil** » selon le vocabulaire interne).

---

## 8. Messages utilisateur (toasts, formulaires)

### 8.1 Ponctuation française

- **Exemple :** `Votre compte a été créé avec succès!` (`SignUp.tsx`)
- **Typographie française :** espace **avant** les signes doubles `!`, `?`, `;` et `:` dans un texte soigné (ex. « succès&nbsp;! » avec espace insécable en publication).

*(Même logique pour `?` et `;` si vous uniformisez les textes.)*

---

## 9. Page 404 — `src/pages/NotFound.tsx`

- **Texte entièrement en anglais** (« Page not found », « Return to Home ») alors que le reste du site est en français.
- **Suggestion :** « Page introuvable », « **Retour** à l’**accueil** » (ou « Retourner à l’accueil »).

---

## Fichiers les plus concernés (pour corrections ciblées)

| Fichier | Problèmes notables |
|---------|--------------------|
| `src/pages/Index.tsx` | Missions, accords, actualités, doublon historique |
| `src/components/Layout.tsx` | Typographie adresse |
| `src/components/RVSSection.tsx` | Conjugaison, titre, relative, accent |
| `src/pages/Sections.tsx` | Accord « tous … et programmes » |
| `src/pages/SectionDetail.tsx` | « Derniers Actualités » |
| `src/components/UniversitesSection.tsx` | Malgaches, construction « intégrer » |
| `src/components/TaggedHeroCarousel.tsx` | Terme « hero » |

---

## Note méthodologique

L’audit porte sur le **texte présent dans le code** au moment de la revue. Les contenus **stockés en base** (articles, descriptions d’admin) peuvent contenir d’autres erreurs non listées ici.

---

*Les corrections listées dans ce rapport ont été appliquées au code source (voir historique Git / fichiers modifiés).*
