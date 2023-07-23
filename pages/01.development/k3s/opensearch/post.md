# Helm으로 OpenSearch 설치하기

## OpenSearch 레포지토리 추가 및 차트 다운로드

```sh
$ helm repo add opensearch https://opensearch-project.github.io/helm-charts/
$ helm repo update
$ helm fetch opensearch/
$ tar xzvf opensearch-2.13.3.tgz
```

## `values.yaml` 수정

```
$ cd opensearch
$ sudo vi values.yaml
```

### OpenSearch 설정
```
singleNode: false # true로 수정
...
opensearchJavaOpts: "-Xmx500M -Xms500M" # "-Xmx2G -Xms2G" 로 수정
...
resources:
  requests:
    cpu: "1000m" # "2000m"으로 수정
...
httpHostPort: "" # 30004로 수정
transportHostPort: "" # 31004로 수정
```




## OpenSearch 설치

```sh
$ kubectl create namespace opensearch
$ helm install opensearch -f values.yaml . -n opensearch
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


### OpenSearch 삭제

> 아래 명령어 외, Harbor 관련 PVC를 모두 삭제해야 재설치시 로그인 이슈가 없음

```sh
$ helm delete -n opensearch opensearch
```
