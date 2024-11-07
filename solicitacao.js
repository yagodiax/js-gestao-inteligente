import wixData from 'wix-data';
import wixLocation from 'wix-location';

$w.onReady(function () {
    $w("#btnAprovar").onClick(() => {
        const item = $w("#dynamicDataset").getCurrentItem();
        if (item) {
            approveItem(item);
        } else {
            showNotification("Item não encontrado.");
        }
    });

    $w("#btnReprovar").onClick(() => {
        const item = $w("#dynamicDataset").getCurrentItem();
        if (item) {
            rejectItem(item._id);
        } else {
            showNotification("Item não encontrado.");
        }
    });
});

function approveItem(item) {
    wixData.query("Lojas")
        .eq("_id", item._id)
        .find()
        .then((results) => {
            if (results.items.length > 0) {
                const existingItem = results.items[0];
                const updatedItem = {
                    ...existingItem,
                    "solicitacao": false,
                    "aprovacao": true
                };
                wixData.update("Lojas", updatedItem)
                    .then(() => {
                        showNotification("Loja aprovada com sucesso!");
                        wixLocation.to("/solicitações");
                    })
                    .catch((err) => {
                        showNotification("Erro ao atualizar a loja: " + err);
                        console.error("Erro ao atualizar loja:", err);
                    });
            }
        })
        .catch((err) => {
            showNotification("Erro ao buscar a loja: " + err);
            console.error("Erro ao buscar loja:", err);
        });
}

function rejectItem(itemId) {
    wixData.query("Lojas")
        .eq("_id", itemId)
        .find()
        .then((results) => {
            if (results.items.length > 0) {
                const existingItem = results.items[0];
                const updatedItem = {
                    ...existingItem,
                    "solicitacao": false,
                    "aprovacao": false
                };
                wixData.update("Lojas", updatedItem)
                    .then(() => {
                        showNotification("Loja reprovada com sucesso!");
                        wixLocation.to("/solicitações");
                    })
                    .catch((err) => {
                        showNotification("Erro ao atualizar a loja: " + err);
                        console.error("Erro ao atualizar loja:", err);
                    });
            }
        })
        .catch((err) => {
            showNotification("Erro ao buscar a loja: " + err);
            console.error("Erro ao buscar loja:", err);
        });
}

function showNotification(message) {

}
