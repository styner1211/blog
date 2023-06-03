# Helm으로 Redis 설치하기

## Redis 레포지토리 추가 및 차트 다운로드

```sh
$ helm repo add bitnami https://charts.bitnami.com/bitnami
$ helm fatch bitnami/redis
$ tar xzvf redis-17.10.3.tgz
```

## `values.yaml` 수정

```
$ cd redis
$ sudo vi values.yaml
```

### `values.yaml` 설정

```
...
architecture: replication # standalone으로 수정
...
...
service:
  type: ClusterIP # NodePort 로 수정
  ...
  nodePorts:
    redis: 30003

```

## Redis 설치

> 로컬 개발 목적이므로 standalone으로 설치한다.

```sh
$ kubectl create namespace redis
$ helm install redis -f values.yaml . -n redis
```
```
NAME: redis
LAST DEPLOYED: Sat May 27 14:06:38 2023
NAMESPACE: redis
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
CHART NAME: redis
CHART VERSION: 17.10.3
APP VERSION: 7.0.11

** Please be patient while the chart is being deployed **

Redis&reg; can be accessed on the following DNS names from within your cluster:

    redis-master.redis.svc.cluster.local for read/write operations (port 6379)
    redis-replicas.redis.svc.cluster.local for read-only operations (port 6379)



To get your password run:

    export REDIS_PASSWORD=$(kubectl get secret --namespace redis redis -o jsonpath="{.data.redis-password}" | base64 -d)

To connect to your Redis&reg; server:

1. Run a Redis&reg; pod that you can use as a client:

   kubectl run --namespace redis redis-client --restart='Never'  --env REDIS_PASSWORD=$REDIS_PASSWORD  --image docker.io/bitnami/redis:7.0.11-debian-11-r7 --command -- sleep infinity

   Use the following command to attach to the pod:

   kubectl exec --tty -i redis-client \
   --namespace redis -- bash

2. Connect using the Redis&reg; CLI:
   REDISCLI_AUTH="$REDIS_PASSWORD" redis-cli -h redis-master
   REDISCLI_AUTH="$REDIS_PASSWORD" redis-cli -h redis-replicas

To connect to your database from outside the cluster execute the following commands:

    export NODE_IP=$(kubectl get nodes --namespace redis -o jsonpath="{.items[0].status.addresses[0].address}")
    export NODE_PORT=$(kubectl get --namespace redis -o jsonpath="{.spec.ports[0].nodePort}" services redis-master)
    REDISCLI_AUTH="$REDIS_PASSWORD" redis-cli -h $NODE_IP -p $NODE_PORT

```

### paasword
```
$ export REDIS_PASSWORD=$(kubectl get secret --namespace redis redis -o jsonpath="{.data.redis-password}" | base64 -d)
$ echo $REDIS_PASSWORD
```


### Redis 삭제

> 아래 명령어 외, Harbor 관련 PVC를 모두 삭제해야 재설치시 로그인 이슈가 없음

```sh
$ helm delete -n redis redis
```