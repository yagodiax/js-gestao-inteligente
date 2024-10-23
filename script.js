// MINHA LOJA

import wixData from 'wix-data';
import wixUsers from 'wix-users';

$w.onReady(function () {
    if (wixUsers.currentUser.loggedIn) { // Verifique se o usuário está logado
        checkIfMemberHasStore();
    }
    $w("#button1").onClick(() => {
        $w("#statusMessage").text = "Aguarde..."; // Mensagem de aguarde
        saveChangesAndSubmit();
    });
});

function checkIfMemberHasStore() {
    const userId = wixUsers.currentUser.id;
    wixData.query("LOJASOLICITACAO")
        .eq("_owner", userId)
        .find()
        .then((results) => {
            if (results.items.length > 0) {
                console.log("Usuário já possui uma loja.");
                $w("#statusMessage").text = "Você já possui uma loja."; // Informar ao usuário que ele já possui uma loja
            } else {
                createNewStore(userId);
            }
        })
        .catch((err) => {
            console.error("Erro ao verificar se o usuário possui loja:", err);
        });
}

function createNewStore(userId) {
    const newStore = {
        _owner: userId,
        solicitacao: false // Inicializa o campo solicitacao como false
    };
    wixData.insert("LOJASOLICITACAO", newStore)
        .then((result) => {
            console.log("Loja criada com sucesso:", result);
        })
        .catch((err) => {
            console.error("Erro ao criar loja:", err);
        });
}

function saveChangesAndSubmit() {
    const dataset = $w("#Perfil");

    // Salve as alterações no dataset
    dataset.save()
        .then(() => {
            $w("#statusMessage").text = "Dados enviados com sucesso!"; // Mensagem de sucesso
        })
        .catch((err) => {
            console.error("Erro ao salvar alterações no dataset:", err);
            $w("#statusMessage").text = "Erro ao enviar os dados."; // Mensagem de erro
        });
}
z
