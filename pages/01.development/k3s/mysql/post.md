# Helm으로 MySql 설치하기

Helm으로 쿠버네티스 클러스터에 MySql 설치해보자.

> Helm에서는 패키지를 차트(Chart)라고 부른다.

Helm 공식 저장소(레포지토리)에 있는 차트들이 유지보스가 되지 않은 경우가 많다.
따라서 다음 명령어를 이용하여 bitnami 저장소를 추가한다.

## bitnami 저장소 추가

```sh
$ helm repo add bitnami https://charts.bitnami.com/bitnami
```

## Namespace 추가
```sh
kubectl create ns mysql
``` 

## MySql 설치

> `--set` 뒤에 `키`=`값` 형식으로 각종 설정 값을 넣을 수 있다.

```sh
$ helm install -n mysql mysql --set auth.rootPassword=[패스워드] bitnami/mysql
```

## 설치 완료
```
NAME: mysql
LAST DEPLOYED: Mon Apr  3 16:07:07 2023
NAMESPACE: mysql
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
CHART NAME: mysql
CHART VERSION: 9.7.1
APP VERSION: 8.0.32

** Please be patient while the chart is being deployed **

Tip:

  Watch the deployment status using the command: kubectl get pods -w --namespace mysql

Services:

  echo Primary: mysql.mysql.svc.cluster.local:3306

Execute the following to get the administrator credentials:

  echo Username: root
  MYSQL_ROOT_PASSWORD=$(kubectl get secret --namespace mysql mysql -o jsonpath="{.data.mysql-root-password}" | base64 -d)

To connect to your database:

  1. Run a pod that you can use as a client:

      kubectl run mysql-client --rm --tty -i --restart='Never' --image  docker.io/bitnami/mysql:8.0.32-debian-11-r21 --namespace mysql --env MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD --command -- bash

  2. To connect to primary service (read/write):

      mysql -h mysql.mysql.svc.cluster.local -uroot -p"$MYSQL_ROOT_PASSWORD"
```


## 설치된 릴리즈 목록 확인

```sh
$ helm ls
```

## 컨테이너 접속

```sh
kubectl exec -it <pod-name> bash or sh
```


## MySql 접속

```sh
PGPASSWORD=<password> psql -h <host or service name or localhost> -U <username> <dbname>
```