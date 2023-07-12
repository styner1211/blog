# Helm으로 Kafka 설치하기

## Kafka 레포지토리 추가 및 차트 다운로드

```sh
$ helm repo add bitnami https://charts.bitnami.com/bitnami
$ helm fatch bitnami/kafka
$ tar xzvf kafka-22.1.1.tgz
```

## `values.yaml` 수정

```
$ cd kafka
$ sudo vi values.yaml
```

### NodePort 설정
```
...
service:
  type: ClusterIP # NodePort 로 수정
  ...
  nodePorts:
    client: 30001
...
externalAccess:
  service:
    type: LoadBalancer # NodePort 로 수정
    nodePorts: [] # [30001]로 수정
  useHostIps: false # true 로 수정
...
```

## Kafka 설치

```sh
$ kubectl create namespace kafka
$ helm install kafka -f values.yaml . -n kafka
$ helm upgrade kafka -f values.yaml . -n kafka
```

```
NAME: kafka
LAST DEPLOYED: Tue May 23 15:05:14 2023
NAMESPACE: kafka
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
CHART NAME: kafka
CHART VERSION: 22.1.1
APP VERSION: 3.4.0

** Please be patient while the chart is being deployed **

Kafka can be accessed by consumers via port 9092 on the following DNS name from within your cluster:

    kafka.kafka.svc.cluster.local

Each Kafka broker can be accessed by producers via port 9092 on the following DNS name(s) from within your cluster:

    kafka-0.kafka-headless.kafka.svc.cluster.local:9092

To create a pod that you can use as a Kafka client run the following commands:

    kubectl run kafka-client --restart='Never' --image docker.io/bitnami/kafka:3.4.0-debian-11-r28 --namespace kafka --command -- sleep infinity
    kubectl exec --tty -i kafka-client --namespace kafka -- bash

    PRODUCER:
        kafka-console-producer.sh \
            --broker-list kafka-0.kafka-headless.kafka.svc.cluster.local:9092 \
            --topic test

    CONSUMER:
        kafka-console-consumer.sh \
            --bootstrap-server kafka.kafka.svc.cluster.local:9092 \
            --topic test \
            --from-beginning
```


### Kafka 삭제

> 아래 명령어 외, Harbor 관련 PVC를 모두 삭제해야 재설치시 로그인 이슈가 없음

```sh
$ helm delete -n kafka kafka
```