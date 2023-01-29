const input = document.querySelector('input');
const socket = io(window.location.origin);
const listEle = document.querySelector('#names');
const link = location.href;

const [val, username, room] = [
    link.slice(link.indexOf('?val=') + 5, link.indexOf('&username=')),
    link.slice(link.indexOf('&username=') + 10, link.lastIndexOf('&room')),
    link.slice(link.lastIndexOf('&room=') + 6)
];

socket.on('connection');
socket.emit('createOrJoinRoom', ({ username, room, val }), () => {
    if (val === 'tr'){
        window.location.href = window.location.origin;
        alert("room not created yet");
    }
});

socket.on('usererror', msg => {
    alert(msg);
})

socket.on('showmessage', (data) => {
    let blob = new Blob([...data.data], { type: "image/jpeg" });
    let urlCreator = window.URL || window.webkitURL;
    let imageUrl = urlCreator.createObjectURL(blob);
    showImages(imageUrl, data.socket_id);
})

showImages = (src, socket_id) => {
    let addStyle = false;
    if (socket_id === socket.id) {
        addStyle = true;
    }
    flexdiv = document.createElement('div');
    imgdiv = document.createElement('div');
    img = document.createElement('img');
    img.src = src;
    img.id = 'shared-image';
    a = document.createElement('a');
    a.setAttribute('class', 'fas fa-download');
    a.href = src;
    flexdiv.classList.add('container');
    a.setAttribute('download', '');
    if (addStyle) {
        flexdiv.classList.add('to-right');
    } else {
        flexdiv.classList.add('to-left');
    }
    imgdiv.classList.add('img-div-card');
    imgdiv.append(img, a);
    flexdiv.append(imgdiv);
    document.querySelector('.container-c').append(flexdiv, document.createElement('br'));
    window.scrollTo(0, document.body.scrollHeight);
}

socket.on('presentUsers', users => {
    listEle.innerHTML = users.length > 1 ? 'Users in room:&nbsp;&nbsp;' : 'User in room:&nbsp;&nbsp;';
    span = document.createElement('span');
    span.innerHTML = '';
    users.forEach(user => {
        span.innerHTML += `${user.username},&nbsp;`;
    })
    span.innerHTML = span.textContent.slice(0, -2);
    listEle.append(span);
})

input.addEventListener('change', (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    offset = 0;
    chunks = 64 * 1024;
    dataArray = [];
    if (file.type.indexOf('image/') === 0) {
        reader.onloadend = () => {
            buf = reader.result;
            while (buf.byteLength - offset > 0) {
                c = buf.slice(0, offset);
                if (offset < buf.byteLength) {
                    dataArray.push(buf.slice(offset, offset + chunks));
                    offset += chunks;
                } else {
                    dataArray.push(buf.slice(offset));
                }
            }
            console.log(dataArray)
            socket.emit('message', { data: dataArray, socket_id: socket.id });
        }
        reader.readAsArrayBuffer(file);
    } else {
        alert('input error');
    }
});

document.querySelector('#leave').onclick = () => {
    window.location.href = window.location.origin;
}