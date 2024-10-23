import wixData from 'wix-data';
import wixWindow from 'wix-window';

$w.onReady(function () {
    loadNextStore();
});

function loadNextStore() {
    wixData.query("LOJASOLICITACAO")
        .eq("solicitacao", true)
        .limit(1)
        .find()
        .then((results) => {
            if (results.items.length > 0) {
                const item = results.items[0];
                $w("#text57").text = item.nome;
                $w("#image6").src = item.logo;
                $w("#text62").text = item.endereco;
                $w("#text63").text = item.frase;
                $w("#text65").text = item.horario;
                $w("#text67").text = item.texto;
                $w("#text72").text = item.instagram;
                $w("#text68").text = item.site;
                $w("#text70").text = item.whatsapp;
                $w("#gallery1").items = item.fotos;
                $w("#videoBox4").videoUrl = item.videoLoja;
                $w("#videoBox3").videoUrl = item.videoRoupas;
                $w("#btnAprovar").onClick(() => {
                    approveItem(item);
                });
                $w("#btnReprovar").onClick(() => {
                    rejectItem(item._id);
                });
            } else {
                $w("#text57").text = "Nenhuma loja para revisar";
            }
        })
        .catch((err) => {
            console.error("Erro ao carregar loja:", err);
            showNotification("Erro ao carregar loja: " + err);
        });
}

function approveItem(item) {
    wixData.query("Lojas")
        .eq("_id", item._id) 
        .find()
        .then((results) => {
            const newItem = {
                "_id": item._id,
                "title": item.nome,
                "logo": item.logo,
                "endereco": item.endereco,
                "frase": item.frase,
                "horario": item.horario,
                "texto": item.texto,
                "instagram": item.instagram,
                "site": item.site,
                "whatsapp": item.whatsapp,
                "fotos": item.fotos,
                "videoLoja": item.videoLoja,
                "videoRoupas": item.videoRoupas
            };
            if (results.items.length > 0) {
                const existingItem = results.items[0];
                wixData.update("Lojas", { ...existingItem, ...newItem })
                    .then(() => {
                        updateSolicitacaoField(item._id);
                        showNotification("Loja aprovada e atualizada com sucesso!");
                        loadNextStore();
                        scrollToTop();
                    })
                    .catch((err) => {
                        showNotification("Erro ao atualizar a loja: " + err);
                        console.error("Erro ao atualizar loja:", err);
                        scrollToTop();
                    });
            } else {
                wixData.insert("Lojas", newItem)
                    .then(() => {
                        updateSolicitacaoField(item._id);
                        showNotification("Loja aprovada e inserida com sucesso!");
                        loadNextStore();
                        scrollToTop();
                    })
                    .catch((err) => {
                        showNotification("Erro ao inserir a loja aprovada: " + err);
                        console.error("Erro ao inserir loja aprovada:", err);
                        scrollToTop();
                    });
            }
        })
        .catch((err) => {
            showNotification("Erro ao buscar a loja: " + err);
            console.error("Erro ao buscar loja:", err);
            scrollToTop();
        });
}

function rejectItem(itemId) {
    wixData.query("LOJASOLICITACAO")
        .eq("_id", itemId)
        .find()
        .then((results) => {
            const item = results.items[0];
            updateSolicitacaoField(item._id);
            showNotification("Loja reprovada com sucesso!");
            loadNextStore(); 
            wixWindow.openLightbox("RejectionMessage");
            scrollToTop();
        })
        .catch((err) => {
            showNotification("Erro ao encontrar a solicitação: " + err);
            console.error("Erro ao encontrar a solicitação:", err);
            scrollToTop();
        });
}

function updateSolicitacaoField(itemId) {
    wixData.get("LOJASOLICITACAO", itemId)
        .then((item) => {
            item.solicitacao = false;
            wixData.update("LOJASOLICITACAO", item)
                .catch((err) => {
                    showNotification("Erro ao atualizar o campo de solicitação: " + err);
                    console.error("Erro ao atualizar campo de solicitação:", err);
                });
        })
        .catch((err) => {
            showNotification("Erro ao obter a loja: " + err);
            console.error("Erro ao obter loja:", err);
        });
}

function showNotification(message) {
    $w("#notificationMessage").text = message;
    $w("#notificationMessage").show();
}

function scrollToTop() {
    wixWindow.scrollTo(0, 0);
}
