import wixData from 'wix-data';
import wixUsers from 'wix-users';

$w.onReady(function () {
    if (wixUsers.currentUser.loggedIn) {
        checkIfMemberHasStore();
    }
    $w("#button1").onClick(() => {
        $w("#statusMessage").text = "Aguarde..."; 
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
                $w("#statusMessage").text = "Você já possui uma loja.";
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
        solicitacao: true 
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
    dataset.save()
        .then(() => {
            const userId = wixUsers.currentUser.id;
            wixData.query("LOJASOLICITACAO")
                .eq("_owner", userId)
                .find()
                .then((results) => {
                    if (results.items.length > 0) {
                        const item = results.items[0];
                        item.solicitacao = true; 
                        wixData.update("LOJASOLICITACAO", item)
                            .then(() => {
                                $w("#statusMessage").text = "Dados enviados e solicitação marcada com sucesso!";
                            })
                            .catch((err) => {
                                console.error("Erro ao atualizar a solicitação da loja:", err);
                                $w("#statusMessage").text = "Erro ao enviar os dados e marcar a solicitação."; 
                            });
                    }
                })
                .catch((err) => {
                    console.error("Erro ao buscar a loja do usuário:", err);
                });
        })
        .catch((err) => {
            console.error("Erro ao salvar alterações no dataset:", err);
            $w("#statusMessage").text = "Erro ao enviar os dados."; 
        });
}
