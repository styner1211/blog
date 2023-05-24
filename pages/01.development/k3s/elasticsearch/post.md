# Helm으로 Elasticsearch 설치하기

## Elasticsearch 레포지토리 추가 및 차트 다운로드

```sh
$ helm repo add elastic https://helm.elastic.co
$ helm fatch elastic/elasticsearch
$ tar xzvf elasticsearch-8.5.1.tgz
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

## Elasticsearch 설치

```sh
$ kubectl create namespace elasticsearch
$ helm install elasticsearch -f values.yaml . -n elasticsearch
```

```
NAME: elasticsearch
LAST DEPLOYED: Tue May 23 16:05:46 2023
NAMESPACE: elasticsearch
STATUS: deployed
REVISION: 1
NOTES:
1. Watch all cluster members come up.
  $ kubectl get pods --namespace=elasticsearch -l app=elasticsearch-master -w
2. Retrieve elastic user's password.
  $ kubectl get secrets --namespace=elasticsearch elasticsearch-master-credentials -ojsonpath='{.data.password}' | base64 -d
3. Test cluster health using Helm test.
  $ helm --namespace=elasticsearch test elasticsearch
```


### Elasticsearch 삭제

> 아래 명령어 외, Harbor 관련 PVC를 모두 삭제해야 재설치시 로그인 이슈가 없음

```sh
$ helm delete -n elasticsearch elasticsearch
```