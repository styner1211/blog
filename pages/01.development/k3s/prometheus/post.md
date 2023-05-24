# Helm으로 Promethues 설치하기


## Prometheus 레포지토리 추가

```sh
$ helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
```

## `values.yaml`을 수정

> `values.yaml`을 수정하기 위해 Git을 내려받는다.

```
$ git clone https://github.com/prometheus-community/helm-charts.git
$ cd /prometheus/helm-charts/charts/prometheus
$ sudo vi values.yaml
```

```
...
service:
  type: ClusterIP # NodePort 로 수정
  nodePort: 32764
...
```


## Prometheus 설치
```
$ kubectl create namespace prometheus
$ helm install prometheus prometheus-community/prometheus -f values.yaml --namespace prometheus
```

## 설치 결과
```
NAME: prometheus
LAST DEPLOYED: Sat May 20 15:28:35 2023
NAMESPACE: prometheus
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
The Prometheus server can be accessed via port 80 on the following DNS name from within your cluster:
prometheus-server.prometheus.svc.cluster.local


Get the Prometheus server URL by running these commands in the same shell:
  export NODE_PORT=$(kubectl get --namespace prometheus -o jsonpath="{.spec.ports[0].nodePort}" services prometheus-server)
  export NODE_IP=$(kubectl get nodes --namespace prometheus -o jsonpath="{.items[0].status.addresses[0].address}")
  echo http://$NODE_IP:$NODE_PORT


The Prometheus alertmanager can be accessed via port  on the following DNS name from within your cluster:
prometheus-%!s(<nil>).prometheus.svc.cluster.local


Get the Alertmanager URL by running these commands in the same shell:
  export POD_NAME=$(kubectl get pods --namespace prometheus -l "app=prometheus,component=" -o jsonpath="{.items[0].metadata.name}")
  kubectl --namespace prometheus port-forward $POD_NAME 9093
#################################################################################
######   WARNING: Pod Security Policy has been disabled by default since    #####
######            it deprecated after k8s 1.25+. use                        #####
######            (index .Values "prometheus-node-exporter" "rbac"          #####
###### .          "pspEnabled") with (index .Values                         #####
######            "prometheus-node-exporter" "rbac" "pspAnnotations")       #####
######            in case you still need it.                                #####
#################################################################################


The Prometheus PushGateway can be accessed via port 9091 on the following DNS name from within your cluster:
prometheus-prometheus-pushgateway.prometheus.svc.cluster.local


Get the PushGateway URL by running these commands in the same shell:
  export POD_NAME=$(kubectl get pods --namespace prometheus -l "app=prometheus-pushgateway,component=pushgateway" -o jsonpath="{.items[0].metadata.name}")
  kubectl --namespace prometheus port-forward $POD_NAME 9091

For more information on running Prometheus, visit:
https://prometheus.io/

```

## Prometheus Operator

> 참고: https://github.com/prometheus-operator/prometheus-operator

Prometheus Operator는 Kubernetes 환경에서 Prometheus 관리를 자동화해 간단하게 구성할 수 있도록 도와주는 도구이다.

Prometheus Operator는 관측할 Service들을 ServiceMonitor가 지속적으로 바라보고, Target을 Prometheus 서버로 보내주며, 이 일련의 행위들을 Operator가 관리하는 구조로 이루어져 있다.

> ServiceMonitor는 Prometheus 서버가 메트릭 수집을 위해 Kubernetes의 Service를 바라보도록 하는 Prometheus Operator의 오브젝트이다.

### Custom Resource Definitions (CRDs) 설치

```
$ sudo apt  install jq
$ LATEST=$(curl -s https://api.github.com/repos/prometheus-operator/prometheus-operator/releases/latest | jq -cr .tag_name)
$ curl -sL https://github.com/prometheus-operator/prometheus-operator/releases/download/${LATEST}/bundle.yaml | kubectl create -f -
```

### 설치 확인

```
$ kubectl wait --for=condition=Ready pods -l  app.kubernetes.io/name=prometheus-operator -n default
```

## 스프링부트 프로젝트 설정

> 다음은 내가 사용하는 yaml 파일로써, 앞선 설치 과정은 아래 `k8s-service-mornitor.yaml`을 이용해 ServiceMonitor 오브젝트를 사용하기 위해 필요했다.

### `k8s-deployment.yaml` 작성
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: MODULE_NAME-deployment # 해당 이름으로 디플로이먼트가 생성
  namespace: NAMESPACE
  labels:
    app: MODULE_NAME # 향후 어느 리소스가 이 app 값인 디플로이먼트를 참고하려할때 필요한 값을 지정해주기 위한 것
spec:
  replicas: 1 # .spec.replicas 필드에 따라 디플로이먼트는 1개의 레플리카 파드를 생성한다.
  selector:
    matchLabels:
      app: MODULE_NAME # 디플로이먼트가 관리할 파드를 찾는 방법을 정의 (.spec.template.metadata.labels의 app을 참조)
  template:
    metadata:
      labels:
        app: MODULE_NAME # .selector.matchLabel에서 찾게 되는 것
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "8080"
        prometheus.io/path: "/actuator/prometheus"
    spec:
      containers:
        - name: MODULE_NAME
          image: HARBOR_REGISTRY/NAMESPACE/MODULE_NAME:DOCKER_IMAGE_TAGS
          ports:
            - containerPort: 8080
          imagePullPolicy: Always
          env:
            - name: DATE
              value: 'DATE_STRING'
          livenessProbe:
            httpGet:
              path: /health
              port: 8080
              httpHeaders:
                - name: Custom-Header
                  value: Awesome
            initialDelaySeconds: 3
            periodSeconds: 60
      imagePullSecrets:
        - name: registry-secret
```

### `k8s-service.yaml` 작성
```
apiVersion: v1
kind: Service
metadata:
  name: MODULE_NAME-service
  labels:
    app: MODULE_NAME
spec:
  type: NodePort
  ports:
    - name: http
      protocol: TCP
      port: 8080
      targetPort: 8080
      nodePort: 31001 # 모듈 별 설정 필요
  selector:
    app: MODULE_NAME
```

### `k8s-service-mornitor.yaml` 작성
```
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: MODULE_NAME-service-monitor
  labels:
    release: prometheus-operator
spec:
  selector:
    matchLabels:
      app: MODULE_NAME
  endpoints:
    - port: http
      path: "/actuator/prometheus"
```

## Prometheus 접속
```
http://[호스트명]:32764
```

### Prometheus에서 스프링부트 액츄에이터 scrap 확인