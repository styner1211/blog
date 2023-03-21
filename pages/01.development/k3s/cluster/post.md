# K3S 멀티 노드 클러스터 구성

[Multipass](/01.development/env/multipass)를 이용하여 우분투 VM을 생성한다.

## 내 구형 맥북 프로에 우분투 VM을 구성하고, 마스터 노드1로 만들기 

### k3s-master1 구성: 

```sh
sudo multipass launch --name k3s-master1 --cpus 2 --memory 8G --disk 120G
```

### K3S 설치 및 실행

```sh
multipass exec k3s-master1 -- /bin/bash -c "curl -sfL https://get.k3s.io | K3S_KUBECONFIG_MODE="644" sh -"
```

### k3s 노드 정보 확인
```sh
$ multipass exec k3s-master1 kubectl get nodes
```


### 내 맥미니: k3s-master2

### 내 마이크로서버: k3s-master3


## K3S 설치