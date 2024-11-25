import wixData from 'wix-data';
import wixUsers from 'wix-users';

$w.onReady(function () {
    if (wixUsers.currentUser.loggedIn) {
        checkIfMemberHasStore();
    }
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
        })
        .catch((err) => {
            console.error("Erro ao criar loja:", err);
        });
}
