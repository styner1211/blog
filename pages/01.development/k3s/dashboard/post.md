# Kubernetes Dashboard

## Kubernetes Dashbaord 설치

```sh
GITHUB_URL=https://github.com/kubernetes/dashboard/releases
VERSION_KUBE_DASHBOARD=$(curl -w '%{url_effective}' -I -L -s -S ${GITHUB_URL}/latest -o /dev/null | sed -e 's|.*/||')
sudo k3s kubectl create -f https://raw.githubusercontent.com/kubernetes/dashboard/${VERSION_KUBE_DASHBOARD}/aio/deploy/recommended.yaml
```

### `dashboard.admin-user.yml` 파일 생성
```
apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin-user
  namespace: kubernetes-dashboard
```

### `dashboard.admin-user-role.yml` 파일 생성
```
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: admin-user
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: admin-user
  namespace: kubernetes-dashboard
```

### `admin-user` 구성 배포
```sh
sudo k3s kubectl create -f dashboard.admin-user.yml -f dashboard.admin-user-role.yml
```

### `admin-user` 토큰 생성
> 토큰은 잘 기록해 두자.
```sh
sudo k3s kubectl -n kubernetes-dashboard create token admin-user --duration=720h
```

## K3S 클러스터 외부에서 대시보드 접속

위 방식으로 배포한 Kubernates Dashboard는 기본적으로 K3S 클러스터 내부에서만 접근할 수 있다. 만약 K3S 클러스터 외부에서 대시보드에 접근하고 싶다면, NodePort 설정을 하던가, Ingress를 이용하여 대시보드를 외부로 노출 시킬 수 있다.

### Ingress 설정

> K3S는 디폴트로 Traefik을 이용한다.

#### `kubernetes-dashboard-ingress.yml` 파일 생성

아래 hosts에 들어가 있는 값인 vm-macmini는 K3S가 실행되어 있는 우분투 VM의 호스트 명으로. http://vm-macmini로 접속하면 kubernetes-dashboard 서비스의 9090 포트로 트래픽이 전달된다.

> vm-macmini 처럼 호스트명으로 접근하기 위해 로컬 DNS 설정이 필요하다. 

```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: kubernetes-dashboard-ingress
  namespace: kubernetes-dashboard
  labels:
    app: kubernetes-dashboard
  annotations:
    kubernetes.io/ingress.class: "traefik"
spec:
  rules:
  - host: vm-macmini
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: kubernetes-dashboard
            port:
              number: 9090
```

#### 로컬 DNS 설정


자신의 로컬 환경(예를 들면, 내 맥미니)에서 우분투 VM 내부에서 구동되고 있는 K3S 대시보드에 접근하기 위해서, 로컬 환경의 `/etc/hosts/`를 수정하여 host 이름으로 우분투 VM에 접근할 수 있도록 한다.

```sh
sudo vi /etc/hosts
```

에서 아래 라인은 추가한다.

```
192.168.0.40    vm-macmini
```

#### Ingress 배포

```sh
kubectl apply -f kubernetes-dashboard-ingress.yml
```

위처럼 배포한 뒤, http://vm-macmini로 접속하면, `404 page not found` 가 나타날 것이다.

이것은 kubernetes-dashboard 서비스로 트래픽이 전달 되지 못했기 때문이다.

#### kubernetes-dashboard 서비스 객체 수정

```sh
kubectl edit service kubernetes-dashboard -n kubernetes-dashboard
```
```
ports:
  - port: 443 # 9090으로 수정
    protocol: TCP
    targetPort: 8443 # 9090으로 수정
```

#### kubernetes-dashboard 디플로이먼트 객체 수정

```sh
kubectl edit deployment kubernetes-dashboard -n kubernetes-dashboard
```

```
- args:
        - --auto-generate-certificates # 삭제
        - --enable-skip-login=false # 추가
        - --enable-insecure-login=true # 추가
        - --namespace=kubernetes-dashboard
        image: kubernetesui/dashboard:v2.7.0
        imagePullPolicy: Always
        livenessProbe:
          failureThreshold: 3
          httpGet:
            path: /
            port: 8443 # 9090으로 수정
            scheme: HTTPS # HTTP로 수정
          initialDelaySeconds: 30
            periodSeconds: 10  
            successThreshold: 1     
            timeoutSeconds: 30
        name: kubernetes-dashboard
        ports:               
        - containerPort: 8443 # 9090으로 수정
          protocol: TCP 
```

위와 같이 수정 후, 디플로이먼트를 재시작 한다.

> 파드 수를 줄였다가 늘리는 방식으로 재시작

```sh
kubectl scale deploy kubernetes-dashboard --replicas 0 -n kubernetes-dashboard
kubectl scale deploy kubernetes-dashboard --replicas 1 -n kubernetes-dashboard
```

그리고 아래 명령으로 서비스 객체에 열려있는 포트가 9090인지 확인한다.

```sh
kubectl get all -n kubernetes-dashboard
```

```
...
service/kubernetes-dashboard        ClusterIP   10.43.116.244   <none>        9090/TCP   43m
...
```

#### K3S 클러스터 외부(내 맥미니)에서 대시보드 접속

http://vm-macmini/#/login 로 접속 해보면, 아래와 같은 경고 메시지와 함께 로그인이 불가능한 것을 알 수 있다.

<img width="600" src="/assets/development/k3s/dashboard/insecure.png" />

이것은 경고 메시지 그대로 대시보드에 접속하기 위해서는, K3S 내부에서 localhost로 접근하거나, https 프로토콜을 이용해서 접근만 허용 가능하도록 만들어져 있기 때문이다.

하지만, http://vm-macmini/#/login 로 접속하면 위에서 기록해둔 토큰을 입력하면 로그인이 가능하다!
