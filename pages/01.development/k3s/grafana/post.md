# Helm으로 Grafana 설치하기


## Grafana 레포지토리 추가

```sh
$ helm repo add grafana https://grafana.github.io/helm-charts
```

## `values.yaml`을 수정

> `values.yaml`을 수정하기 위해 Git을 내려받는다.

```
$ git clone https://github.com/grafana/helm-charts.git
$ cd /helm-charts/charts/grafana
$ sudo vi values.yaml
```

```
...
service:
  type: ClusterIP # NodePort 로 수정
  nodePort: 32763
...
```


## Grafana 설치
```
$ kubectl create namespace grafana
$ helm install grafana grafana/grafana -f values.yaml --namespace grafana
```

## 설치 결과
```
NAME: grafana
LAST DEPLOYED: Sat May 20 16:14:14 2023
NAMESPACE: grafana
STATUS: deployed
REVISION: 1
NOTES:
1. Get your 'admin' user password by running:

   kubectl get secret --namespace grafana grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo


2. The Grafana server can be accessed via port 80 on the following DNS name from within your cluster:

   grafana.grafana.svc.cluster.local

   Get the Grafana URL to visit by running these commands in the same shell:
     export NODE_PORT=$(kubectl get --namespace grafana -o jsonpath="{.spec.ports[0].nodePort}" services grafana)
     export NODE_IP=$(kubectl get nodes --namespace grafana -o jsonpath="{.items[0].status.addresses[0].address}")
     echo http://$NODE_IP:$NODE_PORT

3. Login with the password from step 1 and the username: admin
#################################################################################
######   WARNING: Persistence is disabled!!! You will lose your data when   #####
######            the Grafana pod is terminated.                            #####
#################################################################################
```

## Grafana 접속
```
http://[호스트명]:32763
```