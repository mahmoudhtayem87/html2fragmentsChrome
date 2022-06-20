let toggle = document.getElementById("toggle");
let github_link = document.getElementById("github");
let copy = document.getElementById("copy");
let npm_link = document.getElementById("npm");

setLabel();
copy.addEventListener("click",()=>{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var currTab = tabs[0];
        if (currTab) { // Sanity check
            chrome.tabs.sendMessage(currTab.id, "getHTML", {}, data => {

            });
        }
    });
});
github_link.addEventListener("click",()=>{
    console.log("github");
    var newURL = "https://github.com/mahmoudhtayem87/HTML2FragmentsCollection";
    chrome.tabs.create({ url: newURL });
});
npm_link.addEventListener("click",()=>{
    console.log("github");
    var newURL = "https://www.npmjs.com/package/html-2-fragments-collection";
    chrome.tabs.create({ url: newURL });
});
document.addEventListener("DOMContentLoaded",async ()=>{
    await setLabel();
});
function disable()
{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var currTab = tabs[0];
        if (currTab) { // Sanity check
            chrome.tabs.sendMessage(currTab.id, "disable", {}, data => {
            });
        }
    });
}
async function setLabel()
{
    //toggle-title
    let toggle_title = document.getElementById("toggle-title");
    let toggle_icon = document.getElementById("toggle-icon");
    var status = await chrome.storage.sync.get("isActive");
    toggle_title.innerHTML = status.isActive === true ? "Disable" : "Enable";
    toggle_icon.classList.remove("disable");
    toggle_icon.classList.remove("enable");
    toggle_icon.classList.add(status.isActive === false ? "disable" : "enable");

}
// When the button is clicked, inject setPageBackgroundColor into current page
toggle.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    var status = await chrome.storage.sync.get("isActive");
    isActive = !status.isActive;
    await chrome.storage.sync.set({isActive});
    setLabel();
    if (!isActive)
    {
        console.log("disable");
        disable();
    }
});
