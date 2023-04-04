# GitLab 설치

Helm을 이용하여 K3S에 GitLab을 설치한다.

## Helm 설치

```sh
$ sudo snap install helm --classic
```

## repo 등록 
```sh
$ helm repo add gitlab https://charts.gitlab.io/
```

## 압축 파일 다운로드 및 압축 해제
```sh
$ helm fetch gitlab/gitlab
$ tar xvfz gitlab-6.10.1.tgz
```

## namespace 생성
```sh
$ kubectl create ns gitlab
```

## `values.yaml` 수정

### global.edition
```sh
...
edition: ee # ce 로 수정
...
```
### global.hosts

domain부분에 localhost.com을 붙여주었다. 다른설정을 안하면 기본적으로 앞에 gitlab이 붙는다고 한다.
gitlab과 minio, registry 부분에 각자의 이름을 넣어주었다.
> 후에 ingress에서 해당 이름을 가지고 도메인을 만들어 준다.
따로 설정하지 않으면 domain부분에 각자의 이름(gitlab, minio, registry)가 앞에 붙는게 디폴트인듯 하다.

```sh
...
hosts:
    domain: vm-macmini.com
    hostSuffix:
    https: true
    externalIP:
    ssh: ~
    gitlab: 
      name: gitlab.vm-macmini.com
      https: true
    minio: 
      name: minio.vm-macmini.com
      https: true
    registry: 
      name: registry.vm-macmini.com
      https: true
    tls: {}
    smartcard: {}
    kas: {}
    pages: {}

...
```

### global.ingress

### certmanager-issuer 및 certmanager
```sh
## Settings to for the Let's Encrypt ACME Issuer
certmanager-issuer: # 수정 필요
#   # The email address to register certificates requested from Let's Encrypt.
#   # Required if using Let's Encrypt.
  email: styner1211@gmail.com # 수정 필요

## Installation & configuration of jetstack/cert-manager
## See requirements.yaml for current version
certmanager:
  installCRDs: true
  nameOverride: certmanager
  # Install cert-manager chart. Set to false if you already have cert-manager
  # installed or if you are not using cert-manager.
  install: false # false로 수정 필요
  # Other cert-manager configurations from upstream
  # See https://github.com/jetstack/cert-manager/blob/master/deploy/charts/cert-manager/README#configuration
  rbac:
    create: true
```
### nginx-ingress

### gitlab-runner
gitlab-runner는 자체 서명된 인증서에서는 작동하지 않는다.
certmanager를 사용하지 않았기 때문에 certmanager를 사용한 자동 TLS 인증서 생성이 비활성화 되었고 자체 서명된 인증서가 생성되었다.
따라서 gitlab-runner가 작동하지 않을 것이기 때문에 gitlab-runner.install : false로 설정함
```sg
## Installation & configuration of gitlab/gitlab-runner
## See requirements.yaml for current version
gitlab-runner:
  install: false
  rbac:
    create: true
  runners:
    locked: false
    config: |
      [[runners]]
        [runners.kubernetes]
        image = "ubuntu:18.04"
        {{- if .Values.global.minio.enabled }}
        [runners.cache]
          Type = "s3"
          Path = "gitlab-runner"
          Shared = true
          [runners.cache.s3]
            ServerAddress = {{ include "gitlab-runner.cache-tpl.s3ServerAddress" . }}
            BucketName = "runner-cache"
            BucketLocation = "us-east-1"
            Insecure = false
        {{ end }}
  podAnnotations:
    gitlab.com/prometheus_scrape: "true"
    gitlab.com/prometheus_port: 9252
```

## 

```sh
$ export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
$ helm install gitlab -f values.yaml . -n gitlab
```