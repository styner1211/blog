# Helm으로 Elasticsearch 설치하기

## Elasticsearch 레포지토리 추가 및 차트 다운로드

```sh
$ helm repo add elastic https://helm.elastic.co
$ helm fatch elastic/elasticsearch
$ tar xzvf elasticsearch-8.5.1.tgz
```

```sh
$ helm repo add bitnami https://charts.bitnami.com/bitnami
$ helm fetch bitnami/elasticsearch
$ tar xzvf elasticsearch-19.8.1.tgz
```

## `values.yaml` 수정

```
$ cd elasticsearch
$ sudo vi values.yaml
```

### Elasticsearch 설정
```
...
replicas: 1 # 1로 수정
minimumMasterNodes: 2 # 1로 수정
...
clusterHealthCheckParams: "wait_for_status=green&timeout=1s" # "wait_for_status=yellow&timeout=1s" 로 수정
...
readinessProbe:
  initialDelaySeconds: 10 # 120으로 변경
...
service:
  type: ClusterIP # NodePort 로 수정
  ...
  nodePorts: "" # 30002 로 수정
esJavaOpts: "" # -Xmx4g -Xms4g 로 수정
...
```



```
...
global:
  kibanaEnabled: true
...
service:
  type: ClusterIP # NodePort 로 수정
  nodePorts:
    restAPI: 30002
    transport: 31002
...
master:
  replicaCount: 2 # 1로 수정
...
data:
  replicaCount: 2 # 1로 수정
...
data:
  replicaCount: 2 # 1로 수정
...
coordinating:
  replicaCount: 2 # 1로 수정
...
ingest:
  replicaCount: 2 # 1로 수정
...
metrics:
  enabled: true
...
```





## Elasticsearch 설치

```sh
$ kubectl create namespace elasticsearch
$ helm install elasticsearch -f values.yaml . -n elasticsearch
```

```
NAME: elasticsearch
LAST DEPLOYED: Wed May 31 15:42:04 2023
NAMESPACE: elasticsearch
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
CHART NAME: elasticsearch
CHART VERSION: 19.8.1
APP VERSION: 8.7.1

-------------------------------------------------------------------------------
 WARNING

    Elasticsearch requires some changes in the kernel of the host machine to
    work as expected. If those values are not set in the underlying operating
    system, the ES containers fail to boot with ERROR messages.

    More information about these requirements can be found in the links below:

      https://www.elastic.co/guide/en/elasticsearch/reference/current/file-descriptors.html
      https://www.elastic.co/guide/en/elasticsearch/reference/current/vm-max-map-count.html

    This chart uses a privileged initContainer to change those settings in the Kernel
    by running: sysctl -w vm.max_map_count=262144 && sysctl -w fs.file-max=65536

** Please be patient while the chart is being deployed **

  Elasticsearch can be accessed within the cluster on port 9200 at elasticsearch.elasticsearch.svc.cluster.local

  To access from outside the cluster execute the following commands:

    export NODE_PORT=$(kubectl get --namespace elasticsearch -o jsonpath="{.spec.ports[0].nodePort}" services elasticsearch)
    export NODE_IP=$(kubectl get nodes --namespace elasticsearch -o jsonpath="{.items[0].status.addresses[0].address}")
    curl http://$NODE_IP:$NODE_PORT/

```

http://[도메인]:30002/_cat 접속 후,아래 계정으로 Elasticsearch 서버를 확인해 볼 수 있다.


### Elasticsearch 삭제

> 아래 명령어 외, Harbor 관련 PVC를 모두 삭제해야 재설치시 로그인 이슈가 없음

```sh
$ helm delete -n elasticsearch elasticsearch
```