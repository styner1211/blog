# Gitlab

## GitLab 설치 및 실행

> Docker를 이용하여 설치하자.

## GitLab Volume 위치 지정

| Local Location | Container Location | Usage |
| :-- | :-- | |
| $GITLAB_HOME/data | /var/opt/gitlab | For storing application data |
| $GITLAB_HOME/logs	| /var/log/gitlab | For storing logs |
| $GITLAB_HOME/config | /etc/gitlab | For storing the GitLab configuration files |

## Docker Engine으로 GitLab 실행하기

```sh
$ sudo docker run --detach \
  --hostname 호스트이름 \
  --env GITLAB_OMNIBUS_CONFIG="external_url 'http://호스트이름:11080'; gitlab_rails['gitlab_shell_ssh_port'] = 11022" \
  --publish 11443:443 --publish 11080:80 --publish 11022:22 \
  --name gitlab \
  --restart always \
  --volume ./gitlab/config:/etc/gitlab \
  --volume ./gitlab/logs:/var/log/gitlab \
  --volume ./gitlab/data:/var/opt/gitlab \
  --shm-size 256m \
  gitlab/gitlab-ce:latest
```

애플 실리콘 M1에서는 별도의 이미지를 이용해서 실행해야 한다. 그렇지 않으면 아래 에러 메시지를 만나게 될 것이다.

```
exec format error
```

> Helm Chart를 이용해서 GilLab을 설치하려 했을 때도, 위 에러 메시지가 났었는데, 실리콘 맥에서는 별도의 도커 이미지를 구해서 실행해야 햇다. (삽질 많이함...)

```sh
$ sudo docker run --detach \
  --hostname 203504.iptime.org \
  --env GITLAB_OMNIBUS_CONFIG="external_url 'http://203504.iptime.org:11080'; gitlab_rails['gitlab_shell_ssh_port'] = 11022" \
  --publish 11080:11080 --publish 11022:22 \
  --name gitlab \
  --restart always \
  --volume ./gitlab/config:/etc/gitlab \
  --volume ./gitlab/logs:/var/log/gitlab \
  --volume ./gitlab/data:/var/opt/gitlab \
  --shm-size 256m \
  yrzr/gitlab-ce-arm64v8:latest
```

## GitLab 접속

```
http://localhost:11080
```

## GitLab `root` 계정의 초기 비밀번호 확인

```sh
$ sudo docker exec -it gitlab grep 'Password:' /etc/gitlab/initial_root_password
```