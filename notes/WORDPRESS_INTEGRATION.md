# 🚀 Guide d'intégration WordPress pour TechNova Chat Widget

## 📋 **SOLUTION ULTRA-SIMPLE**

Ajoutez **seulement 2 lignes** dans votre thème WordPress pour avoir un chat widget fonctionnel et sécurisé !

## 🎯 **ÉTAPE 1 : DÉPLOYER LE BACKEND**

### Sur Coolify :
1. Connecter votre repository GitHub à Coolify
2. Configurer les variables d'environnement :
   ```
   OPENWEBUI_API_KEY=votre_vraie_cle_api
   OPENWEBUI_URL=http://localhost:3000
   FRONTEND_URL=https://votre-site-wordpress.com
   ```
3. Déployer le backend
4. Récupérer l'URL : `https://votre-backend.coolify.app`

## 🎯 **ÉTAPE 2 : INTÉGRER DANS WORDPRESS**

### Méthode 1 : Footer.php (Recommandée)

Ouvrez `wp-content/themes/votre-theme/footer.php` et ajoutez avant `</body>` :

```html
<!-- TechNova Chat Widget - 2 lignes seulement ! -->
<script src="https://votre-backend.coolify.app/config.js"></script>
<script src="https://votre-backend.coolify.app/widget.js"></script>
```

**C'est tout !** Le widget apparaît automatiquement sur toutes vos pages.

### Méthode 2 : Functions.php

Ajoutez dans `wp-content/themes/votre-theme/functions.php` :

```php
function technova_chat_widget() {
    if (!is_admin()) {
        wp_enqueue_script('technova-config', 'https://votre-backend.coolify.app/config.js', array(), '1.0.0', true);
        wp_enqueue_script('technova-widget', 'https://votre-backend.coolify.app/widget.js', array('technova-config'), '1.0.0', true);
    }
}
add_action('wp_enqueue_scripts', 'technova_chat_widget');
```

### Méthode 3 : Plugin WordPress

Créez un fichier `wp-content/plugins/technova-chat.php` :

```php
<?php
/**
 * Plugin Name: TechNova Chat Widget
 * Description: Chat widget sécurisé pour TechNova
 * Version: 1.0.0
 */

// Sécurité WordPress
if (!defined('ABSPATH')) {
    exit;
}

function technova_enqueue_scripts() {
    if (!is_admin()) {
        wp_enqueue_script(
            'technova-config',
            'https://votre-backend.coolify.app/config.js',
            array(),
            '1.0.0',
            true
        );
        wp_enqueue_script(
            'technova-widget',
            'https://votre-backend.coolify.app/widget.js',
            array('technova-config'),
            '1.0.0',
            true
        );
    }
}
add_action('wp_enqueue_scripts', 'technova_enqueue_scripts');
?>
```

Puis activez le plugin dans l'admin WordPress.

## ✅ **AVANTAGES DE CETTE SOLUTION**

✅ **Ultra-simple** : 2 lignes de code seulement  
✅ **Sécurisé** : Clé API cachée sur le backend  
✅ **Automatique** : Configuration dynamique  
✅ **Compatible** : Fonctionne avec tous les thèmes  
✅ **Responsive** : S'adapte mobile/desktop  
✅ **Maintenance** : Zéro maintenance  

## 🎨 **PERSONNALISATION**

Le widget hérite automatiquement du style de votre thème WordPress. Pour personnaliser davantage, ajoutez du CSS :

```css
/* Dans votre style.css ou Customizer WordPress */
#technova-chat-widget-container {
    /* Personnalisez la position */
    bottom: 20px !important;
    right: 20px !important;
}

#technova-chat-bubble {
    /* Personnalisez les couleurs */
    background: linear-gradient(135deg, #votre-couleur-1, #votre-couleur-2) !important;
}
```

## 🔧 **DÉPANNAGE**

### Le widget ne s'affiche pas :
1. Vérifiez que votre backend est en ligne : `https://votre-backend.coolify.app/health`
2. Vérifiez la console du navigateur (F12)
3. Vérifiez que les scripts se chargent bien

### Erreur CORS :
Ajoutez votre domaine WordPress dans les variables d'environnement :
```
FRONTEND_URL=https://votre-site-wordpress.com
```

## 🚀 **URL À REMPLACER**

Dans tous les exemples ci-dessus, remplacez :
- `https://votre-backend.coolify.app` par votre vraie URL Coolify
- `votre-site-wordpress.com` par votre vrai domaine WordPress

## 📝 **EXEMPLE COMPLET**

Si votre backend Coolify est sur `https://technova-backend-abc123.coolify.app`, ajoutez ceci dans footer.php :

```html
<script src="https://technova-backend-abc123.coolify.app/config.js"></script>
<script src="https://technova-backend-abc123.coolify.app/widget.js"></script>
```

Le widget TechNova apparaîtra automatiquement en bas à droite de toutes vos pages WordPress !
