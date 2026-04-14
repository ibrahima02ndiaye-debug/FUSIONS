# IBRA Services - Guide de Contribution

Merci de votre intérêt pour contribuer à IBRA Services! Ce document fournit des directives pour maintenir la qualité et la cohérence du code.

## 🚀 Démarrage Rapide

```bash
# Cloner le repo
git clone https://github.com/votre-org/ibra-services.git
cd ibra-services

# Installer les dépendances
npm install

# Démarrer en développement
npm run dev

# Lancer les tests
npm test
```

## 📋 Standards de Code

### TypeScript
- Utiliser TypeScript strict mode
- Définir des types explicites pour toutes les fonctions publiques
- Éviter `any` - utiliser `unknown` si nécessaire
- Documenter les types complexes

### React
- Utiliser des composants fonctionnels avec hooks
- Extraire la logique complexe dans des hooks personnalisés
- Garder les composants focalisés et réutilisables
- Props: définir des interfaces TypeScript claires

### Styling
- Utiliser Tailwind CSS pour le styling
- Suivre le système de design défini dans  `tailwind.config.js`
- Utiliser les classes utilitaires plutôt que CSS personnalisé
- Mode sombre: toujours inclure `dark:` variants

### Accessibilité (A11y)
- WCAG 2.1 AA minimum
- Navigation clavier complète
- Labels ARIA appropriés
- Texte alternatif pour images
- Ratio de contraste 4.5:1 minimum

## 🧪 Tests

### Types de Tests
```bash
# Tests unitaires
npm test

# Tests avec UI
npm run test:ui

# Coverage
npm run test:coverage
```

### Exigences
- Coverage minimum: 80%
- Tester tous les cas limites
- Mock des appels API externes
- Tests d'accessibilité pour composants UI

### Structure
```
src/
  components/
    Button/
      Button.tsx
      __tests__/
        Button.test.tsx
```

## 📝 Convention de Commits

Utiliser [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types**:
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation seulement
- `style`: Formatage, point-virgules, etc.
- `refactor`: Refactoring de code
- `perf`: Amélioration de performance
- `test`: Ajout de tests
- `chore`: Tâches de maintenance

**Exemples**:
```
feat(chatbot): add AI response streaming
fix(api): resolve authentication timeout
docs(readme): update installation steps
```

## 🔀 Workflow Git

### Branches
- `main`: Production stable
- `develop`: Développement actif
- `feature/nom-feature`: Nouvelles fonctionnalités
- `fix/nom-bug`: Corrections de bugs
- `hotfix/nom-urgence`: Correctifs urgents

### Pull Requests
1. Créer une branche depuis `develop`
2. Faire vos changements avec commits descriptifs
3. Ajouter/mettre à jour les tests
4. Exécuter tests et linting
5. Ouvrir PR vers `develop`
6. Obtenir au moins 1 review
7. Merge après approbation

### Template PR
```markdown
## Description
[Description des changements]

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Tests
- [ ] Tests unitaires passent
- [ ] Tests E2E passent (si applicable)
- [ ] Testé manuellement

## Checklist
- [ ] Code suit les standards du projet
- [ ] Documentation mise à jour
- [ ] Pas de conflits avec develop
- [ ] Screenshots ajoutés (pour UI)
```

## 🎨 Design System

### Couleurs
```js
primary: blue-600 (#3b82f6)
secondary: purple-600 (#8b5cf6)
success: green-600 (#059669)
warning: yellow-600 (#ca8a04)
error: red-600 (#dc2626)
```

### Spacing
Utiliser la scale Tailwind (4px base):
- `p-2` = 8px
- `p-4` = 16px
- `p-6` = 24px
- `p-8` = 32px

### Typography
```css
Headings: font-bold
Body: font-normal
Small: text-sm
Tiny: text-xs
```

## 🔒 Sécurité

### Best Practices
- Ne jamais commit de secrets (API keys, passwords)
- Utiliser `.env` pour variables sensibles
- Valider toutes les entrées utilisateur
- Sanitizer les données avant affichage
- HTTPS seulement en production

### Reporting
Reporter les vulnérabilités à: security@ibra-services.ca

## 📦 Structure du Projet

```
IBRASERVICES-main/
├── client/              # Frontend React
│   ├── src/
│   │   ├── components/  # Composants React
│   │   ├── contexts/    # React Context
│   │   ├── utils/       # Utilitaires
│   │   └── services/    # API services
│   ├── public/          # Assets statiques
│   └── package.json
├── server/              # Backend Node.js
│   ├── src/
│   │   ├── routes/      # Routes API
│   │   ├── db/          # Database
│   │   └── middleware/  # Express middleware
│   └── package.json
├── scripts/             # Scripts de déploiement
├── .github/             # GitHub Actions
└── package.json         # Root workspace
```

## 🚢 Déploiement

### Environnements
- **Development**: Local (`npm run dev`)
- **Staging**: Cloud Run staging
- **Production**: Cloud Run production

### Process
1. Merge vers `main`
2. GitHub Actions exécute tests
3. Build et deploy automatique
4. Smoke tests en production
5. Rollback si échec

## 📚 Ressources

- [Documentation React](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vitest](https://vitest.dev)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/votre-org/ibra-services/issues)
- **Discussions**: [GitHub Discussions](https://github.com/votre-org/ibra-services/discussions)
- **Email**: dev@ibra-services.ca

## 📄 Licence

[MIT License](LICENSE)

---

Merci de contribuer à IBRA Services! 🚗💨
