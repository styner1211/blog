# 개발 환경 구축

내 맥에 VMWare Fusion을 설치 후, ubuntu server 20.04를 설치한다.

> 설치한 VM을 shutdown 한 뒤, core와 memory, 하드디스크 용량을 적절하게 조절 가능한다. 하지만 하드디스크 용량이 설정한 대로 반영이 안된 경우 아래 명령어로 해결 할 수 있다.

## 리눅스 스토리지 디바이스 정보 출력

마운트 되지 않은 블럭 장치를 포함해서 보여준다.

```
$ lsblk
```

# 루트 파일 시스템 디스크 공간 늘리기

다음의 LVM 타입의 Logical Volume인 루트 파일 시스템을 최대 가용 디스크 공간 만큼 늘릴 수 있다.

```sh
$ sudo lvextend --resizefs -l +100%FREE ubuntu-vg/ubuntu-lv
```