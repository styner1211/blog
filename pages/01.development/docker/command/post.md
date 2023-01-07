# Docker 명령어


## docker run
이미지로 컨테이너를 만들어서 실행

``` sh
$ docker run (<옵션>) <이미지 식별자> (<명령어>) (<인자>)
```

이미지로 컨테이너를 만들면서 Bash 쉘(`/bin/bash`)을 실행
``` sh
docker run -it --name {컨테이너 이름} {이미지 식별자} /bin/bash
```

-i 옵션과 -t 옵션은 같이 쓰이는 경우가 매우 많다. 이 두 옵션은 컨테이너를 종료하지 않은 상태로, 터미널의 입력을 계속해서 컨테이너로 전달하기 위해서 사용한다. 따라서, -it 옵션은 주로 컨테이너의 쉘(shell)이나 CLI 도구를 사용할 때 매우 유용하게 사용된다.

참고로, 애플 맥북 실리콘 M1에서 도커 컨테이너 실행 시 아래와 같은 오류가 발생 할 수 있다.
> The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8) and no specific platform was requested
이 경우, `--platform linux/amd64` 옵션이 필요하다.
``` sh
docker run -it --platform linux/amd64 --name {컨테이너 이름} {이미지 식별자} /bin/bash
```




## docker exec
(외부에서) 만들어진 컨테이너 안의 명령 실행 

``` sh
docker exec {컨테이너 이름} (<명령어>) (<인자>)
```


컨테이너 안의 echo 명령을 실행하고 매개 변수로 "Hello World"를 지정했기 때문에 Hello World가 출력된다. docker exec 명령은 이미 실행된 컨테이너에 apt, yum 명령으로 패키지를 설치하거나, 각종 데몬을 실행할 때 활용할 수 있다.
``` sh
sudo docker exec hello echo "Hello World"
```