import wixData from 'wix-data';
import wixUsers from 'wix-users';

$w.onReady(function () {
    if (wixUsers.currentUser.loggedIn) {
        checkIfMemberHasStore();
    }
    checkStoreStatus();
    $w("#button1").onClick(() => {
        saveChangesAndSubmit();
    });
});

function checkIfMemberHasStore() {
    const userId = wixUsers.currentUser.id;
    wixData.query("Lojas")
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
    wixData.insert("Lojas", newStore)
        .then((result) => {
            console.log("Loja criada com sucesso:", result);
            location.reload();
        })
        .catch((err) => {
            console.error("Erro ao criar loja:", err);
        });
}

function checkStoreStatus() {
    const userId = wixUsers.currentUser.id;
    wixData.query("Lojas")
        .eq("_owner", userId)
        .find()
        .then((results) => {
            if (results.items.length > 0) {
                const item = results.items[0];
                if (item.solicitacao === false && item.aprovacao === false) {
                    $w("#status").text = "Por favor, envie os dados da loja.";
                } else if (item.aprovacao === true) {
                    $w("#status").text = "A Loja foi aprovada e está publicada.";
                } else if (item.solicitacao === true) {
                    $w("#status").text = "Aguarde a Aprovação.";
                }
            }
        })
        .catch((err) => {
            console.error("Erro ao verificar o status da loja:", err);
        });
}

function saveChangesAndSubmit() {
    const dataset = $w("#Perfil");
    dataset.save()
        .then(() => {
            const userId = wixUsers.currentUser.id;
            wixData.query("Lojas")
                .eq("_owner", userId)
                .find()
                .then((results) => {
                    if (results.items.length > 0) {
                        const item = results.items[0];
                        if (!item.solicitacao) {
                            item.solicitacao = true;
                            item.aprovacao = false;
                            wixData.update("Lojas", item)
                                .then(() => {
                                    $w("#status").text = "Dados enviados com sucesso, Aguarde a Aprovação!";
                                })
                                .catch((err) => {
                                    console.error("Erro ao atualizar a solicitação da loja:", err);
                                    $w("#status").text = "Erro ao enviar dados.";
                                });
                        } else {
                            $w("#status").text = "Os dados já foram Enviados.";
                        }
                    }
                })
                .catch((err) => {
                    console.error("Erro ao buscar a loja do usuário:", err);
                });
        })
        .catch((err) => {
            console.error("Erro ao salvar alterações no dataset:", err);
            $w("#status").text = "Erro ao enviar os dados.";
        });
}
