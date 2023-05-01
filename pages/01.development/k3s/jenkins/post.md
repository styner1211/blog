# Helm으로 Jenkins 설치하기

## Jenkins 레포지토리 추가

```sh
$ helm repo add jenkinsci https://charts.jenkins.io
$ helm repo update
```

## Helm value 얻기

```sh
$ helm show values jenkinsci/jenkins > jenkins-values.yaml
```

## `jekins-values.yaml` 수정

### Ingress를 사용하기 위한 설정
```sh
...
jenkinsUriPrefix: "/jenkins" # 주석 해제
...
```

### NodePort를 사용하기 위한 설정
```
...
serviceType: ClusterIP # NodePort로 수정
nodePort: 12080 # 추가
...
```

## Jenkins 설치
```sh
$ helm install jenkins jenkinsci/jenkins --create-namespace --namespace jenkins -f jenkins-values.yaml
```

## 초기 유저 `admin`의 비밀번호 얻기
```sh
$ kubectl exec --namespace jenkins -it svc/jenkins -c jenkins -- /bin/cat /run/secrets/additional/chart-admin-password && echo
```



## 참고: Jenkins 삭제
```sh
$ helm delete -n jenkins jenkins
```