// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import TranslationProvider from "./TranslationProvider";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('extension.vsTranslate', () => {
		let translationProvider: any = new TranslationProvider();

		if (!translationProvider.getDefaultTraslationLang()) {
			vscode.window.showInformationMessage("Setup default translation language");
			return true;
		}

		if (!translationProvider.getKey()) {
			vscode.window.showInformationMessage("Setup Yandex Translation key");
			return true;
		}

		let editor = vscode.window.activeTextEditor;
		if (!editor || !editor.selection){
			vscode.window.showInformationMessage("Select Text");
			return true;
		}

		const text = editor!.document.getText(editor!.selection);

		if (!text) {
			vscode.window.showInformationMessage("Select Text");
			return true;
		}

		translationProvider.translate(translationProvider.getDefaultTraslationLang(), text, function (word:any) {
			editor!.edit(builder => {
				builder.replace(editor!.selection, word);
			}).then(success => {
				var postion = editor!.selection.end;
				editor!.selection = new vscode.Selection(postion, postion);
			});
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
