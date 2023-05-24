# K3S 멀티 노드 클러스터 구성


## 우분투 VM을 구성
맥미니와 맥북프로에 각각 VMware Fusion을 이용하여 Ubuntu 20.04 Server를 설치한다.

## K3S 설치: Server 노드

Ubuntu VM에서 다음 명령어로 K3S를 설치한다.

> 참고로, K3S에서는 master node를 server node, worker node를 agent node라 한다.

### 1. single server(master)로 구성하기

```sh
$ curl -sfL https://get.k3s.io | sh -
```

> `kubectl` 명령어를 사용하기 위해 아래 명령어를 이용하자

```sh
$ sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config && sudo chown $USER ~/.kube/config && sudo chmod 644 ~/.kube/config && export KUBECONFIG=~/.kube/config
```


### 2. multiple server(master)로 구성하기 
K3S는 디폴트 datasource로 Embedded SQLite를 사용한다. --cluster-init 옵션은 Embedded etcd를 사용하도록 하여 multiple server를 통한 HA 구성을 가능하게 한다.

```sh
$ curl -sfL https://get.k3s.io | K3S_KUBECONFIG_MODE="644" sh -s - server --cluster-init
```





## K3S 설치: Agent 노드

### 마스터 노드(server node)의 시크릿 토큰 확인
```sh
$ sudo cat /var/lib/rancher/k3s/server/node-token
``` 

### Agent 노드에 K3S 설치
```sh
$ curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--write-kubeconfig ~/.kube/config --write-kubeconfig-mode 666 --tls-san [마스터 IP] --kube-apiserver-arg advertise-address=59.12.64.80" sh -
```


## `.bashrc` 수정

```
...
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
...
```

## 참고
### K3S 삭제
```sh
$ /usr/local/bin/k3s-killall.sh
```
```sh
$ /usr/local/bin/k3s-uninstall.sh
```




### K3S 설치 및 실행: HA 구성을 위한 또다른 마스터 노드

> HA 구성을 위해서는 server node를 2대 더 아래와 같이 클러스터에 추가한다. (server node 총 3대)

```sh
$ curl -sfL https://get.k3s.io | K3S_KUBECONFIG_MODE="644" K3S_TOKEN=[시크릿]] sh -s - server --server https://[마스터 IP]:6443
```

```sh
$ curl -sfL https://get.k3s.io | K3S_URL=https://[마스터 IP]:6443 K3S_TOKEN=[시크릿] sh -
```


#### k3s 구동 상태 확인
```sh
$ sudo systemctl status k3s
```

#### 노드 상태 확인
```sh
$ kubectl get node -o wide
```

```sh
$ kubectl get all -A -o wide
```

#### 노드의 모니터링

> K3S 설치 시 metric 서버도 함께 설치해주었기 때문에 아래와 같은 모니터링이 가능하다. 

```sh
$ kubectl top node
```
