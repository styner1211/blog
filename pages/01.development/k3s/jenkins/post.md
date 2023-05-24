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
nodePort: 32766 # 추가
...
```

## Jenkins 설치
```sh
$ helm install jenkins jenkinsci/jenkins --create-namespace --namespace jenkins -f jenkins-values.yaml
```

## Jenkins 업그레이드
> `jekins-values.yaml` 파일 수정 후, 변경된 설정으로 젠킨스 재실행
```sh
$ helm upgrade jenkins jenkinsci/jenkins --namespace jenkins -f jenkins-values.yaml
```

## 초기 유저 `admin`의 비밀번호 얻기
```sh
$ kubectl exec --namespace jenkins -it svc/jenkins -c jenkins -- /bin/cat /run/secrets/additional/chart-admin-password && echo
```



## 참고: Jenkins 삭제
```sh
$ helm delete -n jenkins jenkins
```

## 참고: Jenkins - Harbor 연동

Jenkins 관리 > Manage Credencials > System > Global credentials (unrestricted) > Add Credencials 클릭
- 세부 설정
ID는 나중에 파이프라인에서 인식할 수 있는 credentials의 ID이기에 Harbor로 기입하고 username은 구축한 harbor의 계정, pw는 말그대로 harbor계정의 pw를 입력한다. Description은 harbor credentials라는것을 이해할 수 있게끔 임의로 한다.