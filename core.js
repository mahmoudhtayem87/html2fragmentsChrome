
//content script
var clickedEl = null;

document.addEventListener("contextmenu", function(event){
    clickedEl = event.target;
}, true);

chrome.runtime.onMessage.addListener( async function (request, sender, sendResponse) {
    if (request === "getHTML") {
        dontSelect = true;
        Swal.fire({
            icon: 'question',
            title: 'Copy Page HTML!',
            text: 'Your page html will copied to your clipboard.',
            showDenyButton: true,
            confirmButtonText: 'Copy',
            denyButtonText: `Don't copy`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                await window.navigator.clipboard.writeText(document.documentElement.outerHTML);
                sendResponse({value: document.documentElement.outerHTML});
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Your html has been copied to your clipboard',
                    showConfirmButton: false,
                    timer: 1500
                })
                dontSelect = false;
            }else
            {
                Swal.fire({
                    position: 'top-end',
                    icon: 'info',
                    title: 'Nothing has been copied to your clipboard',
                    showConfirmButton: false,
                    timer: 1500
                })
                dontSelect = false;
            }
        });
    }
    if (request === "disable") {
        prevTopper = document.getElementById("topper");
        if (prevTopper != null) {
            prevTopper.remove();
        }
        if (prevDOM != null) {
            prevDOM.classList.remove(MOUSE_VISITED_CLASSNAME);
        }
        sendResponse({value: "done!"});
    }
});
// Unique ID for the className.
var MOUSE_VISITED_CLASSNAME = 'crx_mouse_visited';

// Previous dom, that we want to track, so we can remove the previous styling.
var prevDOM = null;

function fixComponent()
{
    var type = document.getElementById("component").value;
    var tags_list = document.getElementById("tags_list");
    var component_name = document.getElementById("component_name");
    switch (type)
    {
        case "component":case "container":
            tags_list.classList.remove("show");
            tags_list.classList.add("hide");

            component_name.classList.add("show");
            component_name.classList.remove("hide");

            break;
        case "tag":
            tags_list.classList.add("show");
            tags_list.classList.remove("hide");

            component_name.classList.remove("show");
            component_name.classList.add("hide");

            break
    }
}

function showPopup(srcElement) {
    Swal.fire({
        title: 'Tell us more about the component',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
        html:
            `<div class="rendered-form">
                <div class="">
                    <label for="component" class="formbuilder-select-label">Type<span class="formbuilder-required">*</span></label><br/>
                    <select class=" swal2-input" name="component" id="component" required="required" aria-required="true">
                        <option value="component" selected="true" id="component-0">Component</option>
                        <option value="container" id="component-1">Container</option>
                        <option value="tag" id="component-2">Tag</option>
                    </select>
                </div>
                <div id="component_name" class="show " style="margin-top:10px">
                    <label for="component-name" class="formbuilder-text-label">Component / Container Name</label><br/>
                    <input type="text" class=" swal2-input" name="lfr_component_name" access="false" id="lfr_component_name">
                </div>
                <div id="tags_list" class="hide " style="margin-top:10px">
                    <label for="tag" class="" >Tag*</label><br/>
                    <select class=" swal2-input" name="tag" id="lfr_tag">
                        <option value="navigation" selected="true" id="tag-0">navigation</option>
                        <option value="navigation-root" id="tag-1">navigation-root</option>
                        <option value="navigation-item-with-sub" id="tag-2">navigation-item-with-sub</option>
                        <option value="navigation-sub-label" id="tag-3">navigation-sub-label</option>
                        <option value="avatar" id="tag-4">avatar</option>
                        <option value="search" id="tag-5">search</option>
                        <option value="language" id="tag-6">language</option>
                        <option value="logo" id="tag-7">logo</option>
                        <option value="skip" id="tag-8">skip</option>
                        <option value="dropzone" id="tag-9">dropzone</option>
                    </select>
                </div>
            </div>`,
        focusConfirm: true,
        preConfirm: () => {
            var type = document.getElementById("component").value;
            switch (type)
            {
                case "component":case "container":
                var component_name = document.getElementById("lfr_component_name").value;
                    srcElement.setAttribute("liferay-component-type", type);
                    srcElement.setAttribute("liferay-component-name", component_name);
                    break;
                case "tag":
                    var lfr_tag = document.getElementById("lfr_tag").value;
                    srcElement.setAttribute("liferay-tag", lfr_tag);
                    break
            }
            dontSelect = false;
        },
        preDeny:()=>{
            dontSelect = false;
        }
    });
    document.getElementById("component").addEventListener("change",fixComponent);
}


var dontSelect = false;
document.addEventListener('mousemove', async function (e) {
    var topper = document.createElement('span');
    topper.setAttribute("id","topper");
    topper.classList.add("top");
    var status = await chrome.storage.sync.get("isActive");
    if (!status.isActive)
        return;
    if (dontSelect)
        return;
    var srcElement = e.target;
    var stop = false;
    srcElement.classList.forEach(cssClass => {
        if (cssClass.indexOf("swal2-container") != -1) {
            stop = true;
            return;
        }
    });
    if (!stop) {
        if (prevDOM != null) {
            prevDOM.classList.remove(MOUSE_VISITED_CLASSNAME);
        }
        prevTopper = document.getElementById("topper");
        if (prevTopper != null) {
            prevTopper.remove();
        }
        var classList = "";
        srcElement.classList.forEach(css=>{
            classList+=`<li>${css}</li>`;
        })
        topper.innerHTML = `
            <h3 style="margin-bottom: 1rem">HTML 2 Liferay Fragments Collection</h3>
            <br/>
            <strong style="margin-bottom: 0.5rem">Element id:</strong>
            <br/>
            ${srcElement.getAttribute("id")}
            <br/>
            <strong style="margin-bottom: 0.5rem">Element Type:</strong>
            <br/>
            ${srcElement.tagName}
            <br/>
            <strong style="margin-bottom: 0.5rem">Element CSS Class List:</strong>
            <br/>
            <ul style="padding:1rem">
            ${classList}
            </ul>
        `;
        document.documentElement.appendChild(topper);
        srcElement.classList.add(MOUSE_VISITED_CLASSNAME);
        prevDOM = srcElement;
    }
}, false);
document.addEventListener('mousedown', async function (e) {
    var status = await chrome.storage.sync.get("isActive");
    if (!status.isActive)
        return;
    if (dontSelect)
        return;
    if (e.buttons != 1)
        return;
    dontSelect = true;
    var srcElement = e.target;
    var stop = false;
    showPopup(srcElement);
}, false);

