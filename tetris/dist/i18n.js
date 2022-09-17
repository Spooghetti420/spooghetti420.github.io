export var LanguageName;
(function (LanguageName) {
    LanguageName[LanguageName["English"] = 0] = "English";
    LanguageName[LanguageName["German"] = 1] = "German";
    LanguageName[LanguageName["Japanese"] = 2] = "Japanese";
    LanguageName[LanguageName["Bulgarian"] = 3] = "Bulgarian";
})(LanguageName || (LanguageName = {}));
export class Language {
    constructor(langName) {
        this.languageName = langName;
        console.log(`assets/lang/${language_codes[langName]}.json`);
        this.file = `assets/lang/${language_codes[langName]}.json`;
    }
}
let languages = {};
export function loadLanguages() {
    console.log("calling function");
    languages = {
        [LanguageName.English]: loadJSON("./assets/lang/en.json"),
        [LanguageName.German]: loadJSON("./assets/lang/de.json"),
        [LanguageName.Japanese]: loadJSON("./assets/lang/ja.json"),
        [LanguageName.Bulgarian]: loadJSON("./assets/lang/bg.json")
    };
    console.log("languages is now", languages);
}
const language_codes = {
    [LanguageName.English]: "en",
    [LanguageName.German]: "de",
    [LanguageName.Japanese]: "ja",
    [LanguageName.Bulgarian]: "bg"
};
export class LocalisableString {
    constructor(stringName) {
        this.stringName = stringName;
    }
    getLocalisedString(language) {
        var _a, _b;
        // Return either the localised string; the English string if no localisation exists; or the bare internal of the string in emergencies.
        return (_b = (_a = languages[language.languageName][this.stringName]) !== null && _a !== void 0 ? _a : languages[LanguageName.English][this.stringName]) !== null && _b !== void 0 ? _b : this.stringName;
    }
}
