
let isActive = false;

function copyHtml(info,tab) {
    try
    {
        console.log("copy html!");
        chrome.tabs.sendMessage(tab.id, "getHTML", {frameId: info.frameId}, async data => {
            console.log(data);
        });
    }catch (exp)
    {

    }

}

chrome.runtime.onInstalled.addListener( () => {
    chrome.storage.sync.set({ "isActive": false }, function(){
    });
});



