# Crêpes & Galettes Pro — site vitrine

Site statique (HTML / CSS / JS, sans dépendances) pour la location de matériel de crêperie
professionnel Krampouz à Ballan-Miré, près de Tours (Touraine). Signature : « Vos événements ont du goût. »

Deux pages, deux cibles :

- `index.html` — **particuliers** : anniversaires, cousinades, Chandeleur, grandes tablées.
- `pro.html` — **professionnels** : traiteurs et restaurants (événements), crêperies
  (dépannage urgent en 2 h, surcroît d'activité en extérieur), avec remise de 10 % dès 2 jours.

## Structure

```
public/
  index.html    accueil particuliers
  pro.html      page professionnels
  styles.css    design commun aux deux pages
  app.js        interactions + estimation (accueil)
  pro.js        interactions + estimation avec remise (page pro)
  favicon.svg
worker.js       worker Cloudflare qui sert les fichiers statiques
deploy.json     manifeste de déploiement Sites
```

## Domaine et e-mail

- Site : **https://www.crepesetgalettes.fr** — domaine enregistré chez Hostinger
  (nameservers `atlas.dns-parking.com` et `hyperion.dns-parking.com`).
  Les deux pages déclarent leur URL canonique et leur `og:url` ; les blocs JSON-LD pointent vers la racine.
- E-mail de contact : **contact@crepesetgalettes.fr**, présent dans les objets `CONTACT`, les blocs
  JSON-LD, le bloc contact des formulaires et le pied de page.
- Les formulaires n'envoient rien côté serveur : ils ouvrent le client mail du visiteur (`mailto:`)
  avec le récapitulatif et l'estimation déjà remplis. Aucun service d'envoi n'est donc requis.

## Tarifs — particuliers

| Appareil | Journée | Week-end |
| --- | --- | --- |
| Crêpière ronde Ø 40 cm (3 unités, 3 000 W) | 35 € | 50 € |
| Crêpière double 2 × 35 cm | 40 € | 60 € |
| Gaufrier Bruxelles 4 × 6 (1 800 W) | 45 € | 70 € |
| Grill panini (2 600 W) | 35 € | 50 € |
| Parc complet (6 appareils) | sur devis | sur devis |

Retour nécessitant une remise en état : + 20 €.

## Tarifs — professionnels

Remise de **10 % sur la location dès 2 jours consécutifs** (la formule week-end compte pour deux jours) :

| Appareil | Journée | Dès 2 jours | Week-end |
| --- | --- | --- | --- |
| Crêpière Ø 40 cm | 35 € | 31,50 € | 45 € |
| Crêpière double 2 × 35 cm | 40 € | 36 € | 54 € |
| Gaufrier Bruxelles | 45 € | 40,50 € | 63 € |
| Grill panini | 35 € | 31,50 € | 45 € |

Offres combinées de week-end (tarifs indicatifs, à confirmer) :

| Offre | Week-end | Somme à l'unité |
| --- | --- | --- |
| Crêpière + gaufrier | 110 € | 120 € |
| Crêpière + panini | 85 € | 100 € |
| Crêpière + gaufrier + panini | 145 € | 170 € |

Dépannage crêperies : appareil de remplacement livré et installé en 2 h, à Tours et dans l'agglomération,
**à partir de 70 €** (puis tarif journée). La livraison à 70 € est réservée aux crêperies ;
pour les particuliers et les autres locations, le retrait et le retour se font sur rendez-vous à Ballan-Miré.

## Présentation des appareils

Le parc de `index.html` est présenté en **fiches produit** (marque, alimentation, plaque ou capacité,
débit, tarif journée et week-end, bouton « Réserver » qui présélectionne l'appareil dans le formulaire).

Les quatre fiches sont illustrées par des photos produit détourées, dans `public/img/` :

| Fichiers | Appareil |
| --- | --- |
| `crepiere-40.webp` / `.png` | crêpière simple Krampouz Ø 40 cm |
| `crepiere-double.webp` / `.png` | crêpière double 2 × 35 cm |
| `gaufrier.webp` / `.png` | gaufrier Bruxelles 4 × 6 |
| `panini.webp` / `.png` | grill panini |

Chaque fiche est servie en WebP avec un PNG de secours (`<picture>`). Si une image manque,
le pictogramme technique prend sa place (repli `is-fallback` dans `app.js`).
Le cadre est en 3:2, produit centré sur fond transparent ; les sources sont recadrées, détourées
et limitées à 1 000 px de large.

## À personnaliser avant mise en ligne

1. **Coordonnées** — objet `CONTACT` en haut de `public/app.js` **et** de `public/pro.js`
   (e-mail `contact@crepesetgalettes.fr`, téléphone, WhatsApp, adresse). Puis les mêmes valeurs
   dans `index.html` et `pro.html` (liens `mailto:`, `tel:`, blocs JSON-LD), ainsi que l'URL canonique
   et l'`og:url` si le domaine change.
   Adresse de retrait actuelle : 4 clos de la Mignardière, 37510 Ballan-Miré — à cueillir
   dans le pied de page, le bloc contact du formulaire, la section « zone » et la réponse FAQ sur le retrait.
2. **Prix** — trois endroits à garder cohérents pour chaque appareil :
   le tableau et les cartes de `index.html`, le tableau de `pro.html`, et les objets `APPARELS`
   des deux scripts (l'estimation en dépend).
3. **Remise pro** — constante `REMISE_PRO` dans `public/pro.js` (0.1 = 10 %).
4. **Caution, assurances, conditions** — réponses de la FAQ de l'accueil.

## Mentions légales et confidentialité

`public/mentions-legales.html` et `public/confidentialite.html` sont liées depuis le pied de page
des deux pages principales. Elles sont en `noindex,follow` et volontairement absentes du sitemap.

Identité renseignée : entrepreneur individuel (micro-entreprise), SIRET 453 454 290 00033,
TVA non applicable (art. 293 B du CGI), responsable de la publication : Laurent Thiébault.
Le pied de page des quatre pages rappelle le SIRET ; il n'y a plus de mention de RC Pro
tant que la souscription n'est pas effective.

Deux démarches sont en cours et signalées dans l'encadré `legal-todo` de la page :

| À publier dès réception | Où |
| --- | --- |
| Attestation RC professionnelle (assureur, numéro de contrat) | section 1, ligne « Assurance » |
| Médiateur de la consommation (nom, adresse, site) | section 8 — adhésion obligatoire pour un pro vendant aux particuliers |

Une fois les deux éléments reçus, supprimer l'encadré `legal-todo` et le style `.todo` s'il
n'est plus utilisé. Si l'assurance est souscrite, reformuler la ligne « Assurance » et la
mention de pied de page en conséquence.

La politique de confidentialité décrit le fonctionnement réel du site : les formulaires composent
un message (`mailto:` ou `wa.me`) sans rien enregistrer côté serveur, aucun cookie n'est déposé,
aucun outil de mesure d'audience n'est chargé, et aucune ressource externe (police, script, image)
n'est appelée. Si un service est ajouté plus tard (réservation en ligne, statistiques, carte Google),
il faudra mettre à jour cette page et, le cas échéant, ajouter un bandeau de consentement.

## Référencement

Une intention principale par page, et une longue traîne répartie dans les sections existantes
plutôt que dans des pages presque identiques.

| Page | Intention principale | Expressions travaillées dans le corps |
| --- | --- | --- |
| `index.html` | location crêpière Tours | location de crêpière professionnelle, location crêpière week-end, location crêpière pour anniversaire, cousinade, Chandeleur, Mardi gras, crêpe party, machine à crêpes, location gaufrier, grill panini, crêpière Krampouz, 220 V |
| `pro.html` | location crêpière professionnelle Tours | dépannage crêpière Tours, dépannage crêperie, crêpière de remplacement, location crêpière traiteur, location matériel événementiel Tours, matériel de cuisson professionnel, location gaufrier professionnel |

Mise en œuvre :

- titres et `meta description` uniques, un seul `h1` par page portant l'expression principale ;
- page d'accueil : expressions de longue traîne dans le hero, le parc, les tarifs, la section
  « Combien d'appareils pour votre tablée ? », les occasions, la zone et la FAQ ;
- page pro : dépannage, surcroît d'activité, tarifs pro, déroulé et FAQ professionnelle ;
- données structurées : `LocalBusiness` + `OfferCatalog` + `FAQPage` sur l'accueil,
  `Service` + `FAQPage` sur la page pro ;
- `sitemap.xml` et `robots.txt` à la racine de `public/` ;
- `link rel="canonical"`, `og:url` et `og:image` en URL absolues sur `https://www.crepesetgalettes.fr`.

Hors du code, une fois le site en ligne : créer la fiche **Google Business Profile**
(4 clos de la Mignardière, 37510 Ballan-Miré, photos des appareils, lien vers le site),
puis déclarer `sitemap.xml` dans la Search Console. Les deux pèsent plus lourd, en local,
que n'importe quelle retouche de balises.

## Aperçu local

```bash
cd public && python3 -m http.server 3004
```

Ouvrir http://localhost:3004 (et http://localhost:3004/pro.html).

## Déploiement

Le manifeste `deploy.json` sert le dossier `public/` via `worker.js` (Cloudflare Workers / Sites).

Le site étant servi par un worker, c'est vers cet hébergement que `www.crepesetgalettes.fr` doit pointer :
chez Hostinger, l'entrée DNS de `www` se règle en CNAME vers l'hôte fourni par la plateforme de déploiement
(et l'apex `crepesetgalettes.fr` en redirection vers `www`, ou l'inverse, selon le choix retenu).
La messagerie `contact@crepesetgalettes.fr` reste, elle, chez Hostinger : elle ne dépend pas de l'hébergement du site.
