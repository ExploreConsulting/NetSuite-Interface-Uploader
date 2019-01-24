import { ExtensionContext } from "vscode";
import * as vscode from 'vscode';
import { EncryptionManager } from "../password-encryption-manager";
import { Prompt } from "./prompt";

export class AskForMasterPasswordPrompt extends Prompt<objectAggregate> {
    context: ExtensionContext;
    constructor(context: ExtensionContext) {
        super();
        this.context = context;
    }

    async shouldPromptBeRendered() {
        return !(await this.containsMasterKey());
    }

    async containsMasterKey() {
        const key = await this.context.workspaceState.get('masterkey');
        return key !== undefined;
    }

    getPrompt() {
        return vscode.window.showInputBox({
            prompt: 'Enter your Master Password',
            password: true
        });
    }

    async postPromptRender(password: string) {
        const manager = new EncryptionManager(password, this.context);
        const isCorrect = await manager.verifyMasterPassword();
        if (isCorrect) {
            await this.context.workspaceState.update('masterkey', manager.key);
            await manager.updatePasswordListing();
        }
        return !isCorrect;
    }
}