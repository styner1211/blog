# Dockerfile 작성

## Dockerfile 내에서 환경 변수 사용하기

```sh
$ docker build -t [이미지 이름] --build-arg 환경변수이름=환경변수값
```

Dockerfile을 통해 도커 이미지를 빌드 할 때, `--build-arg` 옵션으로 넘긴 환경변수는, Dockerfile 내에서 `ARG`로 전달 받을 수 있다.

이렇게 전달 받은 변수는, 다시 Dockerfile 내에서 `ENV`를 이용하여 Dockerfile 내에서 사용가능한 환경변수로 등록할 수 있다.

```
ARG 환경변수이름
ENV DocerFile에서사용하는환경변수이름 $환경변수이름
```


