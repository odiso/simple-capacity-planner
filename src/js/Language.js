/*
 Language class
 */

var currentLanguage = 'en';
var languagesDictionnary = [];

var Language = function(languageToLoad){
    // check if language is selected
    if(languagesDictionnary[languageToLoad] == undefined){
        alert('Bad configuration detected : language selected does not exist.');
        return;
    }
    // load current language
    currentLanguage = languagesDictionnary[languageToLoad];

    // dictionary key finder
    // additional parameters are used as successive hooks for {0},{1},{2},...
    this.get = function(keyword){
        if(currentLanguage[keyword] == undefined){
            return '/!\\ missing translation for "' + keyword + '"';
        }

        var sentence = currentLanguage[keyword];

        // localisation hook manager : {0},{1},{2},...
        for (var i = 1; i < arguments.length; i++) {
            sentence = sentence.replace(new RegExp('\\{' + (i-1) + '\\}', 'g'), arguments[i]);
        }

        return sentence;
    };

    // initiate html parsing
    this.init = function(){
        $('body *[data-text]').each(function(){
            var objValue = $(this).attr('value');
            var textReplacement = l.get($(this).attr('data-text'));
            // innerHTML or value check
            // TODO : except options !
            if( objValue !== undefined && objValue !== false && $(this).prop('tagName') != 'OPTION'){
                $(this).val(textReplacement);
            }
            else{
                $(this).html(textReplacement);
            }
        });

        $('body *[data-placeholder]').each(function(){
            var objValue = $(this).attr('value');
            var textReplacement = l.get($(this).attr('data-placeholder'));
            $(this).attr('placeholder', textReplacement);
        });
    }
};
