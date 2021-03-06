import * as vscode from 'vscode';

export const runCommand = (context: vscode.ExtensionContext) => {

    // on command run, create a button
    const button = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    button.text = 'NSI Upload';
    button.command = 'nsi.uploadFile';
    
    // use the initial state to see if the button should be default to show
    const initialButtonState = context.globalState.get('button');
    
    if (initialButtonState) {
        button.show();
    }

    let disposable = vscode.commands.registerCommand('nsi.toggleUploadButton', async () => {
        
        // when the command is run, get the new state
        const currentButtonState = context.globalState.get('button');
        
        // since this is a toggle, if it exists then hide, if not then show
        if (currentButtonState) {
            context.globalState.update('button', false);
            button.hide();
        } else {
            context.globalState.update('button', true);
            button.show();
        }
        return true;
    });

    context.subscriptions.push(disposable);
};