# 5-minute-alco-market

### Состав проекта

 * game-client - Клиент игры. Web страничка. VanillaJs + HTML + SASS.
 * game-server - Сервер игры. SpringBoot + WebSocket.
 
#### Game-client

пока пусто :(

#### Game-server

##### Сборка:

###### _Сборка сервера_:

Нужен maven и jdk11.

Maven: [Apache Maven Downloads](https://maven.apache.org/download.cgi)

JDK11: [Oracle JavaSE JDK-11](https://www.oracle.com/ru/java/technologies/javase-jdk11-downloads.html)

Из директории модуля **_"./game-server"_** в терминале (**cmd**) выполняем команду:

    -> mvn clean install

На выходе получаем jar-архив: _"./game-server/target/game-server-1.0-SNAPSHOT.jar"_.

###### _Сборка docker образа_:

В составе модуля есть _dockerfile_.

Перед сборкой необходимо установить сам docker.

Docker: [Get Docker](https://docs.docker.com/get-docker/)

Из директории модуля **_"./game-server"_** в терминале (**cmd**) выполняем команду:

    -> docker build -t aimtupsu/game-server:1.0 .

На выходе получаем docker image. Для проверки выполняем команду:

    -> docker image ls
    <- REPOSITORY             TAG       IMAGE ID       CREATED          SIZE
    <- aimtupsu/game-server   1.0       aea0f94a11b5   21 minutes ago   329MB

###### _Запуск сервера_:

1. Если есть только jar-архив
    
    Из директории модуля **_"./game-server"_** выполняем команду:
        
        -> java -jar target/game-server-1.0-SNAPSHOT.jar
 
2. Если установлен docker и собран docker image
    
    Первый раз создаём контейнер и запускаем его. Для этого выполняем команду:
    
        -> docker run -d -p 8080:8080 --name game-server aimtupsu/game-server:1.0
        
    Параметр `-d` говорит о том, что образ будет запущен в виде демон-процесса. 
    Если мы не хотим запускать его как демон-процесс, то убираем этот параметр.
    
    Для вывода логов нашего демон-контейнера выполняем команду:
    
        -> docker logs -f game-server
        
    Для остановки контейнера:
        
        -> docker stop game-server
    
    Для проверки статуса:
    
        -> docker ps -a
        <- CONTAINER ID   IMAGE                      COMMAND    CREATED         STATUS                       PORTS     NAMES
        <- 24a3c0014158   aimtupsu/game-server:1.0   "java …"   9 minutes ago   Exited (143) 3 minutes ago             game-server

    Для повторного запуска:
    
        -> docker start game-server

3. Если docker есть, но нет ни jar-архива, ни docker image
    
    Пулим docker image из репозитория:
    
        -> docker pull aimtupsu/game-server:1.0
        
    И также, как и в п.2 создаём из docker image контейнер и запускаем его:
        
        -> docker run -d -p 8080:8080 --name game-server aimtupsu/game-server:1.0