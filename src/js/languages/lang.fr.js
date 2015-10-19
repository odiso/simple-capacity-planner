if(typeof languagesDictionnary == 'undefined')
{
    alert('Bad configuration : load this file after the Language class');
}

// hooks for formatting are using the scheme : {0},{1},{2},...
// and replaced with successive parameters when Language.get is called.
languagesDictionnary['fr'] = {
    app_name : 'Capacity Planner',
    log_off : 'Déconnexion',
    main_tab : 'Vue d\'ensemble',
    error_title : 'Une erreur est survenue.',
    webservice_error : 'La réponse du serveur est mal formattée, ou vous avez subi une coupure réseau.',

    form_required : 'Obligatoire',
    form_submit : 'Valider',
    form_delete : 'Supprimer',
    form_cancel : 'Annuler',

    create_dashboard_form_title : 'Créez un nouveau dashboard :',

    create_dashboard_name_label : 'Nom :',
    create_dashboard_name_placeholder : 'Saisissez le nom',
    create_dashboard_name_error : 'Le nom est obligatoire et doit être une chaîne entre 1 et 256 caractères.',

    rename_button : 'Renommer',
    delete_button : 'Supprimer',
    edit_button :   'Modifier',
    add_button :    'Ajouter',
    add_component_button :    'Ajouter un composant',

    edit_dashboard_form_title : 'Modifier le dashboard',
    delete_dashboard_confirmation : 'Êtes-vous certain de vouloir supprimer le dashboard "{0}" ?',

    edit_component_form_title : 'Création / Modification d\'un composant',

    edit_component_name : 'Nom',
    edit_component_name_placeholder : 'Nom',
    edit_component_name_error : 'Le nom est obligatoire et doit être une chaîne entre 1 et 256 caractères.',

    edit_component_threshold_warning : 'Seuil d\'alerte (%)',
    edit_component_threshold_warning_placeholder : '60',
    edit_component_threshold_warning_error : 'Veuillez saisir un nombre entre 1 et 100.',

    edit_component_threshold_critic : 'Seuil de criticité (%)',
    edit_component_threshold_critic_placeholder : '80',
    edit_component_threshold_critic_error : 'Veuillez saisir un nombre entre 1 et 100.',

    edit_component_ratio_modifier : 'Règle de calcul du pourcentage total :',
    edit_component_ratio_modifier_error : 'Veuillez sélectionner une règle de calcul.',
    ratio_modifier_default : 'Pourcentage simple (règle par défaut)',
    ratio_modifier_ruleOutMaxCapacity : 'Soustraire la capacité du plus grand élément (marge de sécurité)',
    ratio_modifier_ruleOutMaxCapacity_help : 'La capacité du plus grand élément n\'est pas prise en compte, en tant que marge de sécurité supplémentaire.',

    edit_component_useForGlobalRatio : 'Utiliser ce composant dans le ratio global du dashboard',

    rename_component_form_title : '',

    delete_component_confirmation : 'Êtes-vous certain de vouloir supprimer le composant "{0}" ?',

    rename_element_form_title : 'Renommer l\'élément',
    delete_element_confirmation : 'Êtes-vous certain de vouloir supprimer l\'élément "{0}" ?',


    edit_element_form_title : 'Création / Modification d\'un élément',

    edit_element_name : 'Nom',
    edit_element_name_placeholder : 'Nom',
    edit_element_name_error : 'Le nom est obligatoire et doit être une chaîne entre 1 et 256 caractères.',

    edit_element_value : 'Valeur de référence',
    edit_element_value_placeholder : 'Valeur de référence',
    edit_element_value_error : 'Veuillez saisir un nombre flottant différent de zéro. (ex: 2011.12)',

    edit_element_key : 'Clé de référence',
    edit_element_key_placeholder : 'Clé de référence',
    edit_element_key_error : 'La clé de référence est obligatoire et doit être une chaîne de caractère simple & unique, entre 1 et 32 caractères.',

    edit_indicator_form_title : 'Définir la valeur de l\'élément "{0}" pour {1} :',
    edit_indicator_value : 'Valeur mensuelle',
    edit_indicator_value_placeholder : 'Valeur mensuelle',
    edit_indicator_value_error : 'Veuillez saisir un nombre flottant. (ex: 2011.12)',

    edit_indicator_referenceValue : 'Valeur de référence',
    edit_indicator_referenceValue_placeholder : 'Valeur de référence',
    edit_indicator_referenceValue_error : 'Veuillez saisir un nombre flottant différent de zéro. (ex: 2011.12)',

    add_datecolumn_form_title : 'Ajouter une date au composant :',
    add_datecolumn_label : 'Selectionnez une date',
    add_datecolumn_error : 'Veuillez selectionner une date.',

    element_name : 'Élements',
    total : 'Total',

    month_1: 'Jan',
    month_2: 'Fév',
    month_3: 'Mars',
    month_4: 'Avr',
    month_5: 'Mai',
    month_6: 'Juin',
    month_7: 'Juil',
    month_8: 'Août',
    month_9: 'Sept',
    month_10: 'Oct',
    month_11: 'Nov',
    month_12: 'Déc',

    variable_test : 'This is a {0} variable {0} test'
};

// load Language class
var l = new Language('fr');
// initiate html parsing
l.init();