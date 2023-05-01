# 도커 (Docker)

> 참고: [Docker 설치](https://docs.docker.com/engine/install/ubuntu/)


### Set up the repository
#### 1. Update the `apt` package index and install packages to allow `apt` to use a repository over HTTPS: 
```sh
$ sudo apt-get update

$ sudo apt-get install \
    ca-certificates \
    curl \
    gnupg
```

#### 2. Add Docker’s official GPG key:
```sh
sudo mkdir -m 0755 -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```

#### 3. Use the following command to set up the stable repository.
```sh
$ echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

### Install Docker Engine
```sh
$ sudo apt-get update

$ sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```


### `daemon.json` 수정
도커 레지스트리에서 인증 없이 `docker pull`을 하기 위해 아래와 같이 수정하자.
```sh
$ cd /etc/docker

$ sudo vi daemon.json
```

```json
{
    ...
    "exec-opts":["native.cgroupdriver=systemd"], // 추가
    "insecure-registries": ["도커 레지스트리 주소"], // 추가
    ...
}
 
```
### Docker 재시작
```sh
$ sudo systemctl daemon-reload
$ sudo systemctl restart docker
$ sudo systemctl restart kubelet (kubelet이 설치 되어있으면 재시작)
```
