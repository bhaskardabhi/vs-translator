import * as vscode from 'vscode';

export default class TranslationProvider {
    getKey() {
        return vscode.workspace.getConfiguration('vsTranslator').key;
    }

    getDefaultTraslationLang() {
        return vscode.workspace.getConfiguration('vsTranslator').lang;
    }

    getTranslationProvider() {
        return vscode.workspace.getConfiguration('vsTranslator').source;
    }

    // Tear down any state and detach
    translate(lang: string, text: string, callback: any) {
        if (this.getTranslationProvider() === "Google Translation") {
            this.googleTranslator(lang, text, callback);
        } else {
            this.yandexTranslator(lang, text, callback);
        }
    }

    yandexTranslator(lang: string, text: string, callback: any) {
        var parameters = "key=" + this.getKey() + "&text=" + text + "&lang=" + lang;

        var encodeUrl = require('encodeurl');
        var rp = require('request-promise');
        var option = {
            uri: encodeUrl("https://translate.yandex.net/api/v1.5/tr.json/translate?" + parameters),
            json: true
        };


        rp(option).then(function (data:any) {
            if (data.code === 401) {
                vscode.window.showInformationMessage(data.message);
            } else if (data['text'].length) {
                callback(data['text'][0]);
            }
        });
    }

    googleTranslator(lang: string, text: string, callback: any) {
        var parameters = "key=" + this.getKey() + "&q=" + text + "&target=" + lang;

        var encodeUrl = require('encodeurl');
        var rp = require('request-promise');
        var option = {
            uri: encodeUrl("https://translation.googleapis.com/language/translate/v2?" + parameters),
            json: true
        };


        rp(option).then(function (data: any) {
            if (data['data'] && data['data']['translations'].length) {
                callback(data['data']['translations'][0].translatedText);
            } else if (data.error && data.error.message) {
                vscode.window.showInformationMessage(data.error.message);
            }
        });
    }
}