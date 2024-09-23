function getId(string) { return document.getElementById(string);}
let isDomLoaded = false;
let chatContainer;
let chatContent;
let userInput ;
let userList;
let settingsOverlay;
let channelInfo;
let gifMenu;
let gifsMenuSearchBar;
let gifsMenuContainer;
let fileImagePreview;
let channelList;
let channelsUl;
let currentChannels;
let currentGuildId;
let currentDmId;
let isDropdownOpen = false;
let dropDown;
let selfBubble;
let replyInfo;
let replyContainer;
let replyCloseButton;
let isUpdatingUsers = false;
let imagePreviewContainer;
let jsonPreviewContainer;
let previewImage;
let currentLastDate;
let jsonPreviewElement;
let fileInput;
let fileButton;
let current_invite_ids = {};
let isGifsOpen = false;

let isEmojisOpen = false;
let isOldMessageCd = false;
let isReachedChannelEnd = false;
let isDeveloperMode = true;
let chatContentInitHtml;
let isLastSendMessageStart = false;
let baseImagePath = `${location.origin}/images/`;
let lastMessageDateTime = null;
const maxWidth = 512;
const maxHeight = 384;
const maxTenorWidth = 512 *1.5;
const maxTenorHeight = 384 * 1.5;
const CLYDE_ID = '1';
let defaultMediaImageUrl = '/static/images/defaultmediaimage.png'

let currentCustomEmojis = [];

function getEmojiPath(emojiName) {   return `${baseImagePath}${emojiName}.png`; }

let lastSenderID = '';

let currentChannelName = null;
let currentReplyingTo = '';
const Overview = 'Overview';
const Roles = 'Roles';
const Emoji = 'Emoji';
const Invites = 'Invites';
const DeleteGuild = 'Delete Guild';


const textChanHtml = '<svg class="icon_d8bfb3" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M10.99 3.16A1 1 0 1 0 9 2.84L8.15 8H4a1 1 0 0 0 0 2h3.82l-.67 4H3a1 1 0 1 0 0 2h3.82l-.8 4.84a1 1 0 0 0 1.97.32L8.85 16h4.97l-.8 4.84a1 1 0 0 0 1.97.32l.86-5.16H20a1 1 0 1 0 0-2h-3.82l.67-4H21a1 1 0 1 0 0-2h-3.82l.8-4.84a1 1 0 1 0-1.97-.32L15.15 8h-4.97l.8-4.84ZM14.15 14l.67-4H9.85l-.67 4h4.97Z" clip-rule="evenodd" class=""></path></svg>'
const voiceChanHtml = '<svg class="icon_d8bfb3" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3a1 1 0 0 0-1-1h-.06a1 1 0 0 0-.74.32L5.92 7H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2.92l4.28 4.68a1 1 0 0 0 .74.32H11a1 1 0 0 0 1-1V3ZM15.1 20.75c-.58.14-1.1-.33-1.1-.92v-.03c0-.5.37-.92.85-1.05a7 7 0 0 0 0-13.5A1.11 1.11 0 0 1 14 4.2v-.03c0-.6.52-1.06 1.1-.92a9 9 0 0 1 0 17.5Z" class=""></path><path fill="currentColor" d="M15.16 16.51c-.57.28-1.16-.2-1.16-.83v-.14c0-.43.28-.8.63-1.02a3 3 0 0 0 0-5.04c-.35-.23-.63-.6-.63-1.02v-.14c0-.63.59-1.1 1.16-.83a5 5 0 0 1 0 9.02Z" class=""></path></svg>'

const inviteHtml = '<svg class="actionIcon_f6f816" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M14.5 8a3 3 0 1 0-2.7-4.3c-.2.4.06.86.44 1.12a5 5 0 0 1 2.14 3.08c.01.06.06.1.12.1ZM16.62 13.17c-.22.29-.65.37-.92.14-.34-.3-.7-.57-1.09-.82-.52-.33-.7-1.05-.47-1.63.11-.27.2-.57.26-.87.11-.54.55-1 1.1-.92 1.6.2 3.04.92 4.15 1.98.3.27-.25.95-.65.95a3 3 0 0 0-2.38 1.17ZM15.19 15.61c.13.16.02.39-.19.39a3 3 0 0 0-1.52 5.59c.2.12.26.41.02.41h-8a.5.5 0 0 1-.5-.5v-2.1c0-.25-.31-.33-.42-.1-.32.67-.67 1.58-.88 2.54a.2.2 0 0 1-.2.16A1.5 1.5 0 0 1 2 20.5a7.5 7.5 0 0 1 13.19-4.89ZM9.5 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM15.5 22Z" class=""></path><path fill="currentColor" d="M19 14a1 1 0 0 1 1 1v3h3a1 1 0 0 1 0 2h-3v3a1 1 0 0 1-2 0v-3h-3a1 1 0 1 1 0-2h3v-3a1 1 0 0 1 1-1Z" class=""></path></svg>';
const settingsHtml = '<svg class="actionIcon_f6f816" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M10.56 1.1c-.46.05-.7.53-.64.98.18 1.16-.19 2.2-.98 2.53-.8.33-1.79-.15-2.49-1.1-.27-.36-.78-.52-1.14-.24-.77.59-1.45 1.27-2.04 2.04-.28.36-.12.87.24 1.14.96.7 1.43 1.7 1.1 2.49-.33.8-1.37 1.16-2.53.98-.45-.07-.93.18-.99.64a11.1 11.1 0 0 0 0 2.88c.06.46.54.7.99.64 1.16-.18 2.2.19 2.53.98.33.8-.14 1.79-1.1 2.49-.36.27-.52.78-.24 1.14.59.77 1.27 1.45 2.04 2.04.36.28.87.12 1.14-.24.7-.95 1.7-1.43 2.49-1.1.8.33 1.16 1.37.98 2.53-.07.45.18.93.64.99a11.1 11.1 0 0 0 2.88 0c.46-.06.7-.54.64-.99-.18-1.16.19-2.2.98-2.53.8-.33 1.79.14 2.49 1.1.27.36.78.52 1.14.24.77-.59 1.45-1.27 2.04-2.04.28-.36.12-.87-.24-1.14-.96-.7-1.43-1.7-1.1-2.49.33-.8 1.37-1.16 2.53-.98.45.07.93-.18.99-.64a11.1 11.1 0 0 0 0-2.88c-.06-.46-.54-.7-.99-.64-1.16.18-2.2-.19-2.53-.98-.33-.8.14-1.79 1.1-2.49.36-.27.52-.78.24-1.14a11.07 11.07 0 0 0-2.04-2.04c-.36-.28-.87-.12-1.14.24-.7.96-1.7 1.43-2.49 1.1-.8-.33-1.16-1.37-.98-2.53.07-.45-.18-.93-.64-.99a11.1 11.1 0 0 0-2.88 0ZM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" clip-rule="evenodd" class=""></path></svg>';
const muteHtml = '<svg class="icon_cdc675" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="m2.7 22.7 20-20a1 1 0 0 0-1.4-1.4l-20 20a1 1 0 1 0 1.4 1.4ZM10.8 17.32c-.21.21-.1.58.2.62V20H9a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-2v-2.06A8 8 0 0 0 20 10a1 1 0 0 0-2 0c0 1.45-.52 2.79-1.38 3.83l-.02.02A5.99 5.99 0 0 1 12.32 16a.52.52 0 0 0-.34.15l-1.18 1.18ZM15.36 4.52c.15-.15.19-.38.08-.56A4 4 0 0 0 8 6v4c0 .3.03.58.1.86.07.34.49.43.74.18l6.52-6.52ZM5.06 13.98c.16.28.53.31.75.09l.75-.75c.16-.16.19-.4.08-.61A5.97 5.97 0 0 1 6 10a1 1 0 0 0-2 0c0 1.45.39 2.81 1.06 3.98Z" class=""></path></svg>';
const inviteVoiceHtml = '<svg class="icon_cdc675" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M13 3a1 1 0 1 0-2 0v8H3a1 1 0 1 0 0 2h8v8a1 1 0 0 0 2 0v-8h8a1 1 0 0 0 0-2h-8V3Z" class=""></path></svg>';

const selectedChanColor = 'rgb(64, 66, 73)';
const hoveredChanColor = 'rgb(53, 55, 60';
let permissionManager;
class PermissionManager {
    constructor(permissionsMap, currentGuildId) {
        this.permissionsMap = permissionsMap;
        this.currentGuildId = currentGuildId;
    }

    getPermission(permType) {
        return this.permissionsMap[this.currentGuildId]?.[permType] || 0;
    }

    canInvite() {
        return Boolean(this.getPermission(Permission.CAN_INVITE));
    }

    canManageChannels() {
        return Boolean(this.getPermission(Permission.MANAGE_CHANNELS));
    }

    isSelfAdmin() {
        return Boolean(this.getPermission(Permission.IS_ADMIN));
    }
}



const Permission = {
    READ_MESSAGES: 'read_messages',
    SEND_MESSAGES: 'send_messages',
    MANAGE_ROLES: 'manage_roles',
    KICK_MEMBERS: 'kick_members',
    BAN_MEMBERS: 'ban_members',
    MANAGE_CHANNELS: 'manage_channels',
    MENTION_EVERYONE: 'mention_everyone',
    ADD_REACTION: 'add_reaction',
    IS_ADMIN: 'is_admin',
    CAN_INVITE: 'can_invite'
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            loadObservedContent(entry);
        }
    });
}, { threshold: 0.1 });

function onInputSearchInput() {
    const inputElement = getId('channelSearchInput');
    if (inputElement.value.trim() !== '') {
        inputElement.style.width = '225px';
    } else {
        inputElement.style.width = '144px';
    }
}




function replaceCustomEmojis(message) {
    if(message) {

        const regex = /<:([^:>]+):(\d+)>/g;
    
        let message1 = message.replace(regex, (match, emojiName, emojiId) => {
            if (currentCustomEmojis.hasOwnProperty(emojiName)) {
                return `<img src="${getEmojiPath(currentCustomEmojis[emojiName])}" alt="${emojiName}" style="width: 64px; height: 38px; vertical-align: middle;" />`;
            } else {
                return match; // Return unchanged if emoji not found in customEmojis
            }
        });
        return message1;
    }
    return message

}
function checkStringFormat(str) {
    const pattern = /^\/app\/channels\/\d+\/\d+$/;
    const isPatternApp = pattern.test(str);
    const isPatternMe = pattern == '/me';
    return isPatternApp || isPatternMe;
}

function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
function isChannelMatching(channel_id,isTextChannel) {
    if(isTextChannel) {
        return currentChannelId == channel_id;
    } else {
        return currentVoiceChannelId == channel_id;
    }
}

function mouseHoverChannelButton(channelButton,isTextChannel,channel_id) {
    if(!channelButton) { return; }
    const contentWrapper = channelButton.querySelector('.content-wrapper');


    contentWrapper.style.display = 'flex';
    if(isTextChannel) {
        channelButton.style.backgroundColor = isChannelMatching(channel_id,isTextChannel) ? selectedChanColor : hoveredChanColor;
    } else {
        channelButton.style.backgroundColor = hoveredChanColor;
    }
    channelButton.style.color = 'white';
}
function hashChildElements(channelButton) {
    return channelButton.querySelector('.channel-users-container') != null;
}
function mouseLeaveChannelButton(channelButton,isTextChannel,channel_id) {
    if(!channelButton) { return; }
    const contentWrapper = channelButton.querySelector('.content-wrapper');
    const channelSpan = channelButton.querySelector('.channelSpan');



    if(channelSpan && !isTextChannel) {
        channelSpan.style.marginRight = hashChildElements(channelButton) ? '30px' : '100px';
    }
    if(contentWrapper) {
        if(!isTextChannel) {
            if(currentVoiceChannelId == channel_id) {
                contentWrapper.style.display = 'flex';
            } else {
                contentWrapper.style.display = 'none';
            }
            
        }  else {
            contentWrapper.style.display = 'none';
            
        }
    }
    if(isTextChannel) {
        channelButton.style.backgroundColor = isChannelMatching(channel_id,isTextChannel) ? selectedChanColor : 'transparent';
    } else {
        channelButton.style.backgroundColor = 'transparent';
        
    }
    channelButton.style.color = isChannelMatching(channel_id,isTextChannel) ? 'white' : 'rgb(148, 155, 164)';
}
function handleKeydown(event) {
    if (isKeyDown || isOnMe) return;
    currentChannels.forEach((channel, index) => {
        let hotkey = index < 9 ? (index + 1).toString() : (index === 9 ? '0' : null);
        if (hotkey && event.key === hotkey && event.altKey) {
            changeChannel(channel);
        }
    });
    if (event.altKey) { 
        if (event.key === "ArrowUp") {
            moveChannel(-1);
        } else if (event.key === "ArrowDown") {
            moveChannel(1);
        }
    }
    isKeyDown = true;
}
function editChannelElement(channel_id, new_channel_name) {
    const existingChannelButton = channelsUl.querySelector(`li[id="${channel_id}"]`);
    if (!existingChannelButton) { return; }
    existingChannelButton.querySelector('channelSpan').textContent = new_channel_name;
}
function removeChannelElement(channel_id) {
    const existingChannelButton = channelsUl.querySelector(`li[id="${channel_id}"]`);
    if (!existingChannelButton) { return; }
    existingChannelButton.remove();
}
function createChannelElement(channel) {
    const channel_id = channel.channel_id;
    const channel_name = channel.channel_name;
    const isTextChannel = channel.is_text_channel;
    const last_read_datetime = channel.last_read_datetime;
    const existingChannelButton = channelsUl.querySelector(`li[id="${channel_id}"]`);
    if (existingChannelButton) { return; }
    const htmlToSet = isTextChannel ? textChanHtml : voiceChanHtml;
    const channelButton = createEl('li', { className: 'channel-button', id: channel_id });
    channelButton.style.marginLeft = '-80px';

    const contentWrapper = createEl('div', { className: 'content-wrapper'});
    contentWrapper.style.display = 'none';
    const hashtagSpan = createEl('span', { innerHTML: htmlToSet, marginLeft: '50px' });
    hashtagSpan.style.color = 'rgb(128, 132, 142)';
    const channelSpan = createEl('span', { className: 'channelSpan', textContent: channel_name, });
    channelSpan.style.marginRight = '30px';
    channelSpan.style.width = '100%';
    channelButton.style.width = '70%';
    contentWrapper.style.marginRight = '100px';
    contentWrapper.style.marginTop = '4px';
    const settingsSpan = createEl('span', { innerHTML: settingsHtml });
    settingsSpan.addEventListener('click', () => {
        console.log("Click to settings on:", channel_name);
    })
    if(isSelfAuthor()) {
        const inviteSpan = createEl('span', { innerHTML: inviteHtml });
        inviteSpan.addEventListener('click', () => {
            console.log("Click to invite on:", channel_name);
        })
        contentWrapper.appendChild(inviteSpan);
    }
    contentWrapper.appendChild(settingsSpan);
    channelButton.appendChild(hashtagSpan);
    channelButton.appendChild(channelSpan);
    channelButton.appendChild(contentWrapper);
    appendToChannelContextList(channel_id);
    channelsUl.appendChild(channelButton);

    channelButton.addEventListener('mouseover', function(event) {
        if(event.target.id == channel_id) {
            mouseHoverChannelButton(channelButton, isTextChannel,channel_id);
        }
    });
    channelButton.addEventListener('mouseleave', function(event) {
        if(event.target.id == channel_id) {
            mouseLeaveChannelButton(channelButton, isTextChannel,channel_id);
        }
    });
    mouseLeaveChannelButton(channelButton, isTextChannel,channel_id);
    channelButton.addEventListener('click', function() {
        changeChannel(channel);
    });

    if (channel_id == currentChannelId) {
        changeChannel(channel);
    }


}
function resetKeydown() {
    isKeyDown = false;
}

function addChannel(channel) {
    console.log(typeof(channel), channel);
    currentChannels.push(channel);

    let guildChannels = channels_cache[channel.guild_id] ? JSON.parse(channels_cache[channel.guild_id]) : [];
    guildChannels.push(channel);
    channels_cache[channel.guild_id] = JSON.stringify(guildChannels);
    
    document.removeEventListener('keydown', handleKeydown);
    document.removeEventListener('keyup', resetKeydown);
    createChannelElement(channel);
    if (currentChannels.length > 1) {
        document.addEventListener('keydown', handleKeydown);
        document.addEventListener('keyup', resetKeydown);
    }
}
function updateChannels(channels) {
    if (channels == null) { return; }
    let channelsArray;
    try {
        channelsArray = JSON.parse(channels);
    } catch (error) {
        console.error("Error parsing channels JSON:", error);
        return;
    }
    if (!Array.isArray(channelsArray) || channelsArray.length === 0) {
        console.log("Channels format is not recognized. Type: " + typeof channelsArray + channelsArray);
        return;
    }
    channelsUl.innerHTML = "";
    if(!isOnMe) {
        disableElement('dm-container-parent');
    }
    document.removeEventListener('keydown', handleKeydown);
    document.removeEventListener('keyup', resetKeydown);
    channelsArray.forEach((channel) => {
        createChannelElement(channel);
    });
    currentChannels = channelsArray;
    if (currentChannels.length > 1) {
        document.addEventListener('keydown', handleKeydown);
        document.addEventListener('keyup', resetKeydown);
    }
}

let isKeyDown = false;
let currentChannelIndex = 0;
function moveChannel(direction) {
    let newIndex = currentChannelIndex + direction;
    if (newIndex < 0) {
        newIndex = currentChannels.length - 1;
    }
    else if (newIndex >= currentChannels.length) {
        newIndex = 0;
    }
    changeChannel(currentChannels[newIndex]);
    currentChannelIndex = newIndex; 
}




function createChannelsPop() {
    let isTextChannel = true;
    const newPopOuterParent = createEl('div',{className: 'outer-parent'});
    const newPopParent = createEl('div',{className:'pop-up',id:'createChannelPopContainer'});
    const title = `Kanal Oluştur`
    const sendText = "Sadece seçilen üyeler ve roller bu kanalı görüntüleyebilir.";

    const inviteTitle = createEl('p',{id:'create-channel-title', textContent:title});
    const popBottomContainer = createEl('div',{className:'popup-bottom-container',id:'create-channel-popup-bottom-container'});
    const sendInvText = createEl('p',{id:'create-channel-send-text', textContent:sendText});
    const closeBtn = createEl('button',{className:'popup-close', id:"invite-close-button",textContent:'X'});
    const newChannelPlaceHolder = 'yeni-kanal';
    const inviteUsersSendInput = createEl('input',{id:"create-channel-send-input",placeholder:newChannelPlaceHolder});
    inviteUsersSendInput.addEventListener('input', () => {
        const inputValue = inviteUsersSendInput.value.trim();
        toggleButtonState(inputValue !== ''); 
    });

    const channeltypetitle = createEl('p',{id:'create-channel-type', textContent:'KANAL TÜRÜ'});

    const hashText = `<svg class="icon_b545d5" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M10.99 3.16A1 1 0 1 0 9 2.84L8.15 8H4a1 1 0 0 0 0 2h3.82l-.67 4H3a1 1 0 1 0 0 2h3.82l-.8 4.84a1 1 0 0 0 1.97.32L8.85 16h4.97l-.8 4.84a1 1 0 0 0 1.97.32l.86-5.16H20a1 1 0 1 0 0-2h-3.82l.67-4H21a1 1 0 1 0 0-2h-3.82l.8-4.84a1 1 0 1 0-1.97-.32L15.15 8h-4.97l.8-4.84ZM14.15 14l.67-4H9.85l-.67 4h4.97Z" clip-rule="evenodd" class="foreground_b545d5"></path></svg>`
    const voiceText = `<svg class="icon_b545d5" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3a1 1 0 0 0-1-1h-.06a1 1 0 0 0-.74.32L5.92 7H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2.92l4.28 4.68a1 1 0 0 0 .74.32H11a1 1 0 0 0 1-1V3ZM15.1 20.75c-.58.14-1.1-.33-1.1-.92v-.03c0-.5.37-.92.85-1.05a7 7 0 0 0 0-13.5A1.11 1.11 0 0 1 14 4.2v-.03c0-.6.52-1.06 1.1-.92a9 9 0 0 1 0 17.5Z" class="foreground_b545d5"></path><path fill="currentColor" d="M15.16 16.51c-.57.28-1.16-.2-1.16-.83v-.14c0-.43.28-.8.63-1.02a3 3 0 0 0 0-5.04c-.35-.23-.63-.6-.63-1.02v-.14c0-.63.59-1.1 1.16-.83a5 5 0 0 1 0 9.02Z" class="foreground_b545d5"></path></svg>`;
    const channeltypetexticon = createEl('p',{id:'channel-type-icon',innerHTML:hashText});
    const channeltypevoiceicon = createEl('p',{id:'channel-type-icon',innerHTML:voiceText });
    const channeltypetexttitle = createEl('p',{id:'channel-type-title',textContent:'Metin'});
    const channeltypevoicetitle = createEl('p',{id:'channel-type-title',textContent:'Ses'});
    const channeltypetextdescription = createEl('p',{id:'channel-type-description',textContent:"Mesajlar, resimler, GIF'ler, emojiler, fikirler ve şakalar gönder"});
    const channeltypevoicedescription = createEl('p',{id:'channel-type-description',textContent:"Birlikte sesli veya görüntülü konuşun veya ekran paylaşın"});
    const channelnametitle = createEl('p',{id:'create-channel-name', textContent:'KANAL ADI'});
    const channelIcon = createEl('p',{id:'channel-icon',textContent:'#'});
    
    const textChannelContainer = createEl('div',{id:'create-channel-text-type'});
    const textChannelTitle = createEl('p',{id:'text-channel-title'});
    const voiceChannelTitle = createEl('p',{id:'voice-channel-title'});
    const voiceChannelContainer = createEl('div',{id:'create-channel-voice-type'});
    
    const specialchanHtml = `<svg class="switchIcon_b545d5" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="lightgray" fill-rule="evenodd" d="M6 9h1V6a5 5 0 0 1 10 0v3h1a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3Zm9-3v3H9V6a3 3 0 1 1 6 0Zm-1 8a2 2 0 0 1-1 1.73V18a1 1 0 1 1-2 0v-2.27A2 2 0 1 1 14 14Z" clip-rule="evenodd" class=""></path></svg>`;
    const specialChanIcon = createEl('div',{innerHTML:specialchanHtml,id:'special-channel-icon'});
    const specialChanText = createEl('div',{id:'special-channel-text', textContent:'Özel Kanal'  });
    const specialChanToggle = createEl('toggle',{id:'special-channel-text'});
    textChannelContainer.style.filter = 'brightness(1.5)';
    voiceChannelContainer.style.filter = 'brightness(1)';

    textChannelContainer.addEventListener('click', function() {
        isTextChannel = true;
        textChannelContainer.style.filter = 'brightness(1.5)';
        voiceChannelContainer.style.filter = 'brightness(1)';
    });
    
    voiceChannelContainer.addEventListener('click', function() {
        isTextChannel = false;
        textChannelContainer.style.filter = 'brightness(1)';
        voiceChannelContainer.style.filter = 'brightness(1.5)';
    });

    const popAcceptButton = createEl('button', {className: 'pop-up-accept',textContent:'Kanal Oluştur',style:"height:40px; width: 25%; top:93%;  left: 84%; font-size:14px; disabled=1; white-space:nowrap;"});
    popAcceptButton.addEventListener('click', function() {
        const inviteUsersSendInput = getId('create-channel-send-input');
        let newchanname = inviteUsersSendInput.value.replace(/^\s+/, '');;
        
        if (!newchanname) {
            newchanname = newChannelPlaceHolder;
        }
        const data = {
            'channel_name': newchanname,
            'guild_id': currentGuildId,
            'is_text_channel': isTextChannel
        };
        
        socket.emit('create_channel', data);
        isTextChannel = true;
        closePopUp(newPopOuterParent, newPopParent);
    });
    function toggleButtonState(isActive) {
        if (isActive) {
            popAcceptButton.classList.remove('inactive');
            popAcceptButton.classList.add('active');
        } else {
            popAcceptButton.classList.remove('active');
            popAcceptButton.classList.add('inactive');
        }
    }
    const popRefuseButton =  createEl('button', {className: 'pop-up-refuse',textContent:'İptal', style:"top: 93%; left:61%; font-size:14px;" });
    popRefuseButton.addEventListener('click',function(){
        isTextChannel = true;
        closePopUp(newPopOuterParent, newPopParent);
    });
    newPopParent.appendChild(specialChanIcon);
    newPopParent.appendChild(popAcceptButton);
    newPopParent.appendChild(specialChanText);
    newPopParent.appendChild(specialChanToggle);

    newPopParent.appendChild(popRefuseButton);

    textChannelContainer.appendChild(channeltypetexticon);
    voiceChannelContainer.appendChild(channeltypevoiceicon);

    textChannelContainer.appendChild(channeltypetexttitle);
    textChannelContainer.appendChild(channeltypetextdescription);
    voiceChannelContainer.appendChild(channeltypevoicetitle);
    voiceChannelContainer.appendChild(channeltypevoicedescription);

    newPopParent.appendChild(closeBtn);
    newPopParent.appendChild(inviteTitle);

    newPopParent.appendChild(channeltypetitle);
    newPopParent.appendChild(channelnametitle);
    newPopParent.appendChild(channelIcon);
    
    const centerWrapper = createEl('div',{id:'center-wrapper'});
    centerWrapper.appendChild(textChannelTitle);
    centerWrapper.appendChild(voiceChannelTitle);
    newPopParent.appendChild(centerWrapper);

    newPopParent.append(textChannelContainer );
    newPopParent.append(voiceChannelContainer );
    
    popBottomContainer.appendChild(sendInvText);
    popBottomContainer.appendChild(inviteUsersSendInput);
    newPopParent.appendChild(popBottomContainer);
    newPopOuterParent.style.display = 'flex';
    closeBtn.addEventListener('click',function(){
        closePopUp(newPopOuterParent, newPopParent);
    });
    
    newPopOuterParent.addEventListener('click',function(event){
        if (event.target === newPopOuterParent) {
            closePopUp(newPopOuterParent, newPopParent);
        }
    });

    newPopOuterParent.appendChild(newPopParent);
    document.body.appendChild(newPopOuterParent);
}

function leaveCurrentGuild() {
    socket.emit('leave_from_guild',currentGuildId);
}


function openGuildSettingsDd(event) {
    const clicked_id = event.target.id;
    toggleDropdown();

    if ( clicked_id === 'invite-dropdown-button' ) {
        createInviteUsersPop();
    }
    else if ( clicked_id ===  'settings-dropdown-button') {
        reconstructSettings(true);
        openSettings(true);
        selectSettingCategory(Overview);
    }
    else if ( clicked_id===  "channel-dropdown-button") {
        createChannelsPop();
    }
    else if (clicked_id ===  "notifications-dropdown-button") {
        
    }
    else if ( clicked_id ===  "exit-dropdown-button") {
        askUser('Sunucudan ayrıl', 'Sunucudan ayrılmak istediğine emin misin?','Sunucudan ayrıl',leaveCurrentGuild)
    }

    
}

const rgbCache = {};

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase();
}
function getAverageRGB(imgEl) {
    if (imgEl.src === defaultProfileImageUrl) {
        return '#e7e7e7';
    }

    const blockSize = 5;
    const defaultRGB = { r: 0, g: 0, b: 0 };
    const canvas = document.createElement('canvas');
    const context = canvas.getContext && canvas.getContext('2d');

    if (!context) {
        return defaultRGB;
    }

    // Check if the value is already cached
    if (rgbCache[imgEl.src]) {
        return rgbCache[imgEl.src];
    }

    const height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    const width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

    context.drawImage(imgEl, 0, 0, width, height);

    let data;
    try {
        data = context.getImageData(0, 0, width, height);
    } catch (e) {
        return defaultRGB;
    }

    const length = data.data.length;
    const rgb = { r: 0, g: 0, b: 0 };
    let count = 0;

    for (let i = 0; i < length; i += blockSize * 4) {
        count++;
        rgb.r += data.data[i];
        rgb.g += data.data[i + 1];
        rgb.b += data.data[i + 2];
    }

    // Calculate the average color
    rgb.r = ~~(rgb.r / count);
    rgb.g = ~~(rgb.g / count);
    rgb.b = ~~(rgb.b / count);

    // Convert the RGB values to a hexadecimal string
    const rgbString = rgbToHex(rgb.r, rgb.g, rgb.b);

    // Cache the result
    rgbCache[imgEl.src] = rgbString;

    return rgbString;
}

function drawProfilePop(userData) {
    const profileContainer = createEl('div',{id:'profile-container'});

    const discriminator = userData.discriminator;
    const profileTitle = createEl('p', { id: 'profile-title', textContent: getUserNick(userData.user_id) });
    const profileDiscriminator = createEl('p', { id: 'profile-discriminator', textContent:'#' + discriminator });
    profileContainer.appendChild(profileTitle);
    profileContainer.appendChild(profileDiscriminator);
    const aboutTitle = createEl('p', { id: 'profile-about-title', textContent: userData.user_id == currentUserId ? 'Hakkımda' : 'Hakkında'});
    const aboutDescription = createEl('p', { id: 'profile-about-description', textContent: userData.description });
    const popBottomContainer = createEl('div', { className: 'popup-bottom-container', id: 'profile-popup-bottom-container' });
    popBottomContainer.appendChild(aboutTitle);
    popBottomContainer.appendChild(aboutDescription);
    const popTopContainer = createEl('div', { className: 'popup-bottom-container', id: 'profile-popup-top-container' });
    const profileOptions = createEl('button',{id:userData.user_id, className:'profile-dots3'});
    const profileOptionsText = createEl('p',{className:'profile-dots3-text',textContent:'⋯'});
    profileOptions.appendChild(profileOptionsText);
    popTopContainer.appendChild(profileOptions);
    const profileImg = createEl('img',{id:'profile-display', });

    const profileOptionsContainer = createEl('div',{className: 'profile-options-container'});

    if(userData.user_id != currentUserId) {
        if(!isFriend(userData.user_id)) {
            const addFriendBtn = createEl('button', { className: 'profile-add-friend-button' });
            addFriendBtn.innerHTML = ` <div class="icon-container">${createAddFriSVG()}</div> Arkadaş Ekle`;
            function createAddFriSVG() {
                return `
                    <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 24 24">
                        <path d="M19 14a1 1 0 0 1 1 1v3h3a1 1 0 0 1 0 2h-3v3a1 1 0 0 1-2 0v-3h-3a1 1 0 1 1 0-2h3v-3a1 1 0 0 1 1-1Z" fill="currentColor"></path>
                        <path d="M16.83 12.93c.26-.27.26-.75-.08-.92A9.5 9.5 0 0 0 12.47 11h-.94A9.53 9.53 0 0 0 2 20.53c0 .81.66 1.47 1.47 1.47h.22c.24 0 .44-.17.5-.4.29-1.12.84-2.17 1.32-2.91.14-.21.43-.1.4.15l-.26 2.61c-.02.3.2.55.5.55h7.64c.12 0 .17-.31.06-.36C12.82 21.14 12 20.22 12 19a3 3 0 0 1 3-3h.5a.5.5 0 0 0 .5-.5V15c0-.8.31-1.53.83-2.07ZM12 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" fill="white"></path>
                    </svg>
                `;
            }
            addFriendBtn.addEventListener('click', () => { addFriend(userData.user_id); });
            profileOptionsContainer.appendChild(addFriendBtn);
    
        } 
        const sendMsgBtn = createEl('button',{className:'profile-send-msg-button'});
        const sendMsgIco = createEl('div',{innerHTML:`
            <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22a10 10 0 1 0-8.45-4.64c.13.19.11.44-.04.61l-2.06 2.37A1 1 0 0 0 2.2 22H12Z" class=""></path></svg>
        `});
    
        sendMsgBtn.appendChild(sendMsgIco);
    
        sendMsgBtn.addEventListener('click', () => {
            loadMainMenu();
            OpenDm(userData.user_id);
            const profilePopContainer = getId('profilePopContainer');
            if(profilePopContainer) {
                profilePopContainer.parentNode.remove();
            }
        })
        profileOptionsContainer.appendChild(sendMsgBtn);

    }

    
    
    
    profileContainer.appendChild(profileOptionsContainer);
    setProfilePic(profileImg,userData.user_id);

    const bubble = createBubble(userData.is_online,true);
    profileImg.appendChild(bubble);

    appendToProfileContextList(userData,userData.user_id);
    profileOptions.addEventListener('click',function(event) { 
        showContextMenu(event.pageX, event.pageY,contextList[userData.user_id]);
    });
    profileImg.onload = function() {
        popTopContainer.style.backgroundColor = getAverageRGB(profileImg);
    };
    
    const contentElements = [popTopContainer,profileImg ,profileContainer, popBottomContainer];
    createPopUp({
        contentElements: contentElements,
        id: 'profilePopContainer'
    });
}



function createPopUp({contentElements, id, closeBtnId=null}) {
    const popOuterParent = createEl('div', { className: 'outer-parent' });
    const parentContainer = createEl('div', { className: 'pop-up', id: id });
    popOuterParent.style.display = 'flex';


    contentElements.forEach(element => parentContainer.appendChild(element));
    if(closeBtnId) {
        const closeBtn = createEl('button', { className: 'popup-close', id: closeBtnId, textContent: 'X' });
        parentContainer.appendChild(closeBtn);


        closeBtn.addEventListener('click', function() {
            console.log("Closing pop up.");
            closePopUp(popOuterParent, parentContainer);
        });

    }

    let isMouseDownOnPopOuter = false;

    popOuterParent.addEventListener('mousedown', function(event) {
        // Only set the flag if the mousedown occurred on the popOuterParent
        if (event.target === popOuterParent) {
            isMouseDownOnPopOuter = true;
        }
    });
    
    popOuterParent.addEventListener('mouseup', function(event) {
        // Only proceed with the click action if the mouse down started on popOuterParent
        if (isMouseDownOnPopOuter && event.target === popOuterParent) {
            console.log("Pop outer clicked!");
            closePopUp(popOuterParent, parentContainer);
        }
        // Reset the flag regardless of where the mouseup occurs
        isMouseDownOnPopOuter = false;
    });
    

    popOuterParent.appendChild(parentContainer);
    document.body.appendChild(popOuterParent);
    return popOuterParent;
}

function getCurrentInviteId() {
    let currentGuild = currentGuildId;
    if (!current_invite_ids || !current_invite_ids[currentGuild] || current_invite_ids[currentGuild].length === 0) {
        return null; 
    }
    return current_invite_ids[currentGuild][current_invite_ids[currentGuild].length - 1];
}


function createInviteUsersPop() {
    const title = `Arkadaşlarını ${currentGuildName} sunucusuna davet et`;
    const sendText = "VEYA BİR ARKADAŞINA SUNUCU DAVETİ BAĞLANTISI YOLLA";
    const invitelink = `${window.location.protocol}//${window.location.hostname}/join-guild/${getCurrentInviteId()}`;

    const inviteTitle = createEl('p', { id: 'invite-users-title', textContent: title });
    const channelnamehash = createEl('p', { id: 'invite-users-channel-name-hash', innerHTML:textChanHtml });
    
    const channelNameText = createEl('p', { id: 'invite-users-channel-name-text', textContent: currentChannelName });
    const sendInvText = createEl('p', { id: 'invite-users-send-text', textContent: sendText });
    const inviteUsersSendInput = createEl('input', { id: 'invite-users-send-input', value: invitelink });

    const popBottomContainer = createEl('div', { className: 'popup-bottom-container', id: 'invite-popup-bottom-container' });
    popBottomContainer.appendChild(sendInvText);
    popBottomContainer.appendChild(inviteUsersSendInput);

    const contentElements = [inviteTitle, channelnamehash, channelNameText, popBottomContainer];

    createPopUp({
        contentElements: contentElements,
        id: 'inviteUsersPopContainer',
        closeBtnId: 'invite-close-button'
    });
}

function toggleDropdown() {
    if(!isOnGuild) { return }
    if (!isDropdownOpen) {
        isDropdownOpen = true;
        dropDown.style.display = 'flex'; 
        dropDown.style.animation = 'fadeIn 0.3s forwards'; 
        fillDropDownContent();
    } else {
        dropDown.style.animation = 'fadeOut 0.3s forwards'; 
        setTimeout(() => {
            dropDown.style.display = 'none'; 
            isDropdownOpen = false;
        }, 300); 
    }
}


async function handleScroll() {
    if (loadingScreen.style.display === 'flex') {  return; }

    const tenPercentHeight = window.innerHeight * 0.1;
    if (chatContainer.scrollTop <= tenPercentHeight && !isOldMessageCd && chatContent.children.length > 0) {
        isOldMessageCd = true;
        console.log('Fetching old messages...');
        try {
            let continueLoop = true;
            while (continueLoop) {
                if (chatContainer.scrollTop <= tenPercentHeight) {
                    await GetOldMessagesOnScroll();
                } else {
                    continueLoop = false;
                    console.log('Scroll position exceeded threshold.');
                }
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        } catch (error) {
            console.error('Error fetching old messages:', error);
        } finally {
            isOldMessageCd = false;
            console.log('Fetching complete. Resetting flag.');
        }
    }
}
function handleBottomReachedAction() {
    console.log("Bottom reach!");
}

function adjustHeight() {
    userInput.style.height = 'auto';
    userInput.style.height = (userInput.scrollHeight) + 'px';

    let userInputHeight = userInput.scrollHeight;
    userInput.scrollTop = userInput.scrollHeight - userInput.clientHeight;
    if(userInputHeight > 500)  {
        return;
    }
    chatContainer.style.height = `calc(87vh - ${userInputHeight-60}px)`;

    if(userInputHeight == 60) {
        userInput.style.paddingTop = '-5px';
        userInput.style.height = '45px';
    }

    const elementHeight = parseInt(userInput.style.height, 10);
    const topPosition = elementHeight;
    replyInfo.style.bottom = `${topPosition}px`;


}
function debounce(func, delay) {
    let timer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}
let typingTimeout;

async function handleUserKeydown(event) {
    if (userInput.value !== '') {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        typingTimeout = setTimeout(() => {
            socket.emit('start_writing', {
                'channel_id': isOnDm ? currentDmId : currentChannelId,
                'guild_id': currentGuildId,
                'is_dm': isOnDm
            });
        }, 1000);
    }
    if (event.key === 'Enter' && event.shiftKey) {
        event.preventDefault();
        let startPos = userInput.selectionStart;
        let endPos = userInput.selectionEnd;
        userInput.value = userInput.value.substring(0, startPos) + '\n' + userInput.value.substring(endPos);
        userInput.selectionStart = userInput.selectionEnd = startPos + 1;
        const difference = chatContainer.scrollHeight - (chatContainer.scrollTop + chatContainer.clientHeight)
        console.log(difference);
        if(difference < 10) {
            scrollToBottom();
        }
        userInput.dispatchEvent(new Event('input'));
    } else if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); 
        await sendMessage(userInput.value.trim());
        adjustHeight();
    }
    if(isParty && isDomLoaded) {
        popKeyboardConfetti();
    }
}
let isSnow = false;
let snowActive = false;

let particeContainer;
function enableSnowOnSettings() {
    if(isSnow) {
        enableSnow();
    } else {
        snowActive = false;
    }
}

function toggleSnow() {
    if(isSnow) {
        disableSnow();
    } else {
        isSnow = true;
        enableSnow();
    }
}
function disableSnow() {
    snowActive = false; 
    isSnow = false;
}
function disableSnowOnSettingsOpen() {
    snowActive = false;
}
let isParty = false;
function toggleParty() {
    isParty = !isParty;
}

function enableSnow() {
    particeContainer = getId('confetti-container');
    snowActive = true; 
    let skew = 1;

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    (function frame() {
        if (!snowActive) return; 

        skew = Math.max(0.8, skew - 0.001);

        confetti({
            particleCount: 1,
            startVelocity: 0,
            ticks: 300,
            origin: {
                x: Math.random(),
                y: (Math.random() * skew) - 0.2
            },
            colors: ['#ffff'],
            shapes: ['circle'],
            gravity: randomInRange(0.4, 0.6),
            scalar: randomInRange(0.4, 1),
            drift: randomInRange(-0.4, 0.4),
            particleContainer: particeContainer
        });

        requestAnimationFrame(frame); 
    }());
}

function popKeyboardConfetti() {
    const { x, y } = getCursorXY(userInput, userInput.selectionStart);
    const inputRect = userInput.getBoundingClientRect();
    
    let ratioY = y / window.innerHeight + 0.95;
    let ratioX = (inputRect.left + x) / window.innerWidth;

    if (ratioY > 1) {
        ratioY = 1;
    }
    if (ratioX < 0.2) {
        ratioX = 0.2;
    }

    setTimeout(() => {
        confetti({
            particleCount: 5,
            spread: 7,
            origin: { x: ratioX, y: ratioY },
            disableForReducedMotion: true
        });
    }, 0);
}

const maxFiles = 8;
let fileList = [];
function handleFileInput(eventOrFiles = null) {
    let filesToProcess;
    if (eventOrFiles instanceof Event) {
        filesToProcess = Array.from(eventOrFiles.target.files);
    } else if (eventOrFiles instanceof FileList || eventOrFiles instanceof Array) {
        filesToProcess = Array.from(eventOrFiles);
    } else {
        filesToProcess = [eventOrFiles];
    }
    filesToProcess = filesToProcess.filter(file => file instanceof Blob && file.size <= 50 * 1024 * 1024);
    if (fileList.length + filesToProcess.length > maxFiles) {
        filesToProcess = filesToProcess.slice(0, maxFiles - fileList.length);
    }

    filesToProcess.forEach(file => {
        fileList.push(file);
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = createEl('img', {
                style: 'max-width: 256px; max-height: 256px; margin-right: 10px;',
                src: e.target.result
            });
            fileImagePreview.appendChild(img);
            img.addEventListener('click', function() {
                displayImagePreview(img.src);
            });
        };
        reader.readAsDataURL(file);
    });
    if (fileList.length > maxFiles) {
        fileList = fileList.slice(0, maxFiles);
    }
    updateFileImageBorder();
}

function updateFileImageBorder() {
    
    if (fileImagePreview.children.length === 0) {
        fileImagePreview.style.border = 'none';
    } else {
        fileImagePreview.style.border = '20px solid #2b2d31';
    }
}
function openSearchPop() {

}
function setDropHandler() {
    const dropZone = getId('drop-zone');
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            const dataTransfer = e.dataTransfer;
            if (dataTransfer && dataTransfer.types.includes('text/plain')) {
                dropZone.style.display = 'flex';
            }
            dropZone.classList.add('hover');
        }, false);
    });
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            if (e.type === 'drop') {
                const dataTransfer = e.dataTransfer;
                if (dataTransfer && dataTransfer.types.includes('text/plain')) {
                    const droppedText = dataTransfer.getData('text/plain');
                    if (droppedText.length < 2000) {
                        dropZone.style.display = 'none';
                    }
                }
            } else if (e.type === 'dragleave') {
                if (!dropZone.contains(e.relatedTarget)) {
                    dropZone.style.display = 'none';
                }
            }
            dropZone.classList.remove('hover');
        }, false);
    });
    dropZone.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        let dt = e.dataTransfer;
        let files = dt.files;
        if (files.length) {
            handleFileInput(files); 
        }
    }
    fileButton.addEventListener('click', function() {
        fileInput.click();
    });
    fileInput.addEventListener('change', handleFileInput);
}
function assignElements() {
    const cookieSnow = loadBooleanCookie('isSnow');
    if(cookieSnow) {
        enableSnow();
    }
    isSnow = cookieSnow;
    settingsOverlay = getId('settings-overlay');
    userInput = getId('user-input');
    userList = getId('user-list');
    channelInfo = getId("channel-info");
    replyInfo = getId("reply-info");
    replyContainer  = getId("reply-container");
    replyCloseButton = getId("reply-close-button");
    imagePreviewContainer = getId('image-preview-container');
    jsonPreviewContainer = getId('json-preview-container');
    previewImage = getId('preview-image');
    jsonPreviewElement = getId('json-preview-element')
    chatContainer = getId('chat-container');
    chatContent = getId('chat-content');
    dropDown = getId('guild-settings-dropdown');
    gifMenu = getId('gif-menu');
    gifsMenuSearchBar= getId('gifs-menu-searchbar');
    gifsMenuContainer = getId('gifs-menu-container');
    fileImagePreview = getId('image-preview');
    fileInput = getId('fileInput');
    fileButton = getId('file-button');
    guildsList = getId('guilds-list');
    channelList = getId('channel-list');
    channelsUl = channelList.querySelector('ul');
    chatContentInitHtml = chatContent.innerHTML;
}



document.addEventListener('DOMContentLoaded', function () {
    assignElements();
    
    getId('globalSearchInput').addEventListener('click', function(){
        openSearchPop();
    });

    getId('guild-container').addEventListener('click', function(event) {
        if (event.target.id === 'guild-container' || event.target.id === 'guild-name') {
            toggleDropdown(); 
        }
    });
    gifsMenuSearchBar.addEventListener('keydown', debounce(async function(event) {
        await loadGifContent();
    }, 300));
    createScrollButton();
    
    chatContainer.addEventListener('scroll', handleScroll);
    userInput.addEventListener('input', adjustHeight);
    userInput.addEventListener('keydown', handleUserKeydown);
    closeReplyMenu();
    adjustHeight();

    
    
    setDropHandler();
    
    updateFileImageBorder();
    const guildContainer = getId('guild-container');
    guildContainer.addEventListener('mouseover',function() {
        guildContainer.style.backgroundColor= '#333538';
    });
    guildContainer.addEventListener('mouseout',function() {   
        guildContainer.style.backgroundColor= '#2b2d31';
    });
    

    const friendContainer = getId('friend-container-item');

    friendContainer.addEventListener('click',loadMainMenu);

    if(isOnGuild) { socket.emit('get_user_metadata',currentGuildId);  }

    displayWelcomeMessage('Reeyuki','2024-08-09T12:34:56.789Z');
    window.scrollTo(0, 0);
    
});
window.scrollTo(0, 0);

async function changeChannel(newChannel) {
    if(isOnMe || isOnDm) { return; }
    const channel_id = newChannel.channel_id;
    const isTextChannel = newChannel.is_text_channel;
    const url = constructAppPage(currentGuildId,channel_id);
    if(url != window.location.pathname && isTextChannel) {
        window.history.pushState(null, null, url);
    }
    const newChannelName = newChannel.channel_name;
    isReachedChannelEnd = false;
    
    if(isTextChannel) {
        currentChannelId = channel_id;
        currentChannelName = newChannelName;
        userInput.placeholder = '#' + truncateString(newChannelName,30) + ' kanalına mesaj gönder';
        channelInfo.textContent = newChannelName;
        lastSenderID = '';
        chatContent.innerHTML = '';
        lastMessageDateTime = null;
        currentLastDate = '';
        GetHistoryFromOneChannel(currentChannelId);
        closeReplyMenu();
    } else {
        joinVoiceChannel(channel_id);
    }

    if(!currentChannels) { return; }

    currentChannels.forEach((channel, index) => {
        const channelButton = channelsUl.querySelector(`li[id="${channel.channel_id}"]`);
        if(channelButton) {
            if(channel.channel_id != channel_id) {
                mouseHoverChannelButton(channelButton,channel.is_text_channel,channel.channel_id);
                mouseLeaveChannelButton(channelButton,channel.is_text_channel,channel.channel_id);
            } else if(!isTextChannel) {
                const usersInChannel = usersInVoice[channel_id];
                if(usersInChannel) {

                    let allUsersContainer = channelButton.querySelector('.channel-users-container');
                    if(!allUsersContainer) {
                        allUsersContainer = createEl('div',{className:'channel-users-container'});
                    }
                    channelButton.style.width = '100%';
                    usersInChannel.forEach((user_id,index) => {
                        drawVoiceChannelUser(index,user_id,channel_id,channelButton,allUsersContainer,isTextChannel);
                    });
                }
            }
        }
    });
}

function drawVoiceChannelUser(index,user_id,channel_id,channelButton,allUsersContainer,isTextChannel) {
    
    const userName = getUserNick(user_id);
    const userContainer = createEl('li', { className: 'channel-button',id : user_id });
    userContainer.addEventListener('mouseover', function(event) {
        //mouseHoverChannelButton(userContainer, isTextChannel,channel_id);
    });
    userContainer.addEventListener('mouseleave', function(event) {
        //mouseLeaveChannelButton(userContainer, isTextChannel,channel_id);
    });


    createUserContext(user_id);
    
    userContainer.id = `user-${user_id}`;
    const userElement = createEl('img', { src: profileUrl, style: 'width: 25px; height: 25px; border-radius: 50px; position:fixed; margin-right: 170px;' });
    setProfilePic(userElement,user_id);
    userContainer.appendChild(userElement);
    userContainer.style.marginTop = index == 0 ? '30px' : '10px';
    userContainer.style.marginLeft = '-220px'; 
    userContainer.style.width = '90%';
    userContainer.style.justifyContent = 'center';
    userContainer.style.alignItems = 'center';

    const contentWrapper = createEl('div', { className: 'content-wrapper' });
    const userSpan = createEl('span', { className: 'channelSpan', textContent: userName ,style:'position: fixed;'});
    userSpan.style.color = 'rgb(128, 132, 142)';
    userSpan.style.border = 'none';
    userSpan.style.width = 'auto';

    const muteSpan = createEl('span', { innerHTML: muteHtml });
    const inviteVoiceSpan = createEl('span', { innerHTML: inviteVoiceHtml });
    contentWrapper.appendChild(muteSpan);
    contentWrapper.appendChild(inviteVoiceSpan);
    contentWrapper.style.marginRight = '-115px';
    userContainer.appendChild(userSpan);
    userContainer.appendChild(contentWrapper);
    allUsersContainer.appendChild(userContainer)
    channelButton.appendChild(allUsersContainer);
}




function GetHistoryFromOneChannel(channel_id,is_dm=false) {
    const rawMessages = guildChatMessages[channel_id];
    if(!is_dm && guildChatMessages[channel_id]&& Array.isArray(rawMessages)) {
        let repliesList = new Set();
        
        if (rawMessages ) {
            messages_cache = {};
            for (const msg of rawMessages) {
                const foundReply = displayChatMessage(msg);
                if (foundReply) {
                    repliesList.add(msg.message_id);
                }
            }

        } else {
            console.error('rawMessages is not an array or is undefined');
        }
        fetchReplies(rawMessages,repliesList);
        return
    }
    let requestData = {
        channel_id: channel_id,
        is_dm : is_dm
    };
    if(isOnGuild) {
        requestData['guild_id'] = currentGuildId;
    }
    hasJustFetchedMessages = setTimeout(() => {
        hasJustFetchedMessages = null;
    }, 1000);
    socket.emit('get_history',requestData);

}

function createScrollButton()
{
    let scrollButton = getId('scroll-to-bottom');
    chatContainer.addEventListener('scroll', function() {
        let threshold = window.innerHeight;
        let hiddenContent = chatContainer.scrollHeight - (chatContainer.scrollTop + chatContainer.clientHeight);
        if (hiddenContent > threshold) {
            scrollButton.style.display = 'flex'; 
        } else {
            scrollButton.style.display = 'none';
        }
    });
    scrollButton.addEventListener('click', function() {
        scrollButton.style.display = 'none';
        scrollToBottom();
    });
}
function readCurrentMessages() {
    if (!currentChannelId ) { return; }
    //const lasttime = lastMessageDateTime;   'last_time' : lasttime,
    socket.emit('read_message',{'channel_id' : currentChannelId,'guild_id' : currentGuildId});
    getId('newMessagesBar').style.display = 'none';
}
function truncateString(str, maxLength) {
    if (str.length <= maxLength) {
        return str; 
    }
    return str.slice(0, maxLength) + '...'; 
}
function createNowDate() {
    let date = new Date();
    let year = date.getUTCFullYear();
    let month = String(date.getUTCMonth() + 1).padStart(2, '0'); 
    let day = String(date.getUTCDate()).padStart(2, '0');
    let hours = String(date.getUTCHours()).padStart(2, '0');
    let minutes = String(date.getUTCMinutes()).padStart(2, '0');
    let seconds = String(date.getUTCSeconds()).padStart(2, '0');
    let milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
    let microseconds = "534260"; 
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}${microseconds}+00:00`;

}

function createRandomId(length = 19) {
    const digits = '0123456789';
    let result = '';
    const digitsLength = digits.length;
    for (let i = 0; i < length; i++) {
      result += digits.charAt(Math.floor(Math.random() * digitsLength));
    }
    return result;
  }
  
function displayCannotSendMessage(failedMessageContent) {
    if(!isOnDm) { return }
    const failedId = createRandomId();
    const failedMessage = {
        message_id: failedId,
        user_id : currentUserId,
        content : failedMessageContent,
        channel_id : currentDmId,
        date : createNowDate(),
        addToTop: false

    }
    userInput.value = '';
    displayChatMessage(failedMessage);
    const failedMsg = getId(failedId);
    if(failedMsg) {
        const foundMsgContent = failedMsg.querySelector('#message-content-element')
        if (foundMsgContent) {
            foundMsgContent.classList.add('failed');
        }
    }


    const textToSend = 'Mesajın iletilemedi. Bunun nedeni alıcıyla herhangi bir sunucu paylaşmıyor olman veya alıcının sadece arkadaşlarından direkt mesaj kabul ediyor olması olabilir.';
    const cannotSendMsg = {
        message_id: createRandomId(),
        user_id: CLYDE_ID,
        content: textToSend,
        channel_id: currentDmId,
        date: createNowDate(),
        last_edited: '',
        attachment_urls: '',
        addToTop: false,
        reply_to_id: '',
        reaction_emojis_ids: '',
        replyOf: '',
        isBot : true,
        willDisplayProfile: true
    };
    
    displayChatMessage(cannotSendMsg);
    scrollToBottom();
}

function displayStartMessage() {

    if(!isOnDm) {
        let isGuildBorn = false;
        if (currentGuildData && currentGuildData[currentGuildId]) {
            const rootChan = currentGuildData[currentGuildId].root_channel;
            if (rootChan && currentChannelId == rootChan) {
                isGuildBorn = true;
            }
        }
        if(chatContent.querySelector('.startmessage') || chatContent.querySelector('#guildBornTitle')) { return; }
        const message = createEl('div',{className:'startmessage'});
        const titleToWrite = isGuildBorn ? `${currentGuildName}` : `#${currentChannelName} kanalına hoş geldin!`;
        const msgtitle = createEl('h1',{id:isGuildBorn ? 'guildBornTitle' : 'msgTitle',textContent:titleToWrite});
        const startChannelText = `#${currentChannelName} kanalının doğuşu!`;
        const startGuildText =  `Bu, sunucunun başlangıcıdır.`;
        const textToWrite = isGuildBorn  ? startGuildText : startChannelText; 
        const channelicon = createEl('div',{className:'channelIcon'});
        const channelHTML = `<svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="42" height="42" fill="rgb(255, 255, 255)" viewBox="0 0 24 24"><path fill="var(--white)" fill-rule="evenodd" d="M10.99 3.16A1 1 0 1 0 9 2.84L8.15 8H4a1 1 0 0 0 0 2h3.82l-.67 4H3a1 1 0 1 0 0 2h3.82l-.8 4.84a1 1 0 0 0 1.97.32L8.85 16h4.97l-.8 4.84a1 1 0 0 0 1.97.32l.86-5.16H20a1 1 0 1 0 0-2h-3.82l.67-4H21a1 1 0 1 0 0-2h-3.82l.8-4.84a1 1 0 1 0-1.97-.32L15.15 8h-4.97l.8-4.84ZM14.15 14l.67-4H9.85l-.67 4h4.97Z" clip-rule="evenodd" class=""></path></svg>`
        channelicon.innerHTML = channelHTML;
        const msgdescription = createEl('div',{id:isGuildBorn ? 'guildBornDescription' : 'msgDescription',textContent:textToWrite});
        
    
        if(!isGuildBorn)  {
            message.appendChild(channelicon);
            message.appendChild(msgtitle);
            msgtitle.appendChild(msgdescription);
        } else {
            const guildBornParent = createEl('div',{id : 'guildBornTitle-wrapper'});
            guildBornParent.appendChild(msgtitle);
            const guildBornFinishText = createEl('p',{id : 'guildBornTitle',textContent : 'klanına hoşgeldin!'});
            guildBornParent.appendChild(guildBornFinishText);
            guildBornParent.appendChild(msgdescription);
            message.appendChild(guildBornParent);
        }
        chatContent.insertBefore(message, chatContent.firstChild); 
        isLastSendMessageStart = true;
        
    } else {
        if(chatContent.querySelector('.startmessage')) { return; }
        const message = createEl('div',{className:'startmessage'});
        const titleToWrite = getUserNick(currentDmId);
        const msgtitle = createEl('h1',{id:'msgTitle',textContent:titleToWrite});
        const startChannelText = `Bu ${getUserNick(currentDmId)} kullanıcısıyla olan direkt mesaj geçmişinin başlangıcıdır.`;
        const profileImg = createEl('img',{className:'channelIcon'});
        setProfilePic(profileImg,currentDmId);
        const msgdescription = createEl('div',{id:'msgDescription',textContent:startChannelText});
        
    

        message.appendChild(profileImg);
        message.appendChild(msgtitle);
        msgtitle.appendChild(msgdescription);
        
        chatContent.insertBefore(message, chatContent.firstChild); 
        isLastSendMessageStart = true;
    }
}

function appendEmbedToMessage(messageElement, url , data) {
    const embedContainer = createEl('div',{className:'embed-container'});
    const siteName = data.siteName;
    if(siteName) {
        const headerElement = createEl('p', {textContent : siteName});
        embedContainer.appendChild(headerElement);
    }
    const titleElement = createEl('a', {textContent: data.title,className: 'url-link',href: url,target: '_blank'});
    
    const descriptionElement = createEl('p', {textContent : data.description});

    embedContainer.appendChild(titleElement);
    embedContainer.appendChild(descriptionElement);
    messageElement.appendChild(embedContainer);

}

const previewsCache = new Map();
const pendingRequests = new Map();

async function displayWebPreview(messageElement, url) {
    try {
        if (previewsCache.has(url)) {
            const cachedData = previewsCache.get(url);
            appendEmbedToMessage(messageElement,url, cachedData);
            return;
        }
        if (pendingRequests.has(url)) {
            const pendingPromise = pendingRequests.get(url);
            const cachedData = await pendingPromise;
            appendEmbedToMessage(messageElement,url, cachedData);
            return;
        }

        const requestPromise = (async () => {
            try {
                const response = await fetch(`https://liventcord-link-worker.efekantunc0.workers.dev/?url=${encodeURIComponent(url)}`);
                const data = await response.json();
                if (!data.title && !data.description) {
                    console.log('No metadata found.');
                    return null; 
                }
                previewsCache.set(url, data);
                return data;
            } catch (error) {
                console.error('Error fetching web preview:', error);
                return null; 
            }
        })();

        pendingRequests.set(url, requestPromise);
        const data = await requestPromise;
        pendingRequests.delete(url);
        if (data) {
            appendEmbedToMessage(messageElement,url, data);
        }
    } catch (error) {
        console.error('Error displaying web preview:', error);
    }
}




  
function handleHistoryResponse(data) {
    if (isChangingPage)  { return; }
    isLastSendMessageStart = false;
    chatContent.innerHTML = chatContentInitHtml;
    messages_cache = {}
    const firstMessageDateOnChannel = new Date(data.oldest_message_date);
    if (data && data.history && data.history.length > 0) {
        let messages = data.history;
        if (!guildChatMessages[data.channel_id]) {
            guildChatMessages[data.channel_id] = [];
        }
        messages.sort((a, b) => new Date(a.date) - new Date(b.date));
        try {
            console.log(typeof(guildChatMessages[data.channel_id]))
            guildChatMessages[data.channel_id].push(...messages);
        } catch (error) {
            console.error(`Failed to push messages for channel ${data.channel_id}:`, error);
        }
        

        let oldestMessageDate = new Date(messages[0].date);
        if (oldestMessageDate.getTime() === firstMessageDateOnChannel.getTime()) {
            displayStartMessage();
        }
        let repliesList = new Set();
        setTimeout(() => {
            for (const msg of messages) {
                const foundReply = displayChatMessage(msg);
                if (foundReply) {
                    repliesList.add(msg.message_id);
                    unknownReplies.pop(msg.message_id);
                }
            }
        }, 5);
        fetchReplies(messages,repliesList);
        setTimeout(() => {
            scrollToBottom();
            setTimeout(() => {
                scrollToBottom();
            }, 20);
        }, 10);
    } else {
        displayStartMessage();
    }
}
let messageDates = {};

let replyIdToGo = "";
function fetchReplies(messages, repliesList=null,goToOld=false) {
    if(!repliesList) { repliesList = new Set()}
    if(goToOld) {
        const message_id = messages;
        const existingDate = messageDates[message_id];
        if(existingDate) { 
            if(existingDate > currentLastDate) {
                replyIdToGo = message_id;
                GetOldMessages(existingDate,message_id);
            }

            return 
        }
        const data = {
            'message_id' : message_id,
            'guild_id' : currentGuildId, 
            'channel_id' : currentChannelId
        }
        socket.emit('get_message_date',data);
        return;
    }
    const messagesArray = Array.isArray(messages) ? messages : [messages];

    const replyIds = messagesArray
        .filter(msg => !repliesList.has(msg.message_id) && !reply_cache[msg.message_id])
        .filter(msg => msg.reply_to_id !== undefined && msg.reply_to_id !== null && msg.reply_to_id !== '')
        .map(msg => msg.reply_to_id);

    if (replyIds.length > 0) {
        const data = {
            ids: replyIds,
            guild_id: currentGuildId,
            channel_id: currentChannelId
        };
        socket.emit('get_bulk_reply', data);
    }
}



function pad(number, length) {
    let str = String(number);
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}

function formatDate(date) {
    const year = date.getUTCFullYear();
    const month = pad(date.getUTCMonth() + 1, 2); 
    const day = pad(date.getUTCDate(), 2);
    const hours = pad(date.getUTCHours(), 2);
    const minutes = pad(date.getUTCMinutes(), 2);
    const seconds = pad(date.getUTCSeconds(), 2);
    const milliseconds = pad(date.getUTCMilliseconds(), 3);
    const microseconds = pad(date.getUTCMilliseconds() * 1000, 6);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${microseconds}+00:00`;
}
function getMessage(top = true) {
    const messages = Array.from(chatContent.children);
    const filteredMessages = messages.filter(message => message.classList.contains('message'));


    if (filteredMessages.length === 0) return null;

    if (top) {
        return filteredMessages.reduce((topmost, current) => 
            current.offsetTop < topmost.offsetTop ? current : topmost, 
            filteredMessages[0]
        );
    } else {
        return filteredMessages[filteredMessages.length - 1];
    }
}


function getMessageDate(top=true) {
    const messages = chatContent.children;
    if (messages.length === 0) return null;

    let targetElement = getMessage(top);
    if (targetElement) {
        const dateGathered = targetElement.getAttribute('data-date');
        const parsedDate = new Date(dateGathered);
        const formattedDate = formatDate(parsedDate);
        return formattedDate;
    } else {
        return null;
    }
}

function updateChatWidth() {
    if (getId('user-list').style.display == 'none') {
        getId('user-input').classList.add('user-list-hidden');
        getId('gifbtn').classList.add('gifbtn-user-list-hidden');
        getId('emojibtn').classList.add('emojibtn-user-list-hidden');
    } else {
        getId('user-input').classList.remove('user-list-hidden');
        getId('gifbtn').classList.remove('gifbtn-user-list-hidden');
        getId('emojibtn').classList.remove('emojibtn-user-list-hidden');
    }
}
function handleOldMessagesResponse(data) {
    const history = data.history; 
    if(!history && !Array.isArray(history)) {
        console.error('History is not in the expected format:', data);
        return;
    }
    if(history.length == 0) { isReachedChannelEnd = true; return; }

    let messages = history.map(msg => ({
        message_id : msg.message_id,
        user_id: msg.user_id,
        content: msg.content,
        channel_id: msg.channel_id !== undefined ? msg.channel_id : null,
        date: msg.date,
        last_edited: msg.last_edited,
        attachment_urls: msg.attachment_urls,
        addToTop: false,
        reply_to_id: msg.reply_to_id,
        isBot: msg.is_bot,
        reaction_emojis_ids: msg.reaction_emojis_ids
    }));

    if(!Array.isArray(messages) || messages.length < 1) { displayStartMessage(); return; } 

    let repliesList = new Set();
    for (const msg of messages) {
        let willDisplayProfile = true;
        const foundReply =  displayChatMessage({
            ...msg,
            addToTop: true,
            replyOf: data.message_id,
            willDisplayProfile : willDisplayProfile
        });
        
        if (foundReply) {
            repliesList.add(msg.message_id);
        }
    };

    fetchReplies(messages,repliesList);
    const oldestMessageDateOnChannel = new Date(data.oldest_message_date);
    if(isNaN(oldestMessageDateOnChannel.getTime())) {
        console.error('Invalid oldest message date from data.');
    }
    messages.sort((a, b) => new Date(a.date) - new Date(b.date));
    const firstMessageDate = new Date(messages[0].date);
    if (!isNaN(firstMessageDate.getTime())) {
        if (firstMessageDate.getTime() === oldestMessageDateOnChannel.getTime()) {
            displayStartMessage();
        }
    } else {
        console.error('Invalid date for the first message.');
    }

}

let hasJustFetchedMessages;
function GetOldMessagesOnScroll() {
    if(isReachedChannelEnd || isOnMe) { return; }
    if(hasJustFetchedMessages) { return; }
    const oldestDate = getMessageDate();
    if (!oldestDate) return;
    if(oldestDate == '1970-01-01 00:00:00.000000+00:00') { return; }
    GetOldMessages(oldestDate);
}

function GetOldMessages(date,message_id=null) {
    let data = {
        date: date.toString(),
        is_dm : isOnDm
    }
    if(message_id) {
        data['message_id'] = message_id;
    }

    data['channel_id'] = isOnDm ? currentDmId : currentChannelId;
    if(isOnGuild) {
        data['guild_id'] = currentGuildId;
    }
    socket.emit('get_old_messages',data);
    hasJustFetchedMessages = setTimeout(() => {
        hasJustFetchedMessages = null;
    }, 1000);
}

function updateUserList(users) {
    if(isOnMe) { console.log("Got users while on me page.");  return; }
    if(isUpdatingUsers) {  console.warn("Already updating users!");  return; }
    isUpdatingUsers = true;

    const usersArray = Object.values(users);
    userList.innerHTML = '';
    const tableWrapper = createEl('div',{className:'user-table-wrapper'});
    const table = createEl('table',{className:'user-table'});
    const tbody = createEl('tbody');

    const onlineUsers = usersArray.filter(user => user.is_online === true);
    const offlineUsers = usersArray.filter(user => user.is_online !== true);
    if (onlineUsers.length > 0) {
        renderTitle(`ÇEVRİM İÇİ — ${onlineUsers.length}`, tbody);
        renderUsers(onlineUsers, tbody, true); 
    }
    if (offlineUsers.length > 0) {
        renderTitle(`ÇEVRİM DIŞI — ${offlineUsers.length}`, tbody);
        renderUsers(offlineUsers, tbody, false); 
    }
    table.appendChild(tbody);
    tableWrapper.appendChild(table);
    userList.appendChild(tableWrapper);
    isUpdatingUsers = false;
}


function renderTitle(titleText, container, headingLevel = 1) {
    const titleElement = createEl(`h${headingLevel}`);
    titleElement.innerText = titleText;
    titleElement.style.fontSize = '12px';
    titleElement.style.color = 'rgb(148, 155, 153)';
    container.appendChild(titleElement);
}


const crownEmojibase64 = `data:image/png;base64,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`;

function isAuthor(user_id){
    return guildAuthorIds[currentGuildId] == user_id 
}
function renderUsers(users, tbody, isOnline) {
    for (const userData of users) {
        const isUserOnline = userData.is_online === true;

        if (isUserOnline === isOnline) {
            const profileContainer = createEl('div', { className: 'profile-container' , id:userData.user_id});
            if(isUserOnline) {
                profileContainer.classList.add('activeprofile');
            }
            const userNameDiv = createEl('span', { textContent: userData.name, className: "profileName" });
            userNameDiv.style.color = 'white';
            const profileImg = createEl('img', { className: 'profile-pic'});
            profileImg.width = '30px';
            profileImg.height = '30px';
            profileImg.style.pointerEvents = 'none';
            profileImg.dataset.user_id = userData.user_id;
            const bubble = createBubble(isUserOnline);
            profileContainer.appendChild(profileImg);
            profileContainer.appendChild(userNameDiv); 

            if(isOnGuild) {
                if(isAuthor(userData.user_id)) {
                    const crownEmoji = createEl('img', { src: crownEmojibase64, id: 'crown-symbol' });
                    userNameDiv.appendChild(crownEmoji);
                }

            }
            profileImg.addEventListener('mouseover', function() {
                this.style.borderRadius = '0px';
                bubble.style.opacity = 0;
            });
            profileImg.addEventListener('mouseout', function() {
                this.style.borderRadius = '25px';
                if(isUserOnline) { bubble.style.opacity = 1; }
            });
            profileContainer.addEventListener('mouseenter', function() {
                profileContainer.style.backgroundColor = 'rgb(53, 55, 60)';
            });
            profileContainer.addEventListener('mouseleave', function() {
                profileContainer.style.backgroundColor = 'initial'; 
            });

            appendToProfileContextList(userData,userData.user_id)
            setProfilePic(profileImg,userData.user_id);

            profileContainer.appendChild(bubble);
            tbody.appendChild(profileContainer);
            

        }
    }
}



function createBubble(isOnline,isProfileBubble) {
    const classn = isProfileBubble ? 'profile-bubble' : 'status-bubble';
    const bubble = createEl('span',{className:classn});
    if (isOnline) {
        bubble.style.backgroundColor = '#23a55a'; 
    } else {
        bubble.style.opacity = 0;
    }

    return bubble;
}


function removeLastProfileImageAndReplaceWithSmallDateElement() {
    const messages = chatContent.children;


    for (let i = 1; i < messages.length; i++) {
        const currentMessage = messages[i];
        currentMessage.parentNode.querySelector('.profile-pic').remove();
        currentMessage.parentNode.querySelector('.author-and-date').remove();
        currentMessage.classList.remove('onsmallprofile');


        return;
    }
}

const deletedUser = 'Deleted User';
let lastTopSenderId = null;
function getUserNick(user_id) { 
    if(user_id && currentUserId && currentUserId == user_id) {
        return currentUserName;
    }
    return user_id in userNames ? userNames[user_id].nick : deletedUser;
}
function getUserDiscriminator(user_id) { 
    return user_id in userNames ? userNames[user_id].discriminator : '0000';
}
function scrollToElement(scrollContainer, targetChild) {
    if (!(scrollContainer instanceof HTMLElement) || !(targetChild instanceof HTMLElement)) {
        console.error('Invalid arguments: Both arguments must be valid HTML elements.');
        return;
    }
    const targetRect = targetChild.getBoundingClientRect();
    const containerRect = scrollContainer.getBoundingClientRect();
    const targetCenterY = targetRect.top + targetRect.height / 2;
    const containerCenterY = containerRect.top + containerRect.height / 2;
    const scrollTop = scrollContainer.scrollTop + (targetCenterY - containerCenterY);
    scrollContainer.scrollTo({
        top: scrollTop,
        left: scrollContainer.scrollLeft,
        behavior: 'smooth' 
    });

}

function scrollToMessage(messageToScroll) {
    scrollToElement(chatContainer,messageToScroll);
    messageToScroll.style.transition = 'background-color 0.5s ease-in-out;';
    setTimeout(() => {
        messageToScroll.classList.remove('blink');
        messageToScroll.classList.add('blink');
        setTimeout(() => {
            messageToScroll.classList.remove('blink');
            messageToScroll.style.transition = '';
        }, 2000); 
    }, 100); 
}
function createReplyBar(newMessage,message_id,user_id,content,attachment_urls) {
    if(newMessage.querySelector('.replyBar')) { return; }
    const smallDate = newMessage.querySelector('.small-date-element');
    if(smallDate)  {
        smallDate.remove();
    }

    const replyBar = createEl('div',{className:'replyBar'});
    newMessage.appendChild(replyBar);
    newMessage.classList.add('replyMessage');
    const messageContentElement = newMessage.querySelector('#message-content-element')


    const nick = getUserNick(user_id);
    replyBar.style.height = '100px';
    const replyAvatar = createEl('img', {className : 'profile-pic', id : user_id});
    replyAvatar.classList.add('reply-avatar');
    replyAvatar.style.width = '15px';
    replyAvatar.style.height = '15px';

    setProfilePic(replyAvatar,user_id);
    const replyNick = createEl('span',{textContent:nick,className:'reply-nick'});
    const textToWrite = content ? content : attachment_urls ? attachment_urls : 'Eki görüntülemek için tıkla';
    const replyContent = createEl('span',{className:'replyContent', textContent:textToWrite})

    
    replyContent.onclick = () => {
        const originalMsg = getId(message_id);
        if(originalMsg) {
            scrollToMessage(originalMsg);
        } else {
            fetchReplies(newMessage.dataset.reply_to_id, null, goToOld=true);
        }
    }
    replyBar.appendChild(replyAvatar);
    replyBar.appendChild(replyNick);
    replyBar.appendChild(replyContent);
    
}
function createDateBar(currentDate) {
    const formattedDate = new Date(currentDate).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    const datebar = createEl('span',{className:'dateBar', textContent:formattedDate});
    chatContent.appendChild(datebar);
}
let isScrolling = false;
let bottomestChatDateStr;
let lastMessageDate = null; 

function displayWelcomeMessage(userName,date) {
    const newMessage = createEl('div',{className : 'message'});
    const messageContentElement = createEl('div', {id:'message-content-element'});
    const authorAndDate = createEl('div');
    authorAndDate.classList.add('author-and-date');
    const nickElement = createEl('span');
    nickElement.textContent = userName;
    nickElement.classList.add('nick-element');
    authorAndDate.appendChild(nickElement);
    const dateElement = createEl('span');
    dateElement.textContent = getFormattedDate(new Date(date));
    dateElement.classList.add('date-element');
    authorAndDate.appendChild(dateElement);

    newMessage.appendChild(authorAndDate);
    newMessage.appendChild(messageContentElement);

    
    chatContent.appendChild(newMessage);
    console.log(newMessage.parentNode);

    

}


function displayChatMessage(data) {
    if (!data) return;
    let { message_id,user_id, content, channel_id, date, last_edited, attachment_urls, addToTop, reply_to_id, reaction_emojis_ids,isBot, replyOf, willDisplayProfile } = data;
    if(messages_cache[message_id])  {
        console.log("Skipping adding message:", content);
        return;
    }
    if (!channel_id || !date ) {return; }
    if (!attachment_urls && content == ''){ return; }
    const nick = getUserNick(user_id);
    const newMessage = createEl('div',{className : 'message'});
    const messageContentElement = createEl('p', {id:'message-content-element'});
    let isCreatedProfile = false;
    if (addToTop) {
        if(willDisplayProfile) {
            isCreatedProfile = true;
            createProfileImageChat(newMessage, messageContentElement, nick, user_id, date, isBot);
        } else {
            createNonProfileImage(newMessage, date);
        }
    } else {
        const currentDate = new Date(date).setHours(0, 0, 0, 0); 
        if (lastMessageDate === null || lastMessageDate !== currentDate) {
            createDateBar(currentDate);
            lastMessageDate = currentDate;
        }
        let difference = new Date(bottomestChatDateStr).getTime() - new Date(date).getTime();
        difference = Math.abs(difference) / 1000;
        let isTimeGap = false;
        if (bottomestChatDateStr && difference > 300) {
            isTimeGap = true;
        }
        
        if(!lastSenderID || isTimeGap || reply_to_id) {
            isCreatedProfile = true;
            createProfileImageChat(newMessage, messageContentElement, nick, user_id, date, isBot);
        }
        else {
            if (lastSenderID != user_id || isTimeGap) {
                isCreatedProfile = true;
                createProfileImageChat(newMessage, messageContentElement, nick, user_id, date, isBot);
            } else {
                createNonProfileImage(newMessage, date);
            }
        }
        bottomestChatDateStr = date;
    }
    let formattedMessage = replaceCustomEmojis(content);
    if (isURL(content)) {formattedMessage = '';  }
    messageContentElement.style.position = 'relative';
    messageContentElement.style.wordBreak = 'break-all';
    newMessage.id = message_id;
    newMessage.dataset.user_id =  user_id;
    newMessage.dataset.date =  date;
    newMessage.dataset.content =  content;
    newMessage.dataset.attachment_urls = attachment_urls;
    newMessage.dataset.reply_to_id = reply_to_id;
    newMessage.dataset.message_id = message_id;
    messageContentElement.dataset.content_observe = formattedMessage;
    observer.observe(messageContentElement);
    newMessage.appendChild(messageContentElement);
    createMediaElement(content, messageContentElement,newMessage, attachment_urls);
    if(currentLastDate) {
        if(date < currentLastDate) {
            date = currentLastDate;
        }
    } else {
        currentLastDate = date;
    }
    messages_cache[message_id] = newMessage;
    messages_raw_cache[message_id] = data;
    if (!addToTop) { 
        lastSenderID = user_id;
    } else {
        lastTopSenderId = user_id;
    }
    if(user_id != currentUserId) {
        createMsgOptionButton(newMessage,true);
    }
    createOptions3Button(newMessage,message_id,user_id);
    if(isLastSendMessageStart) {isLastSendMessageStart = false; }
    if (addToTop) {
        chatContent.insertBefore(newMessage, chatContent.firstChild);
        chatContainer.scrollTop = chatContainer.scrollTop + newMessage.clientHeight;
    } else {
        chatContent.appendChild(newMessage);
        const previousSibling = newMessage.previousElementSibling
        if(previousSibling) {
            const previousMsgContent = previousSibling.querySelector('#message-content-element');
            if (isCreatedProfile && previousMsgContent && previousMsgContent.classList.contains('onsmallprofile')) {
                newMessage.classList.add('profile-after-profile');
            }

        }
    }

    if(user_id == CLYDE_ID) {
        const youCanSeeText = createEl('p',{textContent : 'Bunu sadece sen görebilirsin.'});
        youCanSeeText.style.fontSize = '12px';
        youCanSeeText.style.color = 'rgb(148, 155, 164)';

        const parentElement = createEl('div',{display:'flex', flexDirection: 'column',zIndex: 1});
        parentElement.style.height = '100%';

        parentElement.appendChild(messageContentElement);

        parentElement.appendChild(youCanSeeText)
        newMessage.appendChild(parentElement);
    }



    if(date && newMessage.parentNode.className != 'startmessage') {
        lastMessageDateTime = formatDate(new Date(date));
    }
    if(replyOf == message_id) {
        setTimeout(() => {
            scrollToMessage(newMessage);
        }, 0);
    }
    if(reply_to_id) {
        const foundReply = getId(reply_to_id);
        if(foundReply) {
            createReplyBar(newMessage, foundReply.dataset.message_id,foundReply.dataset.user_id,foundReply.dataset.content,foundReply.dataset.attachment_urls);
        } 
        else {
            unknownReplies.push(data);    
        }
        return foundReply;
    }
    
}
let unknownReplies = [];

function isURL(str) {
    const urlPattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    return urlPattern.test(str);
}

const profileCache = {};
const guildImageCache = {};
const failedProfiles = new Set();
const failedGuilds = new Set();
const requestInProgress = {};
const bytesOf404 = 'WwogICI0MDQiLAogIDQwNApdCg==';
const base64Of404 = 'data:application/json;base64,WwogICI0MDQiLAogIDQwNApdCg==';
const clydeSrc  = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfIAAAHyCAIAAACf89uHAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAAFzUkdCAK7OHOkAAIjVSURBVHja7NRBCQAwDMDAypyB+YcpmI0SDk5AXplzHwAZszMLAFsHwNYBWmwdIMXWAVJsHSDF1gFSbB0gxdYBUmwdIMXWAVJsHSDF1gFSbB0gxdYBUmwdIMXWAVJsHSDF1gFSbB0gxdYBUmwdIMXWAVJsHSDF1gFSbB0gxdYBUmwdIMXWAVJsHSDF1gFSbB0gxdYBUmwdIMXWAVJsHSDF1gFSbB0gxdYBUmwdIMXWAVJsHSDF1gFSbB0gxdYBUmwdIMXWAVJsHSDF1gFSbB0gxdYBUmwdIMXWAVJsHSDF1gFSbB0gxdYBUmwdIMXWAVJsHSDF1gFSbB0gxdYBUmwdIMXWAVJsHSDF1gFSbB0gxdYBUmwdIMXWAVJsHSDF1gFSbB0gxdYBUmwdIMXWAVJsHSDF1gFSbB0gxdYBUmwdIMXWAVJsHT57Z/4U5ZHG8f9wk/VCEBQRURiJ0QiKmigKgjcqymE2Wc+Ka1JrAC8ERDGC8QBFQCOayrrZJKugLsccDG/v87x9TXfzQmrXmGHyVH2qa+al/EGm6sO3vv10D0GkFKR1giCIlIK0ThAEkVKQ1gmCIFIK0jpBEERKQVonCIJIKUjrBEEQKQVpnSAIIqUgrRMEQaQUpHWCIIiUgrROEASRUpDWCYIgUgrSOkEQREpBWicIgkgpSOsE8Z+MVSNZa0ezS8aWV4RX7A2HDkUKj0Y/+iIGlFyIb7wY33rDA0q/QSp7GbATeMh2+ex+yPb0sZ3dXnmXt6PL29ocBzZ9GVt/KramJlKwM5yzaSxz1Uhy/t+J1IO0TvxRAHcvLhnLKQ+vPBhZ9Xls9enYusZ4Sbu3+aa39R7jlHaz0h5ct/Ww7T2s7D5S/gDZ8YBVgNA56HQBar2P7ZHsHWB7+9n+AaTqEXLgETv4GKnsmCxriRd/Hl2xbZwsT5DWCeLXkhEayVw7mlMWzquKFHwW++DsRFGrt+GGt/E22+Sz+Q7y8R32CXAX2XIPEFrfprR+HylD0Onl9w2zC6e7Wu9n+xBD69zsh4DvWLXP4SdsR2t89YFw9rrR5Pw1ErMX0joxuwGDZ5eFc6si+SdioTMTa654RV2s+BYr7mLrb7EN37IN/gpOt7UOSK0baR2QWi+TlAM8sCeavVc4fTc3ez+yb0BQBRhO11Q/Rq0fecJqBlnNE7b94sTK7ePJ+eslZiOkdWLWADE8a/3Y0p3h3MPRFcdihZe9NTfZWp+POpF1XUgRgGbnWkdKlNY5XOt3tda3AKh15XRkO8CdLqI6JyCt94uojoiobpUwQu4Y1RHQOgfNXjvIKtvilNwJ0jqR4mSsGc2G/cbq6IrTE6FL3gc32GrON+xDH1vrnSB0wXqhddPs0umIcLqb1p1uHdFar3jgap2bXWsdS5h+q4QBVAmjtV4zyLWO1D1lJceiyflZELMI0jqRLKQXjGRuHl+yN5LzWSzv3GR+ixe6zlZ1sFX+WtjBQOvAFFrvlFoHeFTnaR0BoQNGYN8MiMAu07oye+KWKWBo3e7WEVfrooeRgX3A1Ppj1a0bWq8RWkdKz8WS8wMiZgukdeJ39vjivZHsv8SWn/dWtLOV11g+cJ0VXGPgdMBwutT6h4bWQegC3cBgWhdgVBfIBua22a3LBgZBoXPQ6RjYRatuaR3RaR1w0zrW67bWq9207lMLQgcGWf0zVv+UbSOzE6R1YraAKi8NL6mJ5ZyJ5zZ7y6+yvKsMhA4orReg1nENdbCQ0joATre1jqzVWkfElqnS+i0R1RGV0znC6WZaB7MjZreutA6ouXV3Ekal9X5rwFFNwsBqdOtGVMcVzX70KSuqjyTnJ0gkP6R14l2QsWl88ZFY9hfxnFa2rI3ltuEKTufkKa23s3xldj+qhxLSeqGtdYjqHOF0pHOKbr3E7daF1u20Xqq0rtM6Um6n9eBuHZ3OSxhER/VH7JC9ZYpCPyLSujB7vc/RZ6ym38sqpNl2grROJFkwX7QnknVsYsklL7uVLW1lOT7LriK5yukckdZ1YA8JpwuwgengWtdRHQnYMtVp3e7WLa3rMRjEnYQBjG4dqXzA0zqCTkfkJEwf2FyAUV2CTje6dTA7aB0wSpg6oXWkmAI7QVonksTmGbsjmafii6+wJS0MhA4s9clpQ5b55Gqzy6hupvUQx+nWdQNjbpmuQ7jQBevVGAzgC32jsV9qat09ZQpgTve1rpxuDDiquXV7wHGfMjtgaR1ArRvDMEAdoLT+lH36jO1qjyfnR0wkOaR14q3ZPH1XZNGpeFYzA6FzslsApXVkmaV1EdUByOlS69ctrSO6W08s1mFVWne6dXcSZhPibpn63Xq3NjsW61Za1926uWXaZ2yZ6m7dHYMRxTpgT8LUDvKVb5nqtF474CXnZ00kOaR14v8lfeN4RnVsUZOX2cyALMB3+hKgBQCz22k9t80sYewtUyetA1rrdg/jljDF+jiS3DJFfK070426W0eMEkZ06w+C0zrAGxhERnWf/dZBU4DPrVv1OiKcrrdMEQzsdECJIK0T75CCkYU7I+kn4xmX2SKgGddM6XS/gXG1ztFpPQ/N7uyXAsYkjDO0Hji3ror1qbp1wNgyBXQJ455FwlUOraPWewGpdXC6wEjrWuuJV309FoFdR3WOTOuIcLrW+qf+WrgrnKSfPpHEkNaJ/0no+6ILG730SwycDisInZOFgR2dnqXNPkO3nodY3TpSIKK6MeAIYFq3t0yRmbWubw4ITutK6+qqrx5wuqCi17k8AEsYRKd1xC7WD7pz60+sHgZBp0vQ7LRrSpDWiXcg9LR90bQGL+0iW3iJpfuYaR1w0nrrVGldTzfqEiY/eBKmEJ3uDjjKbl1SlHgi6Vup9dusxChhnAFHwJ2EQZxTpoF3wkizG0dMAXPA8TvjRFKNTOu1KqqbJcyWM3QuiSCtE7+l0Oc3eAsusrRLTGj9MsvwWcQxu3UUumhgYA1O6263bpq9sMPuYYLvhAm46gu4HTDg6FzMWwpO73a1jujjSA8trQeWMAcEUuuIdSeMaXZcdQmz7WvSOkFaJ34DFmwPz//am3+BgdMB7nREpHVARvUrTE3CaLNLrS+10rpbwugGxihhArt1COydU26Zmg2MDOz6+kaBcrqZ1gHjBsfASRid1l2tI9YpU6Ta1rpbwsi0/j072evdujcBXGyJWXzVGD15NnLibISvVXXhA/XhqvrwJxVjSOVYqHg0VEw7rn9ESOvEtKwenXc8Pu8Cm3eegdbnC62rtI6g05XWEatYR+RxJBA6rOB0J61fk2m9XUb1awlahyOmvIdRWr/pa92N6gFXfW1Ux5F0VIfVTOuIsWUq74RxjiO5JQwSNLSOoNatbt3V+qDUugzsLT+yV6+9V288vr5+47/VwBN4brwdlq+HxYr8+PPk4PeTt+5OAFdv4F+FE3+LAFV14s8A/QFIJUjrRCALKiPzznlzzzPQuu90XNNkCZOe2K03J0zC2MMwenQdc7ogeMARCbzqK3i6UdwcoAO7TuuwunPr0ukgdHWDYzdgzK2XAeh0vl/KcY8juQOOAVo3Ghit9VpJvZPWb/4EHldO59bWHh+WrtcqVzZ/5b/GF5PyheS19SP99p8/Tz55Fu+6G7vaEf2qIaq8X7RlNIduMpg9kNaJKUhbPTr3r/E559lchEd1AaZ11cAY9bqT1rnWrW69VWpd75e6NwcAptYRZ8vUHXAEoc9wHCl4v9T9Go1fmdb7pixh3Osb9ZbpYYG85yuohHnG+l+gtZXHkTda3LgqjISu0R4PtvkQPHnlqXVoGFZvaBieS4aR5z9N3u+b6LoT+7IhWnc8XFE1DsYn3ZPWiVnAgg3jc/7uzWliAHc6ljC8gVEljFGsO1pHoVu7pgKt9TbUeq6eW0fy9ei6NDsI3Z2E0ZcHANzp7p0wCJ5FmvFOmHtBd8IEfOOds2Xqal0X63a37l7MG5jWT//AElK5ErHrcSuDA5OANLh2t2V2LnGJJxj25Q6o58N8NV689EXPn6DuH060dUSPn4nUHg+T60nrRHIxvyLyfiP7cxPDqM7hTldaR2RaR4LTeot9f0AOEDy3jiitu3PruEIJEzAJ417Ma2+ZyhJGOz34Bsfgb0fSkzC903Tr7pfeud26oXX7Bkff7D3/lkX5G21wt2NRyLfekPzpkCl3/aNXgqHEkI6rlnXiyiX+Ujzh4EO+AuZrfPH8X5M90vU7qsbXbaHunrRO/B7M2xN9v4n5WkdkYDe1rrdMET3gqJ1ulDB6DEaXMOaWabuchLkWMAkDGJcHOFoPmG5EhNORmb8ayZ1bn+77qfVxpOAt02CtA+B0+751rfVz/2Da4GKVBIdxXFUAxyfo5QB9K/STlyZDiCtxXA2GtND9t4D6EaBegOjjrddR9B9ToietE++AuXui7zWi03Val8hJGKeEuWyPrqPWEblfiquhdXk3b/DcujG0bjjdx3C6TOuO1gO+oto8ZeqWMPr6xuC07myZuloHBqb8IlOjhDEmYZ6q40jI2R/YL8Lj6GKdtWHV6ApFB3B8qN3NH3I7S4PbSdxv0qW4pbv1Q/kPDXGbEperB+sL1Len3ipeAPjcgxeKnt6Jpubojv3jpHjSOvH2mbs7+l6D7/Qmn0bUOqZ1rnXASevp9tz6lJMw1iWO1papTuu6gYHV1TowjdY7p9G6HlqfWevdRgkDQrdPmfY6aR2YfhJm5m7dnltvfu79MuxsciLmJqcO41L6EqFvXGVaV3aWDxHlcatRGXKSu65ZUM1S5QppcNfjwLBQ+UtH68hLwc3bsf01YZqzJK0Tb83pf2pgqPX/snf2KhUDQRR+QhFBfA2fwN5CsBJstBa1EPwBxc6LCoK9CFcblXjD2giKysYdPJmTYdjEq+3CIUw2W38cTmZnjVsH2U0nDIJ1m637vvUT17d+qtm6SNw6/pqS6S6B4ZwvNq3/Fuu5gTCiXAjjT5lyKu/Q7UgruSuq89doeKxvjpvrChB/sZYcKKcZbz8FmnTldbA/Ni3HYcx/9sN0E+VRZFBuCR4Si7EiBWsRDLtXzScKqSOK2uxJKc3qehlwVrBe9A/NL73NJKbviwzWnVtHdyNksY6mdTcTRp7GqnN8o+9b7zllOspjXZTJ1kV+eACY/qdfpgNufeg4kr/0DljfGDdnD7EKMN0mDVdqK9MD9hDW4LiSHeZaRJpjESxmUA7QMznRV8pGK4C4WnI6dOvHIza0RRf0zy3QWeApurn92t57L+a9YL1oai0svs5uxWTVkzpMh8D0I8hl6yI2OObceiteemcG8/KUKQfzeqy38Tqb1s973XqX6Veub72vwdG6dTfqa9ljnSeScg2OxLrP1nfvm8unWAHlmqhAMOZMV4hy1OS4CJ9QK76ZtCjEk5TmUqj1NpgG6yd4pbAYLMTpxymuEOIQOe5q1cHxR4F7wXrRFJpb+xSmi8StmzaYQ/PXFGeRkny2zk4YiDNhdNSXDITpuPUk191IrPsQZjSUrSdlsE63boat+7tMh/vW2QwDpmeuqOZAmGy2vnPXXDyqPbdd5EAzKG9Mty9MWqK8pumGsAJw49W5bNQhwolTaYXUxs46iTU9uEF8xAqBTnzLfki2URMRivqbvbN7jauKovj/Z5uKqIiCD/VBRXxTEbEUiwiKGEuwglJTimIakdhYIba1FW3Spibt5Lv5aibfyWTMh0WK1XFv786sO6vbnZtQQSjkwOKw756bx/xYrLPPuaZz5+8luCesJ+2tx49l8QuZ/qgju8O6c+vxBsdAdn9zQPw6ErdM450wHFrf/aqveNn67liPW6b9PlsvFWIdn6geLv46kikcRwrDMO1lvTgvgxWprMOGM2PJ1LDeVMOh+2gFYkpO6+2icDZ9tELWg+MEPRGPArUQ3yExJ7KZroinNhHPPuUgXqlmL6BYM9ULwP2lBPeE9aRddOiMNHVqk8e6MT1iHdm66Sl3iWO46ivMrUesx2z9BcO6n1sPNwc8oFsPV30VHEfyl603QhgOrYds3RRDmDgJc2JCT0/rd7PasyTTVVkFyrHmBPeTKpvBg8dTP5HgjMj5V+wjWiHZnStH5BITlTiSKExOCHTX4QsgOAXWO45DFVeD4yiCZhdqp8+kDdWE9aQCq37QmK7OsDNexwxMUbZuQHenTGHVn7+sb/ToRyVtHdbOSbkwI1fm5Mai3FiS/kXpX8oKe+yel4tl+WpcPx/Td/v1revhYt4YrBdh/ZoyW49Y93PrjNdDsF48CQOmM1unW6dVb7mlp6a0s6xXFqW0InO/8vgPBGRTjMtZh2EVRiso7FcE4gQ3Rw9p1YFm1Filyn7ENx9RhBy8SkZzpULTc1zus+QsClBey3GP2ta12tp2cWuylmx7wnrSv9XUJsB6J7DOAUdk6zxi6o4j4bYvMP3lH7WlpN9MGLVXNuyKwd/uaLZuF7J1J1utY7K+dfgr6qwwja3KpbKcHNG3+x5sbp1fvItz65k81o+EEKYwWx+MM46w6h+O6slx7ZjRnxektCxzVW5pYu6Q96t4P27iyzDXmyFsoYhvFHDo5DVqCHPiPlTBa5wfN0D7GRV0HL6xmoqojfe9B0ddtRW6v+/tOcRHqlZHef1x1QqrG4/tZ/84nM4xJawnYQDm1d8PnDWgm+jWeRyJkzAmWvVsPfyDHr2qX4zoLwvbHAe7NRNgzRWIL9Im+K58zFWuytUF+WxEj/TSre8xtx7depxuNBUeR6JbN+FDpu8Pa8uYfjml58pybUmmKubEed2KD1WsJr7dWKG/XCVOHOJXE3c+/YwKJ1WwogCsC5x4tOooKLCb4+TWYeFSFBbRpMdEJUbk5DjAzSYIDtXcahw3VdZYZ0Wy7QnrSdBjx//MsH6w03TI75rGYZgnTPriZf10ECg3XpPmtNs04BCoHeq9tbnFC2lvLknHpDaXHNZN/2ESJrp1Yl2bh/TEqLZnWcqM9CxI/7LMVgHuhjaIb9R4dDucTMDrHXKcNQfG89rEfU7SnLjPxDNBMTPhIxiNg50MvvmrHyGPHI/yNpzs9h6cteF4e2WHNOfqCxAcHUIcRdap962TN1PanrCelG2WttaM6aYYrPOer2fP65vd+vW43l4DwSHGKVih2GShWCPBc4jnQGfTVtR4zBDfdVvaJvT4gB7r8zc4RreOT1RzDOa9AdMno9o2qR3TcmlWuhdkaGUb31vCo5u2wo/nwbetUBgkd7m5H02h1tkhuPGrh3UYG88Uwe1UOJ3CGv0YkUcxOcFKBQPuX66h9ryGCG7w2tdgdENgNwSU5++Q9fXOt9/fS4FMwvq+1iOw6hbCxLn1Z7r0gz69bsacmXijINmdT9cIa64oNKAc4k+B41uoCz8isbIhM1UpLcnA8s4qV43ay+u47JA7mVjxCKCT1yxc8E23jpdD5OJFPw6yZ0LfjSHm8vOFHvHoUGH+pP5orxHcJLuXhBQF4Oav8Q9B54KCe5soiHLUzFtMwDptOMG9gwj0CmpqpVIbnUiBTML6flU9WM/kJ2H06S79+Kb2zglzFcQmO0YroRmBbnKm2wHdFehTvGEcRRQPZPprsPgrqM0/2TFLYRFuqQ1OnIinPMT9sSDGJpDDNPc2ie+iWDzSnBJP8GwVNpmxFO1t4jU2q6aCZDzAPTjxAHS8GYIUMBoc9x48oJz4tjVvQlnT+kb2V44msies7z89+frdA510689d0FND2jtvmAbKsSpHWXw+HoEeOo7OyFXYjOzGysc9v8xJww4R7rZ6J96w1Uxa6LjzNRzppOC4TUzGw8C4z8RBbUoaK/sbfuiQNTv+SKfb1UQHBfqZaLT3TsnFioJ83POd+I75ODuYQcwzE5MBl5bcG3ATatCc+EaHiN9ucrXCZHWuv2fm/nqn+e7D+a+XsJ70/2L9tZ+0dVCmK/DddOiZ/mHv/H3kKKIg/D+TAs7ARMgRCAICQEICYSGBhMhICPDPACQQwhaBb71mfV4S47OXWTO9XTPfFEX77OzuZqRSq/r1pvvpqeb1zDQbAegWp1Sf+XhBMxWLTYYi4gdTvqNuK6YDdNhtcUo3JuMWsEjDLyX67lIEysHxyFIsMc87QSjfUpuDhg70eIyZyH6oi/iHFazbfZ+MyD09jzYcqZjz48hRbrG4P+HUCt/ZDuwG1rlK3ozDbrAOzUulrKq/+/6syb5gfV669M7jL797tnokHKcc63n6fDsQP8ITz8RFc0yC23ttN5IwzdawrnWAuIF+8Gquadir5Id1K0UmnrBmWMV7c06F70YgXrbAGo5zz5OjfNSpYkOic/sCJ6Ii1reYLljngIoVabRVyRBcfKci31NYWzXgMvVoEO25V3Irys+Z7AvWZ6Ge5p9+cXL/QVA7lFMrW4vIZdj2HTr1/Iay16vfwnQUiUpdtxXcFo4jz8fxwWuecFIUu43aqvjNe9bIwS17cXYPjB47cQzgdlhrhct2GmozPSZVwLcr5wtlyFJUHAWjicWjDeeUH8N0ie2A7E4eJbIBt592q3XZHtZq5tuzL1i/yOq/Jfbhx0+u3doZtTNUMT2PZ5sMkquuU0whcjDdkvFtHqkN32ZoThtu6coUzbzGNq7dA3eOrPUO8ZVOv/4DwSnaW7EYPZQJ5f17N2QsvewI7X1MJUX37VsJ74BO8TOeao7DKoci4Eb1FDnEJbXkwnExxmt8VEJiN0CvTJdcb7z9+Gz+NxesL3plmvft+bXbO+/N4TJbKgrNSVSM3RQFa6SKKUid8sRc5li4p/sGzcTiOlVROPYmXfJwXEWef9Jo+0qEwjAiFTJxw3fTY1CimYGW1oNNyfAtCd+q46Mlt2Jc4xwgDq/FYp1iQDb+AYiv1K51nm2q0rWQvU7Ki+BwXFvqMmyLul51e+ePOc7GLFi/UOppfvWbp6sHnTBdsG7ULiZmDRPfGLJyCE6HHkqss/KliOq1HmPklZNAc/X7NosC5bmLT2MeH2+LDwBFDx5xik79bSrxdbehYm241phIoWiV1MZ/sAn5pc2yShQRUbh+3Fckea1iem8Ad4i6SM1aKjy9XGc+zvrCuuis0+jHW0BHRxP/86+7uc2zL1i/CMqwBaDnuKEHKZJ7pgyhuUs/UK/NKoIXHSsK98eeKgJxv8MJzcnKkRjtnp7aCE5EDtB1as82i8ygPSh/SEXb/OgPHXcxnr04wSkGxxHgpvXGcATEZbRd54PNw+p1QnA68YxWJGBdxFzKMJ0CxzsZ1buhKJNYXw2+YDrYffA6PVVHAfrrt3ezuoO6YP18S+35ustnnkXJ8US8hlXanTjxdxg4XiVq15WiSD3RtNK+9TN6+vHptzfpvvsK2/8fUCETR5uQvV5cqwAdn/iB/tSLSe1fPgrfMDPOD0A5R4jEnN58GqdItOHEKSiScfPRnisfb6co7T4dA699O6qjkgLxKY6O7vcq5qtvn57Nv/CC9UX/ac//GRKSgePk4x6zFHBzRD8uj5LaAndy3H9sEJc6E+xujaaoEu+qjUmVMRxXRbweK5pF4ffiby3CawM6DThX8GMWJZJxO2KLYnjckS3Dmpl4bttj4wXcMF3jhpaJ6xQDuOE+RRGc3hwlvp3aOaYScXkbyjpl64La+g3brl+LVAHu7300l8GYBevnTGXw/Ou+PRev420qOYwIxAeD6MdZXYnyrb0Si7icBvzgqRjHtapSt7CbZtzCExenYvRp13/2eEvDM1GRzHuEkmMtZOitR6D57pTTbuHHW7E44m0qMYiS1+5N8NrBnd5gDdOD2qcph1WE+M4pjzJpOfJTSK2jLuoyornrtTdnEbIvWD8f6tvzKx88+fEm6bk97WT1TLxFcO+yS0QuHxynQj5OYi6vbTEg27UF3DLbSRSO7Cudkm3tHeViujyKS0BQPiPy4fYmpIbdGFNU4nSDLB/HgHUInnwvYrv2iUO8RCVv3g9im6wv8belK2Ti8i/UyoEeXXmCO5Uc9ziFLcWW7kXlp19mEbIvWD/r6oH+yecnq7VQLjEtDsebEEf2g7GzhukTcI9kj1ceInLzKt4tbmk4BNfKz8IQmsdHf7wNbz/npA6+81tuymFgNCYUR6GAOPUIVdzwHhWKgq8qzKgMvKY3b/bdPiQuDQPjqpetZI83SckT5ZXRBvGQZeJdAD15HVuntqIVtqFT4L47mF01n109OZv/9AXrs9Cly4+//+HZI3/LCqpZOTTH5BuyZAYQC9Y6ktdvhlh8+uZxFf/irYeqJNPjLj6C2q74AFBMIqq+4XvKZSWE8XQFQfBxrRzfj1MrqmQ4jhC8zqCcD/00Pt4WxuFOnFIrDKhQEbJJzL1iXuDGuKwY4+QpJlUiIn8ldS2CF6M1yY4Qp7vk+GjuVbPa1bXq9bcueBSzYP0s6vKVv/u8JXvtqORpAr2LdMVxH2/CguOF4NrGvfx427gYnR9v8y/fSzmAuO/Fz+jB+Y5EC9yYHFkJZG94JRZ1tPG1mL2M6vnG2pgfh+zO7j+L93FDGTFa0pGR2u/r37h15/rNqe6W9UbxMsXf/e33Y27bF+Gd+J18Kf7L3vnzNhEEUZxPEPEFItETid4UKYlp3BFTucKRQAoSSSgtEfcWMb2FhKAhdqgRJ2hogDQU/EkCTTBYwhAhUSA5FszdDnkZv1ufkQtOl7OeVrN7e4mb/PI0O7tr8i3eDLif3ZiMt+JNeqgeNKn71taR2tAcTwXf0irKD1VfNHj9ZpDOP/wc6xmUy7d0e8MDX/7kx28NeLsmBJofjObERdjGSffim1VNI0BczXtfZ7Ill0HEIkNqFuVSPDQHr71wh+C4EeOiiaSzauHKxx9taJZDyYaTTzfnYSF+GQG68yjYuNPaaLZW12rVpeuL5YqocH5eNDt7xunUdJ+ZmdPu5xQK807yK65Ul1dWa+v1xu1mq70VtDvBi1cfHJpRNg4oC+6Z4AlSXpuMimmny64IteHWQXAdBNkl2NdHEgxa97N8T16O9VTo2s2f9x7++tQbevfZ++25rT7E/vvwLaRQsCcIrpw9uE2qhIyGEk5T+Ss+zlAlM3UEiRRMPk5zLS5UgmNQBMRDSUlwuuaNHLrKU7UCQBuIY4QgjhbmeisEd0jt8uXKQrE0N3cuJHVaP/I/QL6hoF++qnD/1nqjdbct0H+30/cXqzDHnU/HBFOjgtgn+GvBN8AdjiupuzF+nAZBcwzufMzy2mmO9XQk0P0rnF7Qw4abpU5Q27SjaRPkVTybgIBsGHO+c5k3dnpc+Xfe8gOUq53nikN0MYiEuN3kObmAb644pBQKiYmPlc/dvW/B0+2mw3e5knJ2T0P8CwslcfqCe2H94yfbMYBGl5RAc5sWDwWgW1IPEBjEDyKZrmP6vkjibhg/6GTWsOdY/59Adwl0MuDWpKPsBOucZgRddeUaWxlLjirDIRUUohiRy1d4kVM9uK1aAcHR6lvmUbzUrUsLKcrHOvSvk3Ac0zSgzAkbcDuONczdvb548Hq9UV1aLl4sZY/g//Q5G7H+xkptsxO8fd+3KZfxGogclGHJLaMhPFKZrsG9kaDcAf2I7KKra9lcO82xngKg08URIr5BQvEN6UwAHUnwke34GtiuXd6MP26F8+bHzDiAHgWAuMizddMrPmXFENxdzknGHHe2jbZ8M2fymeP2Ojesah5pKLkUSX+HEC+edIhPQvlLi5XNdsAcB74jmoPOqlhA64uQSa2A3e4tCaLW6VCDz+g6PXuezRMF/rB3rsF2leUd31+ccXTawgc7U0RBPzgUHC91RkClTsfbB2lFC9IOgwpqW2lBq0iLXGwVAWsg8QqVW7HKRblUKeUupdwJVISEJCcnt3NIMGD7QQ3knL2T8dnr/Wf9zrOf82Yn4eScvfd63/nPO//3WTs4IzO//HnWs9YqWJ9X2SNFq9fpjqiUf+THz4yH0UOxW0Z7/Dgnx+1Q2+0ozBdCcI6Ijko/XsejD+M8rul9/09GeF4Hggvi3sRZcomBQn11s8vxb3Y5brcurfnQKmv31/6vOuDDx37E+O4nDqsdUqvogS5Nqqignf4U7JbsqO4KOzm9I5qjUQ7sBevzN+JiQE9QRvFRIPC9g+kqmjypieSzzq5IvgMeCb49TohLSuLgG1/ldJncaIqSdTgGZOPzyk8ixo/iS4HaoZeCeFHt6jX/Z0Mpp552tt0qLBzXmrv8fuGSy0L67kjiNUdT5p4nHZXK69gVsd1pYmPbNJl2Gfkbbx7Bp5MK1ucB6NWIS0rZvqMSp1Oc/l9kF7iR57iQ7W5smgkTh2qYyNieGUDMdMOpg3KOVBAEZ5dB2XqcWhGRwbeMn0jp1BE+90ll77v3OVMktzuBrbL28rLm1eIll8F0R3PReWYYB9y+qaI/QlGRXNDvopwf15p4WpUJ+4FwP4IjMQXrexnoz8w2rFJ59UlokYf+iXsbrdXV3Q7fcqMI03UJvmc+o2xXnQfTnuAUVfHNk8zA+CxAJ79nPwbEDs1DPO/3jkMfxrf1vG18bAfKS4t8fhedGUvuonOllLWtkrzo7PY2fBe7tXe1KQmaeyOmT3T3TtdI3auXjdwMe8H63gN6h8f0fU+cXjmAdp9XNsW5Q3+rU5XwVOesn1TWUYpz4rUPNJeAux677yre29Rx1xspUDvWJQheX+JIC0Uc5yn8+GVOS+U2uGIP+5RUPiDrmGM/8uDD44bp3jAuaiuDA/G6kUJFHnYnCeKdZKh4bajC+6rxUXvotGB9ryZ0kxn3pkMTXZf4dkM/weJg7YpIARyO91xSnRkVHZkTz06q+NAtlEdpnLyfxOhMRXXxmjyOGE1Ju4kjT9jTRq+ONr6y1p6iLPc8B3NVsf3yGUxXTofadMZd+lZRsKbBIs8lrkr6mZmOYT3pjHNG6sZpwfocTrk8P/kMj//EQUOJPE5nXLvq7u21BmLz2rumd/cfy3ctcg/0DLiBu7xnOia+UIU3IGZHyGE0+M6+U8WPGGLk4wc59Qe5ytuvbrBg/lelxzIc6xOfOGX5iufI6QK3IR6I00ghjwN66pjkQ0J3Etzvvm+kJh0L1udAZ523ZWxtB467+5ky8uy5GZUYxrUjKp7gPozTXcnJsT5hOpPBVeFIvW8kF8S1y2gP6tsipz9u7O7V2Pgvba7cXnVSgvnQrf1fdeADD48roYPygGao7Ug9SxhPO78JcJeRPjZCN04L1l+UTv3ibx56tM2wCh91k6nkqa3jdvY6niNCt++0mNJVk+oMqMj4MRXxHVLD6MyceBhGlHcVfhPnx6XNbpc4AmsZFV309qb3E25WVNP8y+csLm2WYV/WkLn19kfpjydG116jionaJtUz1JbRxItVJrtFGVMw37p0dD6JV7C+5230626aoq8SHvZBTLPomBQ+yxmBnn/HYfaZoO08fw/KMSa65HH6MOu3+zwepHomhkNqfuZ47cSXfbR35T6Nn2TZ3Jrm9jqqVlmjsuwv5gsWX5brn8S6PMFcBoLbLqmuYtjvvnd0+jAF63vadVljXZca07TCTflvb7oJcf8sfgQ6sKYO1oP4sZAdFAgeFX+Q+5JyvMolUI50VCNlBqNBuWM9bx6nY17T3GYT3/a2ks1Hdons/eR53ZE3M9neA61cPTp9mIL1PQnp4XsRGhWH4M4DdziuHwjfHtwq5u9hUpGoxH27CaxL8qBZiuCWPMRR+GqEo3PkO5dolLtv5MuQ1vmUxA033vUXf1n65o1YFyy+XMMqfaK35JI4Pl3tUKm0vjamCfyXF20ZTOwUrO/dt6L/fFkn9zIsKr4nrt+I3fwgJeveAB5oTkelJ4xjPNnjM/p5AW4MO8iW5zcugCPqlQRoGddIsaP/VrKkn0mVN5rbe24LzZu2brntUcXwSeI5YRwTgS7B7mCcn9B+/X+OyIsECtZ3VUsufn5yExwnbkvK4CGJ68gXf4RyK/a0xTmGN6vgudUpBYhjMo8IxTfTYiR86IzPkr4huGSeVA6sk+Ebb4HpHEvrvCz7i/z+B8dd7s5Q2x8x2p92RzSBSfuKsenBhE/B+l7R9659Qa1w2i8iuMO6lwO0ioHj+CDxWr0UKE9UB9yhPx7vdvr5Qpn4ID47V4PisArtFOHbhXQ087g5GfTMZo2clzdtlWVr//0PeHL5c+EOp3oyiKMrrg8cN8lQma52+S+MxHNJBev9m+k33zEdxlRyrXCJR4Gou+fvYbqoLQ+ppfx4eCT4c3C8W3EEzz0KFNWJcIfaZhS0VQfiydeGkK7fB/FdfMXz1b+0Zsshh5Qn+8tivfd9H8j2UkKXnISejqDc+XUTEejSpf8+CmOOBet9mP74sk7dLYk0n+2L+CoGCfEy7pEfGXk4rspuSuD2JvOe8QB0fCw6lIvgce7QRfKoCuXaK2NYt+65PRFa4nlZs66z/+lCx2sJT0VyKA9MnzagG9nXpR1Nm3567yi01wvWd3aDdNWajjgO1q0VI0Dv/ucjYh7X8/d5xQEVeP1cuEoMB8r4wG5a4d0/Il+/aMU1x9PuQ7qMBzpHkrjtZHPtJnuNoj0UWrrnZfVtst/3wLiDdde7YJ52p4RvRXIZ2yvJSBu4ZH4ExhwL1nfOdDe1Ehri8ajfuGEVyL4doJvXUcLHo/8AEMZDXFIlfDWCulQndx+oqVRGHlFxguybu6LNsnlbjfVnZLatsn7LqWW4paxdXYcd/k4Sd+yJC8oyHFVxV2ulbozJUD5D7a99c+jHHAvWM0wf7xiUa15nzPYQxpEL44R0pEuZPO4RL5rDdKcQz3O9cv+VTgVzGXFZNPdGe8bwrJDrmJvM4JOuv/GuY48ts+dl7UkrpmY6BE98nwTuMkA85PQN2oPaJjPX3TT0fZiC9Vn66avW0A13My34/LcjdjJlSGX7rr6xtt8sCp49fm3ZTKVEYRosMZWzg+9wJHqbr40JfPODyqiBXvotZb2YVswTy57rMhpYm4jqtvd47RtmpnLtdpQX5bm6YtXQjzkWrPfq8Sc7Oxs3xG9377rycMdEPde3bx4CuClL+Q5GA4WqyFChFd5vZhzDvlkVkE0wd830GdJxyddLA72sOVif+fuzUmB39zkxYFqeiiK82C3p6lqK8p89c7jHHAvWnX7446mZs4aaEMe7AA7N++A7i/j4baBcAMfwHYn4eiwgrolD7YA7VCLQYbdQTuhWvZ/041Vj3eeJyhvPy9Kai8B+7/2r102I1ChAvM7jFEE5+O4Fuu3rp9etb3/zkuEecyxYR1de+wKpXElcDXQe7QHlWUzTDafim+D4Ts+z+PL9hsclHvbRriPsTjsmFOml7DgiHSO10ey4L3dEy9pL68SPn+x53bPTY1lb1yE4Pl01iJtkdOzqznuGu71esC6du/h5tVZ2Tm3Pd0mMjn2VKF0SxPs+DWRyoym2S6rEIRZAD+V7pBju2E0FTJPTo6hv+kVXdUL/XAF6WXO/COw/f/LZBOigmM0Fdy+xW6qOa2SS2stXDnd7vWBdoy8rV3dmbZgwytLnPVnIvzvFV1RUKqepIvHSWkmD5PRPdBV8qyKfeSwIdgvHrtPiSc3RXzLFwF4BvWJ6AXpZe3fRYT/b3eQMexLBXMhWgyUZsjlqi+9dDfdbBArWu1o5npiONFSeV/goBOk77RiOhHEnSJ3yeCpWRxI3UsWD23tRu2efeYTpfSV2m0JIL0Ava/4Wgb2L7PX0xxO15ev6+t6dZgv4bstYRbt0yfeGuL1esP6rK695Id8ox2gPZjOV/NyhxFX30GZ4/l51+Wx/3F1Si1wVNVgc2SPQ6YzLiNfym1SvgK56Mttq889furAAvax5Xldfe+dMpgPu9VBeSpcc0GG6yL7OKjJWsd38ULfXm451a7/M9skIKfex/PD8vTcK1Myr+Kfw4bgbVgntlFnFvU2yNkWTYzQe45VnulAuyXPcZmOLZcqlrAVZhx32zkRtVEd1kB26KxjwLcqbcUUzQ/wWgaZj3VrqittxasXU5zVYAvezbr7QNVUS3CF4krjv3pklNCOfzYVvE7kbUSGDq+J4HY6/2FYZvFck+zbT9TfcdXiZQy9rQdfjTzzbg/WeDK6KUC5e17hXQl+nqN5V8jN0+tC21xuN9W77xX+5jT33UTd23w2n8a3dFAO4O7peOcXw9GbAd25YRdCvRAXcQ3MZcbyf+FkBelkDsr626FJFb938VOiWID55XDTv7sk4jo9j5L/3wxcGE1wF61mddNpvwkNAHTi+k6HDHkDLsNcmvDJFJvOmwwB0jqYY0lXMSyyORSS4u/pGGaeHl6758LEfbZVV1mCsQ7t9GCV07fDalDlGqbdeAx2+3/Hfw9peby7Wb7ptimeCHL4j1pk7pNNC4wWI7/SFKiFZ9+K+h7/gPjdC7pG9LRrXKGePguZRK8d++dky6FLWoCzmYawPI1grlSutC9OV0TFoXDtGnuMQt9cbivULL3o+NlX4Gqc8XXLw3fP8vdT/DqekN6jIZ8ZUvIkcp9MtA7vVM4lh3BX7auMz2q/4t+sL0MsazHXVNXdCcMJ4G3BXx3F2U47jGLR2+vQvD2V7vaFYXzHW9o9x2g7QeaGK5L/rFhspGOisAB4aKfKof0dFaM5f0tX+LfKK/qK2zEZQbsJY16W00csa5HXCiScL4pkkjoT7dkjoaPVaaG5Kle9eOZTT603EuqI6T94L5XE6xUwM5qZsJK+SuMe6U0rr7lFP+doEmgvoGVK72O4v4T3Ke4vboHm1mxZ//fIS0ssa8GUfsCaeI0FchmJO7QriMH21KVWGtr3eRKw/NdZWv8XRebbHf5AoH3+QgThXqfhj7KS7MRW6KLvdPImVjSbA3Uef+OQprbKaul52wD6vOOK1Bx73lqT9jjzYji/Z56WtgVz33Lt6PCR0V1k7S2sFKaejnuOyFUP5cpjGYT1F9UBzjpK8YB0fAkrZPJn8E/nE8ChfDwR3x234kLgpiuPsobvSh+wPPTJ+yOvLh/8bt4zarzjiNW+9+OgPTX7x2F+dN6uOXHaa/cAo3xqkdeZZFzhkQ/OAcu1tM9A8A3c0nO31xmH9voenxetsawVSe+VesbLHI4aCvo59ngbKtVZQgPguS8308fLUaNOWAf2Q09+VoXmW7/ZHXn7Avq0BWO95zwegthSzufNEco7saI3MN747fO31ZmH9zHO3ZEbIVVQw5zdkbddvkd+Wp3mI5FTgeNfLmGYl+7aN2TAuE5Stx6j+9DPtZG6/47HSTG/aet1Jb88DvT/cDzzuj1oLthhzhNoy8jl2e5PXmqmxSj+5dfja683C+k9unaqoXU+k+HdjSXUkF+izBAf3PpKHIXHhu59ip0Wgpy0u1nu+R3D319Ob2rYXpjdzWdb+k//6pBj9ImT/kAWP7T+4+k6Y3str0joVwriTEdxQrktdr+ITT00NJs0K1rs66fO/9l8FyvMa4jt8Q+3MdyQCpjE+jMv3VX9Ax765qC3Tk81N+E3qpxemN2rt+4b9LGu/aKYT2xeO7LTXRXAZUZvJFjSVy+Y74M6e0rr5T506ZA8lNQjrdrM05HFemaJKpLwqNMGTCXlcdS8V+8mhedaifCS1M0ntyrfhezJK6Lab9PsHHy799GYtY7oaL3Mn+wfu84Y/aM334i0CsDunfEKfoRTYbVc98X1sfOqr39gymEwrWO/eLOXtV/2aKj3alAyJu268yPSjdu4YQ3dvMY9yJF4bymG3wV347nrEsTC9actiNUyfa7LPe2anvW4sHl8narO7LrnUg3IgLkHzVeMCve1XXjNk7/xqCtatAxMyeJ9bnZtCg2UOBcfxJop5ppuE8prmgjjUdmSXkdfPTIcfXh4ibdAy7GZ6L3PWjXnJ7y3MePv3r7oj4Vv5umu0y4j1XDXvcrqkojHdNGaq+H7PA0N217QpWP/OFc/nhw7duKGOVHKNlH6jhzF9950+hPhBCuPwGqaL1DI19Kkg0P/Zz53dKqtJ69CLjxGC95re/NUjWwuxzjjrgoByhfFMm0UeY/s4QK+KMunScL3zqylYv/eh6ZjT42ci8s3xbZmOCsWwO+OPeZG+MT3RW5JH1FF7cqMrTnbV/tH1d7XKatJ6zXFvMezOg37/iNe25n0deugfe3YTzCkiKskgxfNUlEmgH66HkhqBdevAAG5gje9q91susWESsZ5X23G8ayThm11YD+AW6ydBtuP7ZKWqrt90K6Wl3si199ovceSxNY+L9roSulek9jgVgnlPZdx+mTxa8q/D9FBSI7B+zoWuA7P7irAOFYrZIXGO7N6I1KZO7JVzlMTxSdNGETzJjrarjlflmA9/pFVWk1Yd1Uc4sP/4pqU+jwvi8uzQnDCOsb1roq69cZjumjYC6z++ZevMkL5xJ+xmz40eYiKpvcRoGdsVzI2z8lbvpTaC7EL2zJ2iwrjAbRyXOuyb5M3cettjrbIatuonj0Y4sJ9x5iK6KOzEcBlIPc3uDMeVqyU7PvzYMN01bQTWlz7e7jeR4o8y2zZS7Ce6JfRPfBL3AdwXJfMUVQfi6qWI3RXHERWwrtg+s1jaL01bNgAj4M6j5n8k5t3v+bPqJqfkaO7ZbUddjfFcKPdHaZjumo4+1k84+dcuemP6PbfZvxiZnpI4mCaJI9idjvygN4nPaKFoNzleK6r7hB7grvqFiy9rldWwpQ7M/GoeXxdDe70ieA1xMb0yVKQdGdx2j288lR3mH780NHdNRx/r9nqvmTTPzx3u+qSKiQEVFPDtds9uSV4o1w6pHccphoQ+AcR1NG87quolqjdwaa5xfvWm89/fmvd19z1jvouCTxCX+IEu7ZqG6a7p6GP9iqte2BiYvstpvU3RP8YJ2euKp3kw0qSMOiryG3siuW+qqAjWJzDa7WryYN30tJhupkT1Zq733n/y/GP9ffcvwJdYzv/qpeL16qkxR3DPdyg/I6H38l3HFWO2y1wzPHdNRx/rt989RTzf1cfxd4yjgHU3Oa7dCbhLMBqUp9guXku0ywnmeU24HWprNym2Vx6VqN7QpbcFzK/sf7Q17+ujHzu5y2iQLYVIHovgG6bjdfXBpUNz13T0sb70Z+3IbirOw/GYwaOxqzGMM1/Yk83pmdRHKp7mseViXCaGw3HzAN1pA75E9UYvoXbe1Zr3ddDBb0w090wXxOF1VtMJ390dj1aODc1d09HHOpjuHSSXQYg2S2iFK277ulUSzbMzKiZgjXR0JvG6p2LGBXNw7wTo3X7wIeVTdk1cL3/1vs3Buq2l//tsDXF2bn6aT0eZ0GlBVNDQ3DUdcazbGIxDue3yRPJK7oEg9iTqAr179kdHgbtrIt/jsIouUTcpjD89Y485HYKHhO68ZP6W2x5tldXI1TSs/8dNS2MM9/gOgu8hpActuXg47pqOONbP+MqWLq/9W1bAd340hdub/unNaCZd48X1T1I9kp2mCoxO6mQ65h13rIi/AZTLSKF4zDHlsdLmrkZh/fQzFuUbLNorwz6rnsrUr75hOO6ajjjW7bUBNbhdQzy0xfGAu5J8nFFJENePJSVuL2AdRRKfjP0T1JHx7NZxsjKTvqhjx8z+5WZpg9efLjutIZMwtj74oeNn3uSsfVfCOnsyUgbuJo6rpu6+r2B9AHTBt7fkZg0ntbumSl1koJCoLkCTxKtjmGMxhXEUM7RTPKnhtS5lr2rvGKyTqcQlqwP0ypiu+VF5WWOjV/3mgJF/f4CtV77ygC6CV/fJ45H4kvCdVHvMz54cju+ajjjWL7/qhThFLvmHOf1rVToy0ixYnwhJXEaZHZT7vVPviucSmEaB7Giyv9ZX+9GlA9Ps9ebzj5x/rB9y+rtaC7QeeWzzbByX6Scgjnzlbz43BMMwo471HySst920eFC85CFOyyXh27xI7VDuszngliePhwzujZoqE6RvmQh06gHo602lA9P4Ze9TTKgd+Zc4pnXjT5bmkb0TfFMPNEfLV02dt2QIvms64li/+vqtdU7nfqYd5U097JYXqUNCj3k8jpATuqmozlGNFETHPJBaR3ao7TiOke5/cLw1hOtlB+yz35EHH3jcWyz0ve6kt5t5xRGv7X4EuazdX/bWrfl6Iomv37UWYHHXVDh2XfJ8Kk+7TOD4yh2mu29dvmrrRVcUrC+0brx5q5G6XxgPKHcdFWVtPY6vx/QpKoxDea+N8U6mPKLYoRLSt+qB5tLTFconTFz97iXXtYZkvWSflxrBrScrBmV48daLj+6+RqqsAe7DvPWio1sLt4760PE9XXKO/fI4inCX2Xr19UMw49gorHNvs6c/TgD3M4jCN6OHgjjiD/r0HaN3qGuHy7XpsKNeoKMJLpmXKn/ix09pDfyyN8faNzAzNM/y3YK8/cFWWYM3vW7/c62FWwf94Rv9EIvHt4y8aRdpnmSV+x8ZgmGYEcf6DYZ15WshOLRT/FghCo9uqhgFspk4DBWkY16kb/oteGje69fZ7nXY4e9sDfCyhG50zgO9P9xLct/FdehFxzQhqtv6nd/dx0f1nVF7eXc3uWLieC/Q8UMwDDPiWO+m9fzISngsKKdOhuk8E+Q0OTvNqaQ/6xss8uxeCuBJ0+yV1tXGipPdPf3eXkLdGtRlWdu4PCezdCW270pgn4cOu/0LVVRf0HXnT8d6g3k8enbH+g6Od/fK67hs5dbBH4ZpBNYhstopzKiYgezmY0KPMyrVJKIqMqB5R33W9reMJziiqQLK6a7QY5EH8eu0C/F2tP3mW5a2BnW98siDRZk5okkhe99lty72NtZfMxj/8XTueZfWXI4QJ4bLdL0qqGa66mL6iq2mc5cM+pthRhzrNuBIPA807/ckZwQ6guZxHhFMI1WANVLdd8bBN8FcvJbMm+o6FYH+mmvvbA3kss5JDYJC9t1ZA/1JDbsx2xqM9bcnn6VeCjs0z2sqyfyyqmIEN/RXhqvmvzPwwzAjjvXLKqxL2eHCjkd2JHgnPKnvFNjtdxlEEYKnuhgtr6J4HeHuEL9huscsumAQX8a77xv2SxQoZN+TNahf1dBjpYOxjvrg8QnlLnpzNA/BxfEkHaVuZYWkSuWvum7Qh2EagPVwSzOMqUSp2ZLprlDMoDyrDUCcnjgGQXmBnr3SBqVyM0mqU2l/+jNntQZr0U/fSzJmdT+OXNZOx9hF9jll+mD8384rBGIXRUZyvXIqOgrfkh0xXX/X/wz6MMyoY/37L4T58Qzl3YghHoWhQ99FQTRPYh4ncfd0XQjpNMpJ39MY22VqguPXzqic8PGTW3O5huP9JDYr2SprFybZR6/3MnOl3otkXtHbEVxFcZx68gC9q2RUefTxQf9M0ohjfdG3t4jaUmC3h7X7ceYZTvlMQvdxW0btEXXJFb2T8DmzIWXwmd6M5BK6TNvgbvrzo+f4bTDD8gn87pPrZe3CHdQX+V9OdtPb/iGtgVy337VK/XHbYfqUb6foqqidzCxAl3+SfdCHYUYd69963mFau4xQjs9Pp8RhFUdwdld0HAfByVP0Wq+fdeVbKxHfPqGbN61XWj/66I+2BmkZREb79YFDt2wYUfPsezSfPsj9rq+cd6lrmgNxURtwC/favVzlSdNTZrr72ecP9DDMyGN9C2OIk05WDFk7N77CEIs8YXxavzHUQnA6LfVR2Tx3n9MkcENtSYgH5cHrWFcS3OcurQ9TVC+Bfc/gzl+6/RL6609/98tfPei3pv/h9EXCd09HRRLWzTw5oyhqS4ngqks6DvqM44hj/WsV1k0hj7tiduLQi1lDSaT2RSHbjL+T6UbLHaw5wmiKaVcqh91Jhm+E5rQJM1RRPelN57+/Vdbuv+vRGuX23zo9/7Ls+I6rj7dLQ/SXpQ3D5O95CuJOqkBwq8jLoCee2nrZDwZ6GGbEsf6Fc7ZsmOw4lGdnxtOeEW0ThXT+FFPk2iUmDk0ujyNHcHl3CRmslcRrrVvfNlUQb+tqOnbVHhys28sX5wvohMpBbhGUtbfXQQe9seY1okJIJ4ML4topQvPKVMXrbhroYZgmYN21y130jkbIhvLc5/SPBUnyVqTxLUFweSqwG2q7DO56LArgieDSBvwaGRMV05xhfRiebyx9mLJ63gzjuivqjANxSXy3XbzO6QlJx3sfKlhfOH3q87+Oz/toB9x+rFCiIZ6uJrnRQyJ5mEjxNPcVbnICbkn4lqeoXWZDBHq75ziHWB+KucbShymrZz3w8C+M1zXEwbo4rkvaV8yk9pRQ3oP15ZilPxvoGccGYJ1XrGh3BkzHoUPE4z+SxzceXrueuAxA97ivcUy7PBnJPLzGJK9dqi6tmzadcOKgzK3r9S/zq3dcdXyrrAav6254REwX0F2/BVWIxyd8A3dobpXE9LT/9QDPODYC63TAXTaXMeWZDsdDGDdREcQ9vv3giurwmhge5JGNRG34bh6J7DoOzlOmNWqb842eshZ8nXPuJRWyZ22OJ6nyRIC4HWt8S/Lo018Y3GGYEce6SZ1xJXQg3q245rgZEOwIziVUx20COJesCNxDWxyUp0vUQzbXLoWQ7lDuNL5u+pQ5xPrwfMNh5l3TVlkNXif93VmCuIK243sie20Sx2vWe4hT+fly7aZzFxesL5xI6LaHForbJRe9JR3DuKG/CrVNO8vj6ZeQevZGuZl1Lp7LgHKAHrH+L4te5Ku+hhvrplZZDV5HHXV8YjRcVgwnlUNw7VP82Lzg/lv2zuxJzupM8/kHQLfnzsYTwVx028xMRNNexp6IsZme8cW0DQgBWgyWzGILt9nB2BYIAdoQIGEWIRstbAaMhBDWrtJem6pUJVWpqlRSScZ0R0yE257bprKySrXkvN85T+aTb755lCU6S2RlnhNPnHi/82UFV/x4eM57zkf19hPra1+r3nscax/r3X0jzMdNkcc0hUWCGzIEZ8EonLDmCteBb6CZBCedEwNurLpGNvju/ooQJ9Aj1iPW40ilvv6Na5CokOma7IA7UK7xLeBmjSIRF9/ZUr2t67WP9ZN9DMr19qYz79y3ZGxCP06CJzKbmSpIMa9Qc0uTi+Ry4Dej+IGGNbCuIQ6OGz23qq6xHrP1Oh9XfPHKHLtJc0oe/Uysu4IyoBed5rxzX/X2ONY+1ts6R1S7IXVBmvPID/c5fSGzIjhqEanNR0VzT2piHUUZaTNuH0XAvXp8972KfEZjum6Zxpth4ijc7WQ4Timf3uvVH6A5ahbNbRHrn50OtRDrtqB05zgzcePB+ajArVJy5btRG/eNR52xyO+xKLIEZ039M+RqFjt2V+qjd1X66YbY4BjHhUfDgXMW3CwSkdQku7XnEFZ6kkLm6m1dr32sb92ZIcQ9tf8vCpOluMK2qWBWQbnoY9TY0hQxSDHxt7wlpolyTWqumIKUl7mMPnJwb2z+KFUdQ277s9itk+9qxvEZji0fdBqOk9Ti1vmopMjeo/iu9JOHq7R1vfaxLrc3CGStT3eLenaFVSguR5zCjhQUJhkvq1HtxC3lGa24mT7dQRy1FA7oqCuH9Wl2faNX9d8yGMdUj2UrNuQRDEyT8hSpjYLqgVBj8VTGq2pb12sf6xveHgK1Tc/4wL+M7j87tnNgbOvpsd/1j793enz3wFjzR2OdfxwDnWU2BJd1L4bmuUVzLAgy1C5DarKei5xFNOaK5n6F66nqGHLr1iU+aPp/jt6fiqPuxy9+uapP4TtI8B6mKxSBTjmm54oVv4pY/4y0ZmPaxyn53c7Gc2Mbe8cXHpu452j23rbsfW3Z+9uzD7RnHzyW6KGO7MOd2Z91Zn/VM7H5zHjnx2MANOE+6msreWUhrqht3lqR2sT3qAG39uYl9fHIX/3V51LVMSTpjglMHJd4/GD+vWB3SBbukEG51slkHn5+bZW2rtc+1p9bk/ae+sy/jP62d/yBo9l/asn+tCV7d2s2wfpRYF30QB7rHYL1RD8/nv35ieyy7om9Z8d6/5mBOEFvO1U4A818BZHUdNzGj3tk61dYJNZZ89UfPh7Jv/rif/xPqeoYcp/ipWxtjAlMHDJumDkf1Da7nYrgp0QoIBpzzKKToLkI9ca3q7R1vfaxvnR1gvVNp8bva83e1Zz9SbPGujLsHus07I8cT8j+ixPZX3ZlF3ZlX+8f70ngDreumgtFTE4CIqCVNK+drBNHbTXCOo/1j1Fc9V+uTlVoTKN7HOXzPak44kilvnzV1cB3iXycvJZHEhyFITtpjkLmtzdHrH9Guvup9NJjEz9uyi5oclgXtTiyt4LswnQR3LrBukiwLhKsP9qdfaw7++4ZB3d9Pghwd7NJyW0Dos1STME6rI9V7Xy6n/Hqm//9mlTVDHHQkrDHU0hxTP3giSRnw8lrL1XjrS/wyrvyIoj7gurLbN9bpa3rNY71eSszd+yf+FFjVrQAZIdhF6aLGK+36Xi9g1inYfdkP5ld2TfRcG6Mbt1m4oQ71w3Eg4U14KYmvj3QRUnh6vzKTTdV9sr1afA9jfj1jDgKR28Q5aC5mYFyr0KI+8fuPnkE6I+0Rrd+yTX/5ZHbj2TvFDmsJ4a9uUQOU3Lj9OHCHOZEDuvdMOyLTmYf78m+Kbb941FHbQVuzCiUGJEHUB4EegHNFdANyt0j5ttuvy9VZeObr86O8Uscl2y0tP2laJ/TzCQ4OO7BDY5LgcduL6mdpG4/Ht36pdW8l0ZuP5wV3XFEmJ4on8OQ7K1FG6fGsGusix71ZHdYX9ybfbZvovWjsTzNIZAaNbJyClB2i8LfYLRiBWQjb2HNAgLx77u/Cu7mNc2OU3ToVL6hnIojDj327Dur8G1ScmKd9twXBHqBhnNwR3H7vZU/kRSxXlq3rh6+7VD2NsH6kQTrd4LsDutNJl43/TDhHIZYX5Qj+xN92a1nxwFx1Z1iFMhSLMe5SI4T39Afk9+c+2PBin+U32Bx5JnnNqYqOaqX7N/8zexUHHGYseGN/bThItQIVQBrEFzkYM1FrMCe+7cQ6uo8aFqDWL/lF+n5B7M/9FgXCdadaNhtP4zfOCXWuWtKw67j9UU9Oaw7bTo7DpTTj5cku4M7ghQFcYgrMvu6MG8phrgTOO5mgN4vrv3NllR1DZJdzHXMXuKY6rF0+QYTtmigu0Ww281eHtxUr0M5DLsI9S+eqvyJpIh1w/QHB+dtnwDWD2WRw+Sx7g073ToMO9ocA/0wxLrIYx1kF6zDsD/Zl31tYOI0uSwy+Xjg0QkFVvSiMBqzgjsJ7gtL/G07j6eqeMgOKntjPm3fS9wjjeMCY8myDSe1Pe+WWvt02HMQnK/8DKwT9Fjpcqxf/nzE+tTr1g2j8w5kHdZFcOsijfVEzGECu6Y6hykZr9OwC9afOpV9qX/izMejiuDc82SiomdFdoVvviXH7Vzg2eVRrRxu/EOquod0PUp+8um+aScmXVx/Ko44wuMnP32cmPaunDYcj5hPkdrCa86keaKu3KsuUcT6JdAtKzK37s96rIvErYvg1s3GqTCdOQwb2AXrMOwiHDc9bnIY9sN4wy5YB9lfPi2ePW/JiXIU9OOMyPlIVw5kWz8OfJPjmAl0V4vOfjRy7qOR1HQYHu5ivSfp0CPQ45jkuHXevYxWCHQTlIt6Hdx7SXMIBE9WUCCWEQ2v2ZCuOMci1pVu3TZx64HsDw5kYdiJdVEgXm9VDeyhHAaHkrpyhl0ErGvD3pddciq7Rsj+R4QwtOEO1ijAaMbimBXHSWrPbrdOk+5rAbfgG4/8vSxCX/zilanpMyRR+a+Pfudb782XPVWXz4Dj8viNV2d9+e7/8R/+7opUHHFMesy4Yb5y4pwpz24pujgPE+IF6jJ6a1PlW9cj1gv0wsgt+7Pi1hOsHyzKYSzWQfafXqDNsSheF8Gti9gPo7AuOpWQ/e2z4yZpCcrDvTBaoQHnDBHfzo/TmHNFaM76qv98dSqOOOp1/MP/vp4cR0F7DjPOGpYcBO/z7E5WjED/iPWp1AOD3/9w4pZ9OayL8jnM4UAOY7vXRR7rojzWRYL1cA5Dw54wHVhf2p/dfE7IDl4rZItcoUkNlKNArWeHaRQiQhwziwLdKAdN44ijXseXrrqamQnJzkcAmjN8OiR1jxT+LdZPyEpucdueTOVpFrEOLc/M3Zf1WGcOc0jlMOE2R411bdgfdtLXfql+GLtxukTUn13Wn915bqwI6MaSK2NOEeWAvmY3H7X4Yycp3EHTOOKo13HFFVfmkc28xfMa4CavAWv3qApyHOvyeMKtH26Jbn3KNGfrxPf3ZUXIYfYzh4Fht22Onuxoc+QtApM7biqGnW2Oj/eqHMa79aWns8tOZ1s/Gs2TWmfiJmPRvhtMN9RO5kBdpIE/JPNji55PxRFHvQ7BOsMW0lzVNOyG5qh7oBMQPLu8jVifKs19cmhOQ3Zug8O6CFh3ZFfxusL6gjK3CKhzSWxzDOYwvntdxBxGsP6CNLMzP7F7mzY/UcQX8a3Cd0mOi4qxvvKZjak44qjjkaBZE9ziG4bd89ohm+oddgWFX+IxhjBTozmvj87em53r3TridbVxCreuyQ6siwqx3sZ4HYa97HFTnEuiYUfC7rAuWjcwoVtWRCYwIbu18Bv+TGrhtcwAN2ZNc/wg+eXvt3em4oijjofgW+TAjfQcXhtMV6BHwOKpjSSdoFeKWJ9C3f3JrL3Z2Q1ZGPaSWBcZrOt43eQwcOumH8acS1qU74fpyWFdG/blp7O7XMiuMhNiHY9aXOEjCxpzIF5ErCt1nPh/qTjiqOOxa+85gTXwDViD10qw6sOK4ydRoObjcP7tXRW/FiZifc6yjFh1EXMYtjl6sqtbBETF168D6+WuX7c5TDfvhwHW2Q+jsP7smWz3R+cZuZRQkXM3cYopXM05LPdF0zjiqNfhsU5jrrIUR+ew8GOt4yfzhShifQo0+7XRWQGs636Y8LmklvKfwXu4yLB3qevXkcMU9cP0J1gH2c9k1w9M+NA8EIvb+jzBrYKXyej8mXNJ4eerroqt63HU79i59xw3OXtCoUqY3VzJzULzAqz//KnBiPUK6+btE7P2ZEn2fT6HAdnnM14PX/ulN04t1pnDWKw7qX6YvsI2Rxr2FWckihmHJSem+VgkEJxvrQhuiuJffec7M1JxxFGvY93G/aB5WQHcauW4XyHTyXeRvH386Yj1imrOI4M378mKXLxOrOtzSXTrph+GZOctAoE2R2JdbZwK04F13g+jc5ilgnWnVQPZU8Jx0DbMa/MDg3IW4VeYRT+8Lbaux1G/Q7DufPowuExwg8skdR7lRuR4ty+oZc9HrFdUs58Zvml3gnUdr9t+mMnfD2PPJQXu6bVtjozXdQ4Dt57o3bPjyoyLAumKXQGmLbj9o2K60tOxxzGOOh6rX3jf73AC5cqP6xqg1zTvJtBRdw/5lc5kJWK90rp546jDOsgOww6siyzWRRrrTvq4KW9zDGKdG6cIYXjctEe1OS7VOczTZ7It50bD7A6gXBMcj+qVEwvWojVrq/RjGnHEcQnGU0s2sKclYMnJcfvY7TiOWlDuZ4L+pfUR65XF+u/Gb/IhjJMwvVQ/jNo1FZlzScC6qESboyiP9Y4L5TA07PZcUj8N+4azEwC6TVqA7DDWmZvz1WmSnSuYnfYfqvZb1+OIY+rGk0s3wIObWBy1yVU6heMEt1thMSS1zPlfvrw+HbFeSc3clb1R3DridWJd5LAuUpf0YuOUWA/nMCZhL3Ptl47XnzDHTWnYBxLDXiJOIccpWm+sG3yHdfrscK6OPY5x1O8A1q26WSBXySNbZlc4ZfjIGT8TrXszYr2i+6UK63sYr/scxhr2cLyuGtjvKd0PI0xX8bqIWNdkB9b7dA5zxmMdhl3JpisQXhHxBPowahE4joJYxw9ij2Mc9TueXLKB6Uo3Z09nOHEKvMaM31isU2+8F7FeOc1ePOSwLoJb122OQna4dSF7sM1RBLeOBva7adgD/TDerZf9DJ427HTrxrC7QtVWmtcsNMqxaN36zBvnp+KIoy7HXT9ZpKitasQpKABxzIbggH5n15CbMx1dSf3Ge0MR6xXTrJXDHus3MYcx55Jo2IF1Eb5umog5DG9zbAlcv84cxsbr6hYBkcJ6P+P1xLAPwLCTxUGgk916xc0AdzI7JQVUCH336u57H0/FEUddjieXrC904hRXMkZuMaF2Ugu+RbLSgUdZxw9k5XdbI9Yrp5tXj9ywM5snuzCdOQwu6WUOY7+qYc8l8aPVIt8PIzL9MIFrv2DYw9d+CdYZr68cyDafHS3lyodLxSlFBOfiaSxi9kW/E1aclq/ckIojjrocTyxZjx1OvdUJfEMZqsvPQLk8ogDWk0cn8H3rzoj1yummX4/esMthfVeCddcS47AuQve6wrraOA1gXaT6Yexn8EJf1ZB+mPBn8GwOI1jfmBh28prJibHkkGO9xjre9g+Q4O4RK/25OjbDxFG3Y9Wv3gfQyXEWqLuc8Ehww6pD9OyF9dadMVuvnG58cyxx6zuZw8wqmcPoQ0kixusiF8IE+mG4a6q/Ww2s07DTrYfOJSGKcVinYe/NheYMTzTiKUJczV79qCGPcllMJI9uJRVHHHU5Xl2/zwYsmuxIyd2cYzoK1moWnUC9a19065XTzDcSrLschm7d7ppasiOHEZX5uqkjewDryrCfKDxuyn4YxOt9xdd+wbCfzX54dozpuee4tuGoKXpzmUFzunInrCRyKzIn9RVfvDIVRxz1N95575jNWEQgeFCZRCzI9GMn3A9QZA4ciVivMNaF6WLYkcPcvBvnkgKGvcy1XyLVD2NzGG6c6mu/rGHXbY762i+4ddHzZ7Pem5PgrIucOAw4gE5xpeAVmF5I9pkzYzNMHPU4DjX9GbE4dkF1Ps5H79lNDW8u8kXGzcC9kH1/xHoFdcM74zPg1oP9MMJ0fAYv0OYoMv0wzrBbrIsM1vXGqcG6k7p+XcQcJjHsTWfPw4O7OZ+icKYNL0FzijSnbT81MCzyj798dHUqjjjqbFx++V8T0CZRoWjDac+5eEJmCDWUkTm69YpifdOEYH3GDod1kt24dbtxitscZS6TwzBhRw4TuH79hLl+3XSvi+xx05Wu07Gfe54qUcEjpFCu6qQAwX0BxEN4+9Ir8WaYOOpufPVr18CMs61FB+UimvGMA3cR0zN5iOdqKrr1CmvGponrd2QRr6MfRrl1JOyhfpjAuSQ2sBfdD9N2oc/giRbSsJtrv/IN7KeL+2FWn82eHBgBo7nhmcwQViDgG+tMXU6dUbMr8Eu/uO/guVQccdTZmHvLvcaba5rDg4vAdLei8K0eHfT1q4j1CmL97XGLdd7TaxrYef36QWG6wToMuzDdXb9uj5sC66Ig1h/l/TDMYUB2Fa9j41RCGCH7zrNjnt05uBPWkAK9fgWIi2DVUbh1eUThFG+GiaPexsM/W5UQ/ASAjhq+2z/SmAek4X6cK76OWK+kbnh9TBIYyWHY5mj6Yebw+nUR3Loowfoh9MPcGb5+nVi398OUOJck8jkMsA6yl75FQOUwNOmYkYyD2lLwLfFNlOMxX5DmfTJDI1//xjWpOOKop/H2e8fgzeG4Yc+t47aP+BM9e5S3YxZFrFdUM14fu95jnYadWBcB6zDs9qsaoc/gifQ9vRbrSNh5P4zCuijwdVPbDyOG/fkkhzlP900zjiyFr4hyPF5YfZiheT+Mn0mKo47GZZf/teI1WllQWKDTgBPZnLnIV14R65XTzFdGBesgu47XRYzXHdPR5rjfHjcNfwYPhj3YD2OvX1+o74dhvB427OLWRXvPjtKVB6MVLNLFW+XXCXQ+LlsRrxCIo46G7JcaPx5MzAFrkj0DanMdde5VxPrUYP267Tms7zJtjipeF3HXVKR3TdkPUz6HscdNRea4KT+DZ+6HAdbPiJjDvDMwXoBmi2k/owCyT+Ntn1vv8ysyJ4VbpLDScCDumsZRR2PxU+sNyq03Z0FwE+tWyXrE+lTpplUjwPoO79Yh5DB645TXfu0PfC8phHURrl8ve0+vSMfrdtdUX7/OfpiBLIBuHTdXQHBhtEgKkStEXBeB7FSe+3HXNI46Gh/uGGBKTqON/CQo/AA/DqmtE3Nja8R6BbH+9LBgXSRunTkM3boo0OaIc0micvE6DXsY6/yqBhvYNdkD9/QiXodh7xw431cyHKcZx2Mh1vkKi6Wx3ityxdf/W9w1jaMuxpe+dHXelZPXZHoGBXGvLTnAbTnuC9b7DkesV06zFg9duz1r4nXTwL5XsJ6In8GzFwl4rLvjprzQ0WIdZNe7pmU/gyeCWy+K11UOs2NgDGacQHcZC4V1WnUmMLDqlub6Me6axlEvY/GT6x2vqSJwO5RnLLhZdxLielba0RCxXtGP3gnWbQ5zY1EOQ6yXPpcEt27bHPkZPGCdhj3cwE6sq+8lhXOYAcbrfSoKZyEyAQtJLUzvRU3xrdJI3DWNo07GhzvOMlGhB8eMwgKdCgDd6P3t8WLeymnu3Z98b5vDOt26Pm6qDLu69mt+uTZHkH2yOYzdOLXnkuxxU8brQvaXzk6o+EVJM12BGzXm/oTdRHy/yK9jZe/+uGsaR+2Pa/7heh2UB6htCB5W8DevvRuxXlFd997EtduYwxDrheeSJFt3gmGnW1f3w3DX1El9Bi94/br9qgYNuz6XhENJNOy8H0aYjnt6u4TINkgJcxwQB9ADMq8uj7umcdT6eHb1++GtThZaQYd+FD9wdUdx/cJvBiPWK6kb1o0yh6Fh5y0Cts1Rf920bA7j3Lo37IFzSaHP4OldUxGxzuvXdbx+4Mx5unKVrhDrZmVESM1Fy3QIb3v6h//Xd65PxRFH7Y7Pf+FKbmxCGe6CkuAXow7HcaBc5rQvZH7m5Yj1imrmC+evRQ6jyG6+l2T6YUI5DLEuItYTt55rYL8/2A8jcljPkZ2fwROs9+jjpvYiAbdrCg+uvDkBbQ14n/5Bj8Z6D2dXnErqny+MN/TGUcvj8SfWa2qHvXn5vEXALUJBcSX9syc+iVivpG5ekpF43fTD6E7HPfZ7SfozeOq4KaKYBcHP4ImE7OHjptaw6+Om+vp1hfW3B8YZhUMW66qgNM1FJDuxnswb39iXiiOOGh1fgFVXaA5QHr4bNUReO9GY81G9Hbrtnn+LWK+k5tw/6HZNTQ6zm4Zdfd00aNjLHTdtAdbNxqlgHYb9EXU/TPgzePo2R9GKXD/MrwcmiHXyGitktMX3aWXJLdlPnuJjS9tfUnHEUaNDW3VELhReWYijBqwhMl2vcD7cIvulEeuV1rVbJpIcZgcMu732CzkM74cpd/16ozqXhH6YENZtm6PIYZ33wwSuX1fxutOqgSy9uXXogDVEsp/K9KDGI+ZTfhZx5aSbv3zV1ak44qi5gVSdsgRnTV4T6JzVIwuF/tZj6c3bItanQNe/NlbY5mjjddFsY9iBdX4GT+Uw6vr1UJtjm8K6SN8iEP4MXol+GF77daJ/BCjXBMcKUY4VgbUBulsn2QH3k+6tzKIfzLs3FUccNTe2bh8Q2urIBdQmnaESBlzDnW8F3yIsAuh4tfa1wYj1yuumFcOC9bxhJ9btZ/BEDSqEEal4HTlMsB8GWBcF2hxFgnVR8Pp1+1UNbJwih2k5PQKUc9bUBuIJa/yGK4nwyNoDHVh/4aX3U3HEUVvje9fNA3ZhyR2mUSuIM1oJ81047oy8w7oz5hAQj5XHln8SsV55zVqYVvF6yc/gqQZ2R3YY9knc0wusK8Me+KqGzmFEcOulv6oBsut+mP2nz/eY1MV48AwTFR+dw5ijpvrwM/zASRabY7weR20NiV/EqtsshSuMyG264jCNgsiGKyfTXYFHLMp+acT6lMXrgvUd7tovkF1dDmM3TnW8LsKuqc1h7kpyGJE5lyRStwgosv9i8v0w+jbHXWdGEZ4YiOdNN2w4hLfANwpht9RYccKiqNu9+sIVV6biiKNWxsrnNinrjZqyCQwKYJq14jiU5oqbW9y8bU+6OpFYC1if8eoou9dDbY7sXhcxXkc/TPhcEnZNRaofhjmM3jUNX/tFrHPjNOfWSfYtp8cQlxPlhu+EOG24F2hOsme44iRMF8nirTFej6NWxp0LFilSh2P01g5PcJnxY7jvZCbZiXJiHWppRyFkX7txsDqRWAtYl3hdsK6Pm9ocRt3mWOYzeCZeJ9ZD98N06Ab2wLmk4P0wxDrcehHBWZDXfoawDnBDJ1l7povwmyXL4p1fcdTC+Ju//TudqwijIex2JjNZby25q53wyFfgON8q3MtBpOpEYi1gPbnzS2EdOQyxHjpuWoh1kcE6DTs3TgOfwesovPZL7ZouFKY7LbK7pozXkbC/dWYMNCfT1SMJ7pQ35t1kOtYN4v0vZTFR09EYr8cx7UcSqW8b8DYcM0Q6O2GFBLccT2ZmLKJWzEOY21W950CVJjA1gnXf5ugMO3ZNifXd+n6YBndPb4O+fv0gDfvtoeOmps1RZK5fJ9ZD55JsPwyPmwLr40xOUJDgheoWySLnRIB4L1DOFT6y/vKXY/d6HNN4XHb554TpCbI7c5juUCG4TcbD0QpmOHSvdj+LhhIdc3NuccNvqzSBqR2sy5eSjGHnhY5FtwjM0dd+zbuoHEY0yXNJ3DhlvI77YYq715nDvHV6TEGcDl05cZW3sAbZsagpr7kvivF6HNN7vPn2MbasKFhjkY8W5XTleAVeoxjiIkU1t6erNoGpHazrHEbk3boy7OLWhew4btow2c/gifgZPGAdXzcVaawL0wPxejfJHvgMHkIYwXo+P1GbnAbWIQ8uvO7qxaLMUmMdNZgu9a9ejN3rcUzX8djidcqDs1agJ9CRn0Cw4aIcvnMQNyjnK6jKE5jawbrPYRTWA+eS5hRifR/jddF8dK8brNscRt/Ti3hd1BG6p1djXUSsq9sc3zw9BnDTgJPdIeXZ3eVqwB3ib0QO7sO+aGyN8Xoc03IsemKdsd7MT5KUnNRWZjwpFMTJcYrrZHpzG9alaK7uBKamsC7nkq4155Jmikq1OfK4qTHswHoghyHWA9d+hT+DZ7+XZO+HIdZVem6wrkgND06TDqCjwLoqoOGvfT1+sTqO6TQkT1/z6wZBLdhNprNlBU6cKTkhjgKL9Okl4d7s1eakV+56qEoxWGtYlxzm2g/kXBI3TvX9MMS63TVlP0zgXBKuX7fd60cv2OZ4QsXrokU6h7HHTd/sHyPEVSyeYajixALSBO8hu1Gw5uNdP308FUcc02RI38uW3w8A4oxTUCtwQ4rXqAlxZ8Nd0UyUYyWx58Q6C9GmD6s6gakprItufG7EHTe1X9UQ6TZHkb5FQITjpoeF7MS6CNd+mRyGWC/sh+k098OU/F4SLxJQ98NsOjXapTkOlIPjdOKW5pgDED/RgzlR7gfrN8a71+OYHuMrX73mg98PwInnTHd+tr4bBXnNmlhHruI5rmrK6Klnq3eztAaxLoZdsM6vmwbidR431bcIiJjDJCpz7dfdDuslvqohYrxeps0Rbl3k3PpmwXpCZ73t6WCNGdKJSo8Qf1h4LYV7BL4F3E6u9it8i8XLL4+fNo2j2secufd4cNutTpp0C3FQntabHFez+xm9ufyefG+Smhravb/arXqtYV00I2lgL3PtF3MYJOwmhwlhHf0wonCbI+N1kb6nF1i355IYr28/dZ7ILnLlSFdM8AKa05Krgg59GDUQD103Y34qjjiqdUjw8vKvG8BoENz6brxt5ooTSM2kheuK7yENOaH2fH+y6q16DWK9YONU3yLA7yUB68E2R9MPI2K83lI6hwHZw5/BW1jUD9Nbus1xT99IYYrSXcKk6+icjMaiqyla9aQwOpl5amm8RSCOKh13/njR3gP/WtygQqwrdhfUFH8TjFbcertZKVCT6GhS7JoOVr0GsS6a8foYsB7KYYJY1znMkUR3wK0H+mF4T68w3eQwkzluSqwnOkCsUwriKjQn0MF3ariY76qgjrTENsc4qmcwSd/y4UCo9dAAHSKgCWvyndEKC9QIW4Bv8l0eE4Hs08Oq1ybWZy9MY+PUGHbmMA0gOz+DF7z2C93rNOzarcOwt0/quKltc4Rb7wPWjxHZmuDkeEDGhh8/qR4LVqSAhP6yHtsc46iGwdRlbQMJHuw7RGHAjcWmcLQCTLsaKOcKX8Gku1m0e9/0sOq1iXXRDcawm/thwli3x03tZ/Bo2MO3CIiYw+Sw3kWs26+bPt2fhR93s4lQSs505UA2ZkdtEZw7sI4iecvf3/WT2OYYx2c42JN+x48WFVjvAMrhxIesK9fJSThUOcq3it14W1qPLpseVr1msS6GXW2c7iq4SGCP3jjdp9ocrWG/43CgzbHVtDmC7HTruh+mfA6z5tS45ziBLkR2nv3CxlzXIDgFygf16obY5hjHZzUI9D37/sSEhB3lQ1ikE7cKYl3j2wu1WYEaUaiV9W9V9bHSusA6DHu+zXGXzWF43NSR3ZxL4q6pzWHKHze1G6f6FgFsnArTgfVTiWH/bd9Yl4E4QH+SsbhKV4hsvKJM6hJUt7Q5/nUqjjg+i/Hd782TGD3XaMjsmwm4rpsM35mfgNcQmW5prhZtzZVGwXprekF1HyutF6zPuX/QXL9OrDOH2VumH0YfN4VbD5xLCrQ5IocRrJPsqs0xF69v6z0Pux0WYX0SkowlWbRw7w5BPF8MSe009P1b422OcVzq8fdfucbF6EPqxhUbnhSQvYkr/Jkx5pra5HgZNaoZQJd69drpZNVrGeuim1aNeKzzM3hsc7zgVzWMYb8zfC5JY121OYqcW79wPwzj9cO9I3bPkzMfi1Ysr0XJ205XQHw15ItOKfCbmMPEcWkGgf7SKw3gOPMWwloB3ZwJ4oq13qjllY1T+DPgG78RfEuB2Ylw37lvmjG9xrEuh05nbJoA2R3WrWGfI1I5jP26qQhMD2BdJCEMchiDdZHBujHsgvVneicU05VDd2JNnQCpg3AXAe6A+JCjOV/5WRa/+rXYDxPHFA4CfW2DcNzi2ybjlOY4xMewMbeJCldgxgH01kEnhXhZmV7xS+1jXTRr8RDu6bVtjqqBHViHYT+grv2iYUc/DHMYCWHK9sPQsF/w66Ybe8d8y4rOxP0ckLbhndQQHglxvmLBOtPRNfTwI6tSccQxJYNAN4F42JurHhWlSWUpQDMXscJ6EAVRzkWP+BUvTD+rXvtYF924fhRYRz8M2xxn63gd/TD7PdaZsOt43V77VT6Hsf0wj5l+mN/3nNeJCmy7QTkhLgUIjpSc634RMqDv7Mq/IusPNf4lbpzGocaUAV0IjiIci9sGRIoRShjukHXlabpytUjP7l+te3PadDTWHdaTKGbrRH7XVGTjdRGv/YJhZw5TJl4X6a+baqzb46ai/G2OjNfbe4ZBc+Kb4Yna4WSEgscigmuB2qR5Fx7FoUvd4R79vCA2sMeBUUmgg86BBkQUONJJlJeVduJgMWeA2yIbTD/i6mQ+KjV+44pBmXc2DN52T5UyLWIdUYw/lzTT5DBl7odhvG76YdDmaM4ltZfJYXSnI8i+tmecKPcClBXBvQzBWbu3FCHelYBbZsjXsg6mYz7Y+Odo2ONIVW5TVOG7TPZNVx4mOE03a6wYS+6CFCwC4mmjQfcKs8jX+w5Py0i9vrAuuvHF88XHTQXr6p7ewNdNQ1/VaIZhD1y/bu6HcVjHLQLm66Yf9pzPA52ZCbDOvIUFf8BoxRvwDnActeDbFQB98uhWMFNYXHBXNOxxVADooLlpDNfFEArMIkLc5C1YR2GDckDZPwLTKDTNj7TICjmOxxYp0q6YTgdK6xrrEsXMfGfcfwZPsK6Pm/IDpw7rIl6/fhvidd0P02hymMBtjqKHTbzOHMaRfUXPRGegfaUoRVGPFCCuV7BI4TfFNC9aiQl7HP+eg0Ua6EPMWD5dCzmpbZJxvuUihRWHbMKdBbAOyjumQ+nVr0xvptcR1kVzHxi84cMJ0+aIXVPE6zDsOl4X2RyGu6bl7oex8bo27OtOjsGkm2gFfLdvu/JSBPcryqezFrmVE25R11IcE7nHhx55LhVHHJMel12WHP3fve9PQDaylJAMkfFXqBGUi1rJd2Aav9EpuQiYxiNR7gqZkzoR8Y0aYr36lWnZ+lK/WPd3xZivmwbv6eW1XwbrogWqH8ZiXWR2TdVn8ITpMOyN3cOdKnJRJr1DheBJYVIUqwylsO7ATaZnkke8Qu3gHnvY45jU+Pznr7zvwec80CFzwlPF4qY1BWjGCkRe+81MrojcCu021cjaGXD8GFg3HMfs1r2m32nSiHVo1jPDILu5RSD03WpunKJ7vfxxU9EDxrCrHOYEdk1f7R5TDp0E526nzE6kuSwaiJuYBYvKkjtX7tiNWtbzKyx+v3MgRjFxTG5HVDT5s/iYQz0qqM0OJ+NyvgLBNbL9I9lNMWzhfBhFUq9aM+2zl/rFumjW6uEShr1BfbTaXPsVuh+G9/SGr/0KfFVD5Kw6MnTE3IjIUStYq3TF6phKVFDka8wAN34DvtOnUw/9LEYxcZTOW157s534DjKd0ic58QhXTnvOwosGHKA3+ThjFkreqphF1UVkp1bVRPZS11j3ZL+x0LDvUTmMxrqIbY6Tv/aL363uYJvjz/T16291jQLfYHrAbusfgNHkO8DNV+5tYVyOgjXduhbh3n48RjFxKHt+3wPP7W7I5y1DOlexEMejceXamxPlLMjiAqwX0ZwExyNno/RhX9Cki7AuWjX990gj1qFZzw8T63DrvH7d3yIAsqPNESpxLkmEHAZunRc6hj+Dt6RropMcJ7vdoxcjF5Ba4V5l5RrTWNGktsqwOJ7MTmC66OCRP3/hC1em4qjjIfZ89px7JG9RBLcn8sFo2nCDcopMV+5b5elOSE4aFbhRcIYMypsHReR4s1tvVq9EK35Va0yva6yLZj8/nOQwu3NuXTWwm6+bljfs6uumPJcUOG56pGtYxynge0B8BcQDwVIrInPdRCv8gaN2IcST4rgoI3Whfvu7YzFkr88Be77vX0MpOcR6kIjHL9W6iBA3NR5bkIwHYnHKwp01IA6CE+WJWDccGnx0aQ0yvd6xDrJz4zR0LklUqs2xqdz9MOFd0ze7RjWmYdJNCMPIhZucvqAynCmAu70kwVFDrs44DRllFj+5PhVH3Qyx57f/6LFNH5zRoYpx4qhzUnYbj2YXFFE4aoVvHhSSuSSsDxumc8/Tz3lwK4L7lbQz7NSOvdP7HGnEehnNeWb45u0TOl7X98NYrNt+mBbdDyNivF6cw7xyYszT3Ll1BizMT2i6RfIbGvOS7ttinSvgOJB9cepE8eO7FqXiqOkhNJ81554XX2ko7FchxDHrxkQucsV0rTBCwQpBTIIrmciFXSsoiGz8IPdIiLsVUeFKXq+/+8n0ve8lYv0iTirN/mBCY92R3d7miH4Yg3Xe0wusa8PO2xyXHZ9o7RpW7SuktiBe1YrakPbjIvwmkzzSfVNYn4Tawnz/0YJI9hocQnMJW5av3Cx7oQV+3IDbxOW0504MVXIrCtD8DVYoPDJsOUyCk9d4TGq8pftWBIcOsVaLew8NLn++NoOXiPXSZJ/z6ujshnL3w4Tj9X8qjNfzX9VoUznM0s6JVjQXsoVci6APCdubzMQxt0N81D49M1m4d+ZpLnVGHt1KJpK9lsbff+Xb9z7w3C6hueDYuG8w2iwC6F5ktz7PiVlte5LyVA7Hod6VZqJcZmvVjcxi8rP0IQF6U/J2y/ZaDl4i1sNwX56Zu3WCOQw3TkvdImAMu4nXlWFf2THeQo57J45aBS8QkY1wnJacbt3PWpPMWzLAN6jN2TxSDzwcm9mn8XDe/Nv3geaB/ITr4Li+LQt1gUyPipZhuvkl2c0dTuvHsWgJTgHfbnZqGvRM33uwLkx6xHpYDwx+f91octw09Bk8CWFEgTZHYL3Vx+s8bvqbzlGQOiC9q2kUoDNte3mgZ8KuHI9ldbRz6NlV738+dj1OqyE0/8fv/mDhovW79v2JWTmonXayPp1ReHFKTpTzmL49DWQyFishL2ZtwO1KWOQ7gC7KPYLp77w/uODBaqVNxPol1YODd20fvyVw3HRybY7A+qPtEzuODxPcSoqzjMilgCtXBM8VYfdtqU1eW4Ljry5KRzuGtm4fiP3s1T/kv76zZt/z4pq94s1VG6JIdbBoAevsNdTgZiEyWLe/Ib6BaXpw1Jrj3rBbV86a1Aa4adIpt75l2+BDj9eRSY9YL69nXx7cemxkedOY/wweyQ6si5jDqOvXW3CLwENtE+s7zrcmTCfQ6a9tohKitloPqzMRkZ0Dt3biAY7jx2T3URT5FVFaZq/9h/489/v3puKorsHQXDoU1SkhX9CnA98Q4+9yfSkM0wP9KvaRGQubUkJmvLw3z4EbBSGutG3P4BMr6xHoEetlJC1QTW0JTA8cz6w/ev7BIxPzzW2OoeOmS9rG3+g433w8777JbhL8ogRAaycOKSizZhGWZrflOGso7eQX04ueWBcDmc920JjPEWPeIMbcfkfCXKiielRKJuP8DWQgbjYzhdce3HilIG5lGldsSo51QNxtfqYV2Ulzak+dxegR6xetdz9Is5Fcvgl3fPi99pHnW8ceaxq/v3GCbr0xe2/LxMKWiVVtY68fO3/wuA5b/CNduahkkWFhAvQcx1GEeX3xNIfSCugQCe4Qz/XWYygkkIm2/dIOotwl5us2bTnD7DuRtuEi1ArW7pXmNZpYWNNulzzSSaAzYMGcKI0CBE+jCBBcfp9AvMkVTcQ9AxYWrA9qoD+35pMf3l2lMIlYrxY98uQngR5EHvNxAn+xQoKbaCUkopxMZ/wdsOqTJDjQrDgOZGtYcxGPpnZAx4onu3/8YNvA966bl4pjqoZFOTMW9ckIoBwz8S1y9QVP5DNCCZznhODEiXiTgFtZJ05qW3DjZwelaEpj3eQtBxsd1pvTHui3RaBHrE9SH+xMMxM31GbhuIyaK5M7FtQZ2gLVBJ+8QGpddILgBbMFOh+BbIN1uHWH9VZHeVcnxZpfN0S4V26wJVF2PgXlO13Aoi81JMdBavNlTj4S67aDhb8P2HBXtODRqhTZlekGzRXcua4Fa2/XD3JGEYEesf5ptHT1YKElP+YEiJvNTJurJOJ6hqabCA6BOzNZggdyFYDY5ipMVBS1W1Gn6crJd8w5SY1HK3Hu37123mWXfy4Vx6e35PNk23PjG20e5cAxkZ1PzNWhfIqMpuwP2DMealaxXeQEt33U7tvNkF9nrUSCK6WJbwN3tykqQK/xOwAi1qdQjUcVrE2t8xNIgA5Ym23PAMonm6hg1o9GCtyhyIUEB9OdkkcuyqPBOuFOxNvFRYvXfft/Xp+Ko5wf/5u/vVqiFeE49jy5vak3PF2tjuMT6CgC7KbXdsIjIxd6bS4aaqvf5Bw3fukh7rCOumTHIRcNqcFuJuYoCPdGP9d7l0vEemX04rpBk6UwTw8r580NxFFPFuVp1sGOQ79CglP8pbXhvlCkVnD34qMx7K5oyb1KCqeWdqw7Db28tmH23Hu+8tX4UQ7m47ffuUhylfekDZH7nAzKXQFhkSsh323F1hQ/FxflQnD8jGZcg76pYBE0l1k3rjg6235ExCkiGHOuIDFH4WguhdPb79dpH3rE+pR0Ou4/MokD+gC0+g2pTbiXYzqpbS25Slds0yHgDrHWsTg5rpN0rOTXSXCvAL5lduKjkfwV6td/2/70s5vv/PGif/zePAF9bR9rEoJ/69vXSTIuTnz5M5tlnxPtKOYKckplLE6K2lxRfeJsMSTEGZ7oRXWtSkiEeBoFsxTWTF1oyaV2f0JjjiIgEJwFaC7y3I9Aj1ifGi1dNWhO3puaj3a+sJTj1uvgtQlS+GgJrpFdaLdVTVKzrcW6ctbelYsU1j2v3RzguwJ9c27RF81Or73VLo7+0cfX3/GjBPdyp6DkEpddNj3SeZ+ifOvb1zsP/ph4cMlScF85T3WC0cA6aW56xgO5CjAdtOT6Z/peQ7ciwqM249qGE9ysORPl0GGG3VxnbSIXWnL6cZhxCliPQI9Yn3pt2Z6mDeeRTszUxZlxe5iTUkB34iJxz3XacHSnmHVSGzIcB9+Zq7TjN0QzHsM6pjneRs8utS98LUDnDLn1Ar2/dUC+uPbS2obHFifQ99z/1jXXe/SLHZ4C+tNri+SfIr0osofpkxPx3QJuucl245vthV2GVFFDIaQuVCG+nYwZZ8F1ir3kbFPhDqf+ZAQQb5XWNdrGnRim+9pk4sjQQwK1rVUnuK18FMPH3QcGX3z1kx/X2V0uEeufQQ87U5RKSMcmmE3hvLleQUFks5bZMNrXtPAlaorIRoE6ZMbdHJB92+wFmg+5Ysihv1hNhfVRCI+Uf4taPs+2+YMzm7eeEe8v/yXQSv5XoFArntn8oluXWeT9tdfuffm7aimsYIbXZqLiZpOM6yM/2pgT9AEPbhrGVZySiNmLcuLgODdCOUO2DREWWwpRGo9kunssr7SJy92ip3ZjWgcs1AE/E+jxVFHE+iXUa++mP9WRTtWCYuPvEufy8RvTg8hcRe92usKS2vlu8Bp0zpl0Ety/LaxJ7dwrQhyFZ7Ra5Ao9eIFbV/hGHRapLQLQh0DwZB5C4Wai3/8Gtf38pn9EAUyj5m/wA5JdfZbTJuCw3nTf6kIVO+uMxQv1YdKfQYq9utYLi0JnN1sbTjQzBIfYWYhNzovTQcisg9p45eq0xrcsouCc09ubBxev/LcI9Ij1S713eqQl0HEY3PBUiTkJHjbjpDaCFC+wW/nxMjm4DV6YjxsnDprTYmNdhyqa4MxSfMFExb/C7IRHS3a8FdGn054X4PvTCYBGzULkwU2+c4YU381JTiYqKESmJVzVJnKBSvpx0pwrdOVGDE+aROYV83GYcfSo6CKYqDANZy3CCrc3acYJd9TGnouOSCGzBOifPPR4lf5bPx0VsX5xeualwQKaW9GPF9ZU4ES+iCkKsM6OQ9IZe5sim49DpDZqFAVclkVy3M3B5IT2/BgdOpw4InIgm1gPhyrgdaggu1EHRUYPgdGEOB8xtxLumBW71Qci+EqxO81HFiRyiOOHFcFZ8wwnUG6aEdUnftS5Hsz4mYu/IVpygPv/s3duLXIVURT+s/rmQ1QQxQtIQBC8gBovGB804A0iSOJlOj3pSxz8Pzld82x3neV8s3p1cRLIZWZSsCh27dPzOB+bVXtX7Q3lK0/SdJjpWN5mjiuj3wTBg+OLqr2yfVH9ls+639KxfgH06+/lhAnPEm2I1no45lOY4zbJGf2FlfI2EETgNXhdJSwUK70tieB1oyQX1inD3RCH7MRsXdTgO1MFlJvSUVnutnUlg9JIAd8U4yge5FSQVx6yuq/isCaDkSKmF3gN6LWSJBDHFYv7/lJEDt9bgwpftc0LVdqa76+yUMC6TQYZxzFYJOLUD78M1z/uQO9Yv0hWzN/Hxe84nDDNVYYzugnHo9AmwBxnK9aryvbCvK6yTfhUM5PKpsN19LFM+ONYMdNeuYukZ8A3NNeKADfuuZCtOEHvV9RWxRtAWu3FzgbT+b2/GiFGY60ow421KPVABKdtPJ7+keA49oiznmCe7grOSfonEwLcUZXLYFFyGDN3Z8PNW91v6Vi/kHr9vSE6x2WU/2NMp+iOFhS+wmtXeCycXo4ZIRuOk8nyfL1LNlvIQbZKdffKXZlf5arC/FRBXZVxgstIqUFdQ7A7rRXxOl//QfaJcR5ozu2GVX4rVgqCY4hXR4WgaKXpkAo9yvBiiM+pfSvDccm93bD4RbUB8TTKl9tAKy2GCliRQx+LXBrEca3bLfHOb5l1v6Vj/cLrk682gfXTnAYaA8WNAU7FJBXAbgX6FI3kYYi7CbNOd0UyfLOGhZIZYH2mk4ynjfJlsJu8YI05rm37bHORTM+iWzEXH8L0tMLZSvdtiy0e05uTks3tdoqSylcpCc21VWCXqJR5Mn1d/GaVw+X5MdX3XqAYLZRUbV7BXSWaK1iK6bd+Gfo8Ucf6pdGtX4tgLabniGYmlc8eRJEa1nvroep0bRGyQ1ED9+ilcLzJsSdC8lJW4YnTbG59h8Hu6GNBwNq28RWaA2630YXsxDqmecFI0Sqyp4tyuAxf8zWxHvcdynVxFVZUIuMXH24BLdznkWYk18obu6U8vaSVpVGAJ9NF53EVxHFaJFEeuA8//zZ82MvzjvVLJ5nsArqtVYZ1SbxWUuAeMwpy6ifBnRlKchGcLUEqHZWV1+biMlspIS4pKfjmV1DOipECoxUw4wPE7VoVm/oJZzzaCi0G6Chf4xTc/Q2guvXhILNQQtluWCjAQ3HlYQ52MvhDQD0uUYZHi6HRXBlWSUDXCrWtVEeje/7p190971i/zHr51Yd/zf+nNh3liIyATgzWhe8mx2E9vD5VxU0cfYePK8CdGfzxJPUy4rWw7vIDzBorOGytnNBxSMA4vpL7Pjix8iRRYRWjlY/Tzvozfw4/Me0leWFEaMVX6nEAPWK9mEsuTQwBaXVYK4OKfsCcp3eqLIzyiemaFMRnOC1jvPF4bG7pw0Qd61dCr7w5HK9Va/sJpyW5GEtJSG1BCJqL1/z4bBv+eEunAW7b2kxQuuRQ+/SwtUKcJ5ybcyiXDtbmFOZBbewUvPLpI01TYF3sxkg5O8AsSoaAOPJLxo3jexAPre1KLJXYUJsMJvijKb1yBMSrV44hbl55GiyzWO/OdmbLy/3ylo71KyaR/TzBsVPoNWyDm7x+GdYKyI5mFbCesG6V3pkB0DWpNdRqHm/P34NsHHC2brPkyA/luZJSGuJunRPwSyrxeFmCBhUBGlnXil8vTsasFfnjQvN0t7hslnnW44K7pCSs1+ocl9gq8KocpivQNpieQN+p0nx7Fde1brZ0rF9hVbIL69aRorUKgjeEr8Lq7LbeFbZWjCuG4Hn4+W/9CsRR85CTIPFdpWQM4pMH3BYYsvNyWme3YqiNgDUBx57n2xC55tCUL0VkCzkdLGyrImgqwQ3W817DvW2B4Al0DQSlxzLM0y73Ih12V3CbIbOE6XePhq3Zcu3tbrZcaHWsP0myz1cB7gbNNbQpjuOYw3Es8qjKU3kxlrWjnLqXMj0BxKpAEsq9T5yMMC3lFH7m005R7LM/xnGShSDm72lZSfOE9pWJV/NFcL7SoELcsMID3FmGEzPJ+cjNKoCbX4rOCiDyMK/4FrKXbotLsPugunV+idSx/sTJjpcScI9KHIiL4Mo3wN2c2wTiwD3EcFBCPMb07TYV81XykJM8j3BaSa48z0dopX6nebxZiStf7NHkcFSwTQRukr4d/7xAcCkMcRnlUF55ulOouBW3ksjH7sm05e4K3SmHOxGzGCdImrtj7jT/udP88qlj/Yn3xgx/3itrP+eE4Ad7yVOeXzViTPBGv8qU4lYsBNCVOWynKCOaq/TWX/mrEZx8IjL2kBtyX0XgxkjZZdz7ThUzTMJywVc5X3drUh9pi9MSTLdAbslxFV4KKyLT8Fioyhe2zdbDrSjJxWhqdmgOwYF4jfnZ953ml1kd60+l63FLdtpU6B/HUUFIlrfjvmYQXSgKlEyjHFjTRW7stpghe8pzZVBNLuIs1Kc32TLhCbgJ4gZEt8XJi+NmsCAyxDypjFUCxLMk93c4PYPCS8EtUYakGK3A7j4kiFvIsVmwxauIfTofNxxqs4JvvHI0M6zLN+80vxrqWH9ak0pf3NxgpyhIuRU+BuTdEwfZp2mgL8NaSUNcIsnK8SYBXoqUx5vcsiIt43U3IG61ec5zknc75RzBbT4zVQ4W6fkJd0WVuILHFdcZgvKiGBwD8YnTziVNKbLIz2LE1u0UjBSJDIU56/1hp8VuvXM0fPnd8M4HneZXRx3rT1Ef39iEedISNDeUsx6sx5PXoBxkC98E6a4c7h8/sakfIR5ebw7cPI4ySSc4BN+Jrb3PqQCmw2gvyZ3mXF7IJzxxpJ/xidhVorMwWg/TBwfoFs8N39lL7meeMJ12FATEySfBBXFQrnhbm3/6Ve9puZrqWH/6Vvts/yLy1UTP+MQwZ6jxupuPcebJJxAXvsmAbInJeyCeneMpJ3t4LF6YW18KQAfihmkclWNlJJBtoG/KjRT4GwNBVUB8QveQnXMyw2lDQIxxZosh7A6aK1C+riI49fiM5M5m+fCzLc0v6P9LV8f65dDWkPn82w3Hm+mDU5UHvhPxZqSQkajEE9/U2tEzHq+4KZMthrzh2cA3tTb0p4U8bhtX3p+S4HFOe40TviPONvXj9ryPXYwlRvMzjBRQnhmtBA1VWA9x7XgVR6CeVCy+O9MlMh7UWOw+EscV7wrz2XDjZrdZXiB1rD8jvXV9+GNGy0ogu0lwTBWt6OB94sQSn8A6NXhpPBMh9DuyschDBaaDabY7weXpmSAFFN0xfE9s5smk5sZ6YM0aarzGmSi3RsOdFLC1IOvxqrTFWfVLIC4pQ/KoF+YvsDrWn6k+urGJJnFigsZEfrtxRVt0knfVMrSpIItxSXlY3360E/kJJ3DPQ079xkwSpvO1es/4eZSD+GlhjksxtwmvJ0WzinOcDnEHun6TTkt6KdZRjhziXoOfmebj9qjq9p2dY/7G+70wf6HVsf4c2h+/+X4D2QmyDI/rsexRN7ZM92Cw4KjIN2fbqr7PmC5xzmlBeOL+jkSgvAjZD0ZkI6jNFtdF6xisJwc4q8hI/ryyj3Qar5sBBXhwXElt4x4Vz6SRIlmzihviMH0ENxAX36vuHMljeelaf62iq2P9+em1d4efbts9KoK1CnPyrCfxAFBN4pLrqwI3xC0z2a+COY7rLYJLa37T7DVMrRSc8Zo3l/efUeZn4ZwgGO2OSt5bO62VH28uvNy2Cj3aVMB6rtDceS1bXKq8vhdkl+rXqm1+MxtR/t1w/aOHL/WrE7s61i8a3H+8vRHN40FOgrgBEYizZQSfznGDeAR8AtyRkfy9iGkd2xqfOORUANlN5WDprVU1ONtHxHdzkpOVr2Gw1JWYYJaBNEitvkO2wrdUM1qrwfLFrirvKO/qWL/wqrbMALsV2ANAULsG7pnwNfCdMeeZaij0A09l6icyqr6VIUmLYVbrOXOPyPApVarIWFMKQE9qtwWsIwPBIfWI7xlXZdGgkkBXnBA3K3yIc87hP/bOrqepIAjDf1Zv4Aa9aG8kxoZE6wcKqFiMTVqotHxUtICnSRuLP8ld7t3ZDn2dM2dzaExIgUnebGbH4x15Onlnd3Z4FQ+R55K81TWv3GRYv7UKcH9ad4OMGJ2/9QN8syhmMdYRyy1PU4kSEEcm38z8BXAXGOVqdC2jGYG2SuCV58heonS5XfJP8EwUwRHAKIfEZU7ucMJCAe6Z0co9R5CoxzkG0If8DSkExwMyymuv/yxVFvQP1bT4MqwvojPTaPkfmZ/oweKAOJJauSMrTGokZWMz5sUWHOdAjB2PH1MgL2pizKHMF8Aa1NbTVKDEqHElxWvAGuOx1KNunCn3VYJyQcG0LICeDRMKRIdTNDzj6mdnV3baxHG78GkyrN99LVfdq/fu65HPkxpY9xMJfeZyTP7b6uS4YCSWgPg4rvomJz7gDKhdVnQzjtWErCToKcDbm2WOiliVLU5KPvfDAqNRm5f5KkztKcqH+uyKtMUREM1n9bhd3DcZ1u+xwj3Vx6uE+M5RAETBHU71wrKosoVLrvwTmZFbTXBk5tUlDx9PHDcc4XmgtLS7AnCHALW2emG56CSiLr1lzIE8u0JCgMMtqT7nICN/fH2bWp1LFeO4ybBuSlN+bd1t7rjOof+ewVe5hi6j4JKD75wUU2o5yTEFSurSppA4g6hf+Rlj5e/LmC55PRHmCfCNDAwWVZgzlMWW1oSEryL6nNPM1Bn/3A4QN1PFZFg3/TfolyuuWqOKvtnxe4c+GwuaY9AKrRicknwVCEqjHOxG3a3PIKbbm0A587q0HidAu8LnN5UtLpzx9JAsWCgQXBQSbQXHcUxlv092Sn3TKnGTYd10o6ynun6j4fYO/MGJ/zm66nBezOePzyCOaVksOSoLiIcSo2sVu0XeIaPOFIL1akKWJnjeVEF7ExDHygLlA76PT6kG//CFanAjuGnxZVi/d5ri/tETwv3LLbfd9LuR+OejojbmbxTdCID11DP5muCIeYWAaQ5AbVmqpzuZuiSHOAPrXG49s3vgWvvE7rfRQqk8M3ybbqsM6yahhyuB+KTVFwT9jQZzP+jknNDPIL7+k8oXuXoccZDqcBbMz9JNTkgfQxRY97Nyu9t3rS5Tm2yT56HuJvv7wYqx23TXZFg3zavAQdC/WqMfgLU39BtQ33LvPrmPTU+/BD3f7rndnmv3/LezIBfUjyvKcGmhYAt8h//i+6eOdBZWH+jc/tu+HZswCAVQFF05fUiVIqRIE9DO3vl0AfnoFNcDhzfC7d56mZd9WsZ+/8P7N0r9+myP59lrJ3tuStYBUmQdIEXWAVJkHSBF1gFSZB0gRdYBUmQdIEXWAVJkHSBF1gFSZB0gRdYBUmQdIEXWAVJkHSBF1gFSZB0gRdYBUmQdIEXWAVJkHSBF1gFSZB0gRdYBUmQdIEXWAVJkHSBF1gFSZB0gRdYBUmQdIEXWAVJkHSBF1gFSZB0gRdYBUmQdIEXWAVJkHSBF1gFSZB0gRdYBUmQdIEXWAVJkHSBF1gFSZB0gRdYBUmQdIEXWAVJkHSBF1gFSZB0gRdYBUmQdIEXWAVJkHSBF1gFSZB0gRdYBUmQdIEXWAVJkHSBF1gFSZB0gRdYBUmQdIEXWAVJkHSBF1gFSZB0gRdYBUmQdIEXWAVJkHSBF1gFSZB0gRdYBUmQdIEXWAVJkHSBF1gFSZB0gRdYBUmQdIEXWAVJkHSBF1gFSZB0gRdYBUmQdIEXWAVJkHSBF1gFSZB0gRdYBUmQdIEXWAVJkHSDlAM+YqU8cr1YAAAAAAElFTkSuQmCC`
async function setPicture(ImgToUpdate,srcid,is_profile,isTimestamp) {
    if(srcid == CLYDE_ID) {
        ImgToUpdate.src = clydeSrc;
        return;
    }

    isTimestamp = true;
    const timestamp = new Date().getTime();
    const imageUrl = !is_profile ? `/guilds/${srcid}.png?ts=${timestamp}` : isTimestamp ? `/profiles/${srcid}.png?ts=${timestamp}` : `/profiles/${srcid}.png`;
    srcid = String(srcid);
    
    if(is_profile) {
        if (failedProfiles.has(srcid)) {
            ImgToUpdate.src = defaultProfileImageUrl;
            return;
        }
    } else {
        if (failedGuilds.has(srcid)) {
            ImgToUpdate.src = createBlackImage();
            return;
        }
    }


    const cachedBase64 = is_profile ? profileCache[srcid] : guildImageCache[srcid];
    if (cachedBase64 && cachedBase64 !== base64Of404) {
        ImgToUpdate.src = cachedBase64;
        return;
    }

    if (requestInProgress[srcid]) {
        try {
            const base64data = await requestInProgress[srcid];
            ImgToUpdate.src = base64data;
        } catch {
            ImgToUpdate.src = is_profile ? defaultProfileImageUrl : createBlackImage();;
        }
        return;
    }

    requestInProgress[srcid] = (async () => {
        try {
            const response = await fetch(imageUrl);
            if (response.status === 404) {
                ImgToUpdate.src = is_profile ? defaultProfileImageUrl : createBlackImage();
                is_profile ? failedProfiles : failedGuilds.add(srcid);
                return null;
            }
            const blob = await response.blob();
            const base64data = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = function() {
                    const data = reader.result;
                    if (data !== base64Of404) {
                        (is_profile ? profileCache : guildImageCache)[srcid] = data;
                        resolve(data);
                    } else {
                        (is_profile ? profileCache : guildImageCache)[srcid] = base64Of404;
                        reject(new Error('Profile image is 404'));
                    }
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });

            return base64data;
        } catch (error) {
            ImgToUpdate.src = is_profile ? defaultProfileImageUrl : createBlackImage();;
            is_profile ? failedProfiles : failedGuilds.add(srcid);
            return is_profile ? defaultProfileImageUrl : createBlackImage();;
        } finally {
            delete requestInProgress[srcid];
        }
    })();

    try {
        const base64data = await requestInProgress[srcid];
        ImgToUpdate.src = base64data;
    } catch {
        ImgToUpdate.src = defaultProfileImageUrl;
    }

    ImgToUpdate.addEventListener('error', function () {
        ImgToUpdate.src = defaultProfileImageUrl;
        is_profile ? failedProfiles : failedGuilds.add(srcid);
    });
}
async function setGuildPic(guildImg , guild_id) {
    setPicture(guildImg , guild_id,false)
}
async function setProfilePic(profileImg, userId, isTimestamp = false) {
    setPicture(profileImg,userId,true,isTimestamp)
}


function createProfileImageChat(newMessage, messageContentElement, nick, user_id, date, isBot, isAfterDeleting=false,replyBar) {
    if(!messageContentElement) {
        console.error('No msg content element. ', replyBar); return;
    }
    const profileImg = createEl('img', { className: 'profile-pic', id: user_id });
    setProfilePic(profileImg,user_id);
    
    profileImg.style.width = '40px';
    profileImg.style.height = '40px';
    profileImg.dataset.user_id = user_id;
    appendToProfileContextList(user_id);

    profileImg.addEventListener("mouseover", function() { this.style.borderRadius = '0px'; });
    profileImg.addEventListener("mouseout", function() { this.style.borderRadius = '25px'; });

    const authorAndDate = createEl('div');
    authorAndDate.classList.add('author-and-date');
    const nickElement = createEl('span');
    nickElement.textContent = nick;
    nickElement.classList.add('nick-element');
    if(isBot) {
        const botSign = createEl('span',{className: 'botSign'});
        authorAndDate.appendChild(botSign);
    }
    authorAndDate.appendChild(nickElement);
    const messageDate = new Date(date);
    const dateElement = createEl('span');
    dateElement.textContent = getFormattedDate(messageDate);
    dateElement.classList.add('date-element');
    authorAndDate.appendChild(dateElement);
    if(replyBar) {
        newMessage.appendChild(profileImg);
        newMessage.appendChild(authorAndDate);

        newMessage.appendChild(messageContentElement);
        
        const mediaElement = newMessage.querySelector('.imageElement');
        if(mediaElement) {
            messageContentElement.appendChild(mediaElement);
        }
        if(replyBar ) {
            newMessage.insertBefore(replyBar, newMessage.firstChild);
        }
        newMessage.classList.add('replier');
    } else {
        
        if (isAfterDeleting) {
            newMessage.appendChild(profileImg);
            newMessage.appendChild(authorAndDate);
            newMessage.appendChild(messageContentElement);
            const mediaElement = newMessage.querySelector('.imageElement');
            if(mediaElement && messageContentElement) {
                messageContentElement.appendChild(mediaElement);
            }
    
        } else {
            newMessage.appendChild(profileImg);
            newMessage.appendChild(authorAndDate);

            newMessage.appendChild(messageContentElement);

            
        }
    }
    setProfilePic(profileImg,user_id);

    
    messageContentElement.classList.add('onsmallprofile');

    
}



function createNonProfileImage(newMessage,  date) {
    const messageDate = new Date(date);
    const smallDateElement = createEl('p');
    smallDateElement.className = 'small-date-element';
    smallDateElement.textContent = getFormattedDateForSmall(messageDate);
    newMessage.appendChild(smallDateElement);
    smallDateElement.style.position = 'absolute'; 
    smallDateElement.style.marginLeft = '5px'; 

    return smallDateElement;
}

//if (!isJson && !isYt) {
//    if (String(user_id) === String(lastSenderID)) {
//        mediaElement.style.marginLeft = '55px';
//    } else {
//        mediaElement.style.marginLeft = '55px';
//    }
//    mediaElement.style.paddingTop = '50px';
//}
function openExternalUrl(url) {
    window.open(url, '_blank');
}
function processMediaLink(link, newMessage, messageContentElement,content) {
    return new Promise((resolve, reject) => {
        let mediaElement = null;
        newMessage.setAttribute('data-attachment_url', link);

        const handleMediaElement = () => {
            if (mediaElement) {
                const handleLoad = () => {
                    const dummyElement = messageContentElement.querySelector(`img[data-dummy="${link}"]`);
                    if (dummyElement) {
                        messageContentElement.replaceChild(mediaElement, dummyElement);
                    }
                    resolve(); 
                };
                const handleError = (error) => {
                    console.error('Error loading media element:', error);
                    const spanElement = createEl('span');
                    spanElement.textContent = "Failed to load media";
                    spanElement.style.display = 'inline-block';
                    spanElement.style.maxWidth = '100%'; 
                    spanElement.style.maxHeight = '100%'; 
                    spanElement.style.color = 'red';
                    if (mediaElement.parentNode) {
                        mediaElement.parentNode.replaceChild(spanElement, mediaElement);
                    }
                    resolve(true); 
                };

                if (mediaElement instanceof HTMLImageElement || mediaElement instanceof HTMLAudioElement || mediaElement instanceof HTMLVideoElement) {
                    mediaElement.addEventListener('load', handleLoad);
                    mediaElement.addEventListener('error', handleError);
                } else {
                    messageContentElement.appendChild(mediaElement);
                    resolve();
                }
            } else {
                resolve(true); 
            }
        };
        function createRegularText(content) {
            const spanElement = createEl('p',{id: 'message-content-element'});
            spanElement.textContent = content;
            spanElement.style.marginLeft = '0px';
            
        }

        if (isImageURL(link) || isAttachmentUrl(link)) {
            const dummyImage = createImageElement(messageContentElement,content,link);
            messageContentElement.appendChild(dummyImage);
            mediaElement = createImageElement(messageContentElement,content,link);
        } else if (isTenorURL(link)) {
            const dummyGif = createTenorElement(messageContentElement,content,link);
            messageContentElement.appendChild(dummyGif);
            mediaElement = createTenorElement(messageContentElement,content,link);
        } else if (isYouTubeURL(link)) {
            mediaElement = createYouTubeElement(link);
        } else if (isAudioURL(link)) {
            mediaElement = createAudioElement(link);
        } else if (isVideoUrl(link)) {
            mediaElement = createVideoElement(link);
        } else if (isJsonUrl(link)) {
            mediaElement = createJsonElement(link);
        } else if(isURL(link)) {
            const urlPattern = /https?:\/\/[^\s]+/g;
            const parts = content.split(urlPattern); 
            const urls = content.match(urlPattern) || [];
        
            parts.forEach((part, index) => {
                if (part) {
                    const normalSpan = createEl('span', { textContent: part });
                    messageContentElement.appendChild(normalSpan);
                }
        
                if (index < urls.length) {
                    const urlSpan = createEl('a', { textContent: urls[index] });
                    urlSpan.classList.add('url-link');
                    urlSpan.addEventListener('click', ()=> { openExternalUrl(link)})
                    messageContentElement.appendChild(urlSpan);
                }
            });
            displayWebPreview(messageContentElement,link);
            
        } else {
            createRegularText(content,messageContentElement);
            messageContentElement.parentNode.replaceChild(spanElement,messageContentElement)
            resolve(true); 
        }

        handleMediaElement();
    });
}

async function createMediaElement(content, messageContentElement, newMessage, attachment_urls, callback) {
    let links = extractLinks(content) || [];
    let mediaCount = 0;
    let linksProcessed = 0;

    if (attachment_urls && typeof attachment_urls === 'string' && attachment_urls.trim() !== '') {
        attachment_urls = JSON.parse(attachment_urls.replace(/\\/g, ""));
        if (attachment_urls.length > 0 && !attachment_urls[0].startsWith(`${location.origin}`)) {
            attachment_urls[0] = `${location.origin}${attachment_urls[0]}`;
        }
        links.push(...attachment_urls);
    }

    const maxLinks = 4;

    const processLinks = async () => {
        while (linksProcessed < links.length && mediaCount < maxLinks) {
            try {
                const isError = await processMediaLink(links[linksProcessed], newMessage, messageContentElement, content);
                if (!isError) {
                    mediaCount++;
                }
                linksProcessed++;
            } catch (error) {
                console.error('Error processing media link:', error);
                linksProcessed++; // Make sure to advance the counter even on error
            }
        }
        if (callback) {
            callback(mediaCount);
        }
    };
    
    await processLinks();
}
function createTenorElement(msgContentElement, inputText, url) {
    let tenorURL = '';
    if (url.includes("media1.tenor.com/m/") || url.includes("c.tenor.com/")) {
        tenorURL = url;
    } else if (url.startsWith("tenor.com") || url.startsWith("https://tenor.com")) {
        tenorURL = url.endsWith(".gif") ? url : `${url}.gif`;
    }

    let imgElement = createEl('img');
    imgElement.src = defaultMediaImageUrl; // Placeholder image
    imgElement.style.cursor = 'pointer';
    imgElement.style.maxWidth = `${maxTenorWidth}px`;
    imgElement.style.maxHeight = `${maxTenorHeight}px`;

    // Create a new Image object to preload the GIF
    const actualImage = new Image();
    actualImage.src = tenorURL;
    actualImage.onload = function () {
        imgElement.src = actualImage.src; // Update src with the actual GIF
    };
    actualImage.onerror = function () {
        imgElement.src = defaultErrorImageUrl; // Optional: Set an error image
        imgElement.remove();
        msgContentElement.textContent = inputText;
    };

    imgElement.addEventListener('click', function () {
        displayImagePreview(imgElement.src);
    });

    return imgElement;
}



function createImageElement(msgContentElement, inputText, url_src) {
    const imgElement = createEl('img', { class: 'imageElement' });
    imgElement.src = defaultMediaImageUrl;
    imgElement.style.maxWidth = `${maxWidth}px`;
    imgElement.style.maxHeight = `${maxHeight}px`;

    const actualImage = new Image();
    actualImage.src = url_src;
    actualImage.onload = function () {
        imgElement.src = url_src;
    };
    actualImage.onerror = function () {
        imgElement.remove();
        msgContentElement.textContent = inputText;
    };

    imgElement.addEventListener('click', function () {
        displayImagePreview(imgElement.src);
    });

    return imgElement;
}

function hasSharedGuild(friend_id) {
    return shared_guilds_map.hasOwnProperty(friend_id);
}

function createAudioElement(audioURL) {
    const audioElement = createEl('audio');
    audioElement.src = audioURL;
    audioElement.controls = true; 
    return audioElement;
}

async function sendMessage(value) {
    if (value == '') { return }
    if(isOnDm && currentDmId && !isFriend(currentDmId) && !hasSharedGuild(currentDmId)) {
        displayCannotSendMessage(value);
        return;
    }
    let data = {
        'content': value,
        'channel_id': isOnDm ? currentDmId : currentChannelId,
        'reply_to_id': currentReplyingTo,
        'is_dm' : isOnDm
    };
    if(isOnGuild) {
        data['guild_id'] = currentGuildId;
    }
    scrollToBottom();

    if (fileInput.files.length < 1) {
        socket.emit('new_message', data);
        userInput.value = '';
        closeReplyMenu();
        return;
    } 
    
    try {
        const file = fileInput.files[0];
        fileInput.value = '';
        const formData = new FormData();
        formData.append('file', file);
        formData.append('guild_id', currentGuildId);
        formData.append('channel_id',currentChannelId)
        const uploadResponse = await fetch('/upload', {
            method: 'POST',
            body: formData
        });
        if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json();
            data.file_name = uploadData.file_name;
            data.type = uploadData.type;
            data.attachment_urls = uploadData.attachment_urls;
            data.attachment_id = uploadData.attachment_id;
            console.log('File uploaded successfully:', data.file_name);
            if(isOnGuild) {
                socket.emit('new_message', data);
            } else {
                alertUser('Implement Direct messages ');
            }
            
            userInput.value = '';
            closeReplyMenu();
            fileImagePreview.innerHTML = '';
            
        } else {
            console.error('Failed to upload file:', uploadResponse.statusText);
        }
        
    } catch (error) {
        console.error('Error Sending File Message:', error);
    }

};


function getFormattedDate(messageDate) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
        return "ㅤBugün saat " + messageDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
        return "ㅤDün saat " + messageDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    } else {
        return 'ㅤ' + messageDate.toLocaleDateString('tr-TR') + ' ' + messageDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    }
}
function getFormattedDateForSmall(messageDate) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    return messageDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

function isImageURL(url) {
    const imageUrlRegex = /\.(gif|jpe?g|png|bmp|webp|tiff|svg|ico)(\?.*)?$/i;
    return imageUrlRegex.test(url);
}
function isAttachmentUrl(url) {
    const pattern = /attachments\/\d+/;
    return pattern.test(url);
}

function isYouTubeURL(url) {
    return /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/.test(url);
}

function getYouTubeEmbedURL(url) {
    const videoId = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)[1];
    return `https://www.youtube.com/embed/${videoId}`;
}

function isTenorURL(url) {
    return /(?:tenor\.com|media\.tenor\.com)\/(?:[^\/]+\/)+[^\/]+(?:-\w+\.(?:gif|mp4)|$)/.test(url);
}


function isAudioURL(url) {
    const audioExtensions = ['.mp3', '.wav', '.ogg', '.aac', '.flac'];

    const urlWithoutQueryParams = url.split('?')[0]; // Remove query parameters from the URL
    const fileExtension = urlWithoutQueryParams.split('.').pop().toLowerCase();
    
    return audioExtensions.includes(`.${fileExtension}`);
}



function isJsonUrl(url) {
    return url.toLowerCase().includes('.json');
}
function isVideoUrl(url) {
    const videoPatterns = [
        /\.mp4/i, /\.avi/i, /\.mov/i, /\.wmv/i, /\.mkv/i, /\.flv/i, /\.webm/i // Video file extensions
    ];

    return videoPatterns.some(pattern => pattern.test(url));
}
function beautifyJson(jsonData) {
    try {
        const beautifiedJson = JSON.stringify(jsonData, null, '\t'); // Use tab character for indentation
        return beautifiedJson;
    } catch (error) {
        console.error('Error beautifying JSON:', error);
        return null;
    }
}

async function createJsonElement(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch JSON data');
        }
        let jsonData = await response.json();
        const beautifiedData = beautifyJson(jsonData);
        const truncatedJsonLines = beautifiedData.split('\n').slice(0, 15).join('\n');
        const jsonContainer = createEl('div');
        jsonContainer.classList.add('jsonContainer');
        const jsonElement = createEl('pre');
        jsonElement.textContent = truncatedJsonLines;
        jsonElement.style.userSelect = 'text';
        jsonElement.style.whiteSpace = 'pre-wrap';
        jsonContainer.appendChild(jsonElement);
        jsonContainer.addEventListener('click', function () {
            displayJsonPreview(beautifiedData); 
        });
        return jsonContainer;
    } catch (error) {
        console.error('Error creating JSON element:', error);
        return null;
    }
}



function displayImagePreview(sourceimage) {
    imagePreviewContainer.style.display = 'flex';
    previewImage.style.animation = 'preview-image-animation 0.2s forwards';
    previewImage.src = sourceimage;
    currentSelectedImg = sourceimage;
    const previewBtn  = getId('preview-image-button')
    if (!sourceimage.startsWith('data:')) { 
        previewBtn.href = sourceimage;
        previewBtn.target = sourceimage;
    } else {
        previewBtn.href = sourceimage;
        previewBtn.target = sourceimage;
    }

}
function asda() {
    let beautifiedData = JSON.stringify(jsonData, null, '\t'); // Initial beautified JSON

    // Function to toggle between beautified and original JSON
    let isBeautified = true; // Initial state is beautified
    function toggleJsonView() {
        if (isBeautified) {
            // Switch to normal view
            jsonElement.textContent = JSON.stringify(jsonData, null, 2); // Use 2 spaces for indentation
            isBeautified = false;
        } else {
            jsonElement.textContent = beautifiedData || '[Error beautifying JSON]';
            isBeautified = true;
        }
    }
}
function displayJsonPreview(sourceJson) {
    jsonPreviewContainer.style.display = 'flex';
    jsonPreviewElement.dataset.content_observe = sourceJson;
    jsonPreviewElement.style.userSelect = 'text';
    jsonPreviewElement.style.whiteSpace = 'pre-wrap';
    observer.observe(jsonPreviewElement);
}


function loadObservedContent(entry) {
    const jsonData = entry.target.dataset.content_observe;

    const sanitizedHTML = sanitizeHTML(jsonData);

    // Append sanitized HTML to avoid removing existing children like the media element or dummy image
    const tempDiv = createEl('div');
    tempDiv.innerHTML = sanitizedHTML;

    while (tempDiv.firstChild) {
        entry.target.appendChild(tempDiv.firstChild);
    }

    observer.unobserve(entry.target);
}

function sanitizeHTML(html) {
    function isValidForColoring(content) {
        return /^[a-zA-Z0-9\s\-_.,!?]+$/.test(content.trim());
    }

    html = html.replace(/-red\s(.*?)\sred-/gi, (match, content) => {
        if (isValidForColoring(content)) {
            return `<red>${content}</red>`;
        } else {
            return `&lt;-red ${content} red-&gt;`;
        }
    });

    html = html.replace(/-blu\s(.*?)\sblu-/gi, (match, content) => {
        if (isValidForColoring(content)) {
            return `<blu>${content}</blu>`;
        } else {
            return `&lt;-blu ${content} blu-&gt;`;
        }
    });

    html = html.replace(/-yellow\s(.*?)\syellow-/gi, (match, content) => {
        if (isValidForColoring(content)) {
            return `<yellow>${content}</yellow>`;
        } else {
            return `&lt;-yellow ${content} yellow-&gt;`; 
        }
    });

    html = html.replace(/<br>/gi, '&lt;br&gt;');
    html = html.replace(/\n/g, '<br>');
    const sanitizedString = html.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>?/gi, (tag) => {
        const allowedTags = ['br', 'red', 'blu', 'yellow'];
        const tagMatch = tag.match(/<\/?([a-z][a-z0-9]*)\b[^>]*>?/i);
        const tagName = tagMatch ? tagMatch[1].toLowerCase() : '';

        if (allowedTags.includes(tagName)) {
            return tag;
        } else {
            return tag.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
    });
    const validHtml = sanitizedString.replace(/<[^>]*$/g, (match) => {
        return match.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    });

    return applyCustomStyles(validHtml);
}




function applyCustomStyles(html) {
    const styles = {
        'red': 'color: red;',
        'blu': 'color: blue;',
        'yellow': 'color: yellow;' 
    };
    const styledHTML = html.replace(/<([a-z][a-z0-9]*)\b[^>]*>(.*?)<\/\1>/gi, (match, tag, content) => {
        if (styles[tag]) {
            if (content.trim()) {
                return `<span style="${styles[tag]}">${content}</span>`;
            } else {
                return `&lt;${tag}&gt;`;
            }
        } else {

            return `&lt;${tag}&gt;`;
        }
    });

    return styledHTML.replace(/&lt;br&gt;/g, '&lt;br&gt;');
}

// Function to sanitize HTML and allow only <br> tags
//function sanitizeHTML(html) {
//    // Replace <script> tags and other tags with escaped text
//    const sanitizedString = html.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>?/gi, (tag) => {
//        if (tag.toLowerCase() === '<br>' || tag.toLowerCase() === '</br>') {
//            return tag; // Allow <br> and </br> tags as is
//        } else {
//            return tag.replace(/</g, '&lt;').replace(/>/g, '&gt;'); // Escape other tags
//        }
//    });
//
//    return sanitizedString;
//}



function hideImagePreviewRequest(event) {
    if(event.target.id ==='image-preview-container') {
        hideImagePreview();
    }
}
function hideImagePreview() {
    previewImage.style.animation = 'preview-image-disappear-animation 0.15s forwards';
    setTimeout(() => {
        imagePreviewContainer.style.display = 'none';
        previewImage.src = '';
    }, 150);

}


function hideJsonPreview(event) {
    if(event.target.id ==='json-preview-container') {
        
        jsonPreviewContainer.style.display = 'none';
    }
}




function createYouTubeElement(url) {
    const youtubeURL = getYouTubeEmbedURL(url);
    const iframeElement = createEl('iframe');

    iframeElement.src = youtubeURL;
    iframeElement.frameborder = '0';
    iframeElement.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframeElement.allowFullscreen = true;
    iframeElement.setAttribute("allowfullscreen", "true");
    iframeElement.setAttribute("mozallowfullscreen", "true");
    iframeElement.setAttribute("msallowfullscreen", "true");
    iframeElement.setAttribute("oallowfullscreen", "true");
    iframeElement.setAttribute("webkitallowfullscreen", "true");


    iframeElement.className = 'youtube-element';
    return iframeElement;
}


function createVideoElement(url) {
    const videoElement = createEl('video');
    videoElement.src = url;
    videoElement.width = '560';
    videoElement.height = '315';
    
    videoElement.controls = true; 
    return videoElement;
}


function extractLinks(message) {
    if(message) {
        const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/g;
        return message.match(urlRegex) || [];
    }
}

function showReplyMenu(replyToMsgId,replyToUserId) {

    replyCloseButton.style.display = "flex";
    replyInfo.textContent = getUserNick(replyToUserId) + ' kişisine yanıt veriliyor';
    replyInfo.style.display = 'flex';
    currentReplyingTo = replyToMsgId;
    userInput.classList.add('reply-opened')
    
}

function closeReplyMenu() {

    replyCloseButton.style.display = "none";
    replyInfo.style.display = 'none';
    currentReplyingTo = '';
    userInput.classList.remove('reply-opened')
}
function createMsgOptionButton(message,isReply) {
    const textc = isReply ? '↪' : '⋯'; 
    
    const newButton = createEl('button',{className:'message-button'});

        const textEl = createEl('div', { textContent: textc, className: 'message-button-text' });
        newButton.appendChild(textEl);
    if(isReply) {
        newButton.onclick = function() {
            showReplyMenu(message.id,message.dataset.user_id);
        }

    }

    newButton.addEventListener("mousedown", function() {
        newButton.style.border = "2px solid #000000";
    });    
    newButton.addEventListener("mouseup", function() {
        newButton.style.border = "none";
    });
    newButton.addEventListener("mouseover", function() {
        newButton.style.backgroundColor = '#393a3b';
    });    
    newButton.addEventListener("mouseout", function() {
        newButton.style.backgroundColor = '#313338';
    });
    newButton.addEventListener('focus', () => {
        newButton.classList.add('is-focused');
    });
    newButton.addEventListener('blur', () => {
        newButton.classList.remove('is-focused');
    });
    let buttonContainer = message.querySelector('.message-button-container');
    if (!buttonContainer) {
        buttonContainer = createEl('div');
        buttonContainer.classList.add('message-button-container');
        message.appendChild(buttonContainer);
    }

    buttonContainer.appendChild(newButton);
    return newButton;
}


const ActionType = {
    COPY_ID: "ID'yi Kopyala",
    COPY_USER_ID: "Kullanıcı ID'sini Kopyala",
    INVITE_TO_GUILD: "Sunucuya Davet Et",
    BLOCK_USER: "Engelle",
    REPORT_USER: "Kullanıcı Profilini Bildir",
    REMOVE_USER: "Arkadaşı Çıkar",
    EDIT_GUILD_PROFILE: "Sunucu Profilini Düzenle",
    MENTION_USER : "Bahset"
};
const ChannelsActionType = {
    MARK_AS_READ: "Okundu olarak işaretle",
    COPY_LINK: "Bağlantıyı Kopyala",
    MUTE_CHANNEL: "Kanalı Sessize Al",
    NOTIFY_SETTINGS: "Bildirim Ayarları",
    EDIT_CHANNEL: "Kanalı Düzenle",
    DELETE_CHANNEL: "Kanalı Sil"

}
const VoiceActionType = {
    OPEN_PROFILE: "Profil",
    MENTION_USER: "Bahset",
    MUTE_USER: "Sustur",
    DEAFEN_USER: "Sağırlaştır"
    
}
function editGuildProfile() {
    const mimicEvent = 'event';
    mimicEvent.target = 'target';
    mimicEvent.target.id = 'settings';
    openGuildSettingsDd(mimicEvent);
}
function createUserContext(user_id) {
    const context = {
        [VoiceActionType.OPEN_PROFILE]: () => drawProfilePop(user_id),
        [VoiceActionType.MENTION_USER]: () => mentionUser(user_id),
        [VoiceActionType.MUTE_USER]: () => muteUser(user_id),
        [VoiceActionType.DEAFEN_USER]: () => deafenUser(user_id)
    };

    if (user_id === currentUserId) {
        context[ActionType.EDIT_GUILD_PROFILE] = () => editGuildProfile();
    }

    if (isDeveloperMode) {
        context[ActionType.COPY_ID] = () => copyId(user_id);
    }

    return context;
}


function openReactionMenu(message_id) {
    console.log("Opening react menu for: ",message_id);
}
function openEditMessage(message_id) {
    console.log("Editing message ",message_id);
}
function pinMessage(message_id) {
    console.log("Pinning message ",message_id);
}

function markAsUnread(message_id) {
    console.log("Marking as unread message ",message_id);
}
function deleteMessage(message_id) {
    console.log("Deleting message ",message_id);
    let data = {
        'is_dm' : isOnDm,
        'message_id' : message_id,
        'channel_id' : isOnGuild ? currentChannelId : currentDmId
    }
    if(isOnGuild) {
        data['guild_id'] = currentGuildId;
    }
    socket.emit('message_delete',data);
}
function inviteToGuild(user_id) {
    console.log(user_id);
}
function blockUser(user_id) {
    console.log(user_id);
}
function reportUser(user_id) {
    console.log(user_id);
}
function mentionUser(user_id) {

}   
function removeDm(user_id) {


}
function getGuildName(guild_id) {
    const guild = currentGuildData[guild_id];
    return guild ? guild.name : 'Unknown Guild';
}

function getManageableGuilds() {
    if(!permissions_map) { return [] }
    const guildsWeAreAdminOn = [];
    let isFoundAny = false;
    for (const key in permissions_map) {
        if (permissions_map[key].is_admin) {
            guildsWeAreAdminOn.push(key);
            isFoundAny = true;
        }
    }
    return isFoundAny ? guildsWeAreAdminOn : null;
}





function inviteUser(user_id,guild_id) {
    if(!user_id || !guild_id) { return; }
    
    console.log("inviting user : ", user_id , ' to guild ' , guild_id);
    OpenDm(user_id);
    

}


function removeFriend(user_id) {
    socket.emit('friend_request_event', 'remove_friend', { 'friend_id': user_id });
}

const MessagesActionType = {
    ADD_REACTION: "Tepki Ekle",
    EDIT_MESSAGE: "Mesajı Düzenle",
    PIN_MESSAGE: "Mesajı Sabitle",
    REPLY: "Yanıtla",
    MARK_AS_UNREAD: "Okunmadı olarak işaretle",
    DELETE_MESSAGE: "Mesajı Sil",
}

function copyChannelLink(guild_id,channel_id) {
    const content = constructAbsoluteAppPage(guild_id,channel_id);
    navigator.clipboard.writeText(content)
}
function copyId(channel_id) {
    navigator.clipboard.writeText(channel_id);
}

function muteChannel(channel_id) {
    alertUser("Mute channel is not implemented!");

}
function showNotifyMenu(channel_id) {
    alertUser("Notify menu is not implemented!");
}
function editChannel(channel_id) {
    alertUser("Channel editing is not implemented!");
    
}
function deleteChannel(channel_id,guild_id) {
    const data = {
        'guild_id' : guild_id,
        'channel_id' : channel_id
    }
    socket.emit('remove_channel',data);
    
}


function appendToChannelContextList(channel_id) {
    contextList[channel_id] = createChannelsContext(channel_id);
}

function appendToMessageContextList(message_id,user_id) {
    messageContextList[message_id] = createMessageContext(message_id,user_id);
}
function appendToProfileContextList(userData,user_id) {
    if(user_id && userData) {
        contextList[user_id] = createProfileContext(userData,user_id);
    }
}


function createOptions3Button(message,message_id,user_id) {
    const button = createMsgOptionButton(message,false);
    button.dataset.m_id = message_id;

    appendToMessageContextList(message_id,user_id);
    

}


let isUsersOpen = true;

function loadEmojisContent() {

}

function displayGIFs(gifDatas) {
    gifsMenuContainer.innerHTML = ''; 

    gifDatas.forEach(gifData => {
        const img = createEl('img',{className:'gif-content',src:gifData.preview});
        gifsMenuContainer.appendChild(img);

        img.addEventListener('click',function() {
            toggleGifs();
            sendMessage(gifData.gif);
        });


    });
}
async function loadGifContent() {
    const query = gifsMenuSearchBar.value;
    if(!query) {
        gifsMenuContainer.innerHTML = '';
        return;
    } 

    const url = `https://liventcord-gif-worker.efekantunc0.workers.dev?q=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(`API error: ${data.error}`);
        }
        console.warn(data.results);

        const gifElements = data.results.map(result => ({
            gif: result.media_formats.gif.url,
            preview: result.media_formats.tinygif.url,
        }));

        displayGIFs(gifElements);
    } catch (error) {
        console.error('Error fetching or parsing GIFs:', error);
    }
}

function toggleEmojis() {
    if(isGifsOpen) {
        closeGifs();
    } else {
        gifMenu.style.display = 'block';
        loadEmojisContent();
    }
    isGifsOpen = !isGifsOpen;
}
function closeGifs() {
    gifMenu.style.display = 'none';
}
async function toggleGifs() {
    if (isGifsOpen) {
        closeGifs();
    } else {
        gifMenu.style.display = 'block';
    }
    isGifsOpen = !isGifsOpen;
}

function togglePin() {
    console.log("Toggle pin!");
}