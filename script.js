// Codigo Gerenciamento da Propria Loja

import wixData from 'wix-data';
import wixUsers from 'wix-users';

$w.onReady(function () {
    checkIfMemberHasStore();
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
                checkIfUserHasPlan(userId);
            }
        })
        .catch((err) => {
            console.error("Erro ao verificar se o usuário possui loja:", err);
        });
}

function checkIfUserHasPlan(userId) {
    wixData.query("PaidPlans/Plans")
        .eq("_owner", userId)
        .find()
        .then((results) => {
            if (results.items.length > 0) {
                createNewStore(userId);
            } else {
                console.log("Usuário não possui um plano.");
            }
        })
        .catch((err) => {
            console.error("Erro ao verificar se o usuário possui um plano:", err);
        });
}

function createNewStore(userId) {
    const newStore = {
        _owner: userId,
    };
    wixData.insert("LOJASOLICITACAO", newStore)
        .then((result) => {
            console.log("Loja criada com sucesso:", result);
        })
        .catch((err) => {
            console.error("Erro ao criar loja:", err);
        });
}
