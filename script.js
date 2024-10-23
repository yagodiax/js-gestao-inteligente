// Codigo Gerenciamento da Propria Loja FUNCIONANDO

import wixData from 'wix-data';
import wixUsers from 'wix-users';
import wixLocation from 'wix-location';

$w.onReady(function () {
    checkIfMemberHasStore();
    $w("#button1").onClick(() => {
        $w("#statusMessage").text = "Aguarde..."; // Mensagem de aguarde
        markStoreRequestAsPositive();
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
    };
    wixData.insert("LOJASOLICITACAO", newStore)
        .then((result) => {
            console.log("Loja criada com sucesso:", result);
            wixLocation.to(wixLocation.url); // Recarrega a página após criar a loja
        })
        .catch((err) => {
            console.error("Erro ao criar loja:", err);
        });
}

function markStoreRequestAsPositive() {
    const userId = wixUsers.currentUser.id;
    wixData.query("LOJASOLICITACAO")
        .eq("_owner", userId)
        .find()
        .then((results) => {
            if (results.items.length > 0) {
                let storeRequest = results.items[0];
                storeRequest.solicitacao = true;
                wixData.update("LOJASOLICITACAO", storeRequest)
                    .then((updated) => {
                        console.log("Solicitação da loja marcada como positiva:", updated);
                        $w("#statusMessage").text = "Dados enviados com sucesso!"; // Mensagem de sucesso
                    })
                    .catch((err) => {
                        console.error("Erro ao marcar solicitação da loja como positiva:", err);
                        $w("#statusMessage").text = "Erro ao enviar os dados."; // Mensagem de erro
                    });
            }
        })
        .catch((err) => {
            console.error("Erro ao buscar solicitação da loja:", err);
            $w("#statusMessage").text = "Erro ao buscar os dados."; // Mensagem de erro
        });
}
