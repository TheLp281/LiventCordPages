function reloadCSS() {
    const approvedDomains = ['localhost'];
    function getDomain(url) {
        const link = createEl('a');
        link.href = url;
        return link.hostname;
    }
    const links = document.getElementsByTagName('link');
    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        if (link.rel === 'stylesheet') {
            const href = link.href;
            const domain = getDomain(href);
            if (approvedDomains.includes(domain)) {
                const newHref = href.indexOf('?') !== -1 ? `${href}&_=${new Date().getTime()}` : `${href}?_=${new Date().getTime()}`;
                link.href = newHref;
            }
        }
    }
}

//window.addEventListener('focus', reloadCSS);

let isUnread = false;
let wasNotChangingUrl = false;
let isImagePreviewOpen = false;
let closeCurrentJoinPop;
const MyAccount = "MyAccount";
const SoundAndVideo = "SoundAndVideo";
const Notifications = "Notifications";
const ActivityPresence = "ActivityPresence";
const Appearance = "Appearance";
const socket = io();
let guildsList;
let isSettingsOpen = false;
let isUnsaved = false;
let isChangedProfile = false;
let isChangedNick = false;
let isInitialized = false;
let isOnGuild = false;
let shakeForce = 1;
let resetTimeout; 
let currentPopUp = null;

let contextMenu = null;
let microphoneButton = null;
let earphoneButton;
let isEmailToggled = false;
let currentUserId;
let currentDiscriminator = null;
let currentUserName;
let currentChannelId;
let currentVoiceChannelId;
let lastConfirmedProfileImg;
let currentGuildName = '';
let currentGuildIndex = 0;
let logoClicked = 0;
let isWarnedMic = false;
let isGuildSettings = false;
let currentSettingsType = MyAccount;
let userNames = {};
userNames['1'] = {
    nick: 'Clyde',
    discriminator: '0000',
    is_blocked: false
};

let currentEscHandler;
let isOnMe = true;
let isOnDm = false;

let cachedFriMenuContent;
let userListFriActiveHtml;

let contextList = {};
let messageContextList = {};

let channels_cache = {}; // <guild_id> <channels_list>
let guild_users_cache = {}; // <guild_id> <users_list>
let users_metadata_cache = {}; // <guild_id> 

let usersInVoice = {};
let readenMessagesCache = {};
let guildAuthorIds = {};

const userListTitleHTML = `
<h1 id='nowonline' style="font-weight: bolder;">Şimdi Aktif</h1> <ul> </ul>
`;




function getId(string) { return document.getElementById(string);}
const createEl = (tag, options) => Object.assign(document.createElement(tag), options);

const loadingScreen = createEl('div', { id: 'loading-screen' });
document.body.appendChild(loadingScreen);
const loadingElement = createEl('img', { id: 'loading-element' });
loadingScreen.appendChild(loadingElement);
loadingElement.src = '/static/images/icons/icon.png';

async function urlToBase64(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onloadend = () => {
                const base64Data = reader.result.split(',')[1];
                const mimeType = blob.type || 'image/png';
                resolve(`data:${mimeType};base64,${base64Data}`);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Error fetching or converting URL to Base64:', error);
        throw error;
    }
}
urlToBase64(defaultProfileImageUrl)
    .then(base64 => defaultProfileImageUrl = base64)
    .catch(error => console.error(error));
    
urlToBase64(defaultMediaImageUrl)
    .then(base64 => defaultMediaImageUrl = base64)
    .catch(error => console.error(error));
    

function disableElement(str) {
    const element = getId(str);
    if(element) {
        element.style.display = 'none';
    }   

}
function enableElement(str, isFlex1 = false, isBlock = false, isInline = false) {
    const element = getId(str);
    if (element) {
        if (isFlex1) {
            element.style.flex = '1';
        }
        
        if (isBlock) {
            element.style.display = 'block';
        } else if (isInline) {
            element.style.display = 'inline-block';
        } else {
            element.style.display = 'flex';
        }

        //console.log("Element", str, 'is enabled.');
    }
}


function toggleEmail() {
    const eyeIcon = getId('set-info-email-eye');
    isEmailToggled = !isEmailToggled;
    getId("set-info-email").textContent = isEmailToggled ? email : masked_email;    

    if (isEmailToggled) {
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
    

}
function clearCookies() {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [name] = cookie.split('=');
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
}
function saveBooleanCookie(name, value) {
    value = value ? 1 : 0;
    const expires = new Date();
    expires.setTime(expires.getTime() + (365 * 24 * 60 * 60 * 1000));
    const expiresStr = `expires=${expires.toUTCString()}`;
    const cookieValue = encodeURIComponent(value);
    document.cookie = `${encodeURIComponent(name)}=${cookieValue}; ${expiresStr}; path=/`;
}

function loadBooleanCookie(name) {
    const cookieName = encodeURIComponent(name) + '=';
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        if (cookie.startsWith(cookieName)) {
            const result = decodeURIComponent(cookie.substring(cookieName.length));
            return result == 1;
        }
    }
    return null;
}


function startGuildJoinCreate() {
    showGuildPop('Sunucunu Oluştur','Sunucun, arkadaşlarınla takıldığınız yerdir. Kendi sunucunu oluştur ve konuşmaya başla.');

}


function showGuildPop(subject, content) {

    const newPopParent = createEl('div', { className: 'pop-up', id: 'guild-pop-up' });
    const newPopOuterParent = createEl('div', { className: 'outer-parent' });
    const guildPopSubject = createEl('h1', { className: 'guild-pop-up-subject', textContent: subject });
    const guildPopContent = createEl('p', { className: 'guild-pop-up-content', textContent: content });
    const guildPopButtonContainer = createEl('div', { className: 'guild-pop-button-container' });

    const popBottomContainer = createEl('div',{className:'popup-bottom-container'});
    const popOptionButton = createEl('button', { id:'popOptionButton',className: 'guild-pop-up-accept', textContent: 'Kendim Oluşturayım' });
    const closeCallback = function (event) {
        closePopUp(newPopOuterParent, newPopParent);
    }
    
    
    popOptionButton.addEventListener('click', function () { changePopUpToGuildCreation(newPopParent,guildPopButtonContainer,guildPopContent,guildPopSubject,closeCallback); });

    const option2Title = createEl('p', {className:'guild-pop-up-content', id:'guild-popup-option2-title',textContent:'Zaten davetin var mı?' });
    const popOptionButton2 = createEl('button', { id:'popOptionButton2',className: 'guild-pop-up-accept', textContent: 'Bir Sunucuya Katıl' });
    popOptionButton2.addEventListener('click', function () { ChangePopUpToGuildJoining(newPopParent,guildPopButtonContainer,guildPopContent,guildPopSubject,closeCallback); });

    popBottomContainer.appendChild(option2Title);
    popBottomContainer.appendChild(popOptionButton2);

    const closeButton = createEl('button', { className: 'pop-up-accept', className: 'popup-close', textContent: 'X' });
    closeButton.addEventListener('click', function () { closePopUp(newPopOuterParent, newPopParent); });

    newPopParent.appendChild(guildPopSubject);
    newPopParent.appendChild(guildPopContent);
    guildPopButtonContainer.appendChild(popOptionButton);
    guildPopButtonContainer.appendChild(popBottomContainer);
    newPopParent.appendChild(guildPopButtonContainer);
    newPopParent.appendChild(closeButton);

    newPopOuterParent.appendChild(newPopParent);
    newPopOuterParent.style.display = 'flex';

    newPopOuterParent.addEventListener('click',function() {
        if (event.target === newPopOuterParent) {
            closeCallback();
        }
    });

    document.body.appendChild(newPopOuterParent);

}
function clickToCreateGuildBackButton() {
    closePopUp(newPopOuterParent, newPopParent);
}
function clickToJoinGuildBackButton(event,closeCallback) {
    closeCallback(event);
    startGuildJoinCreate();
}

function changePopUpToGuildCreation(newPopParent, popButtonContainer, newPopContent, newPopSubject,closeCallback) {

    if (popButtonContainer && popButtonContainer.parentNode) {
        popButtonContainer.parentNode.removeChild(popButtonContainer);
    }
    newPopSubject.textContent = 'Sunucunu Özelleştir';
    newPopContent.textContent = 'Yeni sunucuna bir isim ve simge ekleyerek ona kişilik kat. Bunları istediğin zaman değiştirebilirsin.';

    const text = currentUserName + ' Kullanıcısının sunucusu';
    const newInput = createEl('input', { value: text, id: 'guild-name-input' });
    const createButton = createEl('button', { textContent: 'Oluştur', className: 'create-guild-verify common-button' });
    const backButton = createEl('button', { textContent: 'Geri', className: 'create-guild-back common-button' });

    backButton.addEventListener('click', function(event) {
        clickToJoinGuildBackButton(event, closeCallback);
    });
    const guildNameTitle = createEl('h1', { textContent: 'SUNUCU ADI', className: 'create-guild-title' });

    const guildImageForm = createEl('div', { id: 'guildImageForm', accept: 'image/*' });
    const guildImageInput = createEl('input', { type: 'file', id: 'guildImageInput', accept: 'image/*', style: 'display: none;' });

    const guildImage = createEl('div', { id: 'guildImg', className: 'fas fa-camera' });
    const uploadText = createEl('p', { id: 'uploadText', textContent: 'UPLOAD' });
    const clearButton = createEl('button', { id: 'clearButton', textContent: 'X', style: 'display: none;' });
    guildImage.appendChild(uploadText);
    guildImage.appendChild(clearButton);
    function triggerGuildInput() {
        guildImageInput.click();
    }
    function handleImageUpload(event) {
        console.log(event);
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                guildImage.style.backgroundImage = `url(${e.target.result})`;
                guildImage.style.backgroundSize = 'cover';
                guildImage.style.backgroundPosition = 'center';
                uploadText.style.display = 'none'; 
                clearButton.style.display = 'flex'; 
                guildImage.className = "guildImage";
                
            };
            reader.readAsDataURL(file);
        }
    }

    guildImage.addEventListener('click', triggerGuildInput);
    createButton.addEventListener('click', createGuild);

    guildImageInput.addEventListener('change', handleImageUpload);
    clearButton.addEventListener('click', clearImage);

    function clearImage(event) {
        event.stopPropagation(); 
        guildImage.style.backgroundImage = '';
        uploadText.style.display = 'block'; 
        clearButton.style.display = 'none'; 
        guildImageInput.value = ''; 
    }

    guildImageForm.appendChild(guildImageInput);
    guildImageForm.appendChild(guildImage);

    newPopParent.style.animation='guild-pop-up-create-guild-animation 0.3s forwards';
    newPopParent.appendChild(guildImageForm);
    newPopParent.appendChild(guildNameTitle);
    newPopParent.appendChild(newInput);
    newPopParent.appendChild(createButton);
    newPopParent.appendChild(backButtn);
}
function ChangePopUpToGuildJoining(newPopParent, popButtonContainer, newPopContent, newPopSubject,closeCallback) {

    if (popButtonContainer) {
        popButtonContainer.remove();
    }

    newPopSubject.textContent = 'Bir Sunucuya Katıl';
    newPopContent.textContent = 'Var olan bir sunucuya katılmak için aşağıya bir davet gir.';
    const text = `${window.location.protocol}//${window.location.hostname}/hTKzmak`;
    const newInput = createEl('input', { placeholder: text, id: 'guild-name-input' });

    const joinButton = createEl('button', { textContent: 'Sunucuya Katıl', className: 'create-guild-verify common-button' });
    joinButton.style.fontSize = '14px';
    joinButton.style.whiteSpace = 'nowrap';
    joinButton.style.padding = '0px';
    joinButton.style.width = '120px';





    joinButton.addEventListener('click',function() {
        if(newInput.value == '') {
            guildNameTitle.textContent = 'DAVET BAĞLANTISI - Lütfen geçerli bir davet bağlantısı veya davet kodu gir.';
            guildNameTitle.textAlign = 'left';
            guildNameTitle.style.color = 'red';
            return;
        } 
        joinToGuild(newInput.value);
        closeCurrentJoinPop = closeCallback;
    });

    const backButton = createEl('button', { textContent: 'Geri', className: 'create-guild-back common-button' });
    backButton.addEventListener('click', function(event) {
        clickToJoinGuildBackButton(event, closeCallback);
    });
    const guildNameTitle = createEl('h1', { textContent: 'DAVET BAĞLANTISI', className: 'create-guild-title',id:'create-guild-title' });
    guildNameTitle.style.top = '25%';
    const guildNameDescription = createEl('h1', { textContent: 'DAVETLER ŞÖYLE GÖRÜNÜR', className: 'create-guild-title' });
    const descriptionText = `
    hTKzmak<br>
    ${window.location.protocol}//${window.location.hostname}/hTKzmak<br>
    ${window.location.protocol}//${window.location.hostname}/cool-people
    `;
    const guildNameDescriptionContent = createEl('h1', { innerHTML: descriptionText, className: 'create-guild-title' });
    guildNameDescriptionContent.style.width = '55%';
    guildNameDescriptionContent.style.textAlign = 'left'; 
    
    


    guildNameDescriptionContent.style.color = 'white';
    guildNameDescriptionContent.style.top = '60%';
    guildNameDescription.style.top = '55%';
    newInput.style.bottom = '50%';


    const guildImage = createEl('div', { id: 'guildImg', className: 'fas fa-camera' });
    const uploadText = createEl('p', { id: 'uploadText', textContent: 'UPLOAD' });
    const clearButton = createEl('button', { id: 'clearButton', textContent: 'X', style: 'display: none;' });
    guildImage.appendChild(uploadText);
    guildImage.appendChild(clearButton);

    const popBottomContainer = createEl('div',{className:'popup-bottom-container'});

    const guildPopButtonContainer = createEl('div', { className: 'guild-pop-button-container' });
    guildPopButtonContainer.appendChild(popBottomContainer);
    newPopParent.appendChild(guildPopButtonContainer);

    newPopParent.style.animation = 'guild-pop-up-join-guild-animation 0.3s forwards';

    newPopParent.appendChild(guildNameTitle);
    newPopParent.appendChild(guildNameDescription);
    newPopParent.appendChild(guildNameDescriptionContent);
    newPopParent.appendChild(newInput);
    newPopParent.appendChild(joinButton);
    newPopParent.appendChild(backButton);
}


function closePopUp(outerParent, popParent) {

    popParent.style.animation = 'pop-up-shrink-animation 0.2s forwards';
    popParent.style.overflow = 'hidden'; 

    setTimeout(() => {
        outerParent.remove();
    }, 200);
}



function triggerFileInput() {
    getId('profileImage').click();
}
function triggerguildImageUpdate() {
    getId('guildImage').click();
}

function reconstructSettings(_isGuildSettings) { //
    const leftBar = getId('settings-leftbar');
    leftBar.innerHTML = '';
    isGuildSettings = _isGuildSettings ;
    if(_isGuildSettings) {
        leftBar.innerHTML = getGuildSettingsHTML();
        selectSettingCategory( Overview );

    } else{ 
        leftBar.innerHTML = getSettingsHtml();
    }

}
function keydownHandler(event) {
    if (event.key === 'Escape') {
        event.preventDefault();
        if (isSettingsOpen) {
            closeSettings();
            return;
        }
        if (isImagePreviewOpen) {
            hideImagePreviewRequest();
        }
    }
}

document.addEventListener('keydown', keydownHandler);

function openSettings(isNotLoadingDefault=false) {
    if(!isNotLoadingDefault) {
        reconstructSettings(false);
    }
    disableSnowOnSettingsOpen();
    selectSettingCategory(MyAccount); 

    

    getId('settings-overlay').style.display = 'flex';

    getId('settings-menu').style.animation = 'settings-menu-appear-animation 0.3s forwards';
    isSettingsOpen = true;
    

};


document.body.addEventListener('click', function(event) {
    if (gifMenu && !gifMenu.contains(event.target) && event.target.id !== 'gifbtn') {
        closeGifs();
    }
});
function createProfileContext(userData) {
    const user_id = userData.user_id;
    let context = {};

    context[VoiceActionType.OPEN_PROFILE] = { action: () => drawProfilePop(userData) };

    if (user_id !== currentUserId) {
        const guildSubOptions = getManageableGuilds();
        if (Array.isArray(guildSubOptions) && guildSubOptions.length > 0) {
            context[ActionType.INVITE_TO_GUILD] = {
                action: () => {},
                subOptions: guildSubOptions.map(subOption => ({
                    label: getGuildName(subOption),
                    action: () => inviteUser(user_id, subOption)
                }))
            };
        }
    }

    if (!isOnMe) {
        context[ActionType.MENTION_USER] = {
            action: () => mentionUser(user_id)
        };
    }

    if (user_id == currentUserId) {
        context[ActionType.EDIT_GUILD_PROFILE] = {
            action: () => editGuildProfile()
        };
    } else {
        context[ActionType.BLOCK_USER] = {
            action: () => blockUser(user_id)
        };
        context[ActionType.REPORT_USER] = {
            action: () => reportUser(user_id)
        };
    }

    if (isFriend(user_id)) {
        context[ActionType.REMOVE_USER] = {
            action: () => removeFriend(user_id)
        };
    }

    if (isDeveloperMode) {
        context[ActionType.COPY_USER_ID] = {
            action: () => copyId(user_id)
        };
    }

    return context;
}

function addContextListeners() {
    document.addEventListener('contextmenu', function (event) {
        event.preventDefault();

        let options = null;

        if (event.target.id && contextList.hasOwnProperty(event.target.id)) {
            options = contextList[event.target.id];
        } else if (event.target.dataset.m_id && messageContextList.hasOwnProperty(event.target.dataset.m_id)) {
            options = messageContextList[event.target.dataset.m_id];
        } else if (event.target.dataset.cid && contextList.hasOwnProperty(event.target.dataset.cid)) {
            options = contextList[event.target.dataset.cid];
        }

        if (options) {
            showContextMenu(event.pageX, event.pageY, options);
        }
    });

    document.addEventListener('click', function (event) {
        if (event.target.dataset.m_id && messageContextList.hasOwnProperty(event.target.dataset.m_id)) {
            const options = messageContextList[event.target.dataset.m_id];
            if (options) {
                hideContextMenu();
                showContextMenu(event.pageX, event.pageY, options);
            }
        }

        if (event.target.classList && !event.target.classList.contains('message') && event.target.id && messageContextList.hasOwnProperty(event.target.id)) {
            const options = messageContextList[event.target.id];
            if (options) {
                hideContextMenu();
                showContextMenu(event.pageX, event.pageY, options);
            }
        }
    });
}

function createChannelsContext(channel_id) {
    let context = {};
    context[ChannelsActionType.MARK_AS_READ] = { action: () => readCurrentMessages() };
    context[ChannelsActionType.COPY_LINK] = { action: () => copyChannelLink(currentGuildId, channel_id) };
    context[ChannelsActionType.MUTE_CHANNEL] = { action: () => muteChannel(channel_id) };
    context[ChannelsActionType.NOTIFY_SETTINGS] = { action: () => showNotifyMenu(channel_id) };

    if (isSelfAuthor()) {
        context[ChannelsActionType.EDIT_CHANNEL] = { action: () => editChannel(channel_id) };
        context[ChannelsActionType.DELETE_CHANNEL] = { action: () => deleteChannel(channel_id, currentGuildId) };
    }

    if (isDeveloperMode) {
        context[ActionType.COPY_ID] = { action: () => copyId(channel_id) };
    }

    return context;
}

function createMessageContext(message_id, user_id) {
    let context = {};

    context[MessagesActionType.ADD_REACTION] = { action: () => openReactionMenu(message_id) };

    if (user_id === currentUserId) {
        context[MessagesActionType.EDIT_MESSAGE] = { action: () => openEditMessage(message_id) };
    }

    if (isSelfAuthor() || (isOnDm && user_id === currentUserId)) {
        context[MessagesActionType.PIN_MESSAGE] = { action: () => pinMessage(message_id) };
    }

    context[MessagesActionType.REPLY] = { action: () => showReplyMenu(message_id, user_id) };
    context[MessagesActionType.MARK_AS_UNREAD] = { action: () => markAsUnread(message_id) };

    if (isSelfAuthor() || (isOnDm && user_id === currentUserId)) {
        context[MessagesActionType.DELETE_MESSAGE] = { action: () => deleteMessage(message_id) };
    }

    if (isDeveloperMode) {
        context[ActionType.COPY_ID] = { action: () => copyId(message_id) };
    }

    return context;
}


document.addEventListener('DOMContentLoaded', async function () {
    isDomLoaded = true;
    currentUserId = passed_user_id;
    currentUserName = user_name;
    currentDiscriminator = user_discriminator;
    
    getId('tb-showprofile').addEventListener('click', toggleUsersList);
    selectSettingCategory(MyAccount);
    selfProfileImage = getId("self-profile-image");
    microphoneButton = getId("microphone-button");
    earphoneButton = getId("earphone-button");
    selfBubble = getId("self-bubble");
    await updateSelfProfile(passed_user_id,user_name);
    microphoneButton.src =  "/static/images/icons/redmic.png";
    earphoneButton.src = "/static/images/icons/redearphones.png";
    initialiseMe();
    if (window.location.pathname.startsWith('/channels/@me/')) {
        const parts = window.location.pathname.split('/');
        const friendId = parts[3];
        OpenDm(friendId);
        
    } else  if (typeof passed_guild_id !== 'undefined' && typeof passed_channel_id !== 'undefined' && typeof passed_author_id !== 'undefined') {
        loadGuild(passed_guild_id,passed_channel_id,passed_guild_name,passed_author_id);
    }
    if (typeof passed_message_readen !== 'undefined') {
        readenMessagesCache = passed_message_readen;
    }
    if (typeof friends_status === 'object' && friends_status !== null) {
        friends_cache = friends_status;
    } 
    if(typeof passed_friend_id !== 'undefined') {
        addUser(passed_friend_id,passed_friend_name,passed_friend_discriminator,passed_friend_blocked)
    }
    addContextListeners();
    getId("variableScript").remove();



});
function createMenuItem(label, itemOptions) {
    const li = createEl('li', { textContent: label });
    li.addEventListener('click', function(event) {
        event.stopPropagation();
        hideContextMenu();
        if (itemOptions.action) {
            itemOptions.action();
        }
    });

    if (itemOptions.subOptions) {
        const subUl = createEl('ul');
        itemOptions.subOptions.forEach(subOption => {
            const subLi = createMenuItem(subOption.label, { action: subOption.action });
            subUl.appendChild(subLi);
        });
        li.appendChild(subUl);

        li.addEventListener('mouseenter', function() {
            const subMenu = li.querySelector('ul');
            subMenu.style.display = 'block';
            
            subMenu.style.left = '100%';
            subMenu.style.right = 'auto';
            
            const subRect = subMenu.getBoundingClientRect();
            const viewportWidth = window.innerWidth;

            if (subRect.right > viewportWidth) {
                subMenu.style.left = 'auto';
                subMenu.style.right = '100%';
            } else if (subRect.left < 0) { 
                subMenu.style.left = '0';
                subMenu.style.right = 'auto';
            }
        });

        li.addEventListener('mouseleave', function() {
            const subMenu = li.querySelector('ul');
            subMenu.style.display = 'none'; 
        });
    }

    return li;
}


function showContextMenu(x, y, options) {
    hideContextMenu();
    const tempContextMenu = createEl('div', { id: 'contextMenu', className: 'context-menu' });
    const ul = createEl('ul');
    for (const key in options) {
        if (options.hasOwnProperty(key)) {
            const itemOptions = options[key];
            const li = createMenuItem(key, itemOptions);
            ul.appendChild(li);
        }
    }
    tempContextMenu.appendChild(ul);
    document.body.appendChild(tempContextMenu);

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const menuWidth = tempContextMenu.offsetWidth;
    const menuHeight = tempContextMenu.offsetHeight;

    let left = Math.min(x, viewportWidth - menuWidth);
    let top = Math.min(y, viewportHeight - menuHeight);

    tempContextMenu.style.setProperty('--menu-left', `${left}px`);
    tempContextMenu.style.setProperty('--menu-top', `${top}px`);

    contextMenu = tempContextMenu;

    document.addEventListener('click', clickOutsideContextMenu);
}



function clickOutsideContextMenu(event) {
    if (contextMenu && !contextMenu.contains(event.target) && !contextList[event.target.id]) {
        hideContextMenu();
    }
}

function hideContextMenu() {
    if (contextMenu) {
        contextMenu.remove();
        contextMenu = null; // Reset contextMenu variable
        document.removeEventListener('click', clickOutsideContextMenu);
    }
}







function createBlackImage() {
    const canvas = createEl('canvas');
    canvas.width = 50; 
    canvas.height = 50; 
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL('image/png');
    return dataURL;
}
function removeFromGuildList(guild_id) {
    const guildImg = getId(guild_id);
    if (guildImg && guildsList.contains(guildImg)) {
        const parentLi = guildImg.closest('li');
        if (parentLi) {
            parentLi.remove();
        }
    }
}

function updateGuildList(guildData) {
    if (!guildData) {
        console.warn("Tried to update guild list without data.");
        return;
    }

    currentGuildData = guildData;
    guildsList.innerHTML = "";

    const mainLogo = createEl('li');
    const mainLogoImg = createEl('img', {
        id: 'main-logo',
        src: '/static/images/icons/icon.png',
        'data-src': '/static/images/icons/icon.png',
        style: 'width: 30px; height: 30px; border: 10px solid rgb(49, 51, 56); user-select: none;'
    });
    mainLogoImg.addEventListener('mousedown', function() {
        mainLogoImg.style.transform = 'translateY(50px)';
    });

    mainLogoImg.addEventListener('mouseup', function() {
        mainLogoImg.style.transform = 'translateY(0)';
    });

    mainLogoImg.addEventListener('mouseleave', function() {
        mainLogoImg.style.transform = 'translateY(0)';
    });
    mainLogoImg.addEventListener('click',function() {
        clickMainLogo();
    });


    
    mainLogo.appendChild(mainLogoImg);
    guildsList.appendChild(mainLogo);

    guildData.forEach((guild) => {
        const existingGuild = getId(guild.id);
        if (existingGuild) {
            return;
        }
        const li = createEl('li');
        const img = createEl('img', { className: 'guilds-list' });
        const whiteRod = createEl('div', { className: 'white-rod' });
        const imgSrc = guild.src && guild.src != 'black' ? guild.src : createBlackImage();
        guildAuthorIds[guild.id] = guild.owner_id;
        img.src = imgSrc;
        li.appendChild(img);
        li.appendChild(whiteRod);

        img.id = guild.id;
        img.addEventListener('click', function () {
            loadGuild(guild.id,guild.first_channel_id,guild.name,)
        });
        
        guildsList.appendChild(li);

        guildNames[guild.id] = guild.name;
    });
    addKeybinds();
    
}



function appendToGuildList(guild) {
    const guildsList = getId('guilds-list'); 
    if (guildsList.querySelector(`#${guild.id}`)) { return; }
    const li = createEl('li');
    const img = createEl('img',{className : 'guilds-list'});
    img.src = guild.src;
    li.appendChild(img);
    const whiteRod = createEl('div',{className:'white-rod'});
    li.appendChild(whiteRod);
    img.id = guild.id;
    img.addEventListener('click', function () {
        loadGuild(guild.id,guild.first_channel_id,guild.name,)
    });

    guildsList.appendChild(li);
    guildNames[guild.id] = guild.name;

    addKeybinds();
}




function alertUser(subject, content) {
    const popUpSubject = createEl('h1', { className: 'pop-up-subject', textContent: subject });
    const popUpContent = createEl('p', { className: 'pop-up-content', textContent: content });

    const popAcceptButton = createEl('button', { className: 'pop-up-accept', textContent: 'Tamam' });
    const popRefuseButton = createEl('button', { className: 'pop-up-refuse', textContent: 'İptal' });

    const buttonContainer = createEl('div', { className: 'pop-button-container' });
    buttonContainer.appendChild(popAcceptButton);
    buttonContainer.appendChild(popRefuseButton);

    const contentElements = [popUpSubject, popUpContent, buttonContainer];

    popAcceptButton.addEventListener('click', function () {
        closePopUp(outerParent, outerParent.firstChild);
    });
    popRefuseButton.addEventListener('click', function () {
        closePopUp(outerParent, outerParent.firstChild);
    });

    outerParent = createPopUp({
        contentElements: contentElements,
        id: null 
    });
}

function askUser(subject, content, successText, acceptCallback, isRed = false) {
    const popUpSubject = createEl('h1', { className: 'pop-up-subject', textContent: subject });
    const popUpContent = createEl('p', { className: 'pop-up-content', textContent: content });
    const popAcceptButton = createEl('button', { className: 'pop-up-accept', textContent: successText });
    if (isRed) {
        popAcceptButton.style.backgroundColor = 'rgb(218, 55, 60)';
    }
    let outerParent;
    popAcceptButton.addEventListener('click', function () {
        acceptCallback();
        closePopUp(outerParent, outerParent.firstChild);
    });

    const popRefuseButton = createEl('button', { className: 'pop-up-refuse', textContent: 'İptal' });
    popRefuseButton.addEventListener('click', function () {
        closePopUp(outerParent, outerParent.firstChild);
    });

    const buttonContainer = createEl('div', { className: 'pop-button-container' });
    buttonContainer.appendChild(popAcceptButton);
    buttonContainer.appendChild(popRefuseButton);

    const contentElements = [popUpSubject, popUpContent, buttonContainer];

    outerParent = createPopUp({
        contentElements: contentElements,
        id: null 
    });
}


function generateSettingsHtml(settings,isGuild=false) {
    const buttons = settings.map(setting => `
        <button class="settings-buttons" onclick="selectSettingCategory('${setting.category}')">${setting.label}</button>
    `).join('\n');


    if(isGuild) {  return buttons; }
    
    return `
    ${buttons}
        <button class="settings-buttons" style="bottom:10%; left:0px; position:fixed;" onclick="logOutPrompt()">Çıkış yap</button>
    `;
    


}
function isSelfAuthor() {
    return isAuthor(currentUserId);
}
const userSettings = [
    { category: 'MyAccount', label: 'Hesabım' },
    { category: 'SoundAndVideo', label: 'Ses Ve Görüntü' },
    { category: 'Notifications', label: 'Bildirimler' },
    { category: 'ActivityPresence', label: 'Etkinlik Gizliliği' },
    { category: 'Appearance', label: 'Görünüm' }
];

const guildSettings = [
    { category: 'Overview', label: 'Genel Görünüm' },
    { category: 'Emoji', label: 'Emoji' },
];

function getGuildSettings() {
    let setToReturn = [...guildSettings]; 
    if (isSelfAuthor()) {
        setToReturn.push({ category: 'Invites', label: 'Davetler' });
        setToReturn.push({ category: 'Roles', label: 'Roller' });
        setToReturn.push({ category: 'Delete Guild', label: 'Sunucuyu Sil' });
    }
    return setToReturn; 
}


function getGuildSettingsHTML() {
    const guildSettingsHtml = generateSettingsHtml(getGuildSettings(),isGuild=true);
    return guildSettingsHtml;
    
}
function getSettingsHtml() {
    const userSettingsHtml = generateSettingsHtml(userSettings);
    return userSettingsHtml;
    
}
function getActivityPresenceHtml() {
    return `
        <h3 id="activity-title">Etkinlik Gizliliği</h3>
        <h3 id="settings-description">ETKİNLİK DURUMU</h3>
        <div class="toggle-card">
            <label for="activity-toggle">Tespit edilen etkinliği diğerleriyle paylaş</label>
            <label for="activity-toggle">Herkese açık bir Sahne'ye katıldığında LiventCord bu durumunu otomatik olarak günceller.</label>
            <div id="activity-toggle" class="toggle-box">
                <div id="toggle-switch" class="toggle-switch">
                    <div class="enabled-toggle">
                        <svg viewBox="0 0 28 20" preserveAspectRatio="xMinYMid meet" aria-hidden="true" class="icon">
                        <rect fill="white" x="4" y="0" height="20" width="20" rx="10"></rect>
                        <svg viewBox="0 0 20 20" fill="none">
                        <path fill="rgba(35, 165, 90, 1)" d="M7.89561 14.8538L6.30462 13.2629L14.3099 5.25755L15.9009 6.84854L7.89561 14.8538Z"></path>
                        <path fill="rgba(35, 165, 90, 1)" d="M4.08643 11.0903L5.67742 9.49929L9.4485 13.2704L7.85751 14.8614L4.08643 11.0903Z"></path></svg> </svg>
                        
                    </div>
                    <div class="disabled-toggle">
                        <svg viewBox="0 0 28 20" preserveAspectRatio="xMinYMid meet" aria-hidden="true" class="icon">
                        <rect fill="white" x="4" y="0" height="20" width="20" rx="10">
                        </rect><svg viewBox="0 0 20 20" fill="none">
                        <path fill="rgba(128, 132, 142, 1)"  d="M5.13231 6.72963L6.7233 5.13864L14.855 13.2704L13.264 14.8614L5.13231 6.72963Z"></path>
                            <path fill="rgba(128, 132, 142, 1)" d="M13.2704 5.13864L14.8614 6.72963L6.72963 14.8614L5.13864 13.2704L13.2704 5.13864Z"></path></svg></svg>
                    </div>
                </div>
            </div>
        </div>
    `;
}
function getNotificationsHtml() {
    return `
        Bildirimler
    `
}
function getOverviewHtml() {
    return `
    <div id="settings-title">Sunucuya Genel Bakış</div>
    <div id="guild-settings-rightbar">
        <div id="set-info-title-guild-name">SUNUCU ADI</div>
        <input type="text" id="guild-overview-name-input" autocomplete="off" value="${currentGuildName}" onkeydown="onEditNick()" maxlength="32">
        <img id="guild-image" onclick="triggerguildImageUpdate()" style="user-select: none;">
        <p id="guild-image-remove" style="display:none" >Kaldır</p>
        <form id="guildImageForm" enctype="multipart/form-data">
            <input type="file" name="guildImage" id="guildImage" accept="image/*" style="display: none;">
        </form>
    </div>
    `
}
function getMissingHtml(title) {
    return `

    <div id="settings-title">Sunucuya Genel Bakış</div>
    <div id="guild-settings-rightbar">
        <p style="font-size:20px; color:white; font-weight:bold; margin-top: -150px;">${title}</p>
        <img src="/static/404_files/noodle.gif"><img>

    </div>
    `
}
function getAccountSettingsHtml() {
    return `
    <div id="settings-rightbartop"></div>
    <div id="settings-title">Hesabım</div>
    <div id="settings-rightbar">
        <div id="settings-light-rightbar">
            <div id="set-info-title-nick">KULLANICI ADI</div>
            <div id="set-info-nick">${currentUserName}</div>
            <div id="set-info-title-email">E POSTA</div>
            <i id="set-info-email-eye" style="cursor:pointer;" class="fas fa-eye toggle-password" onclick="toggleEmail()"> </i>
            <div id="set-info-email">${masked_email}</div>

        </div>
        
        <input type="text" id="new-nickname-input" autocomplete="off" value="${currentUserName}" onkeydown="onEditNick()" maxlength="32">
        <img id="settings-self-profile" src="/profiles/${currentUserId}" onclick="triggerFileInput()" style="user-select: none;">
        <div class="bubble" style="margin-left:90px; top:35px;"></div>
        <form id="profileImageForm" enctype="multipart/form-data">
            <input type="file" name="profileImage" id="profileImage" accept="image/*" style="display: none;">
        </form>
        <span id="settings-self-name">${currentUserName}</span>
    </div>
    `
}
function getAppearanceHtml() {
    return `
        <h3>Görünüm</h3>
        <div class="toggle-card">
            <label for="snow-toggle">Kış Modu</label>
            <label for="snow-toggle">Kar yağışını aktifleştir.</label>
            <div id="snow-toggle" class="toggle-box">
                <div id="toggle-switch" class="toggle-switch">
                    <div class="enabled-toggle">
                        <svg viewBox="0 0 28 20" preserveAspectRatio="xMinYMid meet" aria-hidden="true" class="icon">
                        <rect fill="white" x="4" y="0" height="20" width="20" rx="10"></rect>
                        <svg viewBox="0 0 20 20" fill="none">
                        <path fill="rgba(35, 165, 90, 1)" d="M7.89561 14.8538L6.30462 13.2629L14.3099 5.25755L15.9009 6.84854L7.89561 14.8538Z"></path>
                        <path fill="rgba(35, 165, 90, 1)" d="M4.08643 11.0903L5.67742 9.49929L9.4485 13.2704L7.85751 14.8614L4.08643 11.0903Z"></path></svg> </svg>
                        
                    </div>
                    <div class="disabled-toggle">
                        <svg viewBox="0 0 28 20" preserveAspectRatio="xMinYMid meet" aria-hidden="true" class="icon">
                        <rect fill="white" x="4" y="0" height="20" width="20" rx="10">
                        </rect><svg viewBox="0 0 20 20" fill="none">
                        <path fill="rgba(128, 132, 142, 1)"  d="M5.13231 6.72963L6.7233 5.13864L14.855 13.2704L13.264 14.8614L5.13231 6.72963Z"></path>
                            <path fill="rgba(128, 132, 142, 1)" d="M13.2704 5.13864L14.8614 6.72963L6.72963 14.8614L5.13864 13.2704L13.2704 5.13864Z"></path></svg></svg>
                    </div>
                </div>
            </div>
        </div>
        <div class="toggle-card">
            <label for="party-toggle">Parti Modu</label>
            <label for="party-toggle">Parti modunu aktifleştir.</label>
            <div id="party-toggle" class="toggle-box">
                <div id="toggle-switch" class="toggle-switch">
                    <div class="enabled-toggle">
                        <svg viewBox="0 0 28 20" preserveAspectRatio="xMinYMid meet" aria-hidden="true" class="icon">
                        <rect fill="white" x="4" y="0" height="20" width="20" rx="10"></rect>
                        <svg viewBox="0 0 20 20" fill="none">
                        <path fill="rgba(35, 165, 90, 1)" d="M7.89561 14.8538L6.30462 13.2629L14.3099 5.25755L15.9009 6.84854L7.89561 14.8538Z"></path>
                        <path fill="rgba(35, 165, 90, 1)" d="M4.08643 11.0903L5.67742 9.49929L9.4485 13.2704L7.85751 14.8614L4.08643 11.0903Z"></path></svg> </svg>
                        
                    </div>
                    <div class="disabled-toggle">
                        <svg viewBox="0 0 28 20" preserveAspectRatio="xMinYMid meet" aria-hidden="true" class="icon">
                        <rect fill="white" x="4" y="0" height="20" width="20" rx="10">
                        </rect><svg viewBox="0 0 20 20" fill="none">
                        <path fill="rgba(128, 132, 142, 1)"  d="M5.13231 6.72963L6.7233 5.13864L14.855 13.2704L13.264 14.8614L5.13231 6.72963Z"></path>
                            <path fill="rgba(128, 132, 142, 1)" d="M13.2704 5.13864L14.8614 6.72963L6.72963 14.8614L5.13864 13.2704L13.2704 5.13864Z"></path></svg></svg>
                    </div>
                </div>
            </div>
        </div>
    `;
}
function handleToggleClick(toggleElement, toggleClickCallback) {
    toggleElement.addEventListener('click', function() {
        this.classList.toggle('active');
        this.querySelector('#toggle-switch').classList.toggle('active');
        toggleClickCallback();
    });
}

function toggleCheckBox(toggleElement, value) {
    if (value) {
        toggleElement.querySelector('#toggle-switch').classList.add('active');
        toggleElement.classList.add('active');
    }
}

let isActivityShared = false;
function selectSettingCategory(settingtype) { 
    if (isUnsaved && settingtype != DeleteGuild) {
        shakeScreen();
        return;
    }
    let settingsContainer = getId('settings-rightcontainer');
    
    currentSettingsType = settingtype;
    let newHTML = null;
    let callback;
    let isDefault = false;

    switch (settingtype) {
        case SoundAndVideo:
            newHTML = `
                <div id="settings-title">Ses Ayarları</div>
                <select class="dropdown" id="sound-mic-dropdown"></select>
                <select class="dropdown" id="sound-output-dropdown"></select>
                <select class="dropdown" id="camera-dropdown"</select>
            `;
            callback = activateMicAndSoundOutput;
            break;
        case MyAccount:
            newHTML = getAccountSettingsHtml();
            callback = () => {
                getId('profileImage').addEventListener('change', onEditProfile);
                updateSelfProfile(currentUserId, currentUserName); 
            }
            let rightbar = getId('settings-rightbar');
            if(!rightbar) {
                rightbar = createEl('div',{id:'settings-rightbar'});
                settingsContainer.appendChild(rightbar);
            }
            
            break;
        case Notifications :
            newHTML = getNotificationsHtml();
            break;
        case ActivityPresence :
            newHTML = getActivityPresenceHtml();
            callback = () => { 
                const activitySharedToggle = getId('activity-toggle');
                toggleCheckBox(activitySharedToggle, loadBooleanCookie('isActivityShared'));
                handleToggleClick(activitySharedToggle, () => {
                    const isActivityShared = !loadBooleanCookie('isActivityShared');
                    saveBooleanCookie('isActivityShared', isActivityShared);
                });
            }
            break;
        case Appearance:
            newHTML = getAppearanceHtml();
            callback = () => { 
                const snowToggle = getId('snow-toggle');
                const value = loadBooleanCookie('isSnow');
                toggleCheckBox(snowToggle, value);
                isSnow = value;
                handleToggleClick(snowToggle, () => {
                    toggleSnow();
                    saveBooleanCookie('isSnow', isSnow);
                });
    
                const partyToggle = getId('party-toggle');
                const val = loadBooleanCookie('isParty');
                isParty = val;
                toggleCheckBox(partyToggle, val);
                handleToggleClick(partyToggle, () => {
                    toggleParty();
                    saveBooleanCookie('isParty', isParty);
                });
            }
            break;
        // server settings 
        case Overview:
            newHTML = getOverviewHtml();
            callback = () => {
                getId('guild-image').onerror = () => {
                    getId('guild-image').src = createBlackImage();
                }
                if(permissionManager.canManageChannels()) {
                    getId('guild-image').style.cursor = 'pointer';
                    getId('guild-overview-name-input').style.cursor = 'pointer';
                    getId('guildImage').addEventListener('change', onEditGuildProfile);
                    getId('guild-overview-name-input').disabled = false;
                    if(getId('guild-image').src != createBlackImage()) {
                        enableElement('guild-image-remove');
                        getId('guild-image-remove').addEventListener('click',removeguildImage);
                    }
                } else {
                    getId('guild-image').style.cursor = 'now-allowed';
                    getId('guild-overview-name-input').style.cursor = 'now-allowed';
                    getId('guild-overview-name-input').disabled = true;
                }
                
                getId('guild-image').src = `/guilds/${currentGuildId}`;
                
            }
            break;
        case DeleteGuild:
            createDeleteGuildPrompt(currentGuildId,currentGuildName);
            break;
        default:
            isDefault = true;
            newHTML = getMissingHtml(settingtype);
            break;
        }
    if(newHTML) {
        settingsContainer.innerHTML = newHTML;
        settingsContainer.insertBefore(getCloseButtonElement(),settingsContainer.firstChild)
    }
    if(callback) {
        callback();
    }
 
}
function getCloseButtonElement() {
    const button = createEl('button');
    button.id = 'close-settings-button';
    button.setAttribute('aria-label', 'Close settings');
    button.setAttribute('role', 'button');
    button.tabIndex = 0;

    button.innerHTML = `
        <svg aria-hidden="true" role="img" width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path fill="currentColor" d="M17.3 18.7a1 1 0 0 0 1.4-1.4L13.42 12l5.3-5.3a1 1 0 0 0-1.42-1.4L12 10.58l-5.3-5.3a1 1 0 0 0-1.4 1.42L10.58 12l-5.3 5.3a1 1 0 1 0 1.42 1.4L12 13.42l5.3 5.3Z"></path>
        </svg>
        <span id="close-keybind">ESC</span>
    `;
    button.onclick = closeSettings;
    return button;
}


async function activateMicAndSoundOutput() {
    activateMicAndCamera();
    activateSoundOutput();
}

function createDeleteGuildPrompt(guild_id,guild_name) {
    if(!guild_id) { return }
    var onClickHandler = function() {
        socket.emit('delete_guild', guild_id);
    }
    const successText = "Sunucuyu sil";
    askUser(`${guild_name} Sunucusunu Sil`,'Bu işlem geri alınamaz.',successText,onClickHandler,isRed=true);

} 
async function requestMicrophonePermissions() {
    try {
        const isNoMic = false;
        if(isNoMic) {
            const response = await fetch('/static/notification.mp3');
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onload = function () {
                const bytes = new Uint8Array(reader.result);
                socket.emit('audio_data', bytes);
            };
            reader.readAsArrayBuffer(blob);
        }
        else
        {
            await sendAudioData();
        }

    } catch (error) {
        console.log(error);
        alertUser('MİKROFON ERİŞİMİ ENGELLENDİ', 'Mikrofon izni reddedildi.');
        return false; // Permission denied or error occurred
    }
} 
async function sendAudioData() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = async (e) => {

        };

        mediaRecorder.start();

    } catch (err) {
        console.error('Error accessing microphone:', err);
    }
}


function activateMicAndCamera() {
    async function requestMediaPermissions() {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            return true; // Permission granted
        } catch (error) {
            return false; // Permission denied or error occurred
        }
    }

    function getMediaDevicesList() {
        return navigator.mediaDevices.enumerateDevices()
            .then(devices => devices.filter(device => device.kind === 'audioinput' || device.kind === 'videoinput'));
    }
    async function updateMediaOptions() {
        const micDropdown = getId('sound-mic-dropdown');
        micDropdown.innerHTML = ''; // Clear existing options
        const cameraDropdown = getId('camera-dropdown');
        cameraDropdown.innerHTML = ''; // Clear existing options
        try {
            const hasPermission = await requestMediaPermissions();

            if (hasPermission) {
                const mediaDevices = await getMediaDevicesList();
                mediaDevices.forEach((device, index) => {
                    const option = createEl('option',{fontSize:'12px',border:'none'});

                    option.value = device.deviceId;
                    if (device.kind === 'audioinput') {
                        option.textContent = device.label || `Microphone ${index + 1}`;
                        micDropdown.appendChild(option);
                    } else if (device.kind === 'videoinput') {
                        option.textContent = device.label || `Camera ${index + 1}`;
                        cameraDropdown.appendChild(option);
                    }
                });
            }

            // Add default microphone and camera options at the end
            const defaultMicOption = createEl('option',{fontSize:'12px',value:'default'});
            defaultMicOption.textContent = 'Default Microphone';
            micDropdown.appendChild(defaultMicOption);

            const defaultCameraOption = createEl('option',{fontSize:'12px',value:'default'});
            defaultCameraOption.textContent = 'Default Camera';
            cameraDropdown.appendChild(defaultCameraOption);

        } catch (error) {
            console.error('Error updating media options:', error);

            // Ensure the default options are added even if an error occurs
            const defaultMicOption = createEl('option',{fontSize:'12px',value:'default'});
            defaultMicOption.textContent = 'Default Microphone';
            micDropdown.appendChild(defaultMicOption);

            const defaultCameraOption = createEl('option',{fontSize:'12px',value:'default'});
            defaultCameraOption.textContent = 'Default Camera';
            cameraDropdown.appendChild(defaultCameraOption);
        }
    }

    updateMediaOptions();
    if(navigator && navigator.mediaDevices) {
        navigator.mediaDevices.addEventListener('devicechange', updateMediaOptions);
    }
}




function activateSoundOutput() {
    // Function to request sound output device permissions
    async function requestSoundOutputPermissions() {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
            return true; // Permission granted
        } catch (error) {
            return false; // Permission denied or error occurred
        }
    }

    function getSoundOutputList() {
        return navigator.mediaDevices.enumerateDevices()
            .then(devices => devices.filter(device => device.kind === 'audiooutput'));
    }

    async function updateSoundOutputOptions() {
        const dropdown = getId('sound-output-dropdown');
        dropdown.innerHTML = ''; // Clear existing options

        try {
            const hasPermission = await requestSoundOutputPermissions();

            if (hasPermission) {
                const soundOutputs = await getSoundOutputList();
                soundOutputs.forEach((output, index) => {
                    const option = createEl('option');
                    option.style.fontSize = '12px';
                    option.style.border = 'none';
                    option.value = output.deviceId;
                    option.textContent = output.label || `Sound Output ${index + 1}`;
                    dropdown.appendChild(option);
                });
            }

            // Add default sound output option at the end
            const defaultOption = createEl('option');
            defaultOption.style.fontSize = '12px';
            defaultOption.value = 'default';
            defaultOption.textContent = 'Default Sound Output';
            dropdown.appendChild(defaultOption);

        } catch (error) {
            console.error('Error updating sound output options:', error);

            // Ensure the default sound output option is added even if an error occurs
            const defaultOption = createEl('option');
            defaultOption.style.fontSize = '12px';
            defaultOption.value = 'default';
            defaultOption.textContent = 'Default Sound Output';
            dropdown.appendChild(defaultOption);
        }
    }

    updateSoundOutputOptions();
    navigator.mediaDevices.addEventListener('devicechange', updateSoundOutputOptions);
}



  

let isMicrophoneOpen = true;
function setMicrophone() {
    let imagePath = isMicrophoneOpen ? `/static/images/icons/whitemic.png` : `/static/images/icons/redmic.png`;
    microphoneButton.src = imagePath;
    isMicrophoneOpen = !isMicrophoneOpen;
    console.log("Set microphone! to " , isMicrophoneOpen);
}

let isEarphonesMuted = true;
function setEarphones() {
    let imagePath = isEarphonesOpen ? `/static/images/icons/whiteearphones.png` : `/static/images/icons/redearphones.png`;
    earphoneButton.src = imagePath;
    isEarphonesOpen = !isEarphonesOpen;
    console.log("Set earphones! to " , isEarphonesOpen);
}





function hidePopUp(pop) {
    pop.style.animation = 'slide-down 0.15s ease-in-out forwards';
    setTimeout(() => {
        pop.style.display = 'none';
    }, 1500); 
}

function showUnsavedPopUp(pop) {
    pop.style.display = 'block';
    pop.style.animation = 'slide-up 0.5s ease-in-out forwards';
}

function applySettings() {
    
    if(currentPopUp) {
        hidePopUp(currentPopUp);
        
    }
    console.log(isUnsaved);
    if(isUnsaved) {

        if(isGuildSettings) {
            changeGuildName();
            
            if(isSelfAuthor()) {
                uploadImage(true);
            }

        } else {
            // in default settings
            changeNickname();
            uploadImage(false);
        }


        isUnsaved = false;
    }

}
function generateUnsavedPopUp() {
    const popupDiv = createEl('div',{id:'settings-unsaved-popup'});
  
    const textDiv = createEl('div',{id:'settings-unsaved-popup-text',textContent:'Dikkat — kaydetmediğin değişiklikler var!'});
    popupDiv.appendChild(textDiv);
  
    const resetButton = createEl('span',{id:'settings-unsaved-popup-resetbutton',textContent:'Sıfırla'});


    resetButton.addEventListener('click',function() {

        hidePopUp(popupDiv);
        const nickinput = getId('new-nickname-input')
        if(nickinput) {
            nickinput.value = currentUserName;
        }
        const profileimg = getId('profileImage');
        if(profileimg) {
            profileimg.files = null;
        }
        const settingsSelfProfile = getId('settings-self-profile');

        if(lastConfirmedProfileImg) {
            settingsSelfProfile.src = lastConfirmedProfileImg;
        } else {
            
        }

        const guildNameInput = getId('guild-overview-name-input');
        if(guildNameInput) {
            guildNameInput.value = currentGuildName;
        }

        isUnsaved = false;
        isChangedProfile = false;
        getId('');

    });
    popupDiv.appendChild(resetButton);
  
    const applyButton = createEl('button');
    applyButton.id = 'settings-unsaved-popup-applybutton';
    applyButton.textContent = 'Değişiklikleri Kaydet';
    applyButton.onclick = applySettings;
    popupDiv.appendChild(applyButton);
    getId('settings-menu').appendChild(popupDiv);
  
    return popupDiv;
}




function onEditNick() {
    isUnsaved = true;
    if(!currentPopUp) {
        let _currentPopUp = generateUnsavedPopUp();
        currentPopUp = _currentPopUp;

    }
    
    showUnsavedPopUp(currentPopUp);


}
function removeElement(elementname) {
    const element = document.getElementById(elementname);
    if(element) {
        element.remove();
    }
}
function createCropPop(inputSrc, callbackAfterAccept) {
    const cropTitle = 'Görseli Düzenle';
    const inviteTitle = createEl('p', { id: 'invite-users-title', textContent: cropTitle });

    const imageContainer = createEl('div', { id: 'image-container' });
    const appendButton = createEl('button', { className: 'pop-up-append', textContent: 'Uygula' });
    let parentContainer;
    appendButton.addEventListener('click', () => {
        croppie.result({
            type: 'base64',
            format: 'jpeg',
            viewport:'original',
            quality:1,
            circle : true
        }).then(function (base64) {
            callbackAfterAccept(base64);
            parentContainer.remove();
            updateSettingsProfileColor();
        });
    });
    const backButton = createEl('button', { textContent: 'İptal', className: 'create-guild-back common-button' });

    backButton.addEventListener('click',() => { parentContainer.remove(); })

    const popBottomContainer = createEl('div', { className: 'popup-bottom-container', id: 'invite-popup-bottom-container' });
    popBottomContainer.style.bottom = '-5%';
    popBottomContainer.style.top = 'auto';
    popBottomContainer.style.height = '10%';
    popBottomContainer.style.zIndex = '-1';
    backButton.style.left = '20px';
    
    const contentElements = [inviteTitle, imageContainer, backButton, appendButton, popBottomContainer];
    
    parentContainer = createPopUp({
        contentElements: contentElements,
        id: 'cropPopContainer',
        closeBtnId: 'invite-close-button'
    });
    

    const imageElement = createEl('img');
    imageElement.src = inputSrc;

    const croppie = new Croppie(imageContainer, {
        viewport: { width: 430, height: 430, type: 'circle' }, 
        boundary: { width: 440, height: 440 }, 
        showZoomer: true,
        enableExif: true
    });
    console.log(croppie)
    croppie.bind({
        url: inputSrc
    });
    getId('cropPopContainer').style.setProperty('height', '600px', 'important');
    getId('cropPopContainer').style.setProperty('width', '600px', 'important');

    imageContainer.querySelector('.cr-slider-wrap').querySelector('.cr-slider').style.transform = 'scale(1.5);'
    imageContainer.querySelector('.cr-slider-wrap').querySelector('.cr-slider').style.transform = 'scale(1.5);'
}
function removeguildImage() {
    socket.emit('remove_guild_image',{'guild_id': currentGuildId})
    getId('guildImage').value = '';
    getId('guild-image').src = createBlackImage();


}
let lastConfirmedguildImg;
function onEditImage(isGuild) {
    const filedata = getId(isGuild ? 'guildImage':'profileImage').files[0];
    if (!filedata) {
        console.log("No file. ", isGuild)
        return;
    }
    console.log("On edit image." , isGuild)
    const reader = new FileReader();
    reader.onload = (e) => {
        function callbackAfterAccept(outputBase64) {
            console.log("Callback triggered!", isGuild)
            if(isGuild) {
                lastConfirmedguildImg =  getBase64Image(getId('guild-image'))
            } else {
                lastConfirmedProfileImg =  getBase64Image(getId('settings-self-profile'))
            }
            getId(isGuild ? 'guild-image' : 'settings-self-profile').src = outputBase64;
            isChangedProfile = true;
            if(!currentPopUp) {
                let _currentPopUp = generateUnsavedPopUp();
                currentPopUp = _currentPopUp;
            }
            
            showUnsavedPopUp(currentPopUp);
        }
        createCropPop(e.target.result,callbackAfterAccept);
        
    };
    reader.onerror = (error) => {
        console.error("Error reading file:", error);
    };
    reader.readAsDataURL(filedata);
    getId(isGuild ? 'guildImage':'profileImage').value = '';
    
    isUnsaved = true;

}
function onEditProfile() {
    onEditImage(false);
}
function onEditGuildProfile() {
    onEditImage(true);
}
function deleteProfilePic() {
    let xhr = new XMLHttpRequest();
    let formData = new FormData();
    xhr.open('POST', '/delete_profile_pic');
    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log('Profile picture deleted');
            updateSelfProfile(currentUserId,user_name,true);
        }
        else {
            console.error('Error uploading profile pic!');
        }
    };
    xhr.send(formData);
}
function updateGuild(data) {
    const guildList = getId('guilds-list').querySelectorAll('img');
    guildList.forEach((img) => {
        if (img.id === data.guild_id) {
            img.src = data.is_empty ? createBlackImage() : `guilds/${data.guild_id}`;
        }
    });

}
function uploadImage(isGuild) {
    if (!isChangedProfile) { return; }
    
    let formData = new FormData();
    const uploadedGuildId = currentGuildId;
    const file = isGuild ? getId('guild-image').src : getId('settings-self-profile').src;
    
    console.log(file, isGuild);
    
    if (file && file.startsWith('data:image/')) {
        const byteString = atob(file.split(',')[1]);
        const mimeString = file.split(',')[0].split(':')[1].split(';')[0];
        const ab = new Uint8Array(byteString.length);
        
        for (let i = 0; i < byteString.length; i++) {
            ab[i] = byteString.charCodeAt(i);
        }
        
        const blob = new Blob([ab], { type: mimeString });
        
        if (blob.size <= 8 * 1024 * 1024) {
            formData.append('photo', blob, 'profile-image.png');
            formData.append('is_guild', isGuild);
            
            if (isGuild) {
                formData.append('guild_id', uploadedGuildId);
            }
            
            console.log("Sending req...");
            let xhr = new XMLHttpRequest();
            xhr.open('POST', '/upload_img');
            xhr.onload = function () {
                if (xhr.status === 200) {
                    updateGuild(uploadedGuildId);
                } else {
                    console.error('Error uploading profile pic!');
                }
            };
            xhr.send(formData);
        } else {
            alertUser('Dosya boyutu 8 MB\'den büyük olamaz!');
            getId('profileImage').value = ''; 
        }
    } else {
        console.error('Invalid file format or undefined file.');
    }
}


function createGuild() {
    const guildName = getId('guild-name-input').value;
    const guildPhotoFile = getId('guildImageInput').files[0];

    if (guildPhotoFile !== undefined) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/gif', 'image/png', 'image/webp', 'image/bmp', 'image/tiff', 'image/svg+xml'];
        if (!allowedTypes.includes(guildPhotoFile.type)) {
            alertUser('Yalnızca resim dosyaları yükleyebilirsiniz (JPG, PNG veya GIF)!');
            getId('guildImageInput').value = '';
            getId('guildImg').style.backgroundImage = '';
            return; 
        }

        // Check file size and append to FormData if valid
        if (guildPhotoFile.size > 8 * 1024 * 1024) {
            alertUser('Dosya boyutu 8 MB\'den küçük olmalıdır!');
            getId('guildImageInput').value = '';
            getId('guildImg').style.backgroundImage = '';
            return; 
        }
    }

    let formData = new FormData();

    if (guildPhotoFile !== undefined) {
        formData.append('photo', guildPhotoFile);
    }
    formData.append('guild_name', guildName);
    getId('guildImg').style.class = "";

    fetch('/create_guild', {
        method: 'POST',
        body: formData
    }).then(response => {
        if (response.ok) {
            return response.json();
        }
        return response.text();
    }).then(data => {
        console.log('Guild creation response:', data);
        if(typeof(data) == 'object') {
            const popup = getId('guild-pop-up');
            if (popup) {
                popup.parentNode.remove();
            }
            changeUrlWithFireWorks(data.new_guild_id,data.new_channel_id,data.new_guild_name);
        } else {
            alertUser('Sunucu oluşturma hatası',data);
        }
        
    }).catch(error => {
       console.error('Error:', error);
       
        
    });
}
    
function createFireWorks() {
    setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    return;
}
const getCursorXY = (input, selectionPoint) => {
    const { offsetLeft: inputX, offsetTop: inputY, scrollLeft, scrollTop, clientWidth, clientHeight } = input;
    const div = createEl('div');


    div.style.position = 'absolute';
    div.style.whiteSpace = 'pre-wrap'; 
    div.style.wordWrap = 'break-word'; 
    div.style.visibility = 'hidden'; 
    div.style.overflow = 'hidden';
    div.style.top = `${inputY}px`;
    div.style.left = `${inputX}px`;
    div.style.padding = '10px 100px 10px 55px'; 
    div.style.fontFamily = 'Arial, Helvetica, sans-serif';
    div.style.backgroundColor = '#36393f'; 
    div.style.border = 'none'; 
    div.style.lineHeight = '20px'; 
    div.style.fontSize = '17px'; 
    div.style.borderRadius = '7px'; 
    div.style.boxSizing = 'border-box'; 
    div.style.maxHeight = '500px';
    div.style.width = 'calc(100vw - 585px)';
    const swap = '\u00A0'; 
    const inputValue = input.tagName === 'INPUT' ? input.value.replace(/ /g, swap) : input.value;
    const textNode = document.createTextNode(inputValue.substring(0, selectionPoint));
    div.appendChild(textNode);
    document.body.appendChild(div);
    const range = document.createRange();
    range.selectNodeContents(div);
    range.setStart(textNode, selectionPoint);
    range.setEnd(textNode, selectionPoint);
    const rect = range.getBoundingClientRect();
    const x = rect.left - inputX + scrollLeft;
    const y = rect.top - inputY + scrollTop;
    document.body.removeChild(div);

    return {
        x: Math.min(x, clientWidth), 
        y: Math.min(y, clientHeight) 
    };
};





window.addEventListener('popstate', function(event) {
    try {
        const pathStr = window.location.pathname;
        if (pathStr === '/channels/@me') {
            loadMainMenu(false);
        } else if (pathStr.startsWith('/channels/@me/')) {
            const parts = pathStr.split('/');
            const friendId = parts[3];
            OpenDm(friendId);
        } else if (pathStr.startsWith('/channels/') && pathStr.split('/').length === 4) {
            
            const parts = pathStr.split('/');
            const guildID = parts[2];
            const channelId = parts[3];
            loadGuild(guildID, channelId, null, null, false);
        } else {
            console.error('Unknown URL format:', pathStr);
        }
        
    } catch (error) {
        console.error(error);
    }
});
function constructAppPage(guild_id,channel_id) {
    return`/channels/${guild_id}/${channel_id}`;
}
function constructDmPage(channel_id) {
    return`/channels/@me/${channel_id}`;
}
function constructAbsoluteAppPage(guild_id, channel_id) {
    return `${window.location.protocol}//${window.location.hostname}/app/channels/${guild_id}/${channel_id}`;
}

function selectGuildList(guild_id) {
    console.log(typeof(guild_id),guild_id)
    const guildList = getId('guilds-list'); 
    if (!guildList) return; 
    
    const foundGuilds = guildList.querySelectorAll('img');
    
    foundGuilds.forEach(guild => {
        console.log(guild);
        if (guild.id === guild_id) {
            guild.parentNode.classList.add('selected-guild');
        } else {
            guild.parentNode.classList.remove('selected-guild');
        }
    });
}

function loadGuild(guild_id,channel_id,guildName,guildAuthorId,isChangingUrl=true) {
    if(!guild_id || !channel_id ) { return; }
    
    if (isChangingUrl) {
        const state = constructAppPage(guild_id,channel_id);
        if(window.location.pathname != state) {
            window.history.pushState(null, null, state);
        }
    } else { 
        console.warn("calling from popstate");
    }
    if(isChangingPage) {
        console.warn(" Already changing guild! can not change guild");
        return;
    }
    currentGuildId = guild_id;
    permissionManager = new PermissionManager(permissions_map, currentGuildId);
    selectGuildList(guild_id);
    if(guildName) {
        currentGuildName = guildName;
    } else {
        if(guildNames[guild_id]) {
            currentGuildName = guildNames[guild_id];
        }
    }

    currentChannelId = channel_id;
    if(!isChangingUrl) {
        wasNotChangingUrl = true;
    }
    if(isOnMe) {
        loadApp();
    } else if (isOnDm) {
        loadApp();
    } else if (isOnGuild){
        changecurrentGuild();
    } 
}
function initialiseMe() {
    enableElement('dms-title');
    userList.innerHTML = userListTitleHTML;
    loadMainToolbar();
    isInitialized = true;
}
function get_users() {
    if(currentGuildId) {
        if(guild_users_cache[currentGuildId]) {
            updateUserList(guild_users_cache[currentGuildId]);
        } else {
            socket.emit('get_users',currentGuildId);
        }

        if(!users_metadata_cache[currentGuildId]) {
            socket.emit('get_user_metadata',currentGuildId);
        }

    } else {
        console.warn("Current guild id is null!");
    }
}
function getChannels() {
    if(currentChannelId) {
        if(channels_cache[currentGuildId]) {
            updateChannels(channels_cache[currentGuildId]);
        } else {
            socket.emit('get_channels',currentGuildId);
        }
    } else {
        console.warn("Current channel id is null!");
    }

}
let isChangingPage = false;
function setUserListLine() {
    const userLine = document.querySelector('.horizontal-line');
    if(isUsersOpenGlobal) {
        enableElement('user-list');
        userLine.style.display = 'flex';
    } else {
        disableElement('user-list');
        userLine.style.display = 'none';
    }
}
function handleResize() {
    
    if(window.innerWidth < 1200) {
        if(isOnMe) {
            disableElement('user-list');
            const userLine = document.querySelector('.horizontal-line');
            userLine.style.display = 'none';
        } else {
            setUserListLine();
        }   
    }  else {
        setUserListLine();
    }
    
    const inputRightToSet = userList.style.display === 'flex' ? '463px' : '76px';
    const addFriendInputButton = getId('addfriendinputbutton');
    if (addFriendInputButton) {
        addFriendInputButton.style.right = inputRightToSet;
    }
}
function userExistsDm(userId) {
    return userId in dm_users;
}
function OpenDm(friend_id) {
    const wasOnDm = isOnDm;
    isOnDm = true;
    currentDmId = friend_id;
    lastSenderID = '';
    lastMessageDateTime = null;
    activateDmContainer(friend_id);
    const url = constructDmPage(friend_id);
    if(url != window.location.pathname) {
        window.history.pushState(null, null, url);
    }
    if(!userExistsDm(friend_id)) {
        socket.emit('add_dm',{'friend_id' : friend_id});
    }
    loadApp(friend_id);
    if(wasOnDm) {
        changeCurrentDm(friend_id);
    }
    GetHistoryFromOneChannel(friend_id,true);
}


let lastDmId;
function loadMainMenu(isChangingUrl=true) {
    if(isOnGuild && currentChannelId) {
        guildChatMessages[currentChannelId] = messages_raw_cache;
    }
    function handleMenu() {
        selectGuildList('main-logo');
        if(isChangingUrl) {
            window.history.pushState(null, null, "/channels/@me");
        }
        enableElement('friends-container',false,true);
        getId('friend-container-item').classList.add('dm-selected');
        disableDmContainers();
        lastDmId = '';
        currentDmId = '';
        enableElement('channel-info-container-for-friend');
        disableElement('channel-info-container-for-index');
        loadMainToolbar();
        disableElement('chat-container');
        disableElement('message-input-container');
        getId('friend-container-item').style.color = 'white';

        userList.innerHTML = userListTitleHTML;
        userList.classList.add('friendactive');
        if(userListFriActiveHtml) {
            userList.innerHTML = userListFriActiveHtml;
        }
        getId('nowonline').style.fontWeight = 'bolder';
        if(isOnMe) { return; }
        isOnMe = true;
        isOnGuild = false;
    }
    
    function handleDm() {
        OpenDm(lastDmId)
        disableElement('friends-container');
    }
    if(isOnGuild) {
        if(isOnDm) {
            handleMenu();
        } else {
            if(lastDmId) {
                handleDm()
            } else {
                handleMenu();
            }

        }

    } else {
        handleMenu();
    }


    enableElement('friend-container-item');
    getId('guild-name').innerText = '';
    disableElement('guild-settings-button');
    enableElement('globalSearchInput',false,true);
    enableElement('friends-container-item');
    
    enableElement('dms-title');
    enableElement('dm-container-parent',false, true);
    channelsUl.innerHTML = '';

    enableElement('guild-container',false,true);
    
    
    const chanList = getId('channel-list');
    if(cachedFriMenuContent) {
        chanList.innerHTML = cachedFriMenuContent;
    }
    


    handleResize();
    
}
function UpdateDmUserList(friend_id,friendNick,friendDiscriminator) {
    const usersData = {
        currentUserId: {
            user_id:  currentUserId,
            name: currentUserName,
            is_online : true ,
            discriminator: currentDiscriminator
        },
        friend_id: {
            user_id:  friend_id,
            name: friendNick,
            is_online : isOnline(friend_id),
            discriminator: friendDiscriminator
        }
    };
    updateUserList(usersData);
}
function loadApp(friend_id=null) {
    if(isChangingPage) {return;  }
    isChangingPage = true;
    const userList = getId('user-list');

    if(isOnMe) {
        userListFriActiveHtml = userList.innerHTML;
    }
    
    isOnMe = false;

    userList.innerHTML = ""; 
    userList.classList.remove('friendactive'); 
    enableElement('guild-name');

    if(!friend_id) {
        isOnGuild = true;
        isOnDm = false;
        if(currentDmId) {
            lastDmId = currentDmId;
        }
        getChannels();
        get_users();
        refreshInviteId();
        disableElement('dms-title');
        disableElement('dm-container-parent');
        disableElement('friend-container-item');
        enableElement('guild-settings-button');
        enableElement('hash-sign');
        getId('guild-name').innerText = currentGuildName;
        disableElement('globalSearchInput');
        disableElement('dm-profile-sign-bubble');
        disableElement('dm-profile-sign');
        loadGuildToolbar();
    } else {
        loadDmToolbar();
        isOnGuild = false;
        isOnDm = true;
        enableElement('dm-profile-sign-bubble');
        enableElement('dm-profile-sign');
        enableElement('guild-container',false,true);
        disableElement('guild-settings-button');
        activateDmContainer(friend_id);
        const friendNick = passed_friend_name != undefined && passed_friend_id == friend_id ? passed_friend_name : getUserNick(friend_id);
        userInput.placeholder = '@' + friendNick + ' kullanıcısına mesaj gönder';
        channelInfo.textContent = friendNick;
        disableElement('hash-sign');
        enableElement('dm-profile-sign')
        const dmProfSign = getId('dm-profile-sign');
        setProfilePic(dmProfSign,friend_id);
        dmProfSign.dataset.cid = friend_id;
        
        UpdateDmUserList(friend_id,friendNick,passed_friend_discriminator);
    }
    
    
    disableElement('channel-info-container-for-friend');
    disableElement('friends-container');
    document.querySelector('.horizontal-line').style.display = 'none';
    
    enableElement('channel-info-container-for-index');
    enableElement('chat-container',true);
    enableElement('message-input-container',false,true);
    adjustHeight();
    
    handleResize();
    isChangingPage = false;
}
function openTbHelp() {
    alertUser('Stop it, get some help')

}
function loadMainToolbar() {
    disableElement('tb-call')
    disableElement('tb-video-call')
    disableElement('tb-pin')
    disableElement('tb-createdm')
    disableElement('tb-showprofile')
    disableElement('tb-search')
}
function loadGuildToolbar() {
    disableElement('tb-call')
    disableElement('tb-video-call')
    enableElement('tb-pin')
    disableElement('tb-createdm')
    enableElement('tb-showprofile')
    enableElement('tb-search')
}
function loadDmToolbar() {
    enableElement('tb-call')
    enableElement('tb-video-call')
    enableElement('tb-pin')
    enableElement('tb-createdm')
    enableElement('tb-showprofile')
    enableElement('tb-search')
}


function fillDropDownContent() {
    if(permissionManager.canManageChannels()) {
        enableElement('channel-dropdown-button');
    } else {
        disableElement('channel-dropdown-button');
    }
    if(permissionManager.canManageChannels) {
        enableElement('invite-dropdown-button');
    } else {
        disableElement('invite-dropdown-button');
    }

    if(isSelfAuthor()) {
        disableElement('exit-dropdown-button');
    } else {
        enableElement('exit-dropdown-button');
    }
}
function changeCurrentDm(friend_id) {
    isChangingPage = true;
    isOnMe = false;
    isOnGuild = false;
    isOnDm = true;
    isReachedChannelEnd = false;
    
    const friendNick = getUserNick(friend_id);
    channelInfo.textContent = friendNick;
    userInput.placeholder = '@' + friendNick + ' kullanıcısına mesaj gönder';
    const dmProfSign = getId('dm-profile-sign');
    setProfilePic(dmProfSign,friend_id);
    dmProfSign.dataset.cid = friend_id;
    UpdateDmUserList(friend_id,friendNick)

    isChangingPage = false;
}

function changecurrentGuild() {
    isChangingPage = true;
    isOnMe = false;
    isOnGuild = true;
    getChannels();
    get_users();
    refreshInviteId();
    getId('channel-info').textContent = currentChannelName;
    getId('guild-name').innerText = currentGuildName;
    isDropdownOpen = false;
    dropDown.style.display = 'none';
  
    isChangingPage = false;
}
function joinVoiceChannel(channel_id) {
    if(currentVoiceChannelId == channel_id) { return; }
    clearVoiceChannel(currentVoiceChannelId);
    const sp = getId('sound-panel');
    sp.style.display = 'flex';
    currentVoiceChannelId = channel_id;
    const soundInfoIcon = getId('sound-info-icon');
    soundInfoIcon.innerText = `${currentChannelName} / ${currentGuildName}`;
    if (!usersInVoice[channel_id]) {
        usersInVoice[channel_id] = [];
    }
    const buttonContainer = channelsUl.querySelector(`li[id="${currentVoiceChannelId}"]`);
    const channelSpan = buttonContainer.querySelector('.channelSpan');
    channelSpan.style.marginRight = '30px';
    if(!usersInVoice[channel_id].includes(currentUserId)) {
        usersInVoice[channel_id].push(currentUserId);
    }
}

function closeCurrentCall() {
    const sp = getId('sound-panel');
    const oldVoiceId = currentVoiceChannelId;
    sp.style.display = 'none';
    clearVoiceChannel(oldVoiceId);
    currentVoiceChannelId = '';
    const buttonContainer = channelsUl.querySelector(`li[id="${oldVoiceId}"]`);

    mouseLeaveChannelButton(buttonContainer, false,oldVoiceId);
    usersInVoice[oldVoiceId] = [];
}
function clearVoiceChannel(channel_id) {
    const channelButton = channelsUl.querySelector(`li[id="${channel_id}"]`);
    if(!channelButton) {return; }
    const buttons = channelButton.querySelectorAll('.channel-button');
    buttons.forEach((btn,index) => {
        btn.remove();
    });
    let channelUsersContainer = channelButton.querySelector('.channel-users-container');
    if(channelUsersContainer) {
        channelUsersContainer.remove();
    }
    let existingContentWrapper = channelButton.querySelector('.content-wrapper');
    console.log(existingContentWrapper.style.marginRight);
    existingContentWrapper.style.marginRight = '100px';
}

function refreshInviteId() {
    if(!current_invite_ids) { return; }
    socket.emit('get_current_invite_id',{'guild_id' : currentGuildId});
}

function clickMainLogo() {
    logoClicked ++;
    if(logoClicked >= 14) {
        logoClicked = 0;
        const audioUrl = "https://github.com/TheLp281/LiventCord/raw/main/liventocordolowpitch.mp3";
        try {
            let audio = new Audio(audioUrl);
            audio.play();
        }
        catch(error) {
            console.log(error);
        }
        
          
    } 
    loadMainMenu();
}


function changeUrlWithFireWorks(guild_id,channel_id,guild_id) { 
    loadGuild(guild_id,channel_id,guild_id,currentUserId)
    createFireWorks();
    permissions_map[guild_id] = {
        "read_messages": 1,
        "send_messages": 1,
        "manage_roles": 1,
        "kick_members": 1,
        "ban_members": 1,
        "manage_channels": 1,
        "mention_everyone": 1,
        "add_reaction": 1,
        "is_admin": 1,
        "can_invite": 1
    }
    
}


function getBase64Image(imgElement) {
    const canvas = createEl('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imgElement.naturalWidth;
    canvas.height = imgElement.naturalHeight;
    ctx.drawImage(imgElement, 0, 0);
    return canvas.toDataURL('image/png');
}
function updateSettingsProfileColor() {
    const settingsProfileImg = getId('settings-self-profile');
    const rightBarTop = getId('settings-rightbartop');
    if(rightBarTop) {
        rightBarTop.style.backgroundColor = getAverageRGB(settingsProfileImg);
    }
}

function updateSelfProfile(userId, userName,is_timestamp=false,is_after_uploading=false) {
    if(!userId) { return; }
    const timestamp = new Date().getTime(); 
    let selfimagepath = is_timestamp ? `/profiles/${userId}.png?ts=${timestamp}` : `/profiles/${userId}.png`;
    const selfProfileImage = getId('self-profile-image');

    selfProfileImage.onerror = () => {
        if (selfProfileImage.src != defaultProfileImageUrl) {
            selfProfileImage.src = defaultProfileImageUrl;
        }
    }
    selfProfileImage.onload = () => {
        updateSettingsProfileColor();
    }
    selfProfileImage.src = selfimagepath;
    
    if(currentSettingsType == MyAccount) {
        const settingsSelfNameElement = getId('settings-self-name');
        const selfNameElement = getId('self-name');
        const settingsSelfProfile = getId('settings-self-profile');


        if(userName){
            settingsSelfNameElement.innerText = userName;
            selfNameElement.innerText = userName;
        }
        
        settingsSelfProfile.onerror = function() {
            if (settingsSelfProfile.src != defaultProfileImageUrl) {
                settingsSelfProfile.src = defaultProfileImageUrl;
            }
        };
        settingsSelfProfile.onload = function(event) {
            updateSettingsProfileColor();
            if(is_after_uploading) {
                const base64output = getBase64Image(settingsSelfProfile);
                if(base64output) {
                    console.log("Setting self profile as ", userId, userName)
                    lastConfirmedProfileImg = base64output;
                }
            }
        };
        settingsSelfProfile.src = selfimagepath;
        
    }
}
function shakeScreen() {
    currentSettingsType = null;
    if (!currentPopUp) { currentPopUp = generateUnsavedPopUp(); }
    showUnsavedPopUp(currentPopUp);
    currentPopUp.style.backgroundColor = '#ff1717';

    // Increase shake force
    shakeForce += 0.5;
    if (shakeForce > 5) {
        shakeForce = 5; // Cap the shake force at a maximum value
    }

    // Clear previous resetTimeout if it exists
    clearTimeout(resetTimeout);

    // Reset animation and apply shake animation with scaled force
    document.body.classList.remove('shake-screen'); // Remove the animation class
    void document.body.offsetWidth; // Trigger reflow to reset animation
    document.body.classList.add('shake-screen'); // Add the animation class with updated force

    // Set a new resetTimeout to reset shake force after 5 seconds
    resetTimeout = setTimeout(() => {
        shakeForce = 1; // Reset shake force to 1
        document.body.classList.remove('shake-screen'); // Remove the animation class
        currentPopUp.style.backgroundColor = '#0f0f0f'; // Reset background color
    }, 5000); 

    return;
}
function closeSettings() {
    if(isUnsaved) {
        shakeScreen();
        return;
    }
    enableSnowOnSettings()
    getId('settings-menu').style.animation = 'settings-menu-disappear-animation 0.3s forwards';



    setTimeout(() => {
        getId('settings-overlay').style.display = 'none';

    
        if(currentSettingsType == MyAccount) {
        }
        
    }, 300);

    isSettingsOpen = false;

    
    

}
let changeNicknameTimeout;
function changeNickname() {
    const newNicknameInput = getId('new-nickname-input');
    const newNickname = newNicknameInput.value.trim();

    if (newNickname !== '' && !changeNicknameTimeout && newNickname != currentUserName) {

        console.log("Changed your nickname to: " + newNickname);
        userNick = newNickname;
        socket.emit('set_nick', newNickname);




        newNicknameInput.value = newNickname;
        changeNicknameTimeout = setTimeout(() => {
            changeNicknameTimeout = null;
        }, 1000);

    }
}

let changeGuildNameTimeout;
function changeGuildName() {
    const newGuildInput = getId('guild-overview-name-input');
    const newGuildName = newGuildInput.value.trim();

    if (newGuildName !== '' && !changeGuildNameTimeout && newGuildName != currentGuildName) {

        console.log("Changed guild name to: " + newGuildName);

        const objecttosend = {'' : newGuildName,'guild_id' : currentGuildId};
        socket.emit('set_guild_name', objecttosend);


        const setInfoNick = getId('set-info-nick');
        if(setInfoNick) {
            setInfoNick.innerText = newGuildName;
        }

        newGuildInput.value = newGuildName;
        changeGuildNameTimeout = setTimeout(() => {
            changeGuildNameTimeout = null;
        }, 1000);

    }
}

function setActiveIcon() {
    let favicon = getId('favicon');
    let activeIconHref = '/static/images/icons/iconactive.png';
    favicon.href = activeIconHref;
}
function setInactiveIcon() {
    let favicon = getId('favicon');
    let activeIconHref =  '/static/images/icons/icon.png';
    favicon.href = activeIconHref;
}

function logOutPrompt() {
    askUser('Çıkış Yap','Çıkış yapmak istediğine emin misin?','Çıkış Yap',logOut,color=isRed=true);
}


function logOut() {
    socket.disconnect();

    fetch('/auth/logout', {
        method: 'POST',
        credentials: 'same-origin'
    })
    .then(response => {
        if (response.ok) {
            document.body.innerHTML = '';
            window.location.href = '/';
        } else {
            console.error('Logout failed:', response.statusText);

        }
    })
    .catch(error => {
        console.error('Error during logout:', error);
    });
}
function changePageToMe() {
    window.location.href = "/channels/@me";
}
function changePageToGuild() {
    window.location.href = "/";
}




document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        if(isUnread)
        setActiveIcon();
    } else {
        setInactiveIcon();
    }
});


let cachedAudioNotify = null;

function playNotification() {
    try {
        if (!cachedAudioNotify) {
            cachedAudioNotify = new Audio("https://raw.githubusercontent.com/TheLp281/LiventCord/main/notification.mp3");
        }
        cachedAudioNotify.play();
    } catch (error) {
        console.log(error);
    }
}

function hideLoadingScreen() {
    loadingScreen.style.display = 'none';
}






let isDisconnected = false;
let disconnectTimer = null;
let currentTimeout;
socket.on('connect', function() {
    console.log('Connected to server');
    socket.emit('keep-alive');

    if(!currentTimeout) {
        currentTimeout = setTimeout(function refresh_keep_alive() {
            socket.emit('keep-alive');
            if(socket.connected) {
                hideLoadingScreen();
            }
            setTimeout(refresh_keep_alive, 30000); 
        }, 30000);

    }

    hideLoadingScreen();

    if (isDisconnected) {
        isDisconnected = false;
        console.log('Reconnected after being disconnected');
        if(isOnGuild) {
            loadGuild(currentGuildId,currentChannelId,currentGuildName);
        } else if(isOnDm){
            OpenDm(currentDmId);
        } else if(isOnMe) {
            selectFriendMenu(online);
        }
    } else {

    }
    if (disconnectTimer) {
        clearInterval(disconnectTimer);
        disconnectTimer = null;
    }
});

socket.on('reconnect', () => {
    console.log('Reconnected to server');
    isDisconnected = false;
    if (disconnectTimer) {
        clearInterval(disconnectTimer);
        disconnectTimer = null;
    }

    hideLoadingScreen();
    loadGuild(currentGuildId,currentChannelId,currentGuildName);
});

socket.on('disconnect', (reason, details) => {
    console.log('Disconnected from server.', reason);
    const domains = ['https://liventcord.serveo.net', 'https://liventcord.loophole.site'];
    isDisconnected = true;
    const checkDomain = (domain) => {
        const img = new Image();
        img.onload = () => {
            console.log('Domain is up:', domain);
            setTimeout(() => {
                if (!socket.connected) {
                    window.location.href = domain + window.location.pathname;
                }
            }, 5000);
        };
        img.onerror = () => {
            console.log('Domain is down:', domain);
            if (domains.indexOf(domain) === domains.length - 1) {
                if (loadingScreen) {
                    loadingScreen.style.display = 'flex';
                }
            }

        };
        img.src = `${domain}/static/images/icons/favicon.png`; 
    };

    //domains.forEach((domain) => checkDomain(domain));
    setTimeout(() => {
        if (!socket.connected && loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
        
    }, 10000);
});


socket.on('update_guilds',data => {
    updateGuildList(data);
});

function getLastSecondMessageDate() {
    const messages = chatContent.children;
    if (messages.length < 2) return  '';

    const secondToLastMessage = messages[messages.length - 2];
    if (secondToLastMessage) {
        const dateGathered = secondToLastMessage.getAttribute('data-date');
        if(dateGathered) {
            const parsedDate = new Date(dateGathered);
            const formattedDate = formatDate(parsedDate);
            return formattedDate;
        }
    }
    return '';
}

socket.on('deletion_message', data=> {
    deleteLocalMessage(data.message_id,data.guild_id,data.channel_id,data.is_dm);
    if(guildChatMessages && guildChatMessages[currentChannelId] && guildChatMessages[currentChannelId] [data.message_id]) {
        delete guildChatMessages[currentChannelId][data.message_id];
    }
    const msgdate = messages_raw_cache[data.message_id].date;
    if(lastMessageDate == new Date(msgdate).setHours(0, 0, 0, 0)) {
        lastMessageDate = new Date(getLastSecondMessageDate()).setHours(0, 0, 0, 0)
        
    }
    if(bottomestChatDateStr  == msgdate) {
        bottomestChatDateStr = getLastSecondMessageDate();
    }
    delete guildChatMessages[currentChannelId][data.message_id];
    delete messages_raw_cache[data.message_id];
});

socket.on('join_guild_response',data=> {
    if(!data.success) {
        const errormsg = "DAVET BAĞLANTISI - Davet geçersiz ya da geçerliliğini yitirmiş.";
        getId('create-guild-title').textContent = errormsg;
        getId('create-guild-title').style.color = 'red';
        return;
    }
    if(!permissions_map[data.guild_id]) { permissions_map[data.guild_id] = [] };
    
    
    permissions_map[data.guild_id] = data.permissions_map;
    loadGuild(data.joined_guild_id,data.joined_channel_id,data.joined_guild_name,data.joined_author_id);

    if(closeCurrentJoinPop) {
        closeCurrentJoinPop();
    }
});



socket.on('message_readen', data => {
    if(data) {
        console.log(data);
        Object.keys(data).forEach(key => {
            readenMessagesCache[key] = data[key];
        })
    }
});
socket.on('deleted_guild', data => {
    if(typeof(data) == 'object') {
        if(data.success) {
            closeSettings();
            removeFromGuildList(data.guild_id);
            loadMainMenu();
        } else {
            alertUser('Sunucu silme başarısız.');
        }
        
    } else {
        alertUser('Sunucu silme hatası',data);
    }
});
socket.on('current_invite_ids_response', data => {
    if (data && data.invite_ids) {
        if (!current_invite_ids[data.guild_id]) {
            current_invite_ids[data.guild_id] = [];
        }
        current_invite_ids[data.guild_id] = data.invite_ids;
    } else {
        console.warn("Invite ids do not exist.");
    }
});

socket.on('update_',data => {
    if(data.guild_id == currentGuildId) {
        getId('guild-name').innerText = currentGuildName;
    }
})
socket.on('update_guild_image',data => {
    updateGuild(data)
    
})
socket.on('old_messages_response', function(data) {
    handleOldMessagesResponse(data);
});

function refreshUserProfileImage(user_id,user_nick=null) {
    if (user_id == currentUserId) {
        updateSelfProfile(user_id,null,true,true);
    }
    // from user list
    const profilesList = userList.querySelectorAll('.profile-pic');
    profilesList.forEach(user => {
        if(user_nick) {
            if (user.dataset.user_id === user_id) {
                user.parentNode.querySelector('.profileName').innerText = user_nick;
            }
        }
        if(user_id) {
            if (user.dataset.user_id === user_id) {
                user.src = `/profiles/${user_id}.png`;
            }
        }
    });

    // from chat container 
    const usersList = chatContainer.querySelectorAll('.profile-pic');
    usersList.forEach(user => {
        if(user_nick) {
            if (user.dataset.user_id === user_id) {
                user.parentNode.querySelector('.profileName').innerText = user_nick;
            }
        }
        if(user_id) {
            if (user.dataset.user_id === user_id) {
                user.src = `/profiles/${user_id}.png`;
            }
        }
    });
}


socket.on('update_user_profile', data => {
    refreshUserProfileImage(data.user_id);
});
function getBeforeElement(element) {
    const elements = Array.from(chatContent.children);
    const index = elements.indexOf(element);
    if (index > 0) {
        return elements[index - 1];
    } else {
        return null;
    }
}

function deleteLocalMessage(message_id,guild_id,channel_id,is_dm) {
    if(isOnGuild && channel_id != currentChannelId || isOnDm && is_dm && channel_id != currentDmId) { 
        console.error("Can not delete message: ",guild_id,channel_id, message_id,  currentGuildId,  currentChannelId);
        return; 
    }
    const messages = Array.from(chatContent.children); 

    for (let i = 0; i < messages.length; i++) {
        let element = messages[i];
        if (!element.classList || !element.classList.contains('message')) { continue; }
        const user_id = element.dataset.user_id;
    
        if (String(element.id) == String(message_id)) {
            console.log("Removing element:", message_id);
            element.remove();
            const foundMsg = getMessage(false);
            if(foundMsg) {
                lastSenderID = foundMsg.dataset.user_id;
            }
        } // Check if the element matches the currentSenderOfMsg and it doesn't have a profile picture already
        else if (!element.querySelector('.profile-pic') && getBeforeElement(element).dataset.user_id != element.dataset.user_id) {
            console.log("Creating profile img...");
            const messageContentElement = element.querySelector('#message-content-element');
            const date = element.dataset.date;
            const smallDate = element.querySelector('.small-date-element');
            if(smallDate)  {
                smallDate.remove();
            }
            const nick = getUserNick(user_id);
            
            createProfileImageChat(element, messageContentElement, nick, user_id, date, true);
            break;
        }
    }
    const dateBars = chatContent.querySelectorAll('.dateBar');

    dateBars.forEach(bar => {
        if (bar === chatContent.lastElementChild) {
            bar.remove();
        }
    });


    
    if(chatContent.children.length < 2) {
        displayStartMessage();
    }
    
}



socket.on('create_channel_response', data => {
    if(data.success == undefined || data.success == true) return;
    alertUser(`${currentGuildName} sunucusunda kanal yönetme iznin yok!`);
});

let reply_cache = {};
let messages_cache = {};
let guildChatMessages = {};
let messages_raw_cache = {};

function handleReplies() {
    console.log(reply_cache);
    Object.values(reply_cache).forEach(message => {
        const replierElements = Array.from(chatContent.children).filter(element => element.dataset.reply_to_id == message.message_id);
        console.log(replierElements, message.replies);
        replierElements.forEach(replier => {
            message.replies.forEach(msg => {
                createReplyBar(replier, message.message_id, msg.user_id, msg.content, msg.attachment_urls);
                console.log("Creating replly bar.", replier, message.message_id, msg.user_id, msg.content);
            });
        });
    });
}

socket.on('bulk_reply_response', data => {
    const replies = data.bulk_replies;
    replies.forEach(reply => {
        const { message_id, user_id, content, attachment_urls } = reply;
        if (!reply_cache[message_id]) {
            reply_cache[message_id] = {
                message_id: message_id,
                replies: []
            };
        }
        reply_cache[message_id].replies.push({ user_id, content, attachment_urls });
    });
    setTimeout(() => {
        handleReplies();
    }, 100);
});
function updateUsersMetaData(users, blocked_users) {
    if (!users) {
        console.log("Invalid users", users);
        return;
    }

    for (const userId in users) {
        if (Object.prototype.hasOwnProperty.call(users, userId)) {
            const [nick, discriminator] = users[userId];
            const is_blocked = blocked_users ? blocked_users.hasOwnProperty(userId) : false;
            addUser(userId, nick, discriminator, is_blocked);
        }
    }

    console.log("Updated userNames:", userNames);
}

socket.on('update_users', data => {
    if (!data || !data.users || !data.guild_id) { return; }
    
    guild_users_cache[data.guild_id] = data.users;
    updateUserList(data.users);   
    
});

socket.on('update_channels', data => {
    if(!data || !data.channels || !data.guild_id) { return; }
    channels_cache[data.guild_id] = data.channels;
    updateChannels(data.channels);

});

function removeChannel(data) {
    let cachedChannels = channels_cache[data.guild_id];
    let channelsArray = [];

    if (cachedChannels) {
        channelsArray = JSON.parse(cachedChannels);
        channelsArray = channelsArray.filter(channel => channel.channel_id !== data.channel_id);
        channels_cache[data.guild_id] = JSON.stringify(channelsArray);
    }

    currentChannels = channelsArray;
    removeChannelElement(data.channel_id);
    if(currentChannelId == data.channel_id) {
        const channelsArray = JSON.parse(channels_cache[currentGuildId])
        const firstChannel = channelsArray[0].channel_id;
        loadGuild(currentGuildId,firstChannel)
    }
}

function editChannel(data) {
    let cachedChannels = channels_cache[data.guild_id];
    let channelsArray = [];

    if (cachedChannels) {
        channelsArray = JSON.parse(cachedChannels);
        channelsArray.forEach((channel, index) => {
            if (channel.channel_id === data.channel_id) {
                editChannelElement(channel.channel_id,channel.channel_name);
            }
        });
    } else {
        channelsArray = [];
    }

    currentChannels = channelsArray;
}
socket.on('channel_update', data => {
    if (!data) return;
    const updateType = data.type;
    const removeType = 'remove';
    const editType = 'edit';
    const createType = 'create';

    if(updateType == createType) {
        const channel = {
            guild_id : data.guild_id,
            channel_id: data.channel_id,
            channel_name: data.channel_name,
            is_text_channel: data.is_text_channel
        };
        
        
        addChannel(channel);
    }
    else if (updateType === removeType) {
        removeChannel(data);
    } else if (updateType === editType) {
        editChannel(data);
    }
});

socket.on('update_users_metadata', data => {
    if (!data || !data.users || !data.guild_id) { return; }
    users_metadata_cache[data.guild_id] = data.users;

    updateUsersMetaData(data.users,data.blocked_users);
});


function updateUserOnlineStatus(userId, isOnline) {
    for (const guild_id in guild_users_cache) {
        if (userId != currentUserId && guild_users_cache.hasOwnProperty(guild_id)) {
            const users = guild_users_cache[guild_id];
            for (const userKey in users) {
                if (users.hasOwnProperty(userKey)) {
                    if (users[userKey].user_id === userId) {
                        users[userKey].is_online = isOnline;
                        console.log(`User ${userId} online status updated to ${isOnline} in guild ${guild_id}`);
                        return; 
                    }
                }
            }
        }
    }
    console.log(`User ${userId} not found in any guild`);
}

socket.on('user_status', (data) => {
    const user_id = data.user_id;
    const is_online = data.is_online;
    updateUserOnlineStatus(user_id, is_online)
});

socket.on('message', (data) => {
    try {
        const { is_dm, message_id, user_id, content, channel_id, date, attachment_urls, reply_to_id,is_bot, guild_id, last_edited, reaction_emojis_ids} = data;
        const idToCompare = is_dm ? currentDmId : currentChannelId;
        
        if (data.guild_id != currentGuildId || idToCompare != channel_id) {
            console.log(`${idToCompare} is not ${channel_id} so returning`);
            if (user_id !== currentUserId) {
                playNotification();
                setActiveIcon();
            }
            return;
        }

        displayChatMessage(data);

        fetchReplies(data);
        if(user_id == currentUserId) {
            setTimeout(() => {
                scrollToBottom();
            }, 30);
        }

    } catch (error) {
        console.error('Error processing message:', error);
    }
});

socket.on('message_date_response', (data)=> {
    const message_date = data.message_date;
    messageDates[data.message_id] = message_date;
    console.log(currentLastDate,message_date)
    if(currentLastDate && currentLastDate > message_date) {
        GetOldMessages(message_date,data.message_id);
    } else {
        console.log("Is less than!", currentLastDate, message_date)
    }
});



socket.on('history_data_response', (data) => {
    handleHistoryResponse(data);  
});


socket.on('update_nick',data => {
    const userid = data.user_id;
    const newNickname = data.user_name;
    if(userid == currentUserId) {
        
        const settingsNameText = getId('settings-self-name');
        const setInfoNick = getId('set-info-nick');
        const selfName = getId('self-name');
        
        selfName.innerText = newNickname;
        if(setInfoNick) {
            setInfoNick.innerText = newNickname;
        }
        if(settingsNameText) {
            settingsNameText.innerText = newNickname;
        }
        currentUserName = newNickname;
        return;
    }
    
    refreshUserProfileImage(null,newNickname);
});



const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const bufferSize = 4096;

socket.on('incoming_audio', async data => {

    if (data && data.byteLength > 0) {
        try {
            const arrayBuffer = convertToArrayBuffer(data);
            const decodedData = await decodeAudioDataAsync(arrayBuffer);
            if (decodedData) {
                playAudioBuffer(decodedData);
            } else {
                console.log('Decoded audio data is empty or invalid');
            }
        } catch (error) {
            console.log('Error decoding audio data:');

        }
    } else {
        console.log('Received silent or invalid audio data');
    }
});

function convertToArrayBuffer(data) {
    if (data instanceof ArrayBuffer) {
        return data;
    } else if (data.buffer instanceof ArrayBuffer) {
        return data.buffer;
    } else {
        throw new Error('Unsupported data format');
    }
}

function decodeAudioDataAsync(arrayBuffer) {
    try {

    }
    catch(error) {
        return new Promise((resolve, reject) => {
            audioContext.decodeAudioData(arrayBuffer, resolve, reject);
        });

    }
}

function playAudioBuffer(audioBuffer) {
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);
}

function joinToGuild(invite_id) {
    socket.emit('join_to_guild',{'invite_id':invite_id});
}