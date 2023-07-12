# Helm으로 Harbor 설치하기

## Harbor 레포지토리 추가 및 차트 다운로드

> 애플 실리콘 맥에서는 bitnami 레포지토리를 이용해서 설치해야 한다. 아마도 빌드된 도커 이미지 호환성 문제인 듯?

```sh
$ helm repo add bitnami https://charts.bitnami.com/bitnami
$ helm fetch bitnami/harbor
```

## 차트 다운로드 및 압축 풀기

```sh
$ helm fetch bitnami/harbor
$ tar xzvf harbor-16.4.10.tgz
```

## `values.yaml` 수정

```
$ cd harbor
$ sudo vi values.yaml
```

### 옵션 1: Ingress 설정
```
...
exposureType: proxy # ingress로 수정
...
```

### 옵션 2: NodePort 설정
```
...
externalURL: https://core.harbor.domain # https://[도메인]:32765로 수정
...
service:
  type: ClusterIP # NodePort 로 수정
  nodePorts:
    https: "" # 32765로 수정
...
nginx:
  tls:
  commonName: [도메인]
```

## Harbor 설치

```sh
$ kubectl create namespace harbor
$ helm install harbor -f values.yaml . -n harbor
```


## Harbor 업그레이드
> `jekins-values.yaml` 파일 수정 후, 변경된 설정으로 젠킨스 재실행
```sh
$ helm upgrade harbor bitnami/harbor --namespace harbor -f values.yaml
```


## Harbor 초기 로그인 계정

```
echo Username: "admin"
echo Password: $(kubectl get secret --namespace harbor harbor-core-envvars -o jsonpath="{.data.HARBOR_ADMIN_PASSWORD}" | base64 -d)
```

## Harbor 접속

### 옵션 1: Ingress 경우
```
https://core.harbor.domain
```

### 옵션 2: NodePort 경우
```
https://[도메인]:32765
```


## 참고

### Harbor 삭제

> 아래 명령어 외, Harbor 관련 PVC를 모두 삭제해야 재설치시 로그인 이슈가 없음

```sh
$ helm delete -n harbor harbor
```