# 🎯 Guide Client - Nouvelles Fonctionnalités Data-Attributes

## ✅ **CE QUI A ÉTÉ AJOUTÉ**

Votre widget TechNova supporte maintenant les **attributs data-*** pour une intégration encore plus simple et professionnelle !

## 🚀 **INTÉGRATION SIMPLE - NOUVELLE VERSION**

### **Avant (Méthode Complexe)**
```html
<script>
window.TechnovaConfig = {
    model: 'technova',
    theme: 'red',
    position: 'bottom-left'
};
</script>
<script src="https://gkwww04kwcwc00gockw8ocw4.jstr.fr/widget-embed.js"></script>
```

### **Maintenant (Méthode Simple)**
```html
<script 
    src="https://gkwww04kwcwc00gockw8ocw4.jstr.fr/widget-embed.js"
    data-model="technova"
    data-theme="red"
    data-position="bottom-left">
</script>
```

**UNE SEULE LIGNE = INTÉGRATION COMPLÈTE !**

## 🎨 **TOUS LES ATTRIBUTS DISPONIBLES**

### **Attribut data-model** (Modèle IA)
- **technova** - Assistant TechNova (par défaut)
- **webfrontaide** - Assistant WebFrontAide
- **gpt-4** - Assistant GPT-4
- **claude** - Assistant Claude
- **llama** - Assistant Llama
- **mistral** - Assistant Mistral
- **cyberAide** - Assistant CyberSécurité

### **Attribut data-theme** (Couleurs)
- **blue** - Bleu corporate (par défaut)
- **red** - Rouge dynamique
- **green** - Vert écologique
- **purple** - Violet créatif
- **orange** - Orange énergique
- **pink** - Rose moderne
- **yellow** - Jaune optimiste
- **dark** - Noir élégant
- **teal** - Bleu-vert tech

### **Attribut data-position** (Position sur l'écran)
- **bottom-right** - Bas droite (par défaut)
- **bottom-left** - Bas gauche
- **top-right** - Haut droite
- **top-left** - Haut gauche

### **Attributs Supplémentaires**
- **data-auto-open="true"** - Ouvre automatiquement après 3 secondes
- **data-welcome="false"** - Désactive la notification de bienvenue
- **data-language="en"** - Change la langue (fr, en, es, de)

## 📝 **EXEMPLES D'INTÉGRATION WORDPRESS**

### **Exemple 1 : Site Corporate Bleu**
```html
<script 
    src="https://gkwww04kwcwc00gockw8ocw4.jstr.fr/widget-embed.js"
    data-model="technova"
    data-theme="blue">
</script>
```

### **Exemple 2 : Site E-commerce Vert**
```html
<script 
    src="https://gkwww04kwcwc00gockw8ocw4.jstr.fr/widget-embed.js"
    data-model="gpt-4"
    data-theme="green"
    data-position="bottom-left">
</script>
```

### **Exemple 3 : Site Portfolio Sombre**
```html
<script 
    src="https://gkwww04kwcwc00gockw8ocw4.jstr.fr/widget-embed.js"
    data-model="claude"
    data-theme="dark"
    data-position="top-right">
</script>
```

### **Exemple 4 : Site avec Ouverture Automatique**
```html
<script 
    src="https://gkwww04kwcwc00gockw8ocw4.jstr.fr/widget-embed.js"
    data-model="technova"
    data-theme="purple"
    data-auto-open="true">
</script>
```

## 🛠️ **COMMENT INTÉGRER DANS WORDPRESS**

### **Méthode 1 : Via l'Éditeur de Thème**
1. **Connectez-vous** à votre Dashboard WordPress
2. **Allez dans** Apparence → Éditeur de thème
3. **Ouvrez** le fichier `footer.php`
4. **Ajoutez** le code **juste avant** `</body>`
5. **Sauvegardez**

### **Méthode 2 : Via un Plugin**
1. **Installez** le plugin "Insert Headers and Footers"
2. **Allez dans** Réglages → Insert Headers and Footers
3. **Collez** le code dans la section "Footer"
4. **Sauvegardez**

### **Méthode 3 : Via Gutenberg/Elementor**
1. **Créez** un bloc HTML/Code personnalisé
2. **Collez** le code
3. **Publiez** la page

## 🧪 **COMMENT TESTER**

### **Page de Test Officielle**
Visitez : `https://gkwww04kwcwc00gockw8ocw4.jstr.fr/test-data-attributes`

**Cette page teste automatiquement :**
- ✅ Différents modèles IA
- ✅ Différents thèmes de couleurs
- ✅ Différentes positions
- ✅ Ouverture automatique

### **Tests à Faire**
1. **Couleurs** → Le widget apparaît avec la bonne couleur
2. **Position** → Le widget apparaît au bon endroit
3. **Chat** → Cliquez et posez une question
4. **Modèle** → Vérifiez que la bonne IA répond
5. **Mobile** → Testez sur téléphone

## 🔧 **DÉPANNAGE**

### **Le Widget N'Apparaît Pas**
- ✅ Vérifiez que le code est avant `</body>`
- ✅ Vérifiez qu'il n'y a pas d'erreurs JavaScript (F12)
- ✅ Vérifiez que votre site n'a pas de Content Security Policy bloquante

### **Mauvaise Couleur**
- ✅ Vérifiez l'orthographe : `data-theme="red"` (pas `data-theme="rouge"`)
- ✅ Couleurs disponibles : blue, red, green, purple, orange, pink, yellow, dark, teal

### **Mauvais Modèle**
- ✅ Vérifiez que le modèle existe dans OpenWebUI
- ✅ Modèles testés : technova, webfrontaide, gpt-4, claude, llama, mistral

## 📊 **COMPATIBILITÉ**

### **✅ Compatible Avec :**
- WordPress (toutes versions)
- WooCommerce
- Elementor
- Divi
- Gutenberg
- Sites HTML statiques
- Shopify
- Squarespace

### **✅ Navigateurs Supportés :**
- Chrome, Firefox, Safari, Edge
- Mobile : iOS Safari, Chrome Mobile
- Responsive automatique

## 🎯 **AVANTAGES DE CETTE NOUVELLE VERSION**

### **Pour Vous (Développeur)**
- ✅ **Un seul fichier** à maintenir
- ✅ **Contrôle centralisé** de toutes les mises à jour
- ✅ **Analytics** de tous les widgets
- ✅ **Sécurité** : pas de clé API exposée

### **Pour Vos Clients**
- ✅ **Intégration ultra-simple** : une ligne de code
- ✅ **Personnalisation facile** : changement de couleurs/modèles
- ✅ **Pas de connaissances techniques** requises
- ✅ **Support professionnel** inclus

## 🚀 **EXEMPLE COMPLET PRÊT À UTILISER**

```html
<!-- Copiez-collez ce code dans votre WordPress avant </body> -->
<script 
    src="https://gkwww04kwcwc00gockw8ocw4.jstr.fr/widget-embed.js"
    data-model="technova"
    data-theme="blue"
    data-position="bottom-right">
</script>
<!-- Fin du code - C'est tout ! -->
```

## 📞 **SUPPORT TECHNIQUE**

Si vous avez des questions ou des problèmes :

1. **Testez d'abord** sur : `https://gkwww04kwcwc00gockw8ocw4.jstr.fr/test-data-attributes`
2. **Vérifiez** les logs de la console (F12)
3. **Contactez** le support avec les détails de votre site

---

**🎉 Félicitations ! Votre widget TechNova est maintenant encore plus simple et professionnel à intégrer !**
