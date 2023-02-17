# 쿠버네티스 설치(K8S installation)

> 집에 놀고 있는 리눅스 머신에 K8S를 설치 해보자

## [Docker 설치](https://docs.docker.com/engine/install/ubuntu/)

### Set up the repository
#### 1. Update the `apt` package index and install packages to allow `apt` to use a repository over HTTPS: 
```sh
$ sudo apt-get update

$ sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
```

#### 2. Add Docker’s official GPG key:
```sh
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

#### 3. Use the following command to set up the stable repository.
```sh
$ echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

### Install Docker Engine
```sh
$ sudo apt-get update

$ sudo apt-get install docker-ce docker-ce-cli containerd.io
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



## [kubeadm, kubelet, kubectl 설치](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)


### 1. Update the `apt` package index and install packages needed to use the Kubernetes `apt` repository:
```sh
$ sudo apt update
$ sudo apt-get install -y apt-transport-https ca-certificates curl
```



### 2. Download the Google Cloud public signing key:
```sh
$ sudo curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg
```

### 3. Add the Kubernetes `apt` repository:
```sh
$ echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
```

### 4. Update `apt` package index, install kubelet, kubeadm and kubectl
```sh
$ sudo apt-get update
$ sudo apt-get install -y kubelet kubeadm kubectl
```

## control-plane node 초기화
```sh
$ sudo kubeadm init --pod-network-cidr=10.244.0.0/16 --apiserver-advertise-address=172.19.215.160
```
위 명령어 실행 후, 일정 시간이 지나면 다음과 같은 문구를 볼 수 있다.

```
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a Pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  /docs/concepts/cluster-administration/addons/

You can now join any number of machines by running the following on each node
as root:

  kubeadm join <control-plane-host>:<control-plane-port> --token <token> --discovery-token-ca-cert-hash sha256:<hash>
```



### 선택 사항: non-root user를 위한 작업
```sh
$ mkdir -p $HOME/.kube
$ sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
$ sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

### master node 필수 사항: Pod network ad-on 설치
```sh
kubectl apply -f https://raw.githubusercontent.com/flannel-io/flannel/master/Documentation/kube-flannel.yml
```

## K8S 클러스터에 다른 노드 추가
> 각 노드에서 위 과정을 통해 K8S 구동에 필요한 요소를 먼저 설치하자
hash값은 마스터 노드에서 `kube init`을 실행하고 난 뒤, 안내 문구에서 확인할 수 있다.
```sh
kubeadm join <control-plane-host>:<control-plane-port> --token <token> --discovery-token-ca-cert-hash sha256:<hash>
```

## kubenates dashboard 설치

### yaml 파일 다운로드
```sh
$ curl https://raw.githubusercontent.com/kubernetes/dashboard/v2.5.0/aio/deploy/recommended.yaml -o dashboard.yaml
```


### `dashboard.yaml` 수정
```sh
$ vi dashboard.yaml 수정

# 162번째 줄: name: kubernetes-dashbord -> name: cluster-admin
# 200번째 줄: --enable-skip-login 추가
```


### dashboard 디플로이먼트 생성
```sh
$ kubectl apply -f dashboard.yaml
```

```sh
$ kubectl -n kubernetes-dashboard edit service kubernetes-dashboard #NodePort로 수정

$ kubectl -n kubernetes-dashboard get service kubernetes-dashboard #포트 확인
```

### metric server 
```sh
$ kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```