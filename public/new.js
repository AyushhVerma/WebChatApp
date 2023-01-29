const room = uuid.v4();
const user = document.querySelector('#userName');
const room_id = document.querySelector('#room_id');
const btn_1 = document.querySelector('#btn1')
const btn_2 = document.querySelector('#btn2')
const copy_btn = document.querySelector('#copyToClip');
const user_error = document.querySelector('span');
let shownId = false;

const showRoomId = (roomId) => {
    span = document.createElement('span');
    span.innerHTML = `copy and share ID:<br /> ${roomId}<br />`;
    span.id = 'spanId';
    document.querySelector('#show').prepend(span);
    btn_1.classList.toggle('visibility');
    copy_btn.classList.toggle('visibility');
    copy_btn.innerHTML = 'Copy';
}

const addError = () => {
    user_error.classList.add('error');
    user_error.style.visibility = 'visible';
}

const copied = () => {
    copy_btn.innerHTML = 'Copied';
    navigator.clipboard.writeText(room);
    setTimeout(() => {
        copy_btn.innerHTML = 'Copy'
    }, 10000);
}

const render = () => {
    newName = user.value.trim();
    if (newName.indexOf(' ') > 0) {
        addError();
        return;
    }
    if (newName.length > 0) {
        user_error.style.visibility = 'hidden';
        user_error.classList.remove('error');
    } else if(shownId === false){
        addError();
    }
    if (newName.length && shownId === false) {
        showRoomId(room);
        shownId = true;
    }
}

btn_2.onclick = () => {
    if (user.value.trim().length === 0 || user.value.trim().includes(' ')) {
        addError();
    } else if (room_id.value.length === 0) {
        alert('Room id invalid');
    }
    else {
        url = window.location.origin + `/room.html?val=tr&username=${user.value.trim()}&room=${room_id.value}`;
        window.location.href = url;
    }
}

btn_1.onclick = () => {
    if (user.value.trim().length && !user.value.trim().includes(' ')) {
        url = window.location.origin + `/room.html?val=nt&username=${user.value.trim()}&room=${room}`;
        window.location.href = url;
    } else {
        addError();
    }
}