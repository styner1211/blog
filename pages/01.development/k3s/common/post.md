# 쿠버네티스 메모


## 쿠버네티스 svc의 dns 규칙

```
<서비스명>.<네임스페이스>.svc.cluster.local
```


## 특정 네임스페이스 내 모든 객체 삭제
```sh
$ kubectl delete all --all -n [네임스페이스 이름]
```