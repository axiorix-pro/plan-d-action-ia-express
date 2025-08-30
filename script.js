/**
 * Met à jour la barre de progression en fonction des champs remplis
 */
function updateProgress() {
    const inputs = [
        'companyName', 'sector', 'teamSize', 'budget', 'timeline', 'priority'
    ];
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

    let completed = 0;
    inputs.forEach(id => {
        if (document.getElementById(id).value) completed++;
    });

    if (checkboxes.length > 0) completed++;

    const progress = (completed / 7) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
}

/**
 * Génère le plan d'action personnalisé
 */
function generatePlan() {
    // Validation renforcée
    const companyName = document.getElementById('companyName').value.trim();
    const sector = document.getElementById('sector').value;
    const processesChecked = document.querySelectorAll('input[type="checkbox"]:checked').length;

    if (!companyName || !sector) {
        alert('Nom d\'entreprise + secteur requis.');
        return;
    }

    if (processesChecked === 0) {
        alert('Sélectionnez au moins 1 processus à automatiser.');
        return;
    }

    // Anti-double clic
    const btn = document.querySelector('.generate-btn');
    btn.disabled = true;

    // Afficher le chargement
    document.getElementById('loadingSection').style.display = 'block';
    document.getElementById('resultSection').style.display = 'none';

    // Simuler un délai de traitement
    setTimeout(() => {
        const plan = createPersonalizedPlan();
        displayPlan(plan);

        document.getElementById('loadingSection').style.display = 'none';
        document.getElementById('resultSection').style.display = 'block';

        // Réactiver le bouton
        btn.disabled = false;

        // Scroll vers les résultats
        document.getElementById('resultSection').scrollIntoView({
            behavior: 'smooth'
        });
    }, 2000);
}

/**
 * Crée un plan personnalisé basé sur les réponses
 * @returns {Object} Le plan d'action personnalisé
 */
function createPersonalizedPlan() {
    const companyName = document.getElementById('companyName').value;
    const sector = document.getElementById('sector').value;
    const teamSize = document.getElementById('teamSize').value;
    const budget = document.getElementById('budget').value;
    const timeline = document.getElementById('timeline').value;
    const priority = document.getElementById('priority').value;

    const selectedProcesses = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .map(cb => cb.value);

    const plan = {
        company: companyName,
        sector: sector,
        processes: selectedProcesses,
        budget: budget,
        timeline: timeline,
        priority: priority,
        recommendations: generateRecommendations(selectedProcesses, sector, budget),
        tools: generateToolRecommendations(selectedProcesses, budget),
        implementation: generateImplementationSteps(selectedProcesses, timeline),
        roi: calculateROI(selectedProcesses, teamSize)
    };

    return plan;
}

/**
 * Génère des recommandations basées sur les processus sélectionnés
 * @param {Array} processes - Les processus sélectionnés
 * @param {string} sector - Le secteur d'activité
 * @param {string} budget - Le budget disponible
 * @returns {Array} Liste des recommandations
 */
function generateRecommendations(processes, sector, budget) {
    const recommendations = [];

    if (processes.includes('emails')) {
        recommendations.push({
            title: "Hub e-mail intelligent (via N8N)",
            description: "Architecture centralisée qui analyse automatiquement vos e-mails entrants : tri intelligent par projet/priorité, extraction automatique des données client/commandes, déclenchement de workflows métier, et routage vers les bons collaborateurs avec contexte enrichi.",
            impact: "Économie de 3-4h/jour + 100% des e-mails traités sans oubli"
        });
    }

    if (processes.includes('invoicing')) {
        recommendations.push({
            title: "Factory de facturation automatisée (via N8N + Stripe/Sage)",
            description: "Chaîne complète pilotée par N8N : déclenchement depuis CRM/commande → génération PDF personnalisé → validation interne → envoi client avec tracking → relances automatiques programmées → réconciliation bancaire → synchronisation comptable temps réel.",
            impact: "Réduction de 85% du temps admin + 0% d'erreur de facturation"
        });
    }

    if (processes.includes('crm')) {
        recommendations.push({
            title: "CRM auto-piloté par IA (via N8N + enrichissement)",
            description: "N8N transforme votre CRM en machine intelligente : enrichissement automatique des prospects (SIRET, réseaux sociaux, données financières), scoring temps réel des opportunités, déclenchement de séquences marketing ultra-personnalisées, et alertes commerciales au timing parfait.",
            impact: "Augmentation de 40% du taux de conversion + 60% de gain sur le cycle de vente"
        });
    }

    if (processes.includes('support')) {
        recommendations.push({
            title: "Support client automatisé intelligent (via N8N)",
            description: "Système de ticketing 2.0 : classification automatique des demandes, routage intelligent vers l'expert métier, escalade programmée selon SLA, base de connaissances auto-alimentée, et suivi satisfaction client automatique.",
            impact: "Réduction de 70% du temps de résolution + satisfaction client +25%"
        });
    }

    if (processes.includes('inventory')) {
        recommendations.push({
            title: "Gestion de stock prédictive (via N8N + ERP)",
            description: "Intelligence de stock pilotée par N8N : surveillance temps réel des niveaux, prédiction des ruptures selon historique/saisonnalité, commandes automatiques aux fournisseurs, optimisation des rotations, et tableaux de bord temps réel.",
            impact: "Réduction de 45% des ruptures de stock + optimisation de 30% du BFR"
        });
    }

    return recommendations;
}

/**
 * Génère des recommandations d'outils basées sur les processus sélectionnés
 * @param {Array} processes - Les processus sélectionnés
 * @param {string} budget - Le budget disponible
 * @returns {Array} Liste des outils recommandés
 */
function generateToolRecommendations(processes, budget) {
    const tools = [];

    // Niveau de budget robuste - défaut bas si vide
    const budgetLevel = !budget ? 'low'
        : budget.includes('0-1000') ? 'low'
        : budget.includes('1000-5000') ? 'medium'
        : 'high';

    // N8N recommandé systématiquement comme hub central
    if (budgetLevel === 'low') {
        tools.push("🎯 N8N Self-hosted (gratuit) - Hub d'automatisation central");
    } else {
        tools.push("🎯 N8N Cloud (20€/mois) - Hub d'automatisation central + support");
    }

    // N8N au centre pour chaque processus
    if (processes.includes('emails')) {
        tools.push("📧 N8N (hub e-mail intelligent : IMAP/Gmail ↔ IA ↔ CRM)");
        tools.push("   └ Alternative si déjà en place : Power Automate/Gmail filters");
    }

    if (processes.includes('invoicing')) {
        tools.push("🧾 N8N + Stripe Invoicing + templates PDF dynamiques");
        tools.push("   └ Intégration : Sage/QuickBooks via API");
    }

    if (processes.includes('crm')) {
        tools.push("👥 N8N + CRM (HubSpot/Pipedrive) avec enrichissement SIRET + scoring");
        tools.push("   └ Alternative si déjà en place : Make/Zapier en passerelle");
    }

    if (processes.includes('inventory')) {
        tools.push("📦 N8N + ERP existant + alertes stock intelligentes");
    }

    if (processes.includes('support')) {
        tools.push("🎧 N8N + Slack/Teams + ticketing intelligent + escalade auto");
    }

    if (processes.includes('hr')) {
        tools.push("👔 N8N + Calendly + SIRH + workflows onboarding complets");
    }

    if (processes.includes('accounting')) {
        tools.push("💰 N8N + Sage/Cegid + OCR factures + réconciliation bancaire");
    }

    if (processes.includes('marketing')) {
        tools.push("📱 N8N + Mailchimp/Brevo + CRM + analytics + lead scoring");
    }

    return tools;
}

/**
 * Génère les étapes d'implémentation
 * @param {Array} processes - Les processus sélectionnés
 * @param {string} timeline - Le délai souhaité
 * @returns {Array} Liste des étapes d'implémentation
 */
function generateImplementationSteps(processes, timeline) {
    const steps = [
        "🔍 Audit des processus actuels + cartographie des flux (Semaine 1)",
        "⚙️ Installation et configuration N8N + connexions API (Semaine 2)",
        "🎨 Création des workflows visuels personnalisés (Semaine 3)",
        "🧪 Tests intensifs + simulation de charge (Semaine 4)",
        "👥 Formation équipe + documentation workflows (Semaine 5)",
        "🚀 Déploiement progressif + monitoring (Semaines 6-7)",
        "📊 Optimisation basée sur les métriques réelles (Semaines 8-12)"
    ];

    if (timeline === 'immediate') {
        return [
            "🔍 Audit express + installation N8N (Semaine 1)",
            "⚡ Création workflow prioritaire (Semaine 2)",
            "🧪 Tests + déploiement immédiat (Semaine 3)",
            "📈 Suivi et ajustements (Semaine 4)"
        ];
    }

    return steps;
}

/**
 * Calcule le retour sur investissement
 * @param {Array} processes - Les processus sélectionnés
 * @param {string} teamSize - La taille de l'équipe
 * @returns {Object} Objet contenant les gains mensuels, annuels et le seuil de rentabilité
 */
function calculateROI(processes, teamSize) {
    let monthlyGain = 0;
    const hourlyRate = 35; // Taux horaire moyen

    processes.forEach(process => {
        switch(process) {
            case 'emails': monthlyGain += 40 * hourlyRate; break;
            case 'invoicing': monthlyGain += 20 * hourlyRate; break;
            case 'crm': monthlyGain += 30 * hourlyRate; break;
            default: monthlyGain += 15 * hourlyRate;
        }
    });

    // Multiplicateur basé sur la taille de l'équipe
    const teamMultiplier =
        teamSize === '1-5'    ? 1   :
        teamSize === '6-20'   ? 2.5 :
        teamSize === '21-50'  ? 4   :
        teamSize === '51-100' ? 5   :
        teamSize === '100+'   ? 6   : 1; // défaut = 1

    monthlyGain *= teamMultiplier;

    return {
        monthly: Math.round(monthlyGain),
        annual: Math.round(monthlyGain * 12),
        payback: "2-4 mois"
    };
}

/**
 * Échappe les caractères HTML pour éviter les injections XSS
 * @param {string} text - Le texte à échapper
 * @returns {string} Le texte échappé
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Affiche le plan d'action généré
 * @param {Object} plan - Le plan d'action à afficher
 */
function displayPlan(plan) {
    const content = document.getElementById('planContent');
    const today = new Date().toLocaleDateString('fr-FR');

    let html = `
        <div class="plan-section">
            <h3>📋 Synthèse du projet</h3>
            <p><strong>Entreprise:</strong> ${escapeHtml(plan.company)}</p>
            <p><strong>Secteur:</strong> ${escapeHtml(plan.sector)}</p>
            <p><strong>Date d'analyse:</strong> ${today}</p>
            <p><strong>Processus ciblés:</strong> ${
                plan.processes.length ? plan.processes.join(', ') : 'Aucun (à préciser)'
            }</p>
        </div>
        <div class="plan-section">
            <h3>🎯 Recommandations prioritaires</h3>
            ${plan.recommendations.map(rec => `
                <div style="margin-bottom: 1rem; padding: 1rem; background: white; border-radius: 8px;">
                    <h4 style="color: var(--primary-blue); margin-bottom: 0.5rem;">${rec.title}</h4>
                    <p>${rec.description}</p>
                    <p style="color: var(--success-green); font-weight: 600;">💡 Impact: ${rec.impact}</p>
                </div>
            `).join('')}
        </div>
        <div class="plan-section">
            <h3>🎯 Pourquoi N8N comme hub central ?</h3>
            <div style="background: #f0f9ff; padding: 1.5rem; border-radius: 10px; margin-bottom: 1.5rem; border-left: 4px solid #0284c7;">
                <h4 style="color: #0284c7; margin-bottom: 1rem;">🚀 N8N : La solution d'automatisation de référence pour les pros</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
                    <div style="background: white; padding: 1rem; border-radius: 8px;">
                        <h5 style="color: #059669; margin-bottom: 0.5rem;">🎨 Interface visuelle</h5>
                        <p style="font-size: 0.9rem; margin: 0;">Workflows par nœuds, drag & drop intuitif</p>
                    </div>
                    <div style="background: white; padding: 1rem; border-radius: 8px;">
                        <h5 style="color: #059669; margin-bottom: 0.5rem;">🔗 800+ intégrations</h5>
                        <p style="font-size: 0.9rem; margin: 0;">Connecteurs natifs pour tous vos outils</p>
                    </div>
                    <div style="background: white; padding: 1rem; border-radius: 8px;">
                        <h5 style="color: #059669; margin-bottom: 0.5rem;">⚡ Code personnalisé</h5>
                        <p style="font-size: 0.9rem; margin: 0;">JavaScript/Python intégré pour logiques complexes</p>
                    </div>
                    <div style="background: white; padding: 1rem; border-radius: 8px;">
                        <h5 style="color: #059669; margin-bottom: 0.5rem;">🛡️ Contrôle total</h5>
                        <p style="font-size: 0.9rem; margin: 0;">Self-hosting possible, données sécurisées</p>
                    </div>
                </div>
                <div style="background: #fef3c7; padding: 1rem; border-radius: 8px; border-left: 3px solid #f59e0b;">
                    <p style="margin: 0; font-weight: 600; color: #92400e;">
                        🏆 <strong>Avantage concurrentiel :</strong> Là où Zapier plafonne rapidement et Power Automate devient usine à gaz,
                        N8N grandit avec votre entreprise sans compromis sur la simplicité.
                    </p>
                </div>
            </div>
            <h4 style="color: #1f2937; margin-bottom: 1rem;">🛠️ Stack technique recommandé :</h4>
            <ul style="list-style: none; padding: 0;">
                ${plan.tools.map(tool => `
                    <li style="margin-bottom: 0.8rem; padding: 0.8rem; background: #f9fafb; border-radius: 8px; border-left: 3px solid ${tool.includes('N8N') ? '#0284c7' : '#6b7280'};">
                        ${tool}
                    </li>
                `).join('')}
            </ul>
        </div>
        <div class="plan-section">
            <h3>📅 Plan d'implémentation</h3>
            <ol>
                ${plan.implementation.map(step => `<li>${step}</li>`).join('')}
            </ol>
        </div>
        <div class="plan-section">
            <h3>💰 Retour sur investissement estimé</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                <div style="text-align: center; padding: 1rem; background: white; border-radius: 8px;">
                    <h4 style="color: var(--success-green);">${plan.roi.monthly}€</h4>
                    <p>Économies mensuelles</p>
                </div>
                <div style="text-align: center; padding: 1rem; background: white; border-radius: 8px;">
                    <h4 style="color: var(--success-green);">${plan.roi.annual}€</h4>
                    <p>Économies annuelles</p>
                </div>
                <div style="text-align: center; padding: 1rem; background: white; border-radius: 8px;">
                    <h4 style="color: var(--primary-blue);">${plan.roi.payback}</h4>
                    <p>Seuil de rentabilité</p>
                </div>
            </div>
        </div>
        <div class="plan-section">
            <h3>📞 Prochaines étapes</h3>
            <p>Ce plan d'action a été généré automatiquement selon vos critères. Pour une analyse plus approfondie et un accompagnement personnalisé:</p>
            <ul>
                <li>Audit détaillé de vos processus actuels</li>
                <li>Configuration personnalisée des outils</li>
                <li>Formation de vos équipes</li>
                <li>Support technique et maintenance</li>
            </ul>
        </div>
    `;

    content.innerHTML = html;
}

/**
 * Exporte le plan par email
 */
function exportToEmail() {
    const companyName = document.getElementById('companyName').value;
    const subject = `Plan d'action IA pour ${companyName}`;
    const body = `Bonjour,
Veuillez trouver ci-dessous votre plan d'action IA personnalisé généré automatiquement.
Ce plan inclut:
- Analyse de vos besoins
- Recommandations d'outils (N8N central)
- Planning d'implémentation
- Estimation ROI
Le détail complet est disponible dans l'outil web.
Pour toute question ou accompagnement personnalisé, n'hésitez pas à nous contacter.
Cordialement`;

    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Copie le plan dans le presse-papiers
 */
function copyToClipboard() {
    const content = document.getElementById('planContent').innerText;

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(content).then(() => {
            alert('Plan d\'action copié dans le presse-papiers !');
        }).catch(() => {
            fallbackCopyToClipboard(content);
        });
    } else {
        fallbackCopyToClipboard(content);
    }
}

/**
 * Exporte le plan au format DOCX
 */
function exportToDOCX() {
    const plan = createPersonalizedPlan();
    const today = new Date().toLocaleDateString('fr-FR');
    const { Document, Packer, Paragraph, HeadingLevel } = docx;

    const kids = [
        new Paragraph({ text: "Plan d'action IA Express", heading: HeadingLevel.TITLE }),
        new Paragraph(`Entreprise: ${plan.company || ''}`),
        new Paragraph(`Secteur: ${plan.sector || ''}`),
        new Paragraph(`Date d'analyse: ${today}`),
        new Paragraph(`Processus: ${(plan.processes || []).join(', ')}`),
        new Paragraph(""),
        new Paragraph({ text: "Recommandations prioritaires", heading: HeadingLevel.HEADING_2 }),
        ...(plan.recommendations || []).flatMap(r => [
            new Paragraph(r.title),
            new Paragraph(r.description),
            new Paragraph(`Impact: ${r.impact}`),
            new Paragraph("")
        ]),
        new Paragraph({ text: "Stack technique recommandée", heading: HeadingLevel.HEADING_2 }),
        ...(plan.tools || []).map(t => new Paragraph(t)),
        new Paragraph({ text: "Plan d'implémentation", heading: HeadingLevel.HEADING_2 }),
        ...(plan.implementation || []).map(s => new Paragraph(s)),
        new Paragraph({ text: "ROI estimé", heading: HeadingLevel.HEADING_2 }),
        new Paragraph(`Mensuel: ${plan.roi?.monthly ?? ''}€`),
        new Paragraph(`Annuel: ${plan.roi?.annual ?? ''}€`),
        new Paragraph(`Payback: ${plan.roi?.payback ?? ''}`)
    ];

    const doc = new Document({ sections: [{ children: kids }] });
    Packer.toBlob(doc).then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `plan_ia_${(plan.company || 'entreprise').replace(/\s+/g,'_')}.docx`;
        a.click();
        URL.revokeObjectURL(url);
    });
}

/**
 * Exporte le plan au format JSON
 */
function exportToJSON() {
    const plan = createPersonalizedPlan();
    const blob = new Blob([JSON.stringify(plan, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plan_ia_${(plan.company || 'entreprise').replace(/\s+/g,'_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Méthode de secours pour copier dans le presse-papiers
 * @param {string} text - Le texte à copier
 */
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        alert('Plan d\'action copié dans le presse-papiers !');
    } catch (err) {
        alert('Erreur lors de la copie. Veuillez sélectionner et copier manuellement le contenu.');
    }

    document.body.removeChild(textArea);
}

/**
 * Initialisation au chargement de la page
 */
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('change', updateProgress);
    });
    updateProgress(); // Initialisation au chargement
});
