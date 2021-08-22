
// Хранитель текущего соединения с сервером по WebSocket.
var ws;

// Визуализирует соединение по WebSocket.
function setConnected(connected) {
    document.getElementById("connect-btn").disabled = connected;
    document.getElementById("disconnect-btn").disabled = !connected;
}

// Функция-обработчик события Открытия соединения по WebSocket.
function onOpenWs() {
    console.log('Connected');
    setConnected(true);
}

// Функция-обработчик события Ошибки соединения по WebSocket.
function onErrorWs() {
    console.log('Connecting is failed');
}

// Функция-обработчик события Закрытия соединения по WebSocket.
function onCloseWs(event) {
    console.log('Disconnected. Code: ' + event.code);
    setConnected(false);
    ws = null;
}

function onMsgWs(event) {
    console.log("Message is received: " + event);
    document.getElementById("server-response-label").innerHTML = event.data;
}

// Настраивает соединение по WebSocket.
function configureWs() {
    ws = new WebSocket('ws://localhost:8080/message');
    ws.onopen = onOpenWs;
    ws.onerror = onErrorWs;
    ws.onclose = onCloseWs;
    ws.onmessage = onMsgWs;
}

// Возвращает - true, если текущее соединение готово к закрытию, иначе - false.
// Соединение считается готовым к закрытию, если состояние соединения одно из:
//  * CONNECTING(0) - соединение ещё не открыто;
//  * OPEN(1) - соединение открыто и готово к работе.
function IsWsReadyToClose() {
    return ws.readyState == 0 || ws.readyState == 1;
}

// Выполняет подключение по WebSocket к серверу, если оно ещё не было установлено.
function connect() {
    if (ws == null) {
        console.log('Trying to connect');
	    configureWs();
    }
}

// Выполняет разрыв соединения с сервером по WebSocket, если оно готово к закрытию.
function disconnect() {
    if (ws != null && IsWsReadyToClose()) {
        ws.close();
    }
}