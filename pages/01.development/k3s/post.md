# K3S

> The certified Kubernetes distribution built for IoT & Edge computing


K3s를 개발한 Rancher에서는 두 가지 방법으로 오리지널 쿠버네티스를 경량화하였다.

​
- 더 적은 메모리를 사용하는 구조 사용

  - 쿠버네티스 클러스터 구성요소를 하나의 프로세스로 묶어서 중복으로 사용되는 부분을 제거

- 더 작은 크기의 바이너리 사용

  - 써드파티 스토리지 드라이버와 클라우드 프로바이더 관련 요소를 제거하여 용량을 줄임

​

그리고 아래에 나와있는 것들을 한 번에 제공한다고 나와있고 교체도 가능하다.

​
- Containerd & runc
- Flannel for CNI
- CoreDNS
- Metrics Server
- Traefik for ingress
- Klipper-lb as an embedded service load balancer provider
- Kube-router netpol controller for network policy
- Helm-controller to allow for CRD-driven deployment of helm manifests
- Kine as a datastore shim that allows etcd to be replaced with other databases
- Local-path-provisioner for provisioning volumes using local storage
- Host utilities such as iptables/nftables, ebtables, ethtool, & socat
